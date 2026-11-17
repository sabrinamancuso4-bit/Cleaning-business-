/**
 * Local preview server that mimics Cloudflare Pages closely enough for testing:
 * serves ./public, applies the rules in public/_headers, and serves 404.html for
 * unknown paths. Usage (from the-cleaning-specialist/):  node tools/preview-server.mjs [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const PORT = Number(process.argv[2] || 8788);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
};

// Parse _headers: "path pattern" lines followed by indented "Name: value" lines.
const rules = [];
for (const line of (await readFile(join(ROOT, "_headers"), "utf8")).split("\n")) {
  if (!line.trim() || line.trim().startsWith("#")) continue;
  if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: {} });
  else { const i = line.indexOf(":"); rules.at(-1).headers[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
}
const matches = (pattern, path) => new RegExp("^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$").test(path);

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";
  let file = normalize(join(ROOT, path));
  let code = 200;
  if (!file.startsWith(ROOT) || !(await stat(file).catch(() => null))?.isFile()) {
    file = join(ROOT, "404.html"); code = 404;
  }
  for (const r of rules) if (matches(r.pattern, url.pathname)) for (const [k, v] of Object.entries(r.headers)) res.setHeader(k, v);
  res.writeHead(code, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
