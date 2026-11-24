param([string]$ConfigPath='', [switch]$UseExistingUiBuilds, [switch]$IncludeImportData)
$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
if(!$ConfigPath){$ConfigPath=Join-Path $root 'deployment\production.json'}
$config=Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json
foreach($name in @('PortalUrl','ApiUrl','MediaUrl')){
 $url=[uri]$config.$name
 if(!$url.IsAbsoluteUri -or $url.Scheme -ne 'https'){throw "Invalid HTTPS URL: $name"}
}
$adminReady=![string]::IsNullOrWhiteSpace($config.AdminUrl)
$gaId=[string]$config.GoogleAnalyticsMeasurementId
if($gaId -and $gaId -notmatch '^G-[A-Z0-9]+$'){throw 'Invalid Google Analytics measurement ID'}
if($adminReady -and ([uri]$config.AdminUrl).Scheme -ne 'https'){throw 'AdminUrl must be HTTPS'}
$tools=Join-Path $env:LOCALAPPDATA 'MohaDev'
$nodeDir=Join-Path $tools 'node-v22.23.3-win-x64'
$env:PATH="$nodeDir;$tools\npm-global;$env:PATH"
if(!$UseExistingUiBuilds){
 Push-Location (Join-Path $root 'frontend')
 try { & (Join-Path $tools 'npm-global\pnpm.cmd') run build; if($LASTEXITCODE){throw 'Portal build failed'} } finally {Pop-Location}
 Push-Location (Join-Path $root 'backend')
 try { & (Join-Path $nodeDir 'node.exe') node_modules/react-scripts/scripts/build.js; if($LASTEXITCODE){throw 'Admin build failed'} } finally {Pop-Location}
}
foreach($app in @(@('frontend','dist'),@('backend','build'))){
 $index=Join-Path $root ($app[0]+'\'+$app[1]+'\index.html')
 if(!(Test-Path $index)){throw 'UI build missing'}
 $stamp=(Get-Item $index).LastWriteTimeUtc
 $inputs=@(Get-ChildItem (Join-Path $root ($app[0]+'\src')) -Recurse -File)+@(Get-ChildItem (Join-Path $root ($app[0]+'\public')) -Recurse -File)+@(Get-Item (Join-Path $root ($app[0]+'\package.json')))
 if($app[0] -eq 'frontend'){$inputs+=Get-Item (Join-Path $root 'frontend\index.html'),(Join-Path $root 'frontend\vite.config.ts')}
 if($inputs | Where-Object {$_.LastWriteTimeUtc -gt $stamp}){throw "Stale UI build: $($app[0]); rebuild before packaging"}
}
$release=Join-Path $root ('.dev\releases\moha-hoiquy-'+(Get-Date -Format 'yyyyMMdd-HHmmss'))
if(Test-Path $release){throw 'Release directory already exists'}
New-Item -ItemType Directory -Path $release -Force | Out-Null
$bin=Join-Path $release 'api-update\bin'
New-Item -ItemType Directory -Path $bin -Force | Out-Null
& 'C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\MSBuild\Current\Bin\MSBuild.exe' (Join-Path $root 'api\API.csproj') /t:Rebuild /p:Configuration=Release "/p:OutputPath=$bin\" /m:2 /nologo /verbosity:minimal /clp:ErrorsOnly
if($LASTEXITCODE){throw 'API Release build failed'}
Get-ChildItem $bin -Filter '*.pdb' | Remove-Item
# API.dll.config la ban sao Web.config (co chuoi ket noi); IIS khong doc file nay nen khong dong goi.
Remove-Item (Join-Path $bin 'API.dll.config') -ErrorAction SilentlyContinue
Copy-Item (Join-Path $root 'api\Global.asax') (Join-Path $release 'api-update')
Copy-Item (Join-Path $root 'frontend\dist') (Join-Path $release 'portal') -Recurse
# Khung HTML cho API MetadataPage: phai khop tuyet doi voi assets cua portal vua build.
New-Item -ItemType Directory -Path (Join-Path $release 'api-update\App_Data') -Force | Out-Null
Copy-Item (Join-Path $release 'portal\index.html') (Join-Path $release 'api-update\App_Data\portal-index.html')
Copy-Item (Join-Path $root 'backend\build') (Join-Path $release 'admin-candidate') -Recurse
Get-ChildItem (Join-Path $release 'admin-candidate') -Filter '*.map' -Recurse | Remove-Item
# Chi dong goi file cau hinh va huong dan hien hanh; khong kem ghi chu noi bo theo ngay.
$deployDir=Join-Path $release 'deployment'
New-Item -ItemType Directory -Path $deployDir -Force | Out-Null
$deployRunbooks=@('DEPLOY-MOHA.md','SECURITY-HARDENING.md','NGON-NGU-TIN-TUC.md','SITEMAP-DONG.md','METADATA-HTML-THU-NGHIEM.md','LDAP-RESTORE-STAGING.md','FIX-UPLOAD-413.md')
Get-ChildItem (Join-Path $root 'deployment') -File | Where-Object { $_.Name -like '*.fragment.xml' -or $_.Name -like '*.sql' -or $_.Name -like '*.txt' -or $_.Name -eq 'production.json' -or $deployRunbooks -contains $_.Name } | Copy-Item -Destination $deployDir
# Dong goi moi migration trong db\migrations de khong sot file moi.
Get-ChildItem (Join-Path $root 'db\migrations') -Filter '*.sql' | Copy-Item -Destination (Join-Path $release 'deployment')
$adminUrl=if($adminReady){$config.AdminUrl.TrimEnd('/')}else{'https://ADMIN-HOST-UNCONFIRMED.invalid'}
# Origin (scheme+host+port) cho CSP; portal va media co the khac host nen CSP admin cho ca hai.
$apiOrigin=([uri]$config.ApiUrl).GetLeftPart('Authority')
$portalOrigin=([uri]$config.PortalUrl).GetLeftPart('Authority')
$mediaOrigin=([uri]$config.MediaUrl).GetLeftPart('Authority')
$adminWebSources=(@($portalOrigin,$mediaOrigin) | Select-Object -Unique) -join ' '
# IIS configurations are merge samples; never replace a production Web.config.
$samples=@()
foreach($app in @('portal','admin-candidate')){
 $webConfig=Join-Path $release ($app+'\web.config')
 if(Test-Path $webConfig){
  $sample=[IO.File]::ReadAllText($webConfig)
  if($app -eq 'admin-candidate'){
   # CSP admin dung origin; moha.tefli.vn chi xuat hien trong img-src/media-src/frame-src (portal + media).
   $sample=$sample.Replace('http://mohaapi.tefli.vn',$apiOrigin).Replace('http://mohabackend.tefli.vn',$adminUrl).Replace('http://moha.tefli.vn',$adminWebSources)
  }else{$sample=$sample.Replace('http://mohaapi.tefli.vn',$config.ApiUrl.TrimEnd('/'))}
  $samplePath=Join-Path $release ('deployment\'+$app+'.web.config.sample.xml')
  [IO.File]::WriteAllText($samplePath,$sample)
  $samples+=$samplePath
  Remove-Item -LiteralPath $webConfig
 }
}
$portalIndex=Join-Path $release 'portal\runtime-config.js'
$html=[IO.File]::ReadAllText($portalIndex).Replace('http://mohaapi.tefli.vn/api/Public/',$config.ApiUrl.TrimEnd('/')+'/api/Public/').Replace('http://moha.tefli.vn/',$config.MediaUrl.TrimEnd('/')+'/')
[IO.File]::WriteAllText($portalIndex,$html)
if($gaId -and $html -notmatch [regex]::Escape($gaId)){throw 'Portal Analytics ID does not match production.json; update frontend/public/runtime-config.js and rebuild'}
# window.env cua admin nam trong runtime-config.js (index.html khong con script inline vi CSP).
$adminIndex=Join-Path $release 'admin-candidate\index.html'
$adminRuntime=Join-Path $release 'admin-candidate\runtime-config.js'
if(!(Test-Path $adminRuntime)){throw 'Admin runtime-config.js missing'}
$js=[IO.File]::ReadAllText($adminRuntime)
# Bo khoi ghi de localhost (chi dung khi dev).
$js=[regex]::Replace($js,'(?s)[ \t]*// DEV-BEGIN.*?// DEV-END[^\r\n]*\r?\n?','')
if($js -match 'DEV-BEGIN|DEV-END|localhost'){throw 'Admin runtime-config.js: dev override block not removed'}
# Media co the khac origin portal: thay rieng khoa nay truoc khi thay chung.
$uploadKey="`"REACT_APP_UPLOAD_URL`": 'http://moha.tefli.vn'"
if(!$js.Contains($uploadKey)){throw 'Admin runtime-config.js: REACT_APP_UPLOAD_URL placeholder not found'}
$js=$js.Replace($uploadKey,("`"REACT_APP_UPLOAD_URL`": '"+$config.MediaUrl.TrimEnd('/')+"'"))
$js=$js.Replace('http://mohaapi.tefli.vn',$config.ApiUrl.TrimEnd('/')).Replace('http://mohabackend.tefli.vn',$adminUrl).Replace('http://moha.tefli.vn',$config.PortalUrl.TrimEnd('/'))
[IO.File]::WriteAllText($adminRuntime,$js)
$html=[IO.File]::ReadAllText($adminIndex).Replace('http://mohaapi.tefli.vn',$config.ApiUrl.TrimEnd('/')).Replace('http://mohabackend.tefli.vn',$adminUrl).Replace('http://moha.tefli.vn',$config.PortalUrl.TrimEnd('/'))
[IO.File]::WriteAllText($adminIndex,$html)
if($html -notmatch 'src="/runtime-config\.js"'){throw 'Admin index.html does not load runtime-config.js'}
foreach($index in @($portalIndex,$adminIndex,$adminRuntime)+$samples){
 $content=[IO.File]::ReadAllText($index)
 if($content -match 'tefli\.vn|localhost:517|localhost:55104'){throw "Non-production URL in $index"}
}
# Du lieu import Hoi va Quy chi dong goi khi co co -IncludeImportData (mac dinh KHONG dong goi).
if($IncludeImportData){
 $dataDir=Join-Path $release 'import-data';New-Item -ItemType Directory $dataDir | Out-Null
 $excel=Join-Path $env:USERPROFILE 'Desktop\DanhSach_HoiQuy_TrungUong_20260930_142742.xlsx'
 if(!(Test-Path $excel)){throw 'Customer workbook missing'}
 Copy-Item -LiteralPath $excel -Destination $dataDir
}
# git co the khong nam trong PATH (vd may chi cai GitHub Desktop): tim ban kem theo, neu khong co thi ghi 'unknown' thay vi lam hong ca goi da build.
$git=(Get-Command git -ErrorAction SilentlyContinue | Select-Object -First 1).Source
if(!$git){$git=Get-ChildItem (Join-Path $env:LOCALAPPDATA 'GitHubDesktop\app-*\resources\app\git\cmd\git.exe') -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName}
if($git){$commit=(& $git -C $root rev-parse HEAD);$dirty=[bool](& $git -C $root status --porcelain)}else{Write-Warning 'git not found: manifest records Commit=unknown';$commit='unknown';$dirty=$null}
$manifest=[ordered]@{CreatedAt=(Get-Date).ToString('o');Commit=$commit;WorkingTreeHasChanges=$dirty;PortalUrl=$config.PortalUrl;ApiUrl=$config.ApiUrl;AdminUrl=$config.AdminUrl;AdminReady=$adminReady;ApiWebConfigIncluded=$false;Note='Candidate package. Validate staging and production baseline before deployment.';Files=@()}
$manifest.Files=@(Get-ChildItem $release -Recurse -File | ForEach-Object {[ordered]@{Path=$_.FullName.Substring($release.Length+1);Sha256=(Get-FileHash $_.FullName -Algorithm SHA256).Hash;Bytes=$_.Length}})
$manifest | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $release 'manifest.json') -Encoding utf8
$zip=$release+'.zip';Compress-Archive -Path (Join-Path $release '*') -DestinationPath $zip
Write-Output "Package: $zip"
Write-Output "AdminReady: $adminReady"
