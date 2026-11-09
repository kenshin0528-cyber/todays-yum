import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const characters = ['mochi', 'nabi', 'cookie'];

function skipSubBlocks(data, start) {
  let offset = start;
  while (offset < data.length) {
    const size = data[offset++];
    if (!size) break;
    offset += size;
  }
  return offset;
}

function inspectGif(data) {
  assert.match(data.subarray(0, 6).toString(), /^GIF8[79]a$/);
  const width = data.readUInt16LE(6);
  const height = data.readUInt16LE(8);
  const packed = data[10];
  let offset = 13 + ((packed & 0x80) ? 3 * 2 ** ((packed & 7) + 1) : 0);
  let loop = null;
  let pending = { delay: 0, transparent: false };
  const frames = [];

  while (offset < data.length && data[offset] !== 0x3b) {
    const marker = data[offset++];
    if (marker === 0x21) {
      const label = data[offset++];
      if (label === 0xf9) {
        const size = data[offset++];
        const control = data.subarray(offset, offset + size);
        pending = { delay: control.readUInt16LE(1) * 10, transparent: Boolean(control[0] & 1) };
        offset += size + 1;
      } else if (label === 0xff) {
        const size = data[offset++];
        const application = data.subarray(offset, offset + size).toString();
        offset += size;
        if (application.startsWith('NETSCAPE')) {
          const blockSize = data[offset++];
          if (blockSize >= 3 && data[offset] === 1) loop = data.readUInt16LE(offset + 1);
          offset += blockSize + 1;
        } else offset = skipSubBlocks(data, offset);
      } else offset = skipSubBlocks(data, offset);
    } else if (marker === 0x2c) {
      const imagePacked = data[offset + 8];
      offset += 9;
      if (imagePacked & 0x80) offset += 3 * 2 ** ((imagePacked & 7) + 1);
      offset += 1;
      offset = skipSubBlocks(data, offset);
      frames.push(pending);
      pending = { delay: 0, transparent: false };
    } else throw new Error(`알 수 없는 GIF 블록: 0x${marker.toString(16)}`);
  }

  return { width, height, loop, frames };
}

test('세 캐릭터 자산은 투명 512px PNG로 최적화된다', async () => {
  for (const name of characters) {
    const data = await readFile(new URL(`../assets/characters/${name}.png`, import.meta.url));
    assert.equal(data.subarray(1, 4).toString(), 'PNG');
    assert.equal(data.readUInt32BE(16), 512);
    assert.equal(data.readUInt32BE(20), 512);
    assert.equal(data[25], 6, `${name}.png는 RGBA PNG여야 한다`);
  }
});

test('홈과 캐릭터 선택 UI가 새 이미지 자산을 참조한다', async () => {
  const [html, app] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/app.js', import.meta.url), 'utf8'),
  ]);
  assert.match(html, /id="mascotArt" src="assets\/characters\/mochi\.png"/);
  for (const name of characters) assert.match(app, new RegExp(`assets/characters/${name}\\.png`));
  assert.doesNotMatch(app, /emoji:'[🐰🐱🐻]'/u);
});

test('세 애니메이션은 투명한 3초 무한 루프 GIF다', async () => {
  for (const name of characters) {
    const data = await readFile(new URL(`../assets/characters-animation/${name}.gif`, import.meta.url));
    const gif = inspectGif(data);
    assert.deepEqual([gif.width, gif.height], [362, 362]);
    assert.equal(gif.loop, 0, `${name}.gif는 무한 반복이어야 한다`);
    assert.equal(gif.frames.length, 12);
    assert.ok(gif.frames.every(frame => frame.transparent));
    assert.equal(gif.frames.reduce((sum, frame) => sum + frame.delay, 0), 3000);
    assert.ok(data.length < 400_000, `${name}.gif 용량은 400KB 미만이어야 한다`);
  }
});

test('동작 줄이기와 로딩 오류에는 정적 캐릭터를 사용한다', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  for (const name of characters) assert.match(app, new RegExp(`assets/characters-animation/${name}\\.gif`));
  assert.match(app, /prefers-reduced-motion: reduce/);
  assert.match(app, /static-fallback/);
  assert.match(app, /state\.view==='my'&&id===state\.data\.mascot/);
});
