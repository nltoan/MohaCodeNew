param([string]$BaseUrl = 'http://localhost:55111')
$ErrorActionPreference = 'Stop'
if ($BaseUrl -notmatch '^http://(localhost|127\.0\.0\.1)(:\d+)?$') { throw 'Only a local staging URL may be used.' }

foreach ($case in @(
    @{ Path='/tin-tuc/bai---id15397'; Title=''; Date='2025-12-11' },
    @{ Path='/van-ban/van-ban---id1'; Title='14/2022'; Date='2022-12-31' },
    @{ Path='/van-ban/---qpid340'; Title='14/2022'; Date='2022-12-31' }
)) {
    $response = Invoke-WebRequest ($BaseUrl + '/api/Public/MetadataPage?path=' + [Uri]::EscapeDataString($case.Path)) -UseBasicParsing -TimeoutSec 60
    $html = $response.Content
    $identifier = 'https://moha.gov.vn' + $case.Path
    if ($response.StatusCode -ne 200 -or !$html.Contains($case.Title) -or $html -notmatch 'name="DC.Title" content="[^\"]+"' -or !$html.Contains('name="DC.Date" content="' + $case.Date + '"') -or !$html.Contains('name="DC.Identifier" content="' + $identifier + '"')) { throw "Incorrect metadata for $($case.Path)" }
    if ([regex]::Matches($html, '<meta data-portal-dc name="DC.Title"').Count -ne 1) { throw "Unexpected duplicate metadata for $($case.Path)" }
    Write-Output "PASS $($case.Path)"
}
foreach ($case in @(@{Path='/../web.config';Status=400}, @{Path='/tin-tuc/khong-co---id2147483647';Status=404})) {
    try {
        $response = Invoke-WebRequest ($BaseUrl + '/api/Public/MetadataPage?path=' + [Uri]::EscapeDataString($case.Path)) -UseBasicParsing -TimeoutSec 30
        $actual = [int]$response.StatusCode
    } catch {
        if (!$_.Exception.Response) { throw }
        $actual = [int]$_.Exception.Response.StatusCode
    }
    if ($actual -ne $case.Status) { throw "Unexpected status $actual for $($case.Path)" }
    Write-Output "PASS $($case.Path) status=$actual"
}
foreach ($case in @(@{Path='/';Date='2025-07-14'}, @{Path='/chuyen-muc/tin---id10';Date='2025-11-08'}, @{Path='/gioi-thieu';Date='2025-07-26'}, @{Path='/gioi-thieu/chuc-nang-nhiem-vu';Date='2025-12-14'}, @{Path='/gioi-thieu-bo-truong';Date='2025-03-18'})) {
    $response = Invoke-WebRequest ($BaseUrl + '/api/Public/MetadataPage?path=' + [Uri]::EscapeDataString($case.Path)) -UseBasicParsing -TimeoutSec 30
    if (!$response.Content.Contains('name="DC.Date" content="' + $case.Date + '"') -or !$response.Content.Contains('name="DC.Date.Source" content="owner-assigned"')) { throw "Missing synthetic date marker for $($case.Path)" }
    Write-Output "PASS synthetic date $($case.Path)"
}
# Yeu to khuyen nghi (Language, Subject) va dung chi mot bo the DC trong ban ghi chi tiet.
$detail = (Invoke-WebRequest ($BaseUrl + '/api/Public/MetadataPage?path=' + [Uri]::EscapeDataString('/tin-tuc/bai---id15397')) -UseBasicParsing -TimeoutSec 60).Content
foreach ($name in @('DC.Language','DC.Subject','DC.Creator','DC.Publisher','DC.Description','DC.Identifier','DC.Title','DC.Date')) {
    if ([regex]::Matches($detail, 'name="' + [regex]::Escape($name) + '" content="[^"]+"').Count -ne 1) { throw "Metadata element $name must appear exactly once" }
}
Write-Output 'PASS mandatory and recommended Dublin Core elements'
