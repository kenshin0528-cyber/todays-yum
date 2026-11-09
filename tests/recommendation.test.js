import test from'node:test';import assert from'node:assert/strict';import{getCandidates,chooseMenu}from'../src/recommendation.js';
const menus=[{id:'a',category:'korean'},{id:'b',category:'korean'},{id:'c',category:'snack'}];
test('필터가 없으면 전체 후보를 반환한다',()=>assert.equal(getCandidates(menus).length,3));
test('카테고리와 좋아요 필터를 함께 적용한다',()=>assert.deepEqual(getCandidates(menus,{category:'korean',favoriteOnly:true,favorites:['b','c']}).map(x=>x.id),['b']));
test('직전 메뉴를 가능한 경우 제외한다',()=>assert.equal(chooseMenu(menus,'a',()=>0).id,'b'));
test('후보가 없으면 null을 반환한다',()=>assert.equal(chooseMenu([],null),null));
test('후보가 하나면 같은 메뉴도 허용한다',()=>assert.equal(chooseMenu([menus[0]],'a',()=>0).id,'a'));
test('난수 구간에 따라 모든 후보가 선택 가능하다',()=>{assert.equal(chooseMenu(menus,null,()=>0).id,'a');assert.equal(chooseMenu(menus,null,()=>.9999).id,'c')});
