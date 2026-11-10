#!/usr/bin/env python3
"""Build API.dll (+EF metadata resources), host exe, runtime folder and exe.config for the macOS/Mono dev setup.
Reads secrets at run time from files; writes nothing tracked."""
import os, re, glob, sys, shutil, subprocess, xml.etree.ElementTree as ET
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.environ.get('REPO', os.path.join(HERE, '..', '..')))
if os.path.basename(os.path.dirname(HERE)) == 'scripts':  # tracked copy in scripts/mac
    REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
DEV = os.environ.get('DEV_DIR', os.path.join(REPO, '.dev', 'mac'))
API = REPO + '/api'
PK = os.environ.get('PKGS', DEV + '/pkgs')
FW = '/opt/homebrew/lib/mono/4.8-api'
CSC = os.environ.get('CSC', os.path.expanduser('~/.dotnet/sdk/8.0.416/Roslyn/bincore/csc.dll'))
DOTNET = os.environ.get('DOTNET', os.path.expanduser('~/.dotnet/dotnet'))
BUILD = DEV + '/build'; RUN = DEV + '/api-run'
os.makedirs(BUILD, exist_ok=True); os.makedirs(RUN, exist_ok=True)
STUB = DEV + '/stubs/WpfStub.cs'
HOSTSRC = DEV + '/host/Program.cs'
if not os.path.exists(STUB):  # tracked copy layout
    STUB = HERE + '/stubs/WpfStub.cs'; HOSTSRC = HERE + '/Program.cs'

x = open(API + '/API.csproj', encoding='utf-8-sig').read()
refs = []; runtime = []; missing = []
for m in re.finditer(r'<Reference Include="([^",]+)[^>]*?(?:/>|>(.*?)</Reference>)', x, re.S):
    name = m.group(1); body = m.group(2) or ''
    h = re.search(r'<HintPath>(.*?)</HintPath>', body)
    path = None; real = False
    if h:
        hp = h.group(1).replace('\\', '/')
        mm = re.match(r'(?:\.\./)*packages/([^/]+?)\.(\d+(?:\.\d+)*(?:-[\w.]+)?)/(.*)$', hp)
        if mm:
            idl = mm.group(1).lower(); ver = mm.group(2).lower(); rel = mm.group(3)
            c = '%s/%s/%s/%s' % (PK, idl, ver, rel)
            if not os.path.exists(c):
                c = None; base = os.path.basename(rel)
                for f in glob.glob('%s/%s/*/lib/**/%s' % (PK, idl, base), recursive=True): c = f
            path = c
        else:
            path = API + '/' + hp
        real = True
    else:
        for c in (FW + '/' + name + '.dll', FW + '/Facades/' + name + '.dll'):
            if os.path.exists(c): path = c; break
    if path and os.path.exists(path):
        refs.append(path)
        if real: runtime.append(path)
    else: missing.append(name)
for f in glob.glob(FW + '/Facades/*.dll'): refs.append(f)
for n in ('System.Core', 'System.Xml.Linq', 'System.Data.DataSetExtensions', 'System.Data', 'System.Xml', 'System'):
    if os.path.exists(FW + '/' + n + '.dll'): refs.append(FW + '/' + n + '.dll')
refs.append(FW + '/mscorlib.dll')
srcs = []
for m in re.finditer(r'<Compile Include="([^"]+)"', x):
    f = API + '/' + m.group(1).replace('\\', '/')
    if os.path.isfile(f): srcs.append(f)
srcs.append(STUB)
extra = sorted(glob.glob(DEV + '/shims/*.cs'))
srcs += extra

# EF metadata from edmx
ns = {'e': 'http://schemas.microsoft.com/ado/2009/11/edmx'}
tree = ET.parse(API + '/Models/MohaModel.edmx'); root = tree.getroot()
E = '{http://schemas.microsoft.com/ado/2009/11/edmx}'
rt = root.find(E + 'Runtime')
def first_child(sec):
    return list(rt.find(E + sec))[0]
res = []
for sec, ext in (('ConceptualModels', 'csdl'), ('StorageModels', 'ssdl'), ('Mappings', 'msl')):
    el = first_child(sec)
    ET.register_namespace('', el.tag[1:el.tag.index('}')])
    p = '%s/MohaModel.%s' % (BUILD, ext)
    ET.ElementTree(el).write(p, encoding='utf-8', xml_declaration=True)
    res.append('-resource:%s,Models.MohaModel.%s' % (p, ext))

