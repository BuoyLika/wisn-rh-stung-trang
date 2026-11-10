// Builds the offline survey as ONE html file that opens straight from disk
// (double-click, no internet, no server):  npm run build:offline
// Output: offline/WISN-Tools-Project-Offline.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist-offline');
const target = path.join(root, 'offline', 'WISN-Tools-Project-Offline.html');

process.env.VITE_OFFLINE = '1';
await build({
  root,
  logLevel: 'warn',
  build: {
    outDir,
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000, // images/fonts as data: URLs
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});

let html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
const read = (ref) => fs.readFileSync(path.join(outDir, ref.replace(/^\.?\//, '')), 'utf8');

// <link rel="stylesheet" href="./assets/x.css"> -> <style>
html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="(\.?\/?assets\/[^"]+\.css)"[^>]*>/g, (_m, href) =>
  `<style>\n${read(href)}\n</style>`
);
// <script type="module" src="./assets/x.js"></script> -> inline. Browsers block
// module scripts loaded from file:// but run inline ones.
html = html.replace(/<script\b[^>]*type="module"[^>]*src="(\.?\/?assets\/[^"]+\.js)"[^>]*><\/script>/g, (_m, src) =>
  `<script type="module">\n${read(src).replace(/<\/script/gi, '<\\/script')}\n</script>`
);
if (/(src|href)="\.?\/?assets\//.test(html)) throw new Error('An asset was not inlined');
html = html.replace('<title>', '<title>Offline · ');

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, html);
fs.rmSync(outDir, { recursive: true, force: true });
console.log(`Wrote ${path.relative(root, target)} (${(fs.statSync(target).size / 1024 / 1024).toFixed(2)} MB)`);
