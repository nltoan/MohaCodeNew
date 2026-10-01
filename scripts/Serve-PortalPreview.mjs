import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../frontend/dist');
const mime={'.js':'application/javascript','.html':'text/html; charset=utf-8','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff'};
http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost:5175');
  let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}
  if(!path.extname(file)) file=path.join(root,'index.html');
  let body=await fs.readFile(file);
  if(path.basename(file)==='runtime-config.js') body=Buffer.from(body.toString().replace('http://mohaapi.tefli.vn/api/Public/','http://localhost:55104/api/Public/').replace('https://api-portal.moha.gov.vn/api/Public/','http://localhost:55104/api/Public/').replace('http://moha.tefli.vn/','https://moha.gov.vn/'));
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
 } catch {res.writeHead(404);res.end();}
}).listen(5175,'localhost',()=>console.log('Production build preview: http://localhost:5175 (local API; GA disabled by hostname).'));
