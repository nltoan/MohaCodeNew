// Generate a sitemap from a reviewed export of publicly accessible canonical URLs.
// Never discover unpublished records from the database or infer URLs from IDs.
const fs = require('node:fs/promises');
const path = require('node:path');
const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) throw Error('Usage: node scripts/Generate-PublicSitemap.cjs approved-urls.json NEW_OUTPUT_DIRECTORY');
const origin = 'https://moha.gov.vn';
const xml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

(async () => {
  const items = JSON.parse((await fs.readFile(input, 'utf8')).replace(/^\uFEFF/, ''));
  if (!Array.isArray(items) || !items.length) throw Error('Expected nonempty list of approved canonical URLs');
  const urls = items.map(item => {
    if (typeof item !== 'string' || !item.startsWith(origin + '/')) throw Error('Expected absolute HTTPS moha.gov.vn URL');
    const url = new URL(item);
    if (url.origin !== origin || url.search || url.hash || url.username || url.password || url.href !== item || /\/\//.test(url.pathname)) throw Error(`Invalid canonical URL: ${item}`);
    return url.href;
  });
  if (new Set(urls).size !== urls.length) throw Error('Duplicate URLs');
  const dir = path.resolve(output);
  await fs.mkdir(dir); // Never overwrite a prior release.
  const chunks = [];
  for (let i = 0; i < urls.length; i += 10000) {
    const name = `sitemap-${String(chunks.length + 1).padStart(4, '0')}.xml`;
    const body = urls.slice(i, i + 10000).map(url => `  <url><loc>${xml(url)}</loc></url>`).join('\n');
    await fs.writeFile(path.join(dir, name), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
    chunks.push(name);
  }
  const entries = chunks.map(name => `  <sitemap><loc>${origin}/${name}</loc></sitemap>`).join('\n');
  await fs.writeFile(path.join(dir, 'sitemap_index.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`);
  await fs.writeFile(path.join(dir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap_index.xml\n`);
  console.log(`Generated ${urls.length} URLs in ${chunks.length} sitemap file(s); publish only after review.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
