[CmdletBinding()]
param(
    [Parameter(Mandatory=$true, ParameterSetName='Explicit')][string]$Server,
    [Parameter(Mandatory=$true, ParameterSetName='Explicit')][string]$Database,
    [Parameter(Mandatory=$true, ParameterSetName='Config')][string]$ApiConfigPath,
    [Parameter(ParameterSetName='Config')][string]$ExpectedDatabase = 'CongTTDT_MOHA',
    [Parameter(Mandatory=$true)][string]$OutputFile,
    [switch]$IncludeDocumentsAndMedia
)
$ErrorActionPreference = 'Stop'
$target = [IO.Path]::GetFullPath($OutputFile)
if ([IO.File]::Exists($target)) { throw 'Output file already exists; choose a new path.' }
$builder = [System.Data.SqlClient.SqlConnectionStringBuilder]::new()
if ($PSCmdlet.ParameterSetName -eq 'Config') {
    Add-Type -AssemblyName System.Data.Entity
    [xml]$configuration = [IO.File]::ReadAllText([IO.Path]::GetFullPath($ApiConfigPath))
    $entries = @($configuration.configuration.connectionStrings.add | Where-Object { $_.name -eq 'CongTTDT_MOHAEntities' })
    if ($entries.Count -ne 1) { throw 'Expected exactly one CongTTDT_MOHAEntities connection in API Web.config.' }
    $entity = [System.Data.EntityClient.EntityConnectionStringBuilder]::new([string]$entries[0].connectionString)
    $builder = [System.Data.SqlClient.SqlConnectionStringBuilder]::new($entity.ProviderConnectionString)
    if ($builder.InitialCatalog -ne $ExpectedDatabase) { throw 'Unexpected database in API config; no export was made.' }
    Write-Output ("Using API configuration: server={0}; database={1}" -f $builder.DataSource, $builder.InitialCatalog)
} else {
    $builder['Data Source'] = $Server
    $builder['Initial Catalog'] = $Database
    $builder['Integrated Security'] = $true
}
$builder['Connect Timeout'] = 15
$connection = [System.Data.SqlClient.SqlConnection]::new($builder.ConnectionString)
try {
    $connection.Open()
    $command = $connection.CreateCommand()
    $command.CommandTimeout = 120
    # Export only news explicitly published in Vietnamese and already dated;
    # categories, documents, media and static pages require separate sources.
    $command.CommandText = @'
SELECT 'tin-tuc' AS Route, ID, TieuDe FROM dbo.TinTuc
WHERE TrangThai = N'public' AND NgonNgu = N'vi'
  AND NgayXuatBan IS NOT NULL AND NgayXuatBan <= GETDATE()
  AND TieuDe IS NOT NULL AND LTRIM(RTRIM(TieuDe)) <> N''
'@
    if ($IncludeDocumentsAndMedia) {
        # Stricter than the current multimedia list endpoints, whose status
        # predicate appears in the JOIN: never include unpublished albums.
        $command.CommandText += @'

UNION ALL
SELECT 'van-ban', ID, SoKyHieu FROM dbo.VanBan
 WHERE TrangThai = 1 AND Lang = 1066 AND SoKyHieu IS NOT NULL AND LTRIM(RTRIM(SoKyHieu)) <> N''
UNION ALL
SELECT 'photo', ID, TieuDe FROM dbo.ABL_AlbumAnh
 WHERE TrangThai = N'1' AND TieuDe IS NOT NULL AND LTRIM(RTRIM(TieuDe)) <> N''
   AND (ThoiGianXuatBan IS NULL OR ThoiGianXuatBan <= GETDATE())
UNION ALL
SELECT 'video', ID, TieuDe FROM dbo.ABL_AlbumVideo
 WHERE TrangThai = N'1' AND TieuDe IS NOT NULL AND LTRIM(RTRIM(TieuDe)) <> N''
   AND (ThoiGianXuatBan IS NULL OR ThoiGianXuatBan <= GETDATE())
UNION ALL
SELECT 'audio', ID, TieuDe FROM dbo.ABL_AlbumAudio
 WHERE TrangThai = N'1' AND TieuDe IS NOT NULL AND LTRIM(RTRIM(TieuDe)) <> N''
   AND (ThoiGianXuatBan IS NULL OR ThoiGianXuatBan <= GETDATE())
'@
    }
    $command.CommandText += "`nORDER BY Route, ID"
    $reader = $command.ExecuteReader()
    $urls = [System.Collections.Generic.List[string]]::new()
    try {
        while ($reader.Read()) {
            $route = $reader.GetString(0)
            $title = $reader.GetString(2).ToLowerInvariant().Normalize([Text.NormalizationForm]::FormD)
            $title = [regex]::Replace($title, '[\u0300-\u036f]', '').Replace([string][char]0x0111, 'd')
            $title = [regex]::Replace($title, '[^0-9a-z\-\s]', '')
            $title = [regex]::Replace($title, '\s+', '-')
            $title = [regex]::Replace($title, '-+', '-').Trim('-')
            $urls.Add("https://moha.gov.vn/$route/$title---id$($reader.GetInt32(1))")
        }
    } finally { $reader.Dispose() }
    if ($urls.Count -eq 0) { throw 'No published Vietnamese news found; no file was written.' }
    $json = ConvertTo-Json -InputObject @($urls.ToArray()) -Depth 2
    $stream = [IO.File]::Open($target, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $writer = [IO.StreamWriter]::new($stream, [Text.UTF8Encoding]::new($false))
        try { $writer.Write($json) } finally { $writer.Dispose() }
    } finally { $stream.Dispose() }
    Write-Output "Exported $($urls.Count) public content URLs to $target. Review before generating or publishing a sitemap."
} finally { $connection.Dispose() }
