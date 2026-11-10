param([string]$BaseUrl = 'http://localhost:55104')
$ErrorActionPreference = 'Stop'
# Local development database only. Creates unique test users and removes them
# in finally; never connects to production or reads real passwords.
$connection = [System.Data.SqlClient.SqlConnection]::new('Data Source=(localdb)\MohaDev;Initial Catalog=CongTTDT_MOHA_Dev;Integrated Security=True;Connect Timeout=10')
$prefix = '__codex_status_' + [Guid]::NewGuid().ToString('N') + '_'
$password = [Guid]::NewGuid().ToString('N') + 'aA9!'
[void][Reflection.Assembly]::LoadFrom((Resolve-Path (Join-Path (Split-Path $PSScriptRoot -Parent) 'api/bin/Google.Authenticator.dll')))
$ids = [System.Collections.Generic.List[int]]::new()
try {
    $connection.Open()
    $roleQuery = $connection.CreateCommand()
    $roleQuery.CommandText = "SELECT TOP 1 r.ID FROM dbo.Role r JOIN dbo.RolePermission rp ON rp.RoleId=r.ID JOIN dbo.Permission p ON p.ID=rp.PermissionId WHERE p.Name=N'manage-user'"
    $role = $roleQuery.ExecuteScalar()
    if ($null -eq $role) { throw 'Local test role missing' }
    foreach ($case in @(
        @{Status='active';Ok=$true;TwoFA=0},
        @{Status='True';Ok=$true;TwoFA=0},
        @{Status='TRUE';Ok=$true;TwoFA=0},
        @{Status='False';Ok=$false;TwoFA=0},
        @{Status='locked';Ok=$false;TwoFA=0},
        @{Status='deleted';Ok=$false;TwoFA=0},
        @{Status='True';Ok=$false;TwoFA=1},
        @{Status='True';Ok=$true;TwoFA=1;WithCode=$true}
    )) {
        $name = $prefix + [Guid]::NewGuid().ToString('N')
        $sql = $connection.CreateCommand()
        $sql.CommandText = 'INSERT dbo.User_Account (TenTruyCap, TenDangKy, MatKhau, TrangThai, RoleId, IsTwoFA, Authenticator_Secret) OUTPUT INSERTED.UserID VALUES (@name,@name,@password,@status,@role,@twofa,@secret)'
        [void]$sql.Parameters.AddWithValue('@name', $name)
        [void]$sql.Parameters.AddWithValue('@password', $password)
        [void]$sql.Parameters.AddWithValue('@status', $case.Status)
        [void]$sql.Parameters.AddWithValue('@role', [int]$role)
        [void]$sql.Parameters.AddWithValue('@twofa', [int]$case.TwoFA)
        [void]$sql.Parameters.AddWithValue('@secret', 'local-test-secret')
        $ids.Add([int]$sql.ExecuteScalar())
        try {
            $tokenUrl = ($BaseUrl + '/api/Token?type=password')
            if ($case.WithCode) {
                $otp = [Google.Authenticator.TwoFactorAuthenticator]::new().GetCurrentPIN('local-test-secret', $false)
                $tokenUrl += '&code=' + [Uri]::EscapeDataString($otp)
            }
            $response = Invoke-WebRequest $tokenUrl -Method Post -Body @{grant_type='password';username=$name;password=$password} -UseBasicParsing -TimeoutSec 60
            if (!$case.Ok -or $response.StatusCode -ne 200) { throw 'Unexpected successful login' }
            $token = ($response.Content | ConvertFrom-Json).access_token
            if (!$token) { throw 'Missing token' }
            $auth = @{ Authorization = "Bearer $token" }
            $profile = Invoke-WebRequest ($BaseUrl + '/api/User_Account/GetLoginUser') -Headers $auth -UseBasicParsing -TimeoutSec 30
            if ($profile.StatusCode -ne 200) { throw 'Active-user authorization failed' }
            $permissions = Invoke-WebRequest ($BaseUrl + '/api/User_Account/Get') -Headers $auth -UseBasicParsing -TimeoutSec 30
            if ($permissions.StatusCode -ne 200) { throw 'Permission authorization failed' }
        } catch {
            if ($case.Ok -or !$_.Exception.Response -or [int]$_.Exception.Response.StatusCode -ne 400) { throw }
        }
        Write-Output "PASS status=$($case.Status) twoFA=$($case.TwoFA) codeProvided=$([bool]$case.WithCode)"
    }
} finally {
    foreach ($id in $ids) {
        $delete = $connection.CreateCommand()
        $delete.CommandText = 'DELETE FROM dbo.User_Account WHERE UserID=@id AND TenTruyCap LIKE @prefix'
        [void]$delete.Parameters.AddWithValue('@id', $id)
        [void]$delete.Parameters.AddWithValue('@prefix', $prefix + '%')
        [void]$delete.ExecuteNonQuery()
    }
    $connection.Dispose()
}
