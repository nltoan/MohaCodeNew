param()
$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
$dist=Join-Path $root 'frontend\dist'
if(!(Test-Path "$dist\index.html")){throw 'Build frontend first'}
$stamp=(Get-Item "$dist\index.html").LastWriteTimeUtc
$inputs=@(Get-ChildItem "$root\frontend\src","$root\frontend\public" -Recurse -File)+@(Get-Item "$root\frontend\index.html","$root\frontend\vite.config.ts","$root\frontend\package.json")
if($inputs | Where-Object {$_.LastWriteTimeUtc -gt $stamp}){throw 'Frontend build is stale'}
$config=Get-Content "$root\deployment\production.json" -Raw | ConvertFrom-Json
$release=Join-Path $root ('.dev\releases\portal-performance-seo-'+(Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory $release | Out-Null
Copy-Item $dist "$release\portal" -Recurse
if(Test-Path "$release\portal\web.config"){Remove-Item -LiteralPath "$release\portal\web.config"}
$file="$release\portal\runtime-config.js"
$content=[IO.File]::ReadAllText($file).Replace('http://mohaapi.tefli.vn/api/Public/',$config.ApiUrl.TrimEnd('/')+'/api/Public/').Replace('http://moha.tefli.vn/',$config.MediaUrl.TrimEnd('/')+'/')
if($content -match 'tefli\.vn|localhost:' -or $content -notmatch [regex]::Escape($config.GoogleAnalyticsMeasurementId)){throw 'Invalid production runtime config'}
[IO.File]::WriteAllText($file,$content)
Copy-Item "$root\deployment\CSP-PORTAL.txt" $release
@'
PORTAL ONLY: performance and SEO metadata update; still React CSR/static IIS.
1. Backup current index.html and runtime-config.js. Keep production Web.config.
2. Merge portal/assets first; retain old assets for existing browser sessions.
3. Copy portal/runtime-config.js and other portal public files; copy portal/index.html LAST.
4. Purge cache /, /index.html and /runtime-config.js, then Ctrl+Shift+R.
5. Check home, news, category, article and association/fund lookup on desktop/mobile.
No API/admin update, DB migration, Node.js service or new CSP sources needed for this update.
GA still requires the sources in CSP-PORTAL.txt if they have not already been added.
SEO metadata is rendered client-side; this release does not add SSR or guarantee search rankings.
'@ | Set-Content "$release\README.txt" -Encoding utf8
$files=@(Get-ChildItem $release -Recurse -File | ForEach-Object {[ordered]@{Path=$_.FullName.Substring($release.Length+1);Sha256=(Get-FileHash $_.FullName -Algorithm SHA256).Hash}})
$files | ConvertTo-Json -Depth 4 | Set-Content "$release\manifest.json" -Encoding utf8
Compress-Archive -Path "$release\*" -DestinationPath ($release+'.zip')
Write-Output ($release+'.zip')
