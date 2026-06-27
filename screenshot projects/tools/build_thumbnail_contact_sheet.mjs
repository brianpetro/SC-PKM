import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const variant_order = ["landscape", "square", "portrait", "other"];

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

function detect_variant(file_path) {
  const file_name = path.basename(file_path).toLowerCase();
  if (file_name.includes("landscape")) return "landscape";
  if (file_name.includes("square")) return "square";
  if (file_name.includes("portrait")) return "portrait";
  return "other";
}

function run_magick(args) {
  const result = spawnSync("magick", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`magick failed: ${result.stderr || result.stdout}`);
  }
}

function display_label(file_path, input_dir) {
  return path.relative(input_dir, file_path)
    .replace(/\.png$/iu, "")
    .replace(/--/gu, " | ")
    .replace(/-/gu, " ");
}

async function make_tile(file_path, tile_path, label, thumb_width, thumb_height) {
  const label_path = `${tile_path}.label.png`;
  run_magick([
    "-background",
    "#171717",
    "-fill",
    "#f2f2f2",
    "-font",
    "Helvetica",
    "-pointsize",
    "22",
    "-size",
    `${thumb_width}x96`,
    `caption:${label}`,
    label_path
  ]);
  run_magick([
    file_path,
    "-auto-orient",
    "-thumbnail",
    `${thumb_width}x${thumb_height}>`,
    "-background",
    "#202020",
    "-gravity",
    "center",
    "-extent",
    `${thumb_width}x${thumb_height}`,
    label_path,
    "-append",
    tile_path
  ]);
  await fs.rm(label_path, { force: true });
}

async function make_group_sheet(files, group_name, input_dir, work_dir, output_dir) {
  if (!files.length) return null;

  const thumb_width = 420;
  const thumb_height = group_name === "landscape" ? 220 : 420;
  const tiles = [];

  for (let index = 0; index < files.length; index += 1) {
    const tile_path = path.join(work_dir, `${group_name}-${String(index).padStart(2, "0")}.png`);
    await make_tile(files[index], tile_path, display_label(files[index], input_dir), thumb_width, thumb_height);
    tiles.push(tile_path);
  }

  const sheet_path = path.join(output_dir, `contact-sheet--${group_name}.png`);
  run_magick([
    "montage",
    ...tiles,
    "-background",
    "#101010",
    "-geometry",
    "+18+18",
    "-tile",
    "4x",
    sheet_path
  ]);
  return sheet_path;
}

async function write_csv(files, input_dir, csv_path) {
  const lines = ["variant,file"];
  for (const file_path of files) {
    lines.push(`${detect_variant(file_path)},${JSON.stringify(path.relative(input_dir, file_path))}`);
  }
  await fs.writeFile(csv_path, `${lines.join("\n")}\n`);
}

async function main() {
  const input_dir = get_arg("input");
  const output_dir = get_arg("output");
  const run_id = get_arg("run-id", "manual");
  if (!input_dir || !output_dir) {
    throw new Error("Usage: node build_thumbnail_contact_sheet.mjs --input <final_dir> --output <qa_dir> --run-id <run_id>");
  }

  await ensure_dir(output_dir);
  const work_dir = path.join(output_dir, `.contact-sheet-work-${run_id}`);
  await fs.rm(work_dir, { recursive: true, force: true });
  await ensure_dir(work_dir);

  const files = await list_pngs(input_dir);
  const grouped = new Map(variant_order.map((variant) => [variant, []]));
  for (const file_path of files) {
    grouped.get(detect_variant(file_path)).push(file_path);
  }

  const group_sheets = [];
  for (const variant of variant_order) {
    const sheet_path = await make_group_sheet(grouped.get(variant), variant, input_dir, work_dir, output_dir);
    if (sheet_path) group_sheets.push(sheet_path);
  }

  const combined_path = path.join(output_dir, `contact-sheet--hero-thumbnails--${run_id}.png`);
  if (group_sheets.length) {
    run_magick([
      ...group_sheets,
      "-background",
      "#101010",
      "-append",
      combined_path
    ]);
  }

  const csv_path = path.join(output_dir, `contact-sheet--hero-thumbnails--${run_id}.csv`);
  await write_csv(files, input_dir, csv_path);
  await fs.rm(work_dir, { recursive: true, force: true });

  console.log(JSON.stringify({
    input_dir,
    output_dir,
    run_id,
    image_count: files.length,
    combined_path,
    csv_path
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
