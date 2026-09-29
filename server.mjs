import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const siteRoot = dirname(fileURLToPath(import.meta.url));
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

export function mapRequestToFile(requestUrl) {
  const rawPath = requestUrl.split("?", 1)[0];
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(rawPath);
  } catch {
    return null;
  }

  const segments = decodedPath.replaceAll("\\", "/").split("/");
  if (segments.includes("..")) return null;
  if (decodedPath === "/") return "index.html";

  const relativePath = segments.filter(Boolean).join("/");
  return relativePath || null;
}

export function createSiteServer() {
  return createServer(async (request, response) => {
    const relativePath = mapRequestToFile(request.url ?? "/");
    if (!relativePath) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }

    const filePath = join(siteRoot, relativePath);

    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) throw new Error("Not a file");
      response.writeHead(200, {
        "Cache-Control": "no-cache",
        "Content-Type": mimeTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
      });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 5000;
  createSiteServer().listen(port, "127.0.0.1", () => {
    console.log(`Synaptech demo: http://localhost:${port}`);
  });
}
