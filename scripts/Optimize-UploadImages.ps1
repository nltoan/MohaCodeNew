<#
.SYNOPSIS
  Ep nho hang loat anh cu (jpg/png) trong kho Upload, dung dung quy tac ep nho luc admin tai len
  (canh dai toi da 2560px, JPEG chat luong 90, giu PNG, xoay theo EXIF, bo EXIF).

.DESCRIPTION
  Mac dinh chi CHAY THU (dry-run): doc anh, tinh dung luong tiet kiem duoc, KHONG ghi gi.
  Voi -Apply: sao luu ban goc vao -BackupPath (giu nguyen cau truc thu muc) roi ghi de anh tai cho,
  cung ten/duoi file nen lien ket trong CSDL khong doi. Khong bao gio ghi neu ket qua khong nho hon,
  hoac tiet kiem it hon -MinSavingKB. Bo qua Thumb/, BackUp/, anh moi sua trong -OlderThanMinutes phut.

  Quy tac nam trong API.dll (API.Services.UploadImageOptimizer.Compute) de luon khop voi luc tai len;
  script nap DLL tu bytes nen khong khoa file DLL dang chay.

.EXAMPLE
  # Chay thu tren kho Upload cua may dev
  .\scripts\Optimize-UploadImages.ps1 -UploadPath .dev\api\Upload

.EXAMPLE
  # Ap dung that, xu ly toi da 200 anh moi lan, sao luu ban goc ra ngoai web root
  .\scripts\Optimize-UploadImages.ps1 -UploadPath D:\inetpub\moha\Upload -BackupPath D:\backup\upload-originals-20261112 -Apply -Limit 200
#>
param(
    [Parameter(Mandatory = $true)][string]$UploadPath,
    [string]$ApiDll = '',
    [string]$BackupPath = '',
    [switch]$Apply,
    [int]$MinFileKB = 300,
    [int]$MinSavingKB = 50,
    [int]$OlderThanMinutes = 10,
    [int]$Limit = 0,
    [string]$ReportPath = ''
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $UploadPath -PathType Container)) { throw "Khong thay thu muc Upload: $UploadPath" }
$upload = (Resolve-Path -LiteralPath $UploadPath).Path.TrimEnd('\')

if (-not $ApiDll) {
    foreach ($candidate in @((Join-Path $root 'api\bin\API.dll'), (Join-Path $root '.dev\api\bin\API.dll'))) { if (Test-Path $candidate) { $ApiDll = $candidate; break } }
}
if (-not $ApiDll -or -not (Test-Path -LiteralPath $ApiDll)) { throw 'Khong tim thay API.dll; truyen -ApiDll (vd. api-update\bin\API.dll trong goi phat hanh).' }
$assembly = [System.Reflection.Assembly]::Load([IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $ApiDll).Path))
$type = $assembly.GetType('API.Services.UploadImageOptimizer')
if (-not $type) { throw 'API.dll nay chua co API.Services.UploadImageOptimizer; dung ban API moi.' }
$compute = $type.GetMethod('Compute', [System.Reflection.BindingFlags]'Static,Public,NonPublic')
if (-not $compute) { throw 'API.dll nay chua co UploadImageOptimizer.Compute; dung ban API moi.' }

