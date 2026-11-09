import{mkdir,writeFile}from'node:fs/promises';
import{BASE_MENUS}from'../src/data/menus.js';
const palettes={korean:['#FFE0E8','#FF8EAA','#FFF3C7'],western:['#E5DFFF','#9984E8','#FFE9B2'],snack:['#DDF6EA','#69C6A4','#FFE1EB']};
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function svg(emoji,category='snack',kind='food'){const[a,b,c]=palettes[category]||palettes.snack;return`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="320" viewBox="0 0 440 320" role="img">
<defs><filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#5e4050" flood-opacity=".14"/></filter><linearGradient id="g" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
<rect x="8" y="8" width="424" height="304" rx="54" fill="url(#g)"/><circle cx="72" cy="72" r="22" fill="${c}"/><circle cx="368" cy="80" r="14" fill="${b}" opacity=".55"/><path d="M50 250c70-48 270-48 340 0" fill="none" stroke="${b}" stroke-width="18" stroke-linecap="round" opacity=".25"/>
<g filter="url(#s)"><ellipse cx="220" cy="224" rx="112" ry="35" fill="#fff" stroke="${b}" stroke-width="7"/><ellipse cx="220" cy="215" rx="82" ry="22" fill="${c}" opacity=".75"/><text x="220" y="190" text-anchor="middle" font-size="112" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${escape(emoji)}</text></g>
<path d="M90 116l7 14 15 2-11 10 3 15-14-7-13 7 2-15-11-10 15-2zM350 140l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="${b}" opacity=".7"/></svg>`}
await mkdir(new URL('../assets/food/',import.meta.url),{recursive:true});
await Promise.all(BASE_MENUS.map(menu=>writeFile(new URL(`../assets/food/${menu.id}.svg`,import.meta.url),svg(menu.emoji,menu.category))));
await writeFile(new URL('../assets/food/surprise.svg',import.meta.url),svg('🎁','snack','surprise'));
await writeFile(new URL('../assets/food/custom.svg',import.meta.url),svg('🍽️','western','custom'));
console.log(`Generated ${BASE_MENUS.length+2} local SVG illustrations.`);
