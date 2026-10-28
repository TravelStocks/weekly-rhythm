import {GROUPS,clone,defaults,migrate,valid,blankPlan,quantityFor,newRound,format} from './shopping-model.js?v=20261028-daily1';
const KEY='raymond-weekly-shopping-v1', $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items=defaults(),filter='all',history=[],editing=null,loadError=false;
try {
  const raw=localStorage.getItem(KEY);
  if(raw){
    const data=JSON.parse(raw);if(!valid(data.items))throw Error();items=migrate(data.items);
    if(data.version!==2||JSON.stringify(data.items)!==JSON.stringify(items)){
      if(!localStorage.getItem(KEY+'-before-quantities'))localStorage.setItem(KEY+'-before-quantities',raw);
      localStorage.setItem(KEY,JSON.stringify({version:2,items}));
    }
  }
} catch {loadError=true;}
function toast(message){$('toast').textContent=message;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').textContent='',5000);}
function save(next){try{localStorage.setItem(KEY,JSON.stringify({version:2,items:next}));$('save-status').textContent='已保存到当前浏览器';return true;}catch{toast('保存失败，修改未提交。请检查浏览器存储设置。');return false;}}
function commit(next,message){if(!valid(next)||!save(next))return false;history.push(clone(items));if(history.length>30)history.shift();items=next;render();if(message)toast(message);return true;}
const labels={ready:'已备齐',confirm:'待确认',quantity:'待填用量',stock:'待盘点',buy:'本次补买'};
const originLabel=p=>p.origin==='draft'?'参考默认':p.origin==='notion'?'Notion 记录':'已调整';
function renderItem(x){
  const q=quantityFor(x),p=x.plan,math=p.amount!==null&&p.times!==null?(x.group==='medicine'?`${format(p.amount)} ${p.unit} × ${format(p.times)} 次／周`:`每日 ${format(p.amount)} ${p.unit} × ${format(p.times)} 天`):'用量尚未确定';
  return `<article class="item ${q.state==='ready'?'done':''}">
    <input type="checkbox" id="check-${esc(x.id)}" data-check="${esc(x.id)}" aria-label="已备齐：${esc(x.name)}" ${x.done?'checked':''}>
    <div class="content"><div class="item-top"><label class="item-name" for="check-${esc(x.id)}">${esc(x.name)}</label><button class="edit" data-edit="${esc(x.id)}" aria-label="编辑：${esc(x.name)}">调整</button></div>
    <p class="quantity-basis">${esc(originLabel(p))} · ${esc(math)}</p>
    <div class="quantity-grid"><div><span>一周用量</span><strong>${q.weekly===null?'待填写':`${format(q.weekly)} <small>${esc(p.unit)}</small>`}</strong></div>
    <label class="stock-field">家中库存<div><input type="number" min="0" max="10000000" step="any" inputmode="decimal" data-stock="${esc(x.id)}" aria-label="${esc(x.name)}库存（${esc(p.unit)}）" placeholder="待盘点" value="${p.stock??''}"><small>${esc(p.unit)}</small></div></label>
    <div class="buy-result" data-state="${q.state}"><span>${labels[q.state]}</span><strong>${q.state==='buy'?`${format(q.buy)} <small>${esc(p.unit)}</small>`:q.state==='ready'?'无需补买':'—'}</strong></div></div>
    ${x.confirm?'<p class="item-alert">名称 / 规格待确认 · 暂不列入待买</p>':''}
    ${q.state==='quantity'?`<p class="item-alert">${esc(p.hint)}</p>`:''}
    ${x.quantity?`<p class="item-note">原采购备注：${esc(x.quantity)}</p>`:''}
    ${x.note&&x.note!=='按原图名称记录，具体名称与规格待确认。'?`<p class="item-note">${esc(x.note)}</p>`:''}</div></article>`;
}
function render(){
  const search=$('search').value.trim().toLowerCase(), counts={ready:0,buy:0,stock:0,confirm:0,quantity:0};
  items.forEach(x=>counts[quantityFor(x).state]++);
  const shown=items.filter(x=>{
    const state=quantityFor(x).state;
    return (filter==='all'||filter==='food'&&x.group!=='medicine'||filter==='medicine'&&x.group==='medicine'||filter==='pending'&&state==='buy'||filter==='check'&&['quantity','confirm','stock'].includes(state))&&[x.name,x.note,x.quantity].join(' ').toLowerCase().includes(search);
  });
  $('progress-text').textContent=`${counts.ready} / ${items.length}`;
  $('progress-fill').style.width=(items.length?counts.ready/items.length*100:0)+'%';
  $('undo').disabled=!history.length;$('reset').disabled=!items.some(x=>x.done||x.plan.stock!==null);
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
  document.querySelector('[data-filter="pending"]').textContent=`待买 ${counts.buy}`;
  document.querySelector('[data-filter="check"]').textContent=`待核对 ${counts.stock+counts.confirm+counts.quantity}`;
  $('shopping-results').textContent=`需补买 ${counts.buy} 项 · 待盘点 ${counts.stock} 项 · 名称或用量待确认 ${counts.confirm+counts.quantity} 项 · 当前显示 ${shown.length} 项`;
  $('empty').hidden=!!shown.length;
  $('empty').textContent=filter==='pending'?'暂无已确认的补买项目。请先核对用量并填写库存；空白库存不会按 0 计算。':'没有符合条件的物品。';
  $('groups').innerHTML=GROUPS.map(g=>{
    const list=shown.filter(x=>x.group===g.id);if(!list.length)return '';
    const all=items.filter(x=>x.group===g.id), ready=all.filter(x=>quantityFor(x).state==='ready').length;
    return `<section class="group ${g.id}"><header><h2><span>${g.icon}</span>${g.name}</h2><small>${ready} / ${all.length} 已备齐</small></header><p class="group-caption">${g.caption}</p><div class="items">${list.map(renderItem).join('')}</div></section>`;
  }).join('');
  $('groups').querySelectorAll('[data-check]').forEach(box=>box.addEventListener('change',()=>{const next=clone(items);next.find(x=>x.id===box.dataset.check).done=box.checked;if(!commit(next))render();}));
  $('groups').querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.edit)));
  $('groups').querySelectorAll('[data-stock]').forEach(input=>{const updateStock=()=>{
    if(!input.checkValidity()){input.reportValidity();return;}
    const value=number(input.value);if(items.find(x=>x.id===input.dataset.stock)?.plan.stock===value)return;
    const next=clone(items),item=next.find(x=>x.id===input.dataset.stock);if(!item)return;item.plan.stock=value;item.done=false;
    if(!commit(next))render();
  };input.addEventListener('change',updateStock);input.addEventListener('blur',updateStock);});
}
const number=value=>value.trim()===''?null:Number(value);
function formPlan(){const old=items.find(x=>x.id===editing)?.plan||blankPlan();return {...old,amount:number($('item-amount').value),times:number($('item-times').value),unit:$('item-unit').value,stock:number($('item-stock').value)};}
function preview(){
  const p=formPlan(),q=quantityFor({plan:p,confirm:$('item-confirm').checked,done:false});
  const daily=$('item-group').value!=='medicine';
  $('amount-label').textContent=daily?'每日固定量':'每次用量';$('times-label').textContent=daily?'本周天数（默认 7 天）':'每周次数（7 天合计）';$('item-times').max=daily?'7':'100';
  $('calc-preview').textContent=q.weekly===null?(daily?'填写每日固定量 × 7 天，计算一周用量。':'填写每次用量和每周次数，计算 7 天总用量。'):`一周 ${format(q.weekly)} ${p.unit} · ${q.state==='confirm'?'名称 / 规格待确认':q.state==='stock'?'填写库存后计算本次补买':`本次补买 ${format(q.buy??0)} ${p.unit}`}`;
  $('stock-unit').textContent=p.unit;
}
function open(id){
  editing=id;const item=items.find(x=>x.id===id)||{name:'',group:filter==='medicine'?'medicine':'fruit',quantity:'',note:'',confirm:false,plan:{...blankPlan(),times:filter==='medicine'?null:7}};
  $('item-form').reset();$('dialog-title').textContent=id?'调整用量与库存':'添加物品';
  $('item-name').value=item.name;$('item-group').value=item.group;$('item-quantity').value=item.quantity;$('item-note').value=item.note;$('item-confirm').checked=item.confirm;
  $('item-amount').value=item.plan.amount??'';$('item-times').value=item.plan.times??'';$('item-unit').value=item.plan.unit;$('item-stock').value=item.plan.stock??'';
  $('item-basis').textContent=[item.plan.basis,item.plan.hint].filter(Boolean).join('。');
  $('delete').hidden=!id;$('form-error').textContent='';preview();$('item-dialog').showModal();$('item-amount').focus();
}
['item-amount','item-times','item-stock','item-confirm'].forEach(id=>$(id).addEventListener('input',preview));
$('item-group').addEventListener('change',preview);
$('item-unit').addEventListener('change',()=>{$('item-stock').value='';preview();});
$('item-form').addEventListener('submit',e=>{
  e.preventDefault();const name=$('item-name').value.trim();if(!name){$('form-error').textContent='请填写物品名称。';return;}
  const old=items.find(x=>x.id===editing),plan=formPlan();
  const changed=!old||['amount','times','unit'].some(k=>old.plan[k]!==plan[k]);
  if(changed)plan.origin='user';
  const entry={...old,id:editing||crypto.randomUUID(),group:$('item-group').value,name,quantity:$('item-quantity').value.trim(),note:$('item-note').value.trim(),confirm:$('item-confirm').checked,done:old?.done||false,plan};
  if(old&&(changed||old.plan.stock!==plan.stock||old.confirm!==entry.confirm))entry.done=false;
  const next=clone(items);if(old)next[next.findIndex(x=>x.id===editing)]=entry;else next.push(entry);
  if(!valid(next)){$('form-error').textContent='请填写有效的非负数量，每周次数不超过 100。';return;}
  if(commit(next,old?'用量与库存已更新。':'物品已添加。'))$('item-dialog').close();
});
$('delete').addEventListener('click',()=>{if(editing&&commit(items.filter(x=>x.id!==editing),'已删除，可撤销恢复。'))$('item-dialog').close();});
$('cancel').addEventListener('click',()=>$('item-dialog').close());document.querySelector('.close').addEventListener('click',()=>$('item-dialog').close());$('add').addEventListener('click',()=>open(null));
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render();}));$('search').addEventListener('input',render);
$('reset').addEventListener('click',()=>commit(newRound(items),'新一轮已开始：保留用量，清除勾选和旧库存，请重新盘点。可撤销。'));
$('undo').addEventListener('click',()=>{if(!history.length)return;const next=history.at(-1);if(save(next)){history.pop();items=next;render();toast('已撤销上一步。');}});
$('export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({version:2,items},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='每周采购清单备份.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import').addEventListener('click',()=>$('import-file').click());$('import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2e6)throw Error();const data=JSON.parse(await file.text());if(!valid(data.items))throw Error();commit(migrate(data.items),'已导入备份，可撤销。');}catch{toast('备份格式不正确，现有清单未改变。');}e.target.value='';});
$('print').addEventListener('click',()=>window.print());
window.addEventListener('storage',e=>{if(e.key!==KEY||!e.newValue)return;try{const data=JSON.parse(e.newValue);if(valid(data.items)){$('item-dialog').close();items=migrate(data.items);history=[];render();toast('已同步另一标签页的修改。');}}catch{}});
render();if(loadError){$('save-status').textContent='读取存储失败，原记录未覆盖';toast('原记录未覆盖，可导入备份恢复。');}
