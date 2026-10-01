param([string]$BackupPath)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$toolsDir = Join-Path $env:LOCALAPPDATA 'MohaDev'
$localDb = 'C:\Program Files\Microsoft SQL Server\160\Tools\Binn\SqlLocalDB.exe'
if (!(Test-Path $localDb)) { throw 'SQL LocalDB 2022 is not installed.' }
if (!$BackupPath) {
    $BackupPath = (Get-ChildItem (Join-Path $root 'db') -File |
        Where-Object Extension -In @('.bak', '.zip', '.7z') |
        Sort-Object Name -Descending | Select-Object -First 1).FullName
}
if (!$BackupPath) { throw 'No database backup found in db/.' }
$BackupPath = (Resolve-Path $BackupPath).Path
$extractDir = Join-Path $toolsDir ('database\' + [IO.Path]::GetFileNameWithoutExtension($BackupPath))
New-Item -ItemType Directory -Path $extractDir -Force | Out-Null
switch ([IO.Path]::GetExtension($BackupPath)) {
    '.zip' { Expand-Archive -LiteralPath $BackupPath -DestinationPath $extractDir -Force }
    '.7z' {
        & (Join-Path $toolsDir '7zr.exe') x $BackupPath "-o$extractDir" -y
        if ($LASTEXITCODE -ne 0) { throw 'Backup extraction failed.' }
    }
    '.bak' { $extractDir = Split-Path $BackupPath -Parent }
}
$backup = Get-ChildItem $extractDir -Filter '*.bak' -Recurse | Select-Object -First 1
if (!$backup) { throw 'Archive contains no .bak file.' }
& $localDb create MohaDev 16.0
& $localDb start MohaDev
if ($LASTEXITCODE -ne 0) { throw 'Cannot start MohaDev LocalDB instance.' }
Add-Type -AssemblyName System.Data
$connection = New-Object System.Data.SqlClient.SqlConnection 'Data Source=(localdb)\MohaDev;Initial Catalog=master;Integrated Security=True;Connect Timeout=60'
$connection.Open()
function Read-SqlTable([string]$Sql) {
    $command = $connection.CreateCommand()
    $command.CommandText = $Sql
    $command.CommandTimeout = 600
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter $command
    $table = New-Object System.Data.DataTable
    [void]$adapter.Fill($table)
    return ,$table
}
try {
    $exists = Read-SqlTable "SELECT DB_ID(N'CongTTDT_MOHA_Dev') AS Id"
    if ($exists.Rows[0].Id -isnot [DBNull]) {
        Write-Host 'CongTTDT_MOHA_Dev already exists; reuse it without overwriting data.'
        return
    }
    $backupSqlPath = $backup.FullName.Replace("'", "''")
    $header = Read-SqlTable "RESTORE HEADERONLY FROM DISK=N'$backupSqlPath'"
    Write-Host "Backup: $($backup.Name); source SQL major version: $($header.Rows[0].SoftwareVersionMajor)"
    $files = Read-SqlTable "RESTORE FILELISTONLY FROM DISK=N'$backupSqlPath'"
    $dataDir = Join-Path $toolsDir 'data'
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
    $moves = @()
    $index = 0
    foreach ($file in $files.Rows) {
        $extension = if ($file.Type -eq 'L') { 'ldf' } else { 'mdf' }
        $target = (Join-Path $dataDir "MohaDev_$index.$extension").Replace("'", "''")
        $logical = $file.LogicalName.Replace("'", "''")
        $moves += "MOVE N'$logical' TO N'$target'"
        $index++
    }
    $command = $connection.CreateCommand()
    $command.CommandTimeout = 600
    $command.CommandText = "RESTORE DATABASE [CongTTDT_MOHA_Dev] FROM DISK=N'$backupSqlPath' WITH " + ($moves -join ', ') + ', RECOVERY'
    [void]$command.ExecuteNonQuery()
    $tables = Read-SqlTable 'SELECT COUNT(*) AS Count FROM CongTTDT_MOHA_Dev.sys.tables'
    Write-Host "Restored CongTTDT_MOHA_Dev; tables: $($tables.Rows[0].Count)"
} finally { $connection.Dispose() }