rsp = ['-target:library', '-nologo', '-nostdlib+', '-langversion:7.3', '-debug:portable',
       '-nowarn:1591,0618,0168,0219,0649,0169,0414,1701,1702,1705,0108,0114,0162,0105,0436,1570,1572,1573,1574,1587,1710,1711,1712,0067,0660,0661,0659,CS8981',
       '-out:' + BUILD + '/API.dll', '-noconfig']
rsp += ['-r:' + r for r in dict.fromkeys(refs)] + res + srcs
open(BUILD + '/api.rsp', 'w').write('\n'.join('"%s"' % l if (' ' in l and not l.startswith('-')) else l for l in rsp) + '\n')
print('unresolved refs (expected: PresentationCore, PresentationFramework, System.Web.Entity):', missing)
r = subprocess.run([DOTNET, CSC, '@' + BUILD + '/api.rsp', '-fullpaths', '-errorreport:none'], cwd=REPO, capture_output=True, text=True)
errs = [l for l in (r.stdout + r.stderr).splitlines() if 'error' in l]
if errs or not os.path.exists(BUILD + '/API.dll'):
    print('\n'.join(errs[:40])); sys.exit('API compile FAILED')
print('API.dll built')

# host exe
hr = ['-target:exe', '-nologo', '-nostdlib+', '-noconfig', '-langversion:7.3', '-out:' + BUILD + '/MohaDevHost.exe',
      '-r:' + BUILD + '/API.dll', '-r:' + FW + '/mscorlib.dll', '-r:' + FW + '/System.dll', '-r:' + FW + '/System.Core.dll']
hr += ['-r:' + r for r in runtime if re.search(r'Microsoft\.Owin(\.Hosting)?\.dll$|[/]Owin\.dll$', r)]
hr += ['-r:' + f for f in glob.glob(FW + '/Facades/*.dll')] + [HOSTSRC]
open(BUILD + '/host.rsp', 'w').write('\n'.join(hr) + '\n')
r = subprocess.run([DOTNET, CSC, '@' + BUILD + '/host.rsp', '-errorreport:none'], capture_output=True, text=True)
if r.returncode: print(r.stdout + r.stderr); sys.exit('host compile FAILED')

# runtime folder
for p in runtime:
    shutil.copy2(p, RUN + '/')
for f in ('API.dll', 'API.pdb', 'MohaDevHost.exe'):
    if os.path.exists(BUILD + '/' + f): shutil.copy2(BUILD + '/' + f, RUN + '/' + f)
print('runtime folder:', len(os.listdir(RUN)), 'files')

# exe.config from Web.config
cfg = open(API + '/Web.config', encoding='utf-8-sig').read()
tree = ET.parse(API + '/Web.config'); wc = tree.getroot()
pw = open(DEV + '/sa-password.txt').read().strip()
def esc(s): return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
conn = ('metadata=res://*/Models.MohaModel.csdl|res://*/Models.MohaModel.ssdl|res://*/Models.MohaModel.msl;'
        'provider=System.Data.SqlClient;provider connection string="data source=localhost,14333;initial catalog=CongTTDT_MOHA_Dev;'
        'user id=sa;password=%s;MultipleActiveResultSets=True;App=EntityFramework"' % pw)
app = {c.get('key'): c.get('value') for c in wc.find('appSettings') if c.tag == 'add'}
app.update({'frontendSiteUrl': 'http://localhost:5173',
            'AllowedCorsOrigins': 'http://localhost:5173,http://localhost:5174,http://localhost:5175',
            'AllowInsecureOAuthHttp': 'true'})
loc = API + '/appSettings.local.config'
if os.path.exists(loc):
    for c in ET.parse(loc).getroot():
        if c.tag == 'add' and c.get('key') == 'recaptcha': app['recaptcha'] = c.get('value')
def sub(tag):
    m = re.search(r'<%s[ >].*?</%s>' % (tag, tag), cfg, re.S)
    return m.group(0)
out = ['<?xml version="1.0" encoding="utf-8"?>', '<configuration>',
       sub('configSections'), '  <appSettings>']
out += ['    <add key="%s" value="%s" />' % (esc(k), esc(v or '')) for k, v in app.items()]
out += ['  </appSettings>', sub('runtime'),
        '  <connectionStrings>\n    <add name="CongTTDT_MOHAEntities" connectionString="%s" providerName="System.Data.EntityClient" />\n  </connectionStrings>' % esc(conn),
        sub('entityFramework'), '</configuration>']
txt = '\n'.join(out)
txt = re.sub(r' xmlns:ns\d+="[^"]*"', '', txt)
p = RUN + '/MohaDevHost.exe.config'
open(p, 'w').write(txt); os.chmod(p, 0o600)
print('config written')
