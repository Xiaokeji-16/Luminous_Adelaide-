import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const input = "public/assets/map_base_4k.png";
const outDir = "public/assets/tiles";
const tileSize = 256;

fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(input).metadata();
if (!meta.width || !meta.height) throw new Error("Cannot read image size");

const cols = Math.ceil(meta.width / tileSize);
const rows = Math.ceil(meta.height / tileSize);

console.log(`image: ${meta.width}x${meta.height}`);
console.log(`tiles: ${cols} cols x ${rows} rows (tileSize=${tileSize})`);

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const left = x * tileSize;
    const top = y * tileSize;
    const w = Math.min(tileSize, meta.width - left);
    const h = Math.min(tileSize, meta.height - top);

    const outPath = path.join(outDir, `${x}_${y}.png`);

    await sharp(input)
      .extract({ left, top, width: w, height: h })
      .png()
      .toFile(outPath);
  }
}

console.log("done ->", outDir);