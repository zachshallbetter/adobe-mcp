#!/usr/bin/env node
// Build the files live scenarios place, import and open, without any Adobe app:
//
//   node scripts/live-fixtures.mjs [dir]    (default ~/Documents/adobe-mcp-validation/fixtures)
//
// Images come from one generated PNG converted with macOS sips; text documents from
// textutil. Scenarios open or place copies, never these files. Safe to run again: it
// rebuilds everything. macOS only.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const dir = process.argv[2] ?? join(homedir(), 'Documents', 'adobe-mcp-validation', 'fixtures');
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const sips = (...args) => execFileSync('sips', args, { stdio: ['ignore', 'ignore', 'pipe'] });

// A 600 x 400 RGBA PNG: a colour gradient with a transparent circle cut out of the middle,
// so placement, transparency and colour conversion all have something to show.
function png(width, height) {
    const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
    const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
    const chunk = (type, data) => {
        const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
        const body = Buffer.concat([Buffer.from(type), data]);
        const sum = Buffer.alloc(4); sum.writeUInt32BE(crc(body));
        return Buffer.concat([len, body, sum]);
    };
    const raw = Buffer.alloc((width * 4 + 1) * height);
    for (let y = 0; y < height; y++) {
        raw[y * (width * 4 + 1)] = 0;
        for (let x = 0; x < width; x++) {
            const o = y * (width * 4 + 1) + 1 + x * 4;
            const inside = (x - width / 2) ** 2 + (y - height / 2) ** 2 < (height / 4) ** 2;
            raw[o] = Math.round((255 * x) / width); raw[o + 1] = Math.round((255 * y) / height); raw[o + 2] = 160; raw[o + 3] = inside ? 0 : 255;
        }
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
    return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const img = join(dir, 'images');
mkdirSync(img);
writeFileSync(join(img, 'gradient-rgba.png'), png(600, 400));
sips('-s', 'format', 'jpeg', join(img, 'gradient-rgba.png'), '--out', join(img, 'gradient-rgb.jpg'));
sips('-s', 'format', 'tiff', join(img, 'gradient-rgba.png'), '--out', join(img, 'gradient-rgb.tif'));
sips('-s', 'format', 'psd', join(img, 'gradient-rgba.png'), '--out', join(img, 'gradient-rgb.psd'));
sips('-s', 'format', 'pdf', join(img, 'gradient-rgba.png'), '--out', join(img, 'gradient.pdf'));
sips('-m', '/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc', '-s', 'format', 'jpeg', join(img, 'gradient-rgb.jpg'), '--out', join(img, 'gradient-cmyk.jpg'));
// A small, low-resolution copy for preflight's effective-ppi checks.
sips('-z', '60', '90', '-s', 'dpiWidth', '36', '-s', 'dpiHeight', '36', join(img, 'gradient-rgb.jpg'), '--out', join(img, 'gradient-lowres.jpg'));
writeFileSync(join(img, 'shapes.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect x="10" y="10" width="120" height="80" fill="#c00"/><circle cx="220" cy="100" r="60" fill="#06c"/></svg>\n');

const text = join(dir, 'text');
mkdirSync(text);
const story = ['Fixture story', 'This is the first paragraph of a story placed from a file. It has enough words to wrap across several lines in a narrow frame.', 'The second paragraph mentions the word Fixture again, so find and replace has two hits.', 'The third paragraph ends the story.'];
writeFileSync(join(text, 'story.txt'), story.join('\n') + '\n');
execFileSync('textutil', ['-convert', 'rtf', join(text, 'story.txt'), '-output', join(text, 'story.rtf')]);
execFileSync('textutil', ['-convert', 'docx', join(text, 'story.txt'), '-output', join(text, 'story.docx')]);
// A long story that overflows one frame, for threading and overset checks.
writeFileSync(join(text, 'long.txt'), Array.from({ length: 60 }, (_, i) => `Paragraph ${i + 1}. ${'Long story text to fill frames and force overset. '.repeat(6)}`).join('\n') + '\n');

const data = join(dir, 'data');
mkdirSync(data);
writeFileSync(join(data, 'merge.csv'), 'Name,City,@Photo\nAda Lovelace,London,' + join(img, 'gradient-rgb.jpg') + '\nGrace Hopper,New York,' + join(img, 'gradient-cmyk.jpg') + '\nKatherine Johnson,Hampton,' + join(img, 'gradient-rgb.jpg') + '\n');
writeFileSync(join(data, 'table.csv'), 'Item,Qty,Price\nPaper,10,4.50\nInk,2,19.00\nStaples,100,0.02\n');

const xml = join(dir, 'xml');
mkdirSync(xml);
writeFileSync(join(xml, 'catalog.dtd'), '<!ELEMENT catalog (product+)>\n<!ELEMENT product (name, price)>\n<!ATTLIST product sku CDATA #REQUIRED>\n<!ELEMENT name (#PCDATA)>\n<!ELEMENT price (#PCDATA)>\n');
writeFileSync(join(xml, 'catalog.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE catalog SYSTEM "catalog.dtd">\n<catalog>\n  <product sku="A1"><name>Notebook</name><price>4.50</price></product>\n  <product sku="B2"><name>Pencil</name><price>0.80</price></product>\n</catalog>\n');
writeFileSync(join(xml, 'invalid.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n  <product><name>No sku and no price</name></product>\n</catalog>\n');

console.log(`fixtures written to ${dir}`);
