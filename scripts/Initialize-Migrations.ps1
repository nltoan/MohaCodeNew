# Apply every db\migrations\*.sql (name order, idempotent) to the dev LocalDB (localdb)\MohaDev.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$connection = New-Object System.Data.SqlClient.SqlConnection 'Data Source=(localdb)\MohaDev;Initial Catalog=CongTTDT_MOHA_Dev;Integrated Security=True;Connect Timeout=10'
try {
    $connection.Open()
    foreach ($migration in (Get-ChildItem (Join-Path $root 'db\migrations') -Filter '*.sql' | Sort-Object Name)) {
        $command = $connection.CreateCommand()
        $command.CommandTimeout = 120
        $command.CommandText = [IO.File]::ReadAllText($migration.FullName)
        [void]$command.ExecuteNonQuery()
        Write-Host "Migration applied: $($migration.Name)"
    }
} finally { $connection.Dispose() }
