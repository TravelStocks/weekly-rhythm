import assert from 'node:assert/strict';
import {progressFor} from '../docs/review-model.js';
const ids=['reflection','stocks','craft'];
assert.deepEqual(progressFor(ids,{}),{complete:0,pending:0,total:3,next:'reflection'});
assert.deepEqual(progressFor(ids,{'status-reflection':'已完成','status-stocks':'已完成但待补数据','status-craft':'整理中'}),{complete:1,pending:1,total:3,next:'stocks'});
assert.equal(progressFor(ids,{'status-reflection':'已完成','status-stocks':'已完成','status-craft':'已完成'}).next,'finish');
assert.equal(progressFor(ids,{'effect-0':'有证据','artifact-link':'有作品','review-status':'已完成'}).complete,0);
console.log('Review progress distinguishes completed modules, pending data and filled fields.');
