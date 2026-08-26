import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { inflateSync } from "node:zlib";

const EXPECTED_KEYS = [
  "bi_jian",
  "jie_cai",
  "shi_shen",
  "shang_guan",
  "zheng_cai",
  "pian_cai",
  "zheng_guan",
  "qi_sha",
  "zheng_yin",
  "pian_yin",
];

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const manifest = JSON.parse(readFileSync(resolve(process.cwd(), "public", "characters", "v2", "manifest.json"), "utf8"));

test("V2 manifest freezes ten opaque warm-ivory editorial assets", () => {
  assert.equal(manifest.version, "character-visual/2.0.0");
  assert.equal(manifest.background, "#F6F1E6");
  assert.equal(manifest.backgroundMode, "opaque-paper");
  assert.deepEqual(Object.keys(manifest.assets), EXPECTED_KEYS);
});

for (const key of EXPECTED_KEYS) {
  test(`${key} ships a warm-ivory portrait PNG`, () => {
    const path = resolve(process.cwd(), "public", "characters", "v2", `${key}.png`);
    const bytes = readFileSync(path);

    assert.ok(bytes.subarray(0, 8).equals(PNG_SIGNATURE), `${key} must be a valid PNG`);
    assert.ok(bytes.length > 100_000, `${key} is unexpectedly small`);

    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    const decoded = decodeRgbPng(bytes);
    const record = manifest.assets[key];
    const sha256 = createHash("sha256").update(bytes).digest("hex");

    assert.ok(width >= 900, `${key} width must be at least 900px`);
    assert.ok(height >= 1200, `${key} height must be at least 1200px`);
    assert.ok(height > width, `${key} must use a portrait canvas`);
    assert.equal(decoded.colorType, 2, `${key} must use the locked opaque RGB paper contract`);
    assert.equal(record.width, width);
    assert.equal(record.height, height);
    assert.equal(record.sha256, sha256);

    const corners = [
      decoded.pixelAt(0, 0),
      decoded.pixelAt(width - 1, 0),
      decoded.pixelAt(0, height - 1),
      decoded.pixelAt(width - 1, height - 1),
    ];
    for (const [red, green, blue] of corners) {
      assert.ok(Math.abs(red - 246) <= 10, `${key} corner red channel drifted from warm ivory`);
      assert.ok(Math.abs(green - 241) <= 12, `${key} corner green channel drifted from warm ivory`);
      assert.ok(Math.abs(blue - 230) <= 20, `${key} corner blue channel drifted from warm ivory`);
    }
  });
}

function decodeRgbPng(bytes) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];

  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += length + 12;
  }

  assert.equal(bitDepth, 8, "V2 assets must use 8-bit PNG channels");
  assert.equal(colorType, 2, "V2 assets must use RGB PNG");
  assert.equal(interlace, 0, "V2 assets must be non-interlaced");

  const compressed = inflateSync(Buffer.concat(idat));
  const bytesPerPixel = 3;
  const stride = width * bytesPerPixel;
  const pixels = Buffer.alloc(stride * height);
  let source = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = compressed[source];
    source += 1;
    const row = y * stride;
    const previous = row - stride;
    for (let x = 0; x < stride; x += 1) {
      const raw = compressed[source];
      source += 1;
      const left = x >= bytesPerPixel ? pixels[row + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[previous + x] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel ? pixels[previous + x - bytesPerPixel] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = up;
      else if (filter === 3) predictor = Math.floor((left + up) / 2);
      else if (filter === 4) predictor = paeth(left, up, upperLeft);
      else assert.equal(filter, 0, `Unsupported PNG filter: ${filter}`);
      pixels[row + x] = (raw + predictor) & 0xff;
    }
  }

  return {
    colorType,
    pixelAt(x, y) {
      const index = y * stride + x * bytesPerPixel;
      return [pixels[index], pixels[index + 1], pixels[index + 2]];
    },
  };
}

function paeth(left, up, upperLeft) {
  const estimate = left + up - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
  if (upDistance <= upperLeftDistance) return up;
  return upperLeft;
}
