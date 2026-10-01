param([ValidateSet('Start', 'Stop', 'Build', 'Test')][string]$Action = 'Start')
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$toolsDir = Join-Path $env:LOCALAPPDATA 'MohaDev'
$nodeDir = Join-Path $toolsDir 'node-v22.23.3-win-x64'
$env:PATH = "$nodeDir;$toolsDir\npm-global;$env:PATH"
$node = Join-Path $nodeDir 'node.exe'
$msbuild = 'C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\MSBuild\Current\Bin\MSBuild.exe'
$iis = 'C:\Program Files\IIS Express\iisexpress.exe'
$runtime = Join-Path $root '.dev'
New-Item -ItemType Directory -Path $runtime -Force | Out-Null
$stateFile = Join-Path $runtime 'processes.json'
if ($Action -eq 'Build') {
    & $msbuild (Join-Path $root 'api\API.csproj') /t:Build /p:Configuration=Debug /m:2 /nologo /verbosity:minimal /clp:ErrorsOnly
    if ($LASTEXITCODE -ne 0) { throw 'API build failed.' }
    Push-Location (Join-Path $root 'frontend')
    try {
        & (Join-Path $toolsDir 'npm-global\pnpm.cmd') run build
        if ($LASTEXITCODE -ne 0) { throw 'Portal build failed.' }
    } finally { Pop-Location }
    Push-Location (Join-Path $root 'backend')
    try {
        & (Join-Path $nodeDir 'npm.cmd') run build
        if ($LASTEXITCODE -ne 0) { throw 'Admin build failed.' }
    } finally { Pop-Location }
    return
}
if ($Action -eq 'Test') {
    foreach ($url in @('http://localhost:5173', 'http://localhost:5174', 'http://localhost:55104/api/Public/Menu?lang=vi')) {
        $deadline = (Get-Date).AddMinutes(5)
        do {
            try {
                $response = Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 30
                break
            } catch {
                if ((Get-Date) -ge $deadline) { throw }
                Start-Sleep -Seconds 2
            }
        } while ($true)
        if ($response.StatusCode -ne 200) { throw "Unexpected status: $url" }
        if ($url -like '*api/Public*') { [void]($response.Content | ConvertFrom-Json) }
        Write-Host "PASS HTTP 200: $url"
    }
    return
}
if ($Action -eq 'Stop') {
    if (Test-Path $stateFile) {
        foreach ($entry in (Get-Content $stateFile -Raw | ConvertFrom-Json)) {
            $process = Get-Process -Id $entry.Id -ErrorAction SilentlyContinue
            if ($process -and $process.StartTime.ToUniversalTime().Ticks -eq ([datetime]$entry.StartTime).ToUniversalTime().Ticks) {
                & taskkill.exe /PID $entry.Id /T /F | Out-Null
                Write-Host "Stopped $($entry.Name)"
            }
        }
    }
    return
}
if (Test-Path $stateFile) {
    $running = @(Get-Content $stateFile -Raw | ConvertFrom-Json | Where-Object {
        $process = Get-Process -Id $_.Id -ErrorAction SilentlyContinue
        $process -and $process.StartTime.ToUniversalTime().Ticks -eq ([datetime]$_.StartTime).ToUniversalTime().Ticks
    })
    if ($running.Count -gt 0) { throw 'Dev processes are already running. Use -Action Stop before restarting.' }
}
foreach ($port in @(5173,5174,55104)) {
    if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { throw "Port $port is already in use." }
}
if (!(Test-Path $iis)) { throw 'IIS Express is not installed.' }
if (!(Test-Path (Join-Path $root 'api\bin\API.dll'))) { throw 'Build API first: scripts/Dev.ps1 -Action Build' }
$localDb = 'C:\Program Files\Microsoft SQL Server\160\Tools\Binn\SqlLocalDB.exe'
& $localDb start MohaDev
if ($LASTEXITCODE -ne 0) { throw 'Initialize the dev database first.' }
& (Join-Path $PSScriptRoot 'Initialize-HoiQuy.ps1')
$apiRoot = Join-Path $runtime 'api'
New-Item -ItemType Directory -Path $apiRoot -Force | Out-Null
Copy-Item (Join-Path $root 'api\Global.asax') $apiRoot -Force
Copy-Item (Join-Path $root 'api\bin') $apiRoot -Recurse -Force
foreach ($folder in @('Upload\Thumb', 'UploadTemp', 'tts\newmp3files')) {
    New-Item -ItemType Directory -Path (Join-Path $apiRoot $folder) -Force | Out-Null
}
[xml]$config = Get-Content (Join-Path $root 'api\Web.config') -Raw
$db = $config.configuration.connectionStrings.add | Where-Object name -eq 'CongTTDT_MOHAEntities'
$db.connectionString = 'metadata=res://*/Models.MohaModel.csdl|res://*/Models.MohaModel.ssdl|res://*/Models.MohaModel.msl;provider=System.Data.SqlClient;provider connection string="data source=(localdb)\MohaDev;initial catalog=CongTTDT_MOHA_Dev;integrated security=True;MultipleActiveResultSets=True;App=EntityFramework"'
($config.configuration.appSettings.add | Where-Object key -eq 'frontendSiteUrl').value = 'http://localhost:5173'
$config.Save((Join-Path $apiRoot 'Web.config'))
$env:PORT = '5174'
$env:HOST = 'localhost'
$env:BROWSER = 'none'
$processes = @()
function Start-DevProcess($Name, $File, $Arguments, $WorkingDirectory) {
    $process = Start-Process -FilePath $File -ArgumentList $Arguments -WorkingDirectory $WorkingDirectory -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $runtime "$Name.stdout.log") -RedirectStandardError (Join-Path $runtime "$Name.stderr.log")
    $script:processes += [PSCustomObject]@{ Name=$Name; Id=$process.Id; StartTime=$process.StartTime.ToUniversalTime().ToString('o') }
    $script:processes | ConvertTo-Json | Set-Content $stateFile
}
Start-DevProcess 'api' $iis ('/path:"' + $apiRoot + '" /port:55104 /clr:v4.0 /systray:false') $root
Start-DevProcess 'portal' $node 'node_modules\vite\bin\vite.js' (Join-Path $root 'frontend')
Start-DevProcess 'admin' $node 'node_modules\react-scripts\scripts\start.js' (Join-Path $root 'backend')
Write-Host 'Portal: http://localhost:5173'
Write-Host 'Admin:  http://localhost:5174'
Write-Host 'API:    http://localhost:55104/api/Public/Menu?lang=vi'
Write-Host "Logs:   $runtime"
