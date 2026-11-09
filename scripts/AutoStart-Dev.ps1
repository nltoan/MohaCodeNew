param([switch]$Once)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$runtime = Join-Path $root '.dev'
New-Item -ItemType Directory -Path $runtime -Force | Out-Null
$log = Join-Path $runtime 'autostart.log'
function Write-DevLog([string]$Message) {
    Add-Content -LiteralPath $log -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' ' + $Message)
}
$mutex = New-Object System.Threading.Mutex($false, ('Local\MohaDev-Local-' + $env:USERNAME))
if (!$mutex.WaitOne(0)) {
    $mutex.Dispose()
    if ($Once) { throw 'Supervisor already running; use its health log instead of a duplicate one-shot.' }
    exit
}
try {
    Write-DevLog 'Starting local environment supervisor.'
    $apiFailures = 0
    $firstRun = $true
    do {
        try {
            $missing = @(@(5173,5174,5175,55104) | Where-Object {
                !(Get-NetTCPConnection -LocalPort $_ -State Listen -ErrorAction SilentlyContinue)
            })
            if ($missing.Count -gt 0 -or $Once -or $firstRun) {
                & (Join-Path $PSScriptRoot 'Dev.ps1') -Action Start *> "$runtime\autostart-start.log"
                Write-DevLog ('Start completed; previously missing ports: ' + ($missing -join ','))
                $firstRun = $false
            }
            $connection = New-Object System.Data.SqlClient.SqlConnection 'Data Source=(localdb)\MohaDev;Initial Catalog=CongTTDT_MOHA_Dev;Integrated Security=True;Connect Timeout=10'
            try {
                $connection.Open()
                $command = $connection.CreateCommand()
                $command.CommandText = 'SELECT 1'
                $command.CommandTimeout = 10
                [void]$command.ExecuteScalar()
            } catch {
                Write-DevLog ('Database check failed; waking LocalDB: ' + $_.Exception.Message)
                & (Join-Path $PSScriptRoot 'Dev.ps1') -Action Start *> "$runtime\autostart-start.log"
                throw
            } finally { $connection.Dispose() }
            try {
                $response = Invoke-WebRequest 'http://localhost:55104/api/Public/PostsByCategory?lang=vi&ID=365&skip=0&take=1&requireTotalCount=true' -UseBasicParsing -TimeoutSec 15
                $payload = $response.Content | ConvertFrom-Json
                if ($response.StatusCode -ne 200 -or !$payload.PSObject.Properties['data']) { throw 'Invalid API response' }
                if ($apiFailures -gt 0) { Write-DevLog 'API recovered.' }
                $apiFailures = 0
            } catch {
                $apiFailures++
                Write-DevLog ("API health failure $apiFailures`: " + $_.Exception.Message)
                if ($apiFailures -ge 3) {
                    $entry = $null
                    foreach ($candidate in (Get-Content "$runtime\processes.json" -Raw | ConvertFrom-Json)) {
                        if ($candidate.Name -eq 'api') { $entry = $candidate }
                    }
                    if ($entry) {
                        $process = Get-Process -Id $entry.Id -ErrorAction SilentlyContinue
                        if ($process -and $process.StartTime.ToUniversalTime().Ticks -eq ([datetime]$entry.StartTime).ToUniversalTime().Ticks) {
                            Stop-Process -Id $entry.Id
                            Write-DevLog 'Restarting the managed IIS Express API after 3 health failures.'
                        }
                    }
                    & (Join-Path $PSScriptRoot 'Dev.ps1') -Action Start *> "$runtime\autostart-start.log"
                    $apiFailures = 0
                }
                if ($Once) { throw }
            }
            if ($Once) { Write-DevLog 'PASS database and API health.' }
        } catch {
            Write-DevLog ('Recovery error: ' + $_.Exception.Message)
            if ($Once) { throw }
        }
        if (!$Once) { Start-Sleep -Seconds 30 }
    } while (!$Once)
} finally {
    $mutex.ReleaseMutex()
    $mutex.Dispose()
}
