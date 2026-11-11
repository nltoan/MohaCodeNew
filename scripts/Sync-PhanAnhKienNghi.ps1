<#
.SYNOPSIS
  Tai hai danh sach Phan anh kien nghi / Kien nghi cu tri tu phananh.moha.gov.vn va ghi thanh ban chup JSON cho API.

.DESCRIPTION
  Dung khi MAY CHU API khong goi ra duoc phananh.moha.gov.vn (Invoke-WebRequest bao "Unable to connect to the remote server").
  Chay script nay tren mot may goi duoc he thong ngoai (may quan tri, may chu khac), ghi vao thu muc App_Data\external cua API
  (hoac chep cac file ket qua sang do). API doc cac file nay khi khong goi duoc he thong ngoai va chi nhan mang JSON hop le.

  Chay dinh ky (vi du 5-10 phut) bang Task Scheduler:
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File Sync-PhanAnhKienNghi.ps1 -TargetDir \\may-api\c$\inetpub\api\App_Data\external

.PARAMETER TargetDir
  Thu muc dich (se duoc tao neu chua co). Ghi getPAKN.json va getKNCT.json, thay the nguyen tu qua file tam.
#>
param(
    [Parameter(Mandatory = $true)][string]$TargetDir,
    [string]$BaseUrl = 'https://phananh.moha.gov.vn/Integrated',
    [int]$TimeoutSec = 30
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null

$failed = 0
foreach ($item in @(@{ Name = 'getPAKN'; Path = 'getList' }, @{ Name = 'getKNCT'; Path = 'getListKNCT' })) {
    $url = $BaseUrl.TrimEnd('/') + '/' + $item.Path
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $TimeoutSec -Headers @{ Accept = 'application/json, text/plain, */*' }
        $bytes = $response.RawContentStream.ToArray()
        $json = [Text.Encoding]::UTF8.GetString($bytes)
        $parsed = $json | ConvertFrom-Json
        if ($json.TrimStart()[0] -ne '[') { throw 'Phan hoi khong phai mang JSON' }
        $target = Join-Path $TargetDir ($item.Name + '.json')
        $tmp = $target + '.' + [guid]::NewGuid().ToString('N') + '.tmp'
        [IO.File]::WriteAllText($tmp, $json, (New-Object Text.UTF8Encoding($false)))
        if (Test-Path -LiteralPath $target) { [IO.File]::Replace($tmp, $target, [NullString]::Value) } else { [IO.File]::Move($tmp, $target) }
        Write-Host ('{0}: {1} muc -> {2}' -f $item.Name, @($parsed).Count, $target)
    } catch {
        $failed++
        Write-Warning ('{0}: loi {1} ({2})' -f $item.Name, $_.Exception.Message, $url)
    }
}
if ($failed -gt 0) { exit 1 }
