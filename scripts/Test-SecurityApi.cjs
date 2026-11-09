const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const base='http://localhost:55104/api',rows=[];
function pass(name,data={}){rows.push({name,status:'PASS',...data});console.log('PASS '+name);fs.writeFileSync('.dev/security-api-results.json',JSON.stringify(rows,null,2))}
async function req(route,opts={}){const r=await fetch(base+route,{signal:AbortSignal.timeout(20000),...opts});const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={}}return {status:r.status,headers:r.headers,data,text}}
async function login(a){const r=await req('/Token?type=password',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'password',username:a.name,password:a.password})});assert.equal(r.status,200,'test login');assert.ok(r.data.access_token);return r.data.access_token}
const noSecrets=data=>{const text=JSON.stringify(data);assert.ok(!/"(MatKhau|Authenticator_Secret|PasswordAnswer|EmailPassword)"\s*:/.test(text),'response must not contain secret fields')};
(async()=>{
 const accounts=JSON.parse(fs.readFileSync('.dev/hoi-test-accounts.json','utf8').replace(/^\uFEFF/,''));const admin=await login(accounts[0]),denied=await login(accounts[1]);const auth=t=>({Authorization:'Bearer '+t});
 const project=fs.readFileSync('api/API.csproj','utf8');const sources=fs.readdirSync('api/Controllers/API').filter(x=>x.endsWith('Controller.cs')&&project.includes('Controllers\\API\\'+x));let count=0;
 for(const file of sources){const s=fs.readFileSync('api/Controllers/API/'+file,'utf8');const route=s.match(/\[Route\("api\/([^/]+)\/\{action\}"/);if(!route||route[1]==='Public')continue;const action=/public\s+(?:async\s+)?Task<HttpResponseMessage>\s+Get\(/.test(s)?'Get':route[1]==='Home'?'Statistic':route[1]==='FileManager'?'FileSystem':null;if(!action)continue;const query=new URLSearchParams({take:'1'});const signature=s.match(new RegExp('public\\s+(?:async\\s+)?(?:Task<[^>]+>|[\\w]+)\\s+'+action+'\\(([^)]*)\\)'))?.[1]||'';for(const parameter of signature.split(',')){const pair=parameter.trim().match(/^(int\??|string|bool\??)\s+(\w+)/);if(pair)query.set(pair[2],pair[1]==='string'?'security-invalid':'0')}const r=await req('/'+route[1]+'/'+action+'?'+query);assert.equal(r.status,401,route[1]+' must reject anonymous GET');count++}
 pass('Anonymous administration API routes denied',{controllers:count});
 for(const route of ['/User_Account/Get?take=1','/User_Account/GetLoginUser?take=1','/Roles/Get?take=1','/Permissions/Get?take=1','/ThamSoHeThongs/Get?take=1','/ADConfigs/Get?take=1']){assert.equal((await req(route,{headers:{Authorization:'Bearer invalid'}})).status,401)}
 pass('Invalid bearer tokens rejected');
 for(const route of ['/User_Account/Get?take=1','/Roles/Get?take=1','/Permissions/Get?take=1','/BackUps/Get?take=1','/ThamSoHeThongs/Get?take=1','/ADConfigs/Get?take=1']){const r=await req(route,{headers:auth(denied)});assert.equal(r.status,403,route+' low privilege')}
 pass('Low privilege account denied user/role/backup/configuration APIs');
 const self=await req('/User_Account/GetLoginUser',{headers:auth(denied)});assert.equal(self.status,200);assert.equal(self.data.data.length,1);assert.equal(self.data.data[0].TenTruyCap,accounts[1].name);noSecrets(self.data);
 const other=await req('/User_Account/GetLoginUser?filter='+encodeURIComponent(JSON.stringify(['TenTruyCap','=',accounts[0].name])),{headers:auth(denied)});assert.equal(other.data.data.length,0);
 const adminSelf=await req('/User_Account/GetLoginUser',{headers:auth(admin)});noSecrets(adminSelf.data);
 const id=adminSelf.data.data[0].UserID;
 const profile=await req('/Home/UpdateProfile',{method:'POST',headers:{...auth(denied),'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({values:JSON.stringify({UserID:id})})});assert.equal(profile.status,403);
 pass('Own profile only; cross-account read/update blocked; no password/2FA secret fields');
 const users=await req('/User_Account/Get?take=2',{headers:auth(admin)});assert.equal(users.status,200);noSecrets(users.data);pass('Administrator account list works without returning passwords');
 for(const method of ['GET','OPTIONS']){const r=await req('/Public/Menu?lang=vi',{method,headers:{Origin:'https://untrusted.example','Access-Control-Request-Method':'GET'}});assert.equal(r.status,403);assert.equal(r.headers.get('access-control-allow-origin'),null)}
 const preflight=await req('/HoiQuy/UploadChunk',{method:'OPTIONS',headers:{Origin:'http://localhost:5174','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type'}});assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),'http://localhost:5174');
 pass('CORS denies unknown origin; authenticated admin upload preflight allowed');
 const invalid=await req('/Token?type=password',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'password',username:"' OR 1=1--",password:'security-invalid'})});assert.equal(invalid.status,400);assert.ok(!invalid.text.includes('Exception')&&!invalid.text.includes('Object reference'));
 const ldap=await req('/Token?type=ldap',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'password',username:accounts[0].name,password:'security-invalid'})});assert.equal(ldap.status,400);
 pass('SQL-like invalid credentials and unverified LDAP login denied without exception details');
 for(const method of ['GET','POST'])assert.equal((await req('/Public/SendMail',{method})).status,410);
 assert.equal((await req('/Public/Proxy?url='+encodeURIComponent('http://127.0.0.1:55104/api/Public/Menu'))).status,410);
 pass('Legacy outbound mail and arbitrary URL proxy disabled; no outbound requests performed');
 for(const endpoint of ['Preview','UploadStart','UploadChunk?token=invalid&index=0','UploadComplete?token=invalid','Commit']){const route='/HoiQuy/'+endpoint;assert.equal((await req(route,{method:'POST'})).status,401);assert.equal((await req(route,{method:'POST',headers:auth(denied)})).status,403)}
 assert.equal((await req('/HoiQuy/UploadStart',{method:'POST',headers:{...auth(admin),'Content-Type':'application/json'},body:JSON.stringify({FileName:'test.aspx',Bytes:10})})).status,400);
 assert.equal((await req('/HoiQuy/UploadStart',{method:'POST',headers:{...auth(admin),'Content-Type':'application/json'},body:JSON.stringify({FileName:'test.xlsx',Bytes:80*1024*1024+1})})).status,400);
 const badCommit=await req('/HoiQuy/Commit',{method:'POST',headers:{...auth(admin),'Content-Type':'application/json'},body:JSON.stringify({Token:'security-nonexistent-token'})});assert.equal(badCommit.status,400);
 for(const name of ['security.aspx','security.svg','security.png:evil.aspx']){const body=new FormData();body.append('upload',new Blob(['security test; no executable payload']),name);const r=await req('/FileManager/CKEditorImageUpload',{method:'POST',headers:auth(admin),body});assert.equal(r.status,400,name)}
 const body=new FormData();body.append('files[]',new Blob(['x']),'security.txt');body.append('chunkMetadata',JSON.stringify({FileName:'security.txt',FileGuid:'../../security-outside',TotalCount:1,Index:0}));assert.equal((await req('/FileManager/FileUpload',{method:'POST',headers:auth(admin),body})).status,400);
 const backup=await req('/BackUps/Download?path='+encodeURIComponent('C:/Windows/win.ini'),{headers:auth(admin)});assert.equal(backup.status,403);
 pass('Upload executable/SVG/NTFS names and chunk traversal rejected; backup arbitrary path denied');
 for(const file of ['xxe.xlsx','oversized-xml.xlsx']){const body=new FormData();body.append('file',new Blob([fs.readFileSync('.dev/security-fixtures/'+file)]),file);const r=await req('/HoiQuy/Preview',{method:'POST',headers:auth(admin),body});assert.equal(r.status,400,file);assert.ok(!r.text.includes('StackTrace'))}
 pass('Excel external entity/DTD and oversized uncompressed XML rejected without commit');
 const pwd=await req('/Home/UpdateProfile',{method:'POST',headers:{...auth(denied),'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({values:JSON.stringify({UserID:self.data.data[0].UserID,Password:'Security-test-123456',CurrentPassword:'incorrect'})})});assert.equal(pwd.status,400);
 pass('Password change requires the current password; incorrect verification does not write');
 for(let i=0;i<11;i++){const r=await req('/Token?type=password',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'password',username:'__codex_security_rate_test__',password:'invalid'})});assert.equal(r.status,400);if(i===10)assert.ok(r.text.includes('một phút'))}
 pass('Repeated invalid logins rate limited on isolated synthetic username');

 for(const route of ['/HoiQuy/Search?name=','/HoiQuy/Search?name=test&token=invalid&code=WRONG','/Public/PostDetail?ID=invalid','/Public/PostsByCategory?ID=invalid']){const r=await req(route);assert.equal(r.status,400,route);assert.ok(!/StackTrace|ExceptionType|C:\\\\Users/.test(r.text))}
 pass('Invalid search/captcha/input rejected without stack traces');
 const menu=await req('/Public/Menu?lang=vi');assert.equal(menu.status,200);assert.equal(menu.headers.get('x-content-type-options'),'nosniff');pass('Public portal API remains available with nosniff');
 fs.writeFileSync('.dev/security-api-results.json',JSON.stringify(rows,null,2));
})().catch(e=>{console.error(e);rows.push({name:'suite failure',status:'FAIL',error:e.message});fs.writeFileSync('.dev/security-api-results.json',JSON.stringify(rows,null,2));process.exitCode=1});
