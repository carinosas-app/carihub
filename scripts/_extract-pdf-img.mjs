import fs from 'fs';
import zlib from 'zlib';

const pdfPath = process.argv[2];
const outPath = process.argv[3];
const raw = fs.readFileSync(pdfPath);
const startMark = Buffer.from('stream\n');
let start = raw.indexOf(Buffer.from('stream\n'));
if (start < 0) {
  start = raw.indexOf(Buffer.from('stream\r\n'));
  if (start < 0) throw new Error('no stream');
  start += Buffer.from('stream\r\n').length;
} else {
  start += Buffer.from('stream\n').length;
}
const end = raw.indexOf(Buffer.from('endstream'), start);
if (end < 0) throw new Error('no endstream');
let s = raw.slice(start, end).toString('latin1').replace(/\s+/g, '').replace(/~>$/, '').replace(/~>.*$/, '');

function ascii85Decode(str) {
  const out = [];
  let tuple = [];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === 'z' && tuple.length === 0) {
      out.push(0, 0, 0, 0);
      continue;
    }
    if (c < '!' || c > 'u') continue;
    tuple.push(c.charCodeAt(0) - 33);
    if (tuple.length === 5) {
      let acc = tuple[0] * 52200625 + tuple[1] * 614125 + tuple[2] * 7225 + tuple[3] * 85 + tuple[4];
      out.push((acc >> 24) & 255, (acc >> 16) & 255, (acc >> 8) & 255, acc & 255);
      tuple = [];
    }
  }
  if (tuple.length > 0) {
    for (let i = tuple.length; i < 5; i++) tuple.push(84);
    let acc = tuple[0] * 52200625 + tuple[1] * 614125 + tuple[2] * 7225 + tuple[3] * 85 + tuple[4];
    for (let i = 0; i < tuple.length - 1; i++) out.push((acc >> (24 - 8 * i)) & 255);
  }
  return Buffer.from(out);
}

const decoded = ascii85Decode(s);
const inflated = zlib.inflateSync(decoded);
const latin = raw.toString('latin1');
const wMatch = latin.match(/\/Width\s+(\d+)/);
const hMatch = latin.match(/\/Height\s+(\d+)/);
const w = wMatch ? parseInt(wMatch[1], 10) : 1351;
const h = hMatch ? parseInt(hMatch[1], 10) : 1164;
if (inflated.length !== w * h * 3) {
  throw new Error(`pixel mismatch: got ${inflated.length}, expected ${w * h * 3} (${w}x${h})`);
}
const rowSize = Math.ceil((w * 3 + 3) / 4) * 4;
const bmp = Buffer.alloc(54 + rowSize * h);
bmp.write('BM');
bmp.writeUInt32LE(54 + rowSize * h, 2);
bmp.writeUInt32LE(54, 10);
bmp.writeUInt32LE(40, 14);
bmp.writeInt32LE(w, 18);
bmp.writeInt32LE(h, 22);
bmp.writeUInt16LE(1, 26);
bmp.writeUInt16LE(24, 28);
bmp.writeUInt32LE(rowSize * h, 34);
for (let y = 0; y < h; y++) {
  const srcY = h - 1 - y;
  const dstOff = 54 + y * rowSize;
  const srcOff = srcY * w * 3;
  for (let x = 0; x < w; x++) {
    const si = srcOff + x * 3;
    const di = dstOff + x * 3;
    bmp[di] = inflated[si + 2];
    bmp[di + 1] = inflated[si + 1];
    bmp[di + 2] = inflated[si];
  }
}
fs.writeFileSync(outPath, bmp);
console.log('ok', outPath, w, h, inflated.length);