if ($Apply) {
    if (-not $BackupPath) { throw 'Voi -Apply phai co -BackupPath (thu muc ngoai kho Upload de luu ban goc).' }
    $backupFull = [IO.Path]::GetFullPath($BackupPath).TrimEnd('\')
    if ($backupFull -eq $upload -or $backupFull.StartsWith($upload + '\', [StringComparison]::OrdinalIgnoreCase)) { throw '-BackupPath khong duoc nam trong kho Upload (se bi phuc vu cong khai).' }
    New-Item -ItemType Directory -Force -Path $backupFull | Out-Null
}
if (-not $ReportPath) {
    $reportDir = if ($Apply) { $backupFull } else { Join-Path $root '.dev' }
    New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
    $ReportPath = Join-Path $reportDir ('optimize-upload-images-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.csv')
}

$skipDirs = @('Thumb', 'BackUp')
$cutoff = (Get-Date).AddMinutes(-$OlderThanMinutes)
$files = Get-ChildItem -LiteralPath $upload -Recurse -File | Where-Object {
    $_.Extension -match '^\.(jpe?g|png)$' -and $_.Length -ge ($MinFileKB * 1KB) -and $_.LastWriteTime -lt $cutoff -and
    -not (($_.DirectoryName.Substring($upload.Length).Trim('\') -split '\\')[0] -in $skipDirs)
} | Sort-Object Length -Descending
$candidates = @($files).Count
if ($Limit -gt 0) { $files = $files | Select-Object -First $Limit }

$rows = New-Object System.Collections.Generic.List[object]
$before = 0L; $after = 0L; $changed = 0; $skipped = 0; $failed = 0; $n = 0
foreach ($file in $files) {
    $n++
    if ($n % 50 -eq 0) { Write-Host ("  ... {0}/{1}" -f $n, @($files).Count) }
    $relative = $file.FullName.Substring($upload.Length).TrimStart('\')
    try {
        $bytes = [IO.File]::ReadAllBytes($file.FullName)
        $png = $file.Extension -ieq '.png'
        $invokeArgs = New-Object 'object[]' 2
        $invokeArgs[0] = $bytes; $invokeArgs[1] = $png
        $result = $compute.Invoke($null, $invokeArgs)
        if ($null -eq $result -or ($bytes.Length - $result.Length) -lt ($MinSavingKB * 1KB)) {
            $skipped++; $rows.Add([pscustomobject]@{ Path = $relative; BeforeBytes = $bytes.Length; AfterBytes = $bytes.Length; Action = 'skip' }); continue
        }
        if ($Apply) {
            $backupFile = Join-Path $backupFull $relative
            New-Item -ItemType Directory -Force -Path (Split-Path $backupFile) | Out-Null
            [IO.File]::WriteAllBytes($backupFile, $bytes)
            if ((Get-Item -LiteralPath $backupFile).Length -ne $bytes.Length) { throw 'Sao luu khong khop dung luong' }
            $stamp = $file.LastWriteTime
            $tmp = $file.FullName + '.' + [guid]::NewGuid().ToString('N') + '.tmp'
            [IO.File]::WriteAllBytes($tmp, [byte[]]$result)
            try { [IO.File]::Replace($tmp, $file.FullName, [NullString]::Value) } catch { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue; throw }
            (Get-Item -LiteralPath $file.FullName).LastWriteTime = $stamp
        }
        $changed++; $before += $bytes.Length; $after += $result.Length
        $rows.Add([pscustomobject]@{ Path = $relative; BeforeBytes = $bytes.Length; AfterBytes = $result.Length; Action = $(if ($Apply) { 'optimized' } else { 'would-optimize' }) })
    } catch {
        $failed++; $rows.Add([pscustomobject]@{ Path = $relative; BeforeBytes = $file.Length; AfterBytes = $file.Length; Action = 'error: ' + $_.Exception.Message })
    }
}
$rows | Export-Csv -LiteralPath $ReportPath -NoTypeInformation -Encoding UTF8

Write-Host ''
Write-Host ('Che do            : ' + $(if ($Apply) { 'AP DUNG (da ghi de, ban goc o ' + $backupFull + ')' } else { 'CHAY THU (khong ghi gi)' }))
Write-Host ('Anh du dieu kien  : {0} (>= {1} KB, khong o Thumb/BackUp, cu hon {2} phut)' -f $candidates, $MinFileKB, $OlderThanMinutes)
Write-Host ('Da xu ly/bo qua/loi: {0} / {1} / {2}' -f $changed, $skipped, $failed)
Write-Host ('Dung luong        : {0:N1} MB -> {1:N1} MB (tiet kiem {2:N1} MB)' -f ($before / 1MB), ($after / 1MB), (($before - $after) / 1MB))
Write-Host ('Bao cao CSV       : ' + $ReportPath)
if ($failed -gt 0) { Write-Warning "$failed anh loi; xem cot Action trong bao cao." }
if (-not $Apply -and $changed -gt 0) { Write-Host 'Chay lai voi -Apply -BackupPath <thu muc ngoai web root> de ghi that.' }
