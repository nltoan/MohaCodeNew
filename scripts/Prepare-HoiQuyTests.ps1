$ErrorActionPreference='Stop'
$c=New-Object System.Data.SqlClient.SqlConnection 'Data Source=(localdb)\MohaDev;Initial Catalog=CongTTDT_MOHA_Dev;Integrated Security=True'
$c.Open(); $q=$c.CreateCommand(); $q.CommandText="SELECT COUNT(*) FROM dbo.RolePermission rp JOIN dbo.Role r ON r.ID=rp.RoleId JOIN dbo.Permission p ON p.ID=rp.PermissionId WHERE r.Name='Admin' AND p.Name='manage-hoiquy'"; Write-Output ('Admin permission count: '+$q.ExecuteScalar())
$accounts=@()
foreach($pair in @(@('codex.hoiquy.test','Admin'),@('codex.hoiquy.denied','EDITOR'))){
 $pw=[Guid]::NewGuid().ToString('N'); $q.Parameters.Clear(); $q.CommandText="IF EXISTS(SELECT 1 FROM dbo.User_Account WHERE TenTruyCap=@name) UPDATE dbo.User_Account SET MatKhau=@pw,IsTwoFA=0 WHERE TenTruyCap=@name ELSE INSERT dbo.User_Account(TenDangKy,TenTruyCap,MatKhau,RoleId,TrangThai,IsTwoFA) SELECT @name,@name,@pw,ID,'active',0 FROM dbo.Role WHERE Name=@role OR (@role='EDITOR' AND ID=(SELECT MIN(ID) FROM dbo.Role WHERE Name<>'Admin'))";
 $q.Parameters.AddWithValue('@name',$pair[0])|Out-Null; $q.Parameters.AddWithValue('@pw',$pw)|Out-Null; $q.Parameters.AddWithValue('@role',$pair[1])|Out-Null; $q.ExecuteNonQuery()|Out-Null; $accounts += @{name=$pair[0];password=$pw}
}
$accounts | ConvertTo-Json | Set-Content (Join-Path (Split-Path $PSScriptRoot -Parent) '.dev\hoi-test-accounts.json') -Encoding utf8
$c.Dispose(); Write-Output 'Isolated development test accounts ready.'
