import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const api='http://localhost:55104/api';
const accounts=JSON.parse((await fs.readFile('.dev/hoi-test-accounts.json','utf8')).replace(/^\uFEFF/,''));
async function login(account) {
 const r=await fetch(api+'/Token?type=password',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'password',username:account.name,password:account.password})});
 assert.equal(r.status,200); return (await r.json()).access_token;
}
const token=await login(accounts[0]), denied=await login(accounts[1]);
async function call(path,body,who=token,json=true) {
 return fetch(api+'/HoiQuy/'+path,{method:'POST',headers:{Authorization:'Bearer '+who,'Content-Type':json?'application/json':'application/octet-stream'},body:body===undefined?undefined:json?JSON.stringify(body):body});
}
assert.equal((await call('UploadStart',{FileName:'a.xlsx',Bytes:1},denied)).status,403);
assert.equal((await call('UploadStart',{FileName:'a.xlsx',Bytes:83886081})).status,400);
const data=await fs.readFile(process.env.USERPROFILE+'/Desktop/DanhSach_HoiQuy_TrungUong_20260930_142742.xlsx');
const start=await call('UploadStart',{FileName:'HoiQuy.xlsx',Bytes:data.length,IncludeLogos:false}); assert.equal(start.status,200);
const upload=await start.json(); assert.equal(upload.ChunkBytes,4194304);
assert.equal((await call('UploadComplete?token='+upload.Token)).status,400);
assert.equal((await call('UploadChunk?token='+upload.Token+'&index=0',Buffer.from('bad'),token,false)).status,400);
for(let offset=0,index=0;offset<data.length;offset+=upload.ChunkBytes,index++) {
 const body=data.subarray(offset,Math.min(offset+upload.ChunkBytes,data.length));
 assert.equal((await call('UploadChunk?token='+upload.Token+'&index='+index,body,token,false)).status,200);
 if(index===0) assert.equal((await call('UploadChunk?token='+upload.Token+'&index=0',body,token,false)).status,200);
}
const complete=await call('UploadComplete?token='+upload.Token); assert.equal(complete.status,200);
const preview=await complete.json(); assert.equal(preview.Rows.length,726);
assert.equal((await call('UploadComplete?token='+upload.Token)).status,400);
console.log('PASS chunk upload: 57MB workbook/726 rows; retry, size bounds, permission, missing parts, consumed session. No DB commit.');
