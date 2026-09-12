import { promises as fs } from "node:fs";
import path from "node:path";

const outputDir = path.resolve("out");
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "La-Maison-Malgache";
const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? `/${repository}`;
const textExtensions = new Set([".html", ".css", ".js", ".json", ".txt", ".xml", ".map"]);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) continue;

    const source = await fs.readFile(fullPath, "utf8");
    const patched = source.replace(
      /(^|[^A-Za-z0-9_-])\/assets\//g,
      `$1${basePath}/assets/`,
    );

    if (patched !== source) {
      await fs.writeFile(fullPath, patched, "utf8");
    }
  }
}

await walk(outputDir);
console.log(`Patched public asset URLs for ${basePath}`);
