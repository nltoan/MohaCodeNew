param([string]$ConfigPath='', [switch]$UseExistingUiBuilds)
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
Copy-Item (Join-Path $root 'api\Global.asax') (Join-Path $release 'api-update')
Copy-Item (Join-Path $root 'frontend\dist') (Join-Path $release 'portal') -Recurse
Copy-Item (Join-Path $root 'backend\build') (Join-Path $release 'admin-candidate') -Recurse
Get-ChildItem (Join-Path $release 'admin-candidate') -Filter '*.map' -Recurse | Remove-Item
Copy-Item (Join-Path $root 'deployment') (Join-Path $release 'deployment') -Recurse
Copy-Item (Join-Path $root 'db\migrations\20261001-HoiQuy.sql') (Join-Path $release 'deployment')
# IIS configurations are merge samples; never replace a production Web.config.
foreach($app in @('portal','admin-candidate')){
 $webConfig=Join-Path $release ($app+'\web.config')
 if(Test-Path $webConfig){
  $sample=[IO.File]::ReadAllText($webConfig).Replace('http://mohaapi.tefli.vn',$config.ApiUrl.TrimEnd('/'))
  [IO.File]::WriteAllText((Join-Path $release ('deployment\'+$app+'.web.config.sample.xml')),$sample)
  Remove-Item -LiteralPath $webConfig
 }
}
$portalIndex=Join-Path $release 'portal\runtime-config.js'
$html=[IO.File]::ReadAllText($portalIndex).Replace('http://mohaapi.tefli.vn/api/Public/',$config.ApiUrl.TrimEnd('/')+'/api/Public/').Replace('http://moha.tefli.vn/',$config.MediaUrl.TrimEnd('/')+'/')
[IO.File]::WriteAllText($portalIndex,$html)
if($gaId -and $html -notmatch [regex]::Escape($gaId)){throw 'Portal Analytics ID does not match production.json; update frontend/index.html and rebuild'}
$adminIndex=Join-Path $release 'admin-candidate\index.html'
$adminUrl=if($adminReady){$config.AdminUrl.TrimEnd('/')}else{'https://ADMIN-HOST-UNCONFIRMED.invalid'}
$html=[IO.File]::ReadAllText($adminIndex).Replace('http://mohaapi.tefli.vn',$config.ApiUrl.TrimEnd('/')).Replace('http://mohabackend.tefli.vn',$adminUrl).Replace('http://moha.tefli.vn',$config.PortalUrl.TrimEnd('/'))
# Media may use another origin; replace its particular runtime key after general replacement.
$html=$html.Replace(('REACT_APP_UPLOAD_URL:"'+$config.PortalUrl.TrimEnd('/')+'"'),('REACT_APP_UPLOAD_URL:"'+$config.MediaUrl.TrimEnd('/')+'"'))
[IO.File]::WriteAllText($adminIndex,$html)
foreach($index in @($portalIndex,$adminIndex)){
 $content=[IO.File]::ReadAllText($index)
 if($content -match 'tefli\.vn|localhost:517|localhost:55104'){throw "Non-production URL in $index"}
}
$dataDir=Join-Path $release 'import-data';New-Item -ItemType Directory $dataDir | Out-Null
$excel=Join-Path $env:USERPROFILE 'Desktop\DanhSach_HoiQuy_TrungUong_20260930_142742.xlsx'
if(!(Test-Path $excel)){throw 'Customer workbook missing'}
Copy-Item -LiteralPath $excel -Destination $dataDir
$manifest=[ordered]@{CreatedAt=(Get-Date).ToString('o');Commit=(& git -C $root rev-parse HEAD);WorkingTreeHasChanges=([bool](& git -C $root status --porcelain));PortalUrl=$config.PortalUrl;ApiUrl=$config.ApiUrl;AdminUrl=$config.AdminUrl;AdminReady=$adminReady;ApiWebConfigIncluded=$false;Note='Candidate package. Validate staging and production baseline before deployment.';Files=@()}
$manifest.Files=@(Get-ChildItem $release -Recurse -File | ForEach-Object {[ordered]@{Path=$_.FullName.Substring($release.Length+1);Sha256=(Get-FileHash $_.FullName -Algorithm SHA256).Hash;Bytes=$_.Length}})
$manifest | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $release 'manifest.json') -Encoding utf8
$zip=$release+'.zip';Compress-Archive -Path (Join-Path $release '*') -DestinationPath $zip
Write-Output "Package: $zip"
Write-Output "AdminReady: $adminReady"
