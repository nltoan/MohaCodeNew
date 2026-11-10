param([ValidateSet('Start', 'Stop', 'Build', 'Test')][string]$Action = 'Start')
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$toolsDir = Join-Path $env:LOCALAPPDATA 'MohaDev'
$nodeDir = Join-Path $toolsDir 'node-v22.23.3-win-x64'
$pathEntries = @($env:PATH -split ';' | Where-Object { $_ })
foreach ($devPath in @((Join-Path $toolsDir 'npm-global'), $nodeDir)) {
    if (-not ($pathEntries | Where-Object { $_.TrimEnd('\') -ieq $devPath.TrimEnd('\') })) {
        $pathEntries = @($devPath) + $pathEntries
    }
}
$env:PATH = $pathEntries -join ';'
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
    $testUrls = @('http://localhost:5173', 'http://localhost:5174')
    if (Test-Path (Join-Path $root 'frontend\dist\index.html')) { $testUrls += 'http://localhost:5175' }
    else { Write-Host 'SKIP preview 5175: frontend\dist\index.html not found (run -Action Build first).' }
    $testUrls += 'http://localhost:55104/api/Public/Menu?lang=vi'
    foreach ($url in $testUrls) {
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
$processes = @()
if (Test-Path $stateFile) {
    foreach ($entry in (Get-Content $stateFile -Raw | ConvertFrom-Json)) {
        $process = Get-Process -Id $entry.Id -ErrorAction SilentlyContinue
        if ($process -and $process.StartTime.ToUniversalTime().Ticks -eq ([datetime]$entry.StartTime).ToUniversalTime().Ticks) {
            $processes += $entry
        }
    }
}
# Adopt the preview started separately by the existing local workflow.
if (!($processes | Where-Object Name -eq 'preview') -and (Test-Path "$runtime\portal-preview.pid")) {
    $previewId = [int](Get-Content "$runtime\portal-preview.pid" -Raw)
    $previewCommand = Get-CimInstance Win32_Process -Filter "ProcessId = $previewId"
    if ($previewCommand.CommandLine -like '*Serve-PortalPreview.mjs*') {
        $previewProcess = Get-Process -Id $previewId
        $processes += [PSCustomObject]@{Name='preview';Id=$previewId;StartTime=$previewProcess.StartTime.ToUniversalTime().ToString('o')}
    }
}
foreach ($service in @(@{Name='portal';Port=5173},@{Name='admin';Port=5174},@{Name='preview';Port=5175},@{Name='api';Port=55104})) {
    if (!($processes | Where-Object Name -eq $service.Name) -and (Get-NetTCPConnection -LocalPort $service.Port -State Listen -ErrorAction SilentlyContinue)) {
        throw "Port $($service.Port) is occupied by an unmanaged process; will not stop it."
    }
}
if (!(Test-Path $iis)) { throw 'IIS Express is not installed.' }
if (!(Test-Path (Join-Path $root 'api\bin\API.dll'))) { throw 'Build API first: scripts/Dev.ps1 -Action Build' }
$localDb = 'C:\Program Files\Microsoft SQL Server\160\Tools\Binn\SqlLocalDB.exe'
& $localDb start MohaDev
if ($LASTEXITCODE -ne 0) { throw 'Initialize the dev database first.' }
$apiRoot = Join-Path $runtime 'api'
if (!($processes | Where-Object Name -eq 'api')) {
# Apply every idempotent migration in name order so new files are never missed locally.
$migrationConnection = New-Object System.Data.SqlClient.SqlConnection 'Data Source=(localdb)\MohaDev;Initial Catalog=CongTTDT_MOHA_Dev;Integrated Security=True;Connect Timeout=10'
try {
    $migrationConnection.Open()
    foreach ($migration in (Get-ChildItem (Join-Path $root 'db\migrations') -Filter '*.sql' | Sort-Object Name)) {
        $migrationCommand = $migrationConnection.CreateCommand()
        $migrationCommand.CommandTimeout = 120
        $migrationCommand.CommandText = [IO.File]::ReadAllText($migration.FullName)
        [void]$migrationCommand.ExecuteNonQuery()
        Write-Host "Migration applied: $($migration.Name)"
    }
} finally { $migrationConnection.Dispose() }
New-Item -ItemType Directory -Path $apiRoot -Force | Out-Null
Copy-Item (Join-Path $root 'api\Global.asax') $apiRoot -Force
Copy-Item (Join-Path $root 'api\bin') $apiRoot -Recurse -Force
foreach ($folder in @('Upload\Thumb', 'UploadTemp', 'tts\newmp3files')) {
    New-Item -ItemType Directory -Path (Join-Path $apiRoot $folder) -Force | Out-Null
}
Copy-Item (Join-Path $root 'api\Upload\web.config') (Join-Path $apiRoot 'Upload\web.config') -Force
[xml]$config = Get-Content (Join-Path $root 'api\Web.config') -Raw
$db = $config.configuration.connectionStrings.add | Where-Object name -eq 'CongTTDT_MOHAEntities'
$db.connectionString = 'metadata=res://*/Models.MohaModel.csdl|res://*/Models.MohaModel.ssdl|res://*/Models.MohaModel.msl;provider=System.Data.SqlClient;provider connection string="data source=(localdb)\MohaDev;initial catalog=CongTTDT_MOHA_Dev;integrated security=True;MultipleActiveResultSets=True;App=EntityFramework"'
($config.configuration.appSettings.add | Where-Object key -eq 'frontendSiteUrl').value = 'http://localhost:5173'
($config.configuration.appSettings.add | Where-Object key -eq 'AllowedCorsOrigins').value = 'http://localhost:5173,http://localhost:5174,http://localhost:5175'
($config.configuration.appSettings.add | Where-Object key -eq 'AllowInsecureOAuthHttp').value = 'true'
$config.Save((Join-Path $apiRoot 'Web.config'))
}
$env:PORT = '5174'
$env:HOST = 'localhost'
$env:BROWSER = 'none'
function Start-DevProcess($Name, $File, $Arguments, $WorkingDirectory) {
    if ($script:processes | Where-Object Name -eq $Name) { return }
    $process = Start-Process -FilePath $File -ArgumentList $Arguments -WorkingDirectory $WorkingDirectory -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $runtime "$Name.stdout.log") -RedirectStandardError (Join-Path $runtime "$Name.stderr.log")
    $script:processes += [PSCustomObject]@{ Name=$Name; Id=$process.Id; StartTime=$process.StartTime.ToUniversalTime().ToString('o') }
    $script:processes | ConvertTo-Json | Set-Content $stateFile
}
Start-DevProcess 'api' $iis ('/path:"' + $apiRoot + '" /port:55104 /clr:v4.0 /systray:false') $root
Start-DevProcess 'portal' $node 'node_modules\vite\bin\vite.js' (Join-Path $root 'frontend')
Start-DevProcess 'admin' $node 'node_modules\react-scripts\scripts\start.js' (Join-Path $root 'backend')
if (Test-Path "$root\frontend\dist\index.html") {
    Start-DevProcess 'preview' $node 'scripts\Serve-PortalPreview.mjs' $root
    ($processes | Where-Object Name -eq 'preview').Id | Set-Content "$runtime\portal-preview.pid"
}
$processes | ConvertTo-Json | Set-Content $stateFile
Write-Host 'Portal: http://localhost:5173'
Write-Host 'Admin:  http://localhost:5174'
Write-Host 'API:    http://localhost:55104/api/Public/Menu?lang=vi'
Write-Host 'Preview: http://localhost:5175'
Write-Host "Logs:   $runtime"
