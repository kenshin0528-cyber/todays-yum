import test from'node:test';import assert from'node:assert/strict';import{addDiscovery,discoveryProgress}from'../src/collection.js';
const data=()=>({discoveries:{},stickers:[]});
test('최초 발견만 등록하고 음식 스티커를 한 번만 준다',()=>{const d=data();assert.equal(addDiscovery(d,'a',['a']),true);assert.equal(addDiscovery(d,'a',['a']),false);assert.deepEqual(d.stickers,['food:a'])});
test('5개와 10개 발견 마일스톤 스티커가 중복되지 않는다',()=>{const d=data(),ids=Array.from({length:10},(_,i)=>`m${i}`);ids.forEach(id=>addDiscovery(d,id,ids));assert.equal(d.stickers.filter(x=>x==='explorer').length,1);assert.equal(d.stickers.filter(x=>x==='chef').length,1)});
test('현재 존재하는 메뉴만 진행률에 포함한다',()=>{const d={discoveries:{a:'date',deleted:'date'},stickers:[]};assert.deepEqual(discoveryProgress(d,['a','b']),{found:1,total:2,percent:50})});
