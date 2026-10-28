import assert from 'node:assert/strict';
import {AGENDAS,agendaTotals,buildManual,manualOutcome} from '../docs/review-manual.js';
import {createRecord,validStore,LINES} from '../docs/review-model.js';
assert.deepEqual(agendaTotals('monthly'),{work:630,rest:60,buffer:0,total:690});
assert.deepEqual(agendaTotals('quarterly'),{work:420,rest:120,buffer:30,total:570});
for(const kind of ['monthly','quarterly']){
 const agenda=AGENDAS[kind];for(let i=1;i<agenda.length;i++)assert.equal(agenda[i-1][1],agenda[i][0]);
 const period=kind==='monthly'?'2026-10':'2026-Q4',record=createRecord(kind,period);
 record.fields[kind==='monthly'?'effect-0':'skill-review']='旧版记录保留';
 const fields=[];
 const result=buildManual({kind,period,record,field:(id,label)=>{fields.push(id);return `<input data-field="${id}">${label}`},section:(id,n,t,d,b)=>`<section id="${id}">${t}${b}</section>`,list:id=>`<div id="list-${id}"></div>`,esc:String,lines:LINES});
 for(const [id] of result.outline)assert.ok(result.body.includes(`id="${id}"`),id);
 assert.ok(fields.includes(kind==='monthly'?'effect-0':'skill-review'));
 for(const id of fields)record.fields[id]='保留原值并填写新字段';
 assert.ok(validStore(kind,{schema:1,records:{[period]:record}}));
 assert.ok(result.body.includes('股票周复盘保留'));
 if(kind==='quarterly')assert.ok(result.body.includes('2026-10-28—2027-01-27'));
 assert.equal(manualOutcome(createRecord(kind,period)).every(g=>g.items.length===0),true);
 console.log(kind,fields.length,'fields; agenda, old records and outcome checks passed');
}
