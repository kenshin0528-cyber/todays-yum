import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const characters = ['mochi', 'nabi', 'cookie'];

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
