// Kiem tra tang cuong dang nhap / bearer token (thu hoi token, 2FA, khoa theo ten dang nhap).
// Chay: node scripts/Test-AuthHardening.cjs [--full-lockout]
// Khong doi mat khau tai khoan that: thu hoi token va 2FA chay tren tai khoan tam __codex_tmp_<thoi gian> do admin tao, xoa trong finally.
// --full-lockout chay them ~3 phut de cham toi gioi han theo ten dang nhap.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base='http://localhost:55104/api',rows=[],out='.dev/auth-hardening-results.json';fs.mkdirSync('.dev',{recursive:true});
const save=()=>fs.writeFileSync(out,JSON.stringify(rows,null,2));
function pass(name,data={}){rows.push({name,status:'PASS',...data});console.log('PASS '+name);save()}
function skip(name,reason){rows.push({name,status:'SKIP',reason});console.log('SKIP '+name+': '+reason);save()}
async function req(route,opts={}){const r=await fetch(base+route,{signal:AbortSignal.timeout(20000),...opts});const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={}}return {status:r.status,headers:r.headers,data,text}}
const token=(username,password)=>req('/Token?type=password',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'password',username,password})});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const formH={'Content-Type':'application/x-www-form-urlencoded'};
// Gui giong devextreme-aspnet-data (admin GUI): form-urlencoded voi key + values (JSON).
const send=(route,method,authH,fields)=>req(route,{method,headers:{...authH,...formH},body:new URLSearchParams(Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)])))});
const tokenCode=(username,password,code)=>req('/Token?type=password&code='+encodeURIComponent(code),{method:'POST',headers:formH,body:new URLSearchParams({grant_type:'password',username,password})});
const bearer=t=>({Authorization:'Bearer '+t});
const strongPassword=()=>'Tmp#'+crypto.randomBytes(12).toString('hex')+'Aa9';
// TOTP RFC 6238 (SHA1, 6 so, buoc 30 giay).
function base32Decode(s){const a='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits=0,val=0;const out=[];for(const ch of s.replace(/[\s=]/g,'').toUpperCase()){const i=a.indexOf(ch);if(i<0)throw new Error('bad base32 '+ch);val=(val<<5)|i;bits+=5;if(bits>=8){out.push((val>>>(bits-8))&255);bits-=8}}return Buffer.from(out)}
const stepNow=()=>Math.floor(Date.now()/30000);
function totp(key,counter){const msg=Buffer.alloc(8);msg.writeBigUInt64BE(BigInt(counter));const h=crypto.createHmac('sha1',key).update(msg).digest();const o=h[h.length-1]&15;return String((h.readUInt32BE(o)&0x7fffffff)%1000000).padStart(6,'0')}
async function tempUserTests(admin,roleId){
 const name='__codex_tmp_'+Date.now(),p0=strongPassword();let userId=null;const notes={};
 const loginOk=async(password,code)=>{const r=code?await tokenCode(name,password,code):await token(name,password);assert.equal(r.status,200,'temp login: '+r.text);assert.ok(r.data.access_token);return r};
 const whoami=t=>req('/User_Account/GetLoginUser',{headers:bearer(t)});
 const expectRevoked=async(t,label)=>{const r=await whoami(t);assert.equal(r.status,401,label+': '+r.status+' '+r.text);assert.equal(r.data.error,'token_revoked',label+': '+r.text)};
 try{
  const created=await send('/User_Account/Post','POST',admin,{values:{TenDangKy:name,TenTruyCap:name,MatKhau:p0,TrangThai:'active',RoleId:roleId,IsTwoFA:0,IsReceiveEmail:0}});
  assert.equal(created.status,201,'admin Post temp user: '+created.text);userId=created.data.UserID;assert.ok(userId>0);
  pass('Admin creates disposable user through User_Account/Post (GUI payload)',{user:name,userId,roleId});
  // Thu hoi khi admin doi mat khau (Put MatKhau).
  const t1=(await loginOk(p0)).data.access_token;const me=await whoami(t1);assert.equal(me.status,200);assert.equal(me.data.data[0].TenTruyCap,name);
  const p1=strongPassword();const put1=await send('/User_Account/Put','PUT',admin,{key:String(userId),values:{MatKhau:p1}});assert.equal(put1.status,200,'admin Put MatKhau: '+put1.text);
  await expectRevoked(t1,'T1 after admin password reset');
  const oldPw=await token(name,p0);assert.equal(oldPw.status,400,'old password must fail');
  const t2=(await loginOk(p1)).data.access_token;assert.equal((await whoami(t2)).status,200);
  pass('Token revoked (401 token_revoked) after admin resets password via Put; new password logs in, old one fails');
  // Thu hoi khi nguoi dung tu doi mat khau (Home/UpdateProfile).
  const p2=strongPassword();const up=await send('/Home/UpdateProfile','POST',bearer(t2),{values:{Password:p2,CurrentPassword:p1}});
  assert.equal(up.status,200,'UpdateProfile password: '+up.text);assert.equal(up.data.status,'ok',up.text);
  await expectRevoked(t2,'T2 after self password change');
  const t3=(await loginOk(p2)).data.access_token;assert.equal((await whoami(t3)).status,200);
  pass('Token revoked after the user changes own password via Home/UpdateProfile; new password logs in');
  // Mat khau mac dinh: admin dat lai -> sau N lan dang nhap phien bi han che (setup_required).
  const p3=strongPassword();assert.equal((await send('/User_Account/Put','PUT',admin,{key:String(userId),values:{MatKhau:p3}})).status,200);
  await expectRevoked(t3,'T3 after second admin reset');
  let setup=null,normalLogins=0;
  for(let i=0;i<8&&!setup;i++){const r=await loginOk(p3);if(r.data.setup_required==='1')setup=r.data.access_token;else normalLogins++}
  assert.ok(setup,'setup_required expected after default-password logins');notes.defaultPasswordLogins=normalLogins;
  assert.equal((await whoami(setup)).status,200,'GetLoginUser allowed during setup');
  const blocked=await req('/Home/Statistic',{headers:bearer(setup)});assert.equal(blocked.status,403,'restricted endpoint during setup: '+blocked.status);assert.equal(blocked.data.error,'setup_required');
  pass('Admin-set (default) password: after '+normalLogins+' logins the token carries setup_required and other endpoints get 403',{normalLogins});
  // Bat 2FA: entryKey = base32 cua byte UTF-8 cua secret luu trong DB (secretIsBase32=false).
  const gen=await req('/Home/GenerateAuthenticateSecret',{headers:bearer(setup)});assert.equal(gen.status,200,'GenerateAuthenticateSecret: '+gen.text);
  const key=base32Decode(gen.data.entryKey);assert.match(key.toString('utf8'),/^[A-Z2-7]{32}$/,'entryKey decodes to the 32-char stored secret');
  const p4=strongPassword();
  const half=await send('/Home/UpdateProfile','POST',bearer(setup),{values:{Password:p4,CurrentPassword:p3}});
  assert.equal(half.status,400,'setup needs password AND 2FA: '+half.text);
  const wrong=await send('/Home/UpdateProfile','POST',bearer(setup),{values:{Password:p4,CurrentPassword:p3,IsTwoFA:1,Code:totp(key,stepNow()-6)}});
  assert.equal(wrong.data.status,'ko','UpdateProfile with a 3-minute-old code must fail: '+wrong.text);
  const done=await send('/Home/UpdateProfile','POST',bearer(setup),{values:{Password:p4,CurrentPassword:p3,IsTwoFA:1,Code:totp(key,stepNow())}});
  assert.equal(done.status,200,'setup UpdateProfile: '+done.text);assert.equal(done.data.status,'ok',done.text);
  await expectRevoked(setup,'setup token after completing setup');
  pass('Setup flow: UpdateProfile with new password + valid TOTP enables 2FA (old/insufficient attempts refused) and revokes the setup token');
  // TOTP khi dang nhap: do lech 60 giay, chan dung lai ma trong 3 phut.
  const noCode=await token(name,p4);assert.equal(noCode.status,400);assert.ok(noCode.text.includes('Mã xác nhận không đúng!'),'login without code: '+noCode.text);
  const used=new Set();let s=stepNow();const c0=totp(key,s);used.add(c0);
  const l1=await loginOk(p4,c0);assert.equal(l1.data.setup_required,undefined,'no setup_required after setup');const t4=l1.data.access_token;
  assert.equal((await req('/Home/Statistic',{headers:bearer(t4)})).status,200,'normal endpoint after setup');
  const replay=await tokenCode(name,p4,c0);assert.equal(replay.status,400);assert.ok(replay.text.includes('Mã xác nhận không đúng!'),'replayed code: '+replay.text);
  pass('Login with a fresh TOTP succeeds; the same code is refused on reuse within 3 minutes');
  // Bien do lech: cho dau buoc (con >=15 giay) de buoc n khong doi giua cac lan thu.
  while(30000-Date.now()%30000<15000)await sleep(500);
  const n=stepNow();
  // Sai 4 lan lien tiep (duoi gioi han 10/phut); dang nhap thanh cong sau do xoa bo dem.
  for(const d of [-4,-3,3,4]){const c=totp(key,n+d);const r=await tokenCode(name,p4,c);assert.equal(r.status,400,'step '+d+' code must fail: '+r.text);assert.ok(r.text.includes('Mã xác nhận không đúng!'),'step '+d+' code: '+r.text)}
  assert.equal(stepNow(),n,'step changed during refused-code checks');
  const edges=[];
  for(const d of [-2,2]){const c=totp(key,n+d);if(used.has(c)){skip('TOTP step '+d+' accepted','code equals one already used in the replay window');continue}used.add(c);await loginOk(p4,c);edges.push(d)}
  assert.ok(edges.length>0,'no tolerance-edge code could be checked');
  pass('TOTP tolerance is 60s: codes 3-4 steps (90s-2min) old or ahead are refused, codes at +/-2 steps (60s) are accepted',{acceptedSteps:edges});
  let fresh;
  for(;;){while(stepNow()<=n)await sleep(1000);fresh=totp(key,stepNow());if(!used.has(fresh))break;await sleep(30000-Date.now()%30000+100)}
  used.add(fresh);
  const t5=(await loginOk(p4,fresh)).data.access_token;
  pass('Fresh code from a later 30s step logs in after a replay was refused');
  // Khoa tai khoan (Put TrangThai) va xoa (Delete).
  assert.equal((await send('/User_Account/Put','PUT',admin,{key:String(userId),values:{TrangThai:'locked'}})).status,200);
  await expectRevoked(t5,'token after deactivation');await expectRevoked(t4,'older token after deactivation');
  pass('Token revoked after admin deactivates the user (Put TrangThai=locked)');
  assert.equal((await send('/User_Account/Put','PUT',admin,{key:String(userId),values:{TrangThai:'active'}})).status,200);
  // Ghi nhan: kich hoat lai co lam token cu song lai khong (stamp chi theo mat khau).
  notes.tokenAfterReactivate=(await whoami(t5)).status;
  const del=await send('/User_Account/Delete','DELETE',admin,{key:String(userId)});assert.ok(del.status===204||del.status===200,'Delete: '+del.status+' '+del.text);
  await expectRevoked(t5,'token after Delete');
  const after=await token(name,p4);assert.equal(after.status,400,'deleted user cannot log in');
  pass('Token revoked after admin Delete (soft delete TrangThai=deleted); login refused',{tokenStatusAfterReactivate:notes.tokenAfterReactivate,note:notes.tokenAfterReactivate===200?'re-activating a locked user revives its unexpired tokens (stamp depends only on the password hash)':'reactivation does not revive tokens'});
  userId=-userId;// da xoa
 }finally{
  // Post co the da luu dong nhung khong tra UserID (vd. 500 sau SaveChanges): tim theo ten tam.
  if(userId==null){const f=await req('/User_Account/Get?filter='+encodeURIComponent(JSON.stringify(['TenTruyCap','=',name])),{headers:admin}).catch(()=>null);
   const r=f&&f.data&&f.data.data&&f.data.data[0];if(r&&r.TenTruyCap===name&&r.UserID>0)userId=r.UserID}
  if(userId>0){const d=await send('/User_Account/Delete','DELETE',admin,{key:String(userId)}).catch(e=>({status:0,text:e.message}));
   if(!(d.status===204||d.status===200))await send('/User_Account/Put','PUT',admin,{key:String(userId),values:{TrangThai:'locked'}}).catch(()=>{});userId=-userId}
  if(userId<0){const id=-userId;const row=await req('/User_Account/Get?filter='+encodeURIComponent(JSON.stringify(['UserID','=',id])),{headers:admin});
   const r=row.data&&row.data.data&&row.data.data[0];rows.push({name:'cleanup temp user',status:'INFO',user:name,userId:id,remaining:r?{TrangThai:r.TrangThai,TenTruyCap:r.TenTruyCap}:'not found / not visible',note:'Delete is a soft delete: the row stays in dbo.User_Account with TrangThai=deleted'});save();
   console.log('INFO cleanup: '+name+' (UserID '+id+') TrangThai='+(r?r.TrangThai:'?'))}
 }
}
(async()=>{
 const accounts=JSON.parse(fs.readFileSync('.dev/hoi-test-accounts.json','utf8').replace(/^﻿/,''));const low=accounts[1];
 const login=await token(low.name,low.password);assert.equal(login.status,200,'low privilege login');assert.ok(login.data.access_token);
 const auth={Authorization:'Bearer '+login.data.access_token};
 const self=await req('/User_Account/GetLoginUser',{headers:auth});assert.equal(self.status,200,'GetLoginUser with fresh token');assert.equal(self.data.data[0].TenTruyCap,low.name);
 const again=await req('/User_Account/GetLoginUser',{headers:auth});assert.equal(again.status,200,'second request (cached stamp) still works');
 pass('Fresh token (with pwd_stamp) accepted on plain [Authorize] endpoint');
 assert.equal((await req('/User_Account/GetLoginUser',{headers:{Authorization:'Bearer invalid'}})).status,401);
 assert.equal((await req('/User_Account/GetLoginUser')).status,401);
 pass('Invalid and missing bearer tokens still rejected with 401');
 const menu=await req('/Public/Menu?lang=vi');assert.equal(menu.status,200);
 const preflight=await req('/User_Account/GetLoginUser',{method:'OPTIONS',headers:{Origin:'http://localhost:5174','Access-Control-Request-Method':'GET','Access-Control-Request-Headers':'authorization'}});assert.equal(preflight.status,204);
 pass('Anonymous public API and CORS preflight unaffected by the revocation middleware');
 skip('Old/forged token without pwd_stamp rejected','tokens are DPAPI-protected OWIN tickets; a token without the stamp cannot be crafted here. Tokens issued by the previous build lack the claim and get 401 token_revoked after deploy (one forced re-login).');
 // Tai khoan tam: role giong tai khoan quyen thap (da co san), admin tao/sua/xoa qua User_Account.
 const adminLogin=await token(accounts[0].name,accounts[0].password);assert.equal(adminLogin.status,200,'admin login');assert.notEqual(adminLogin.data.setup_required,'1','admin test account must not be in setup mode');
 await tempUserTests(bearer(adminLogin.data.access_token),self.data.data[0].RoleId);
 // Gioi han theo (ten dang nhap + IP) 10/phut kich hoat truoc; tu mot IP khong phan biet duoc voi gioi han theo ten dang nhap trong 1 phut.
 const user='__codex_lockout_test__';let last;
 for(let i=0;i<11;i++){last=await token(user,'invalid');assert.equal(last.status,400)}
 assert.ok(last.text.includes('một phút'),'11th attempt from one IP refused by per (user+IP) limiter: '+last.text);
 pass('Per (username+IP) limiter refuses the 11th attempt within a minute',{note:'per-username limiter (30 failures/15 min) cannot be reached from one IP inside one minute'});
 if(!process.argv.includes('--full-lockout')){skip('Per-username lockout after 30 failures','run with --full-lockout (takes ~3 minutes; only meaningful against the new build)');return}
 // Da co 10 lan sai o tren; them 2 dot x 10 (cho het cua so 1 phut moi dot) = 30 -> lan tiep theo bi tu choi voi thong bao 15 phut.
 for(let round=0;round<2;round++){await sleep(61000);for(let i=0;i<10;i++){const r=await token(user,'invalid');assert.equal(r.status,400);assert.ok(!r.text.includes('một phút'),'round '+round+' attempt '+i+' should be a counted failure')}}
 await sleep(61000);const locked=await token(user,'invalid');assert.equal(locked.status,400);assert.ok(locked.text.includes('15 phút'),'per-username lockout message expected: '+locked.text);
 pass('Per-username limiter refuses after 30 failed attempts in 15 minutes (counted across per-IP windows)');
 // Khoang trang cuoi (SQL Server bo qua khi so sanh) khong duoc tao bo dem moi.
 const variant=await token(user+'   ','invalid');assert.equal(variant.status,400);assert.ok(variant.text.includes('15 phút'),'trailing-space variant must share the lockout: '+variant.text);
 pass('Trailing-space username variant shares the per-username lockout');
})().catch(e=>{console.error(e);rows.push({name:'suite failure',status:'FAIL',error:e.message});save();process.exitCode=1});
