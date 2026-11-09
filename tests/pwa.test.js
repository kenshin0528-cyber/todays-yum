import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pngSize = async (path) => {
  const data = await readFile(new URL(`../${path}`, import.meta.url));
  assert.equal(data.subarray(1, 4).toString(), 'PNG');
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
};

test('iOS 홈 화면 이름과 Apple Touch Icon이 연결된다', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /name="apple-mobile-web-app-title" content="얌얌 메뉴"/);
  assert.match(html, /name="application-name" content="얌얌 메뉴"/);
  assert.match(html, /rel="apple-touch-icon" sizes="180x180" href="assets\/icons\/apple-touch-icon\.png"/);
  assert.deepEqual(await pngSize('assets/icons/apple-touch-icon.png'), [180, 180]);
});

test('manifest가 Android 일반·고해상도·maskable 아이콘을 제공한다', async () => {
  const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.name, '얌얌 메뉴');
  assert.equal(manifest.short_name, '얌얌 메뉴');
  assert.equal(manifest.display, 'standalone');
  assert.deepEqual(await pngSize('assets/icons/icon-192.png'), [192, 192]);
  assert.deepEqual(await pngSize('assets/icons/icon-512.png'), [512, 512]);
  assert.deepEqual(await pngSize('assets/icons/icon-maskable-512.png'), [512, 512]);
  assert.ok(manifest.icons.some((icon) => icon.purpose === 'maskable' && icon.sizes === '512x512'));
});
