$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$connection = New-Object System.Data.SqlClient.SqlConnection 'Data Source=(localdb)\MohaDev;Initial Catalog=CongTTDT_MOHA_Dev;Integrated Security=True'
try {
 $connection.Open()
 $command = $connection.CreateCommand()
 $command.CommandText = [IO.File]::ReadAllText((Join-Path $root 'db\migrations\20261001-HoiQuy.sql'))
 $command.ExecuteNonQuery() | Out-Null
 Write-Output 'HoiQuy schema and permissions initialized in local development database.'
} finally { $connection.Dispose() }
