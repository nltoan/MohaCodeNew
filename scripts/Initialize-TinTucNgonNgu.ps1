$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$migration = Join-Path $root 'db\migrations\20261109-TinTuc-NgonNgu.sql'
$connection = New-Object System.Data.SqlClient.SqlConnection 'Data Source=(localdb)\MohaDev;Initial Catalog=CongTTDT_MOHA_Dev;Integrated Security=True;Connect Timeout=10'
try {
    $connection.Open()
    $command = $connection.CreateCommand()
    $command.CommandTimeout = 120
    $command.CommandText = [IO.File]::ReadAllText($migration)
    [void]$command.ExecuteNonQuery()
    Write-Output 'TinTuc language migration verified in local development database.'
} finally {
    $connection.Dispose()
}
