const fs=require('node:fs'); const vm=require('node:vm'); const assert=require('node:assert/strict');
const ts=require('../frontend/node_modules/typescript');
(async()=>{
 let calls=0, now=0, fail=false;
 const axios={defaults:{baseURL:'https://api.example/Public'},get:async url=>{calls++; if(fail){fail=false;throw Error('temporary');} await Promise.resolve();return {data:{url,items:[1]},status:200};}};
 const code=ts.transpileModule(fs.readFileSync('frontend/src/services/public-cache.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const context={exports:{},require:()=>({default:axios}),structuredClone,Date:{now:()=>now}};
 vm.runInNewContext(code,context);
 const get=context.exports.cachedPublicGet;
 const [a,b]=await Promise.all([get('/menu?lang=vi'),get('/menu?lang=vi')]); assert.equal(calls,1);
 a.data.items.push(2); assert.equal(b.data.items.length,1);
 await get('/menu?lang=vi'); assert.equal(calls,1);
 await get('/menu?lang=en'); assert.equal(calls,2);
 now=30001; await get('/menu?lang=vi'); assert.equal(calls,3);
 fail=true; await assert.rejects(get('/new')); await get('/new'); assert.equal(calls,5);
 axios.defaults.baseURL='https://other.example/Public'; await get('/menu?lang=vi'); assert.equal(calls,6);
 console.log('PASS public cache: concurrent deduplication, independent data, language/origin keys, 30s expiry, failed-request retry.');
})().catch(e=>{console.error(e);process.exitCode=1;});
