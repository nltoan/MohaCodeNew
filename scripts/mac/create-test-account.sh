#!/bin/bash
# Creates local-only admin test account dev_local_admin in the LOCAL container DB. Password -> test-account.txt (chmod 600).
D="$(cd "$(dirname "$0")/../.." && pwd)/.dev/mac"
sql() { docker exec -i -e SQLCMDPASSWORD="$(cat "$D/sa-password.txt")" moha-dev-mssql /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa "$@"; }
[ -f "$D/test-account.txt" ] || { python3 -I -c "import secrets,string;a=string.ascii_letters+string.digits;print('Dv1!'+''.join(secrets.choice(a) for _ in range(16)))" > "$D/test-account.txt"; chmod 600 "$D/test-account.txt"; }
HASH=$(PW="$(cat "$D/test-account.txt")" python3 -I -c "
import os,hashlib,base64
s=os.urandom(16);h=hashlib.pbkdf2_hmac('sha256',os.environ['PW'].encode(),s,600000,32)
print('PBKDF2-SHA256\$600000\$'+base64.b64encode(s).decode()+'\$'+base64.b64encode(h).decode())")
sql -d CongTTDT_MOHA_Dev -b -Q "
IF EXISTS (SELECT 1 FROM dbo.User_Account WHERE TenTruyCap=N'dev_local_admin')
  UPDATE dbo.User_Account SET MatKhau=N'$HASH', TrangThai=N'active', RoleId=1, IsTwoFA=0, MatKhauMacDinh=0, SoLanDangNhapMacDinh=0 WHERE TenTruyCap=N'dev_local_admin';
ELSE
  INSERT dbo.User_Account (TenDangKy,TenTruyCap,MatKhau,TrangThai,RoleId,IsTwoFA,MatKhauMacDinh,SoLanDangNhapMacDinh,CreationDate,EmailAddress)
  VALUES (N'Local Dev Admin (test)',N'dev_local_admin',N'$HASH',N'active',1,0,0,0,GETDATE(),N'dev_local_admin@localhost.invalid');
SELECT UserID,TenTruyCap,RoleId,TrangThai FROM dbo.User_Account WHERE TenTruyCap=N'dev_local_admin'" -W
