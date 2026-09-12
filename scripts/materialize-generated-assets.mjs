import { promises as fs } from "node:fs";
import path from "node:path";

const assets = [
  ["hero", "hero"],
  ["home", "home"],
  ["accessories", "accessories"],
  ["selection", "selection"],
  ["craft", "craft"],
  ["place", "place"],
  ["journal", "journal"],
];

const outputDir = path.resolve("public/assets/generated");
await fs.mkdir(outputDir, { recursive: true });

for (const [sourceName, outputName] of assets) {
  const sourcePath = path.resolve(`src/data/generated/${sourceName}.ts`);
  const source = await fs.readFile(sourcePath, "utf8");
  const match = source.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/);

  if (!match) {
    throw new Error(`No WebP data URI found in ${sourcePath}`);
  }

  const outputPath = path.join(outputDir, `${outputName}.webp`);
  await fs.writeFile(outputPath, Buffer.from(match[1], "base64"));
  console.log(`Generated ${outputPath}`);
}
