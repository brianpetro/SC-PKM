import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const variants = [
  { id: "landscape", width: 1200, height: 628 },
  { id: "square", width: 1200, height: 1200 },
  { id: "portrait", width: 960, height: 1200 }
];

function get_arg(name, fallback = "") {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

async function ensure_dir(dir_path) {
  await fs.mkdir(dir_path, { recursive: true });
}

async function list_pngs(dir_path) {
  const entries = await fs.readdir(dir_path, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => path.join(dir_path, entry.name))
    .sort();
}

function run_magick(args) {
  const result = spawnSync("magick", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`magick failed: ${result.stderr || result.stdout}`);
  }
}

function base_name_for(raw_path) {
  return path.basename(raw_path).replace(/--raw\.png$/u, "");
}

async function main() {
  const input_dir = get_arg("input");
  const output_dir = get_arg("output");
  if (!input_dir || !output_dir) {
    throw new Error("Usage: node render_hero_variants.mjs --input <raw_dir> --output <final_dir>");
  }

  await ensure_dir(output_dir);
  const raw_files = await list_pngs(input_dir);
  const rendered = [];

  for (const raw_file of raw_files) {
    for (const variant of variants) {
      const out_file = path.join(
        output_dir,
        `${base_name_for(raw_file)}--${variant.id}-${variant.width}x${variant.height}.png`
      );
      run_magick([
        raw_file,
        "-auto-orient",
        "-resize",
        `${variant.width}x${variant.height}^`,
        "-gravity",
        "center",
        "-extent",
        `${variant.width}x${variant.height}`,
        "-colorspace",
        "sRGB",
        "-unsharp",
        "0x0.75+0.75+0.008",
        out_file
      ]);
      rendered.push(out_file);
    }
  }

  console.log(JSON.stringify({
    input_dir,
    output_dir,
    raw_count: raw_files.length,
    rendered_count: rendered.length
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
