[CmdletBinding()]
param([string]$OutputFile = '.\urls-can-duyet.json')
$ErrorActionPreference = 'Stop'
Import-Module WebAdministration
$sites = @(Get-Website | Where-Object {
    @($_.Bindings.Collection | Where-Object { $_.bindingInformation -match '(^|:)api-portal\.moha\.gov\.vn$' }).Count -gt 0
})
if ($sites.Count -ne 1) { throw 'Cannot uniquely identify the IIS API site by binding api-portal.moha.gov.vn. Run on the API server or provide its Web.config path to Export-PublicNewsUrls.ps1.' }
$root = [Environment]::ExpandEnvironmentVariables($sites[0].PhysicalPath)
$config = Join-Path $root 'Web.config'
if (!(Test-Path -LiteralPath $config -PathType Leaf)) { throw 'API site Web.config was not found in the IIS physical path.' }
Write-Output ("IIS API site: {0}; config: {1}" -f $sites[0].Name, $config)
& (Join-Path $PSScriptRoot 'Export-PublicNewsUrls.ps1') -ApiConfigPath $config -OutputFile $OutputFile -IncludeDocumentsAndMedia
