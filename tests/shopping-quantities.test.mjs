import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,quantityFor,migrate,valid,newRound} from '../docs/shopping-model.js';
test('weekly draft and recorded medication quantities are distinct and traceable',()=>{
 const items=defaults();assert.equal(items.length,29);assert.ok(valid(items));
 const sum=group=>items.filter(x=>x.group===group).reduce((n,x)=>n+(quantityFor(x).weekly||0),0);
 assert.equal(sum('fruit'),1750);assert.equal(sum('nuts'),70);assert.equal(sum('vegetables'),2800);
 assert.ok(items.filter(x=>x.group!=='medicine').every(x=>x.plan.times===7));
 assert.equal(quantityFor(items.find(x=>x.name==='前列倍喜')).weekly,126);
 assert.equal(quantityFor(items.find(x=>x.name==='米诺地尔')).weekly,7);
 for(const name of ['白芝麻粉','睡眠糖GABA','南非醉茄','盐酸'])assert.equal(quantityFor(items.find(x=>x.name===name)).weekly,null);
 assert.equal(items.find(x=>x.name==='苹果').plan.origin,'draft');assert.equal(items.find(x=>x.name==='D3+K2').plan.origin,'notion');
});
test('unknown stock is not zero; only a confirmed shortage becomes a purchase',()=>{
 const item=defaults().find(x=>x.name==='苹果');assert.equal(quantityFor(item).state,'stock');assert.equal(quantityFor(item).buy,null);
 item.plan.stock=150;assert.deepEqual(quantityFor(item),{weekly:350,buy:200,state:'buy'});
 item.plan.stock=500;assert.deepEqual(quantityFor(item),{weekly:350,buy:0,state:'ready'});
 item.plan.stock=0;item.confirm=true;assert.equal(quantityFor(item).state,'confirm');
 item.confirm=false;item.plan.times=0;assert.equal(quantityFor(item).state,'ready');
 item.plan.stock=null;assert.equal(quantityFor(item).state,'ready');
});
test('partial quantities stay unknown, fractions do not gain a package buffer',()=>{
 const item=defaults().find(x=>x.name==='蓝莓');item.plan.stock=25;assert.equal(quantityFor(item).buy,150);
 item.plan.amount=.1;item.plan.times=3;item.plan.stock=.1;assert.equal(quantityFor(item).buy,.2);
 item.plan.times=null;assert.equal(quantityFor(item).weekly,null);assert.equal(quantityFor(item).state,'quantity');
});
test('migration preserves edits, deletions, checks and notes without guessing legacy free text',()=>{
 const old=defaults().slice(0,3).map(({plan,...x})=>x);old[0].done=true;old[0].note='留给周三';old[1].quantity='3 个';old[2].name='其他莓果';
 const upgraded=migrate(old);assert.ok(valid(upgraded));assert.equal(upgraded.length,3);assert.equal(upgraded[0].done,true);assert.equal(upgraded[0].note,'留给周三');
 assert.equal(quantityFor(upgraded[0]).weekly,350);assert.equal(upgraded[1].quantity,'3 个');assert.equal(upgraded[1].plan.amount,null);assert.equal(upgraded[2].plan.amount,null);
 assert.deepEqual(migrate(upgraded),upgraded);
});
test('new rounds clear consumed inventory but retain requirements and notes',()=>{
 const items=defaults();items[0].plan.stock=150;items[0].done=true;items[0].note='备注';
 const next=newRound(items);assert.equal(next[0].plan.stock,null);assert.equal(next[0].done,false);assert.equal(quantityFor(next[0]).weekly,350);assert.equal(next[0].note,'备注');assert.equal(items[0].plan.stock,150);
});
test('previous drafts become daily defaults once, preserving user edits and stock',()=>{
 const old=defaults();
 old[2].plan={...old[2].plan,amount:62.5,times:2,stock:25};delete old[2].plan.template;old[2].done=true;
 old[1].plan={...old[1].plan,amount:200,times:2,origin:'user'};delete old[1].plan.template;
 const next=migrate(old);assert.equal(next[2].plan.amount,25);assert.equal(next[2].plan.times,7);assert.equal(next[2].plan.stock,25);assert.equal(next[2].done,false);
 assert.equal(next[1].plan.amount,200);assert.equal(next[1].plan.times,2);assert.deepEqual(migrate(next),next);
});
test('reject malformed imports, invalid units and negative/non-finite stock',()=>{
 for(const value of [-1,NaN,Infinity,'0']){const items=defaults();items[0].plan.stock=value;assert.equal(valid(items),false);}
 const items=defaults();items[0].plan.unit='未知';assert.equal(valid(items),false);items[0].plan.unit='克';items[0].plan.times=101;assert.equal(valid(items),false);
});
