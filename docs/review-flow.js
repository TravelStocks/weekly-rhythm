import {progressFor} from './review-model.js?v=20261028-ux1';
const $=id=>document.getElementById(id);
let active='setup',mode='focus',mountedPeriod='',steps=[],recordRef;
export function mountReviewFlow(kind,period,record){
 recordRef=record;
 const sections=[...document.querySelectorAll('.workbook>.review-section')];
 steps=sections.filter(s=>s.querySelector('[data-field="status-'+s.id+'"]')).map(s=>s.id);
 const fromHash=location.hash.slice(1);
 if(mountedPeriod!==kind+period){active=sections.some(s=>s.id===fromHash)?fromHash:'setup';mountedPeriod=kind+period;mode='focus'}
 if(!sections.some(s=>s.id===active))active='setup';
 const controls=document.createElement('div');controls.className='flow-dashboard';controls.id='flow-dashboard';
 controls.innerHTML='<div class="flow-progress"><span class="micro-label">本轮复盘</span><strong id="flow-count"></strong><span id="flow-pending"></span><div class="flow-track"><i id="flow-fill"></i></div></div><div class="flow-cta"><button class="primary" id="flow-resume">开始复盘 →</button><div class="view-switch" aria-label="复盘显示方式"><button data-flow-mode="focus">逐步填写</button><button data-flow-mode="all">完整浏览</button></div></div>';
 document.querySelector('.review-body').before(controls);
 const jumpLabel=document.createElement('label');jumpLabel.className='flow-mobile-nav';jumpLabel.textContent='跳到模块';const jump=document.createElement('select');jump.id='flow-jump';sections.forEach(s=>{const o=document.createElement('option');o.value=s.id;o.textContent=s.querySelector('h2').textContent;jump.append(o)});jumpLabel.append(jump);controls.append(jumpLabel);jump.onchange=()=>showSection(jump.value,true);
 sections.forEach((s,i)=>{
  s.classList.add('flow-section');
  const outputs={reflection:'3 个真实感受、方向判断与取舍。',evidence:'可追溯的月度记录和季度依据。',directions:'主业、股票、个人成长的方向判断。',stocks:'数据口径、两笔代表性决策、待验证的问题。',finance:'财务结果链接、未来支付和预算约束。',craft:'一份实际改过、能够打开的作品。',skills:'主攻技能的验收证据、作品和下一步选择。',relations:'一次具体交流，以及下一次活动或出游窗口。',goals:'三条主线目标、一个主攻技能与时间分配。',landing:kind==='monthly'?'下月 1–3 个重点、活动日期与少量调整。':'当月必要收尾，以及首月第一步的日期和位置。',finish:'确认成果可用，给未完成事项留下续接时间。'};
  if(outputs[s.id]){const hint=document.createElement('div');hint.className='deliverable-line';hint.textContent='本步留下：'+outputs[s.id];s.querySelector('.section-desc').after(hint)}
  const badge=document.createElement('span');badge.className='section-state';badge.dataset.forSection=s.id;
  s.querySelector('.section-heading').append(badge);
  const nav=document.createElement('div');nav.className='step-footer';
  const prev=sections[i-1],next=sections[i+1];
  if(prev){const b=document.createElement('button');b.textContent='← 上一步';b.onclick=()=>showSection(prev.id,true);nav.append(b)}else{const t=document.createElement('span');t.textContent='准备好后，从第一个模块开始。';nav.append(t)}
  if(next){const b=document.createElement('button');b.className='primary';b.textContent=(next.id==='outcome'?'查看复盘结果':next.id==='finish'?'进入收尾':'下一步')+' →';b.onclick=()=>showSection(next.id,true);nav.append(b)}
  else {const b=document.createElement('button');b.textContent='导出本次复盘';b.onclick=()=>$('export-review').click();nav.append(b)}
  s.append(nav);
 });
 const setup=$('setup'),meta=setup.querySelector(':scope>.manual-grid');
 if(meta){const details=document.createElement('details');details.className='manual-guide setup-extra';const summary=document.createElement('summary');summary.textContent='复盘范围、数据截止与下次安排';details.append(summary);const grid=document.createElement('div');grid.className='manual-grid';[...meta.children].slice(2).forEach(f=>grid.append(f));details.append(grid);meta.after(details)}
 document.querySelectorAll('.review-aside a,.day-agenda a').forEach(a=>a.onclick=e=>{const id=a.hash.slice(1);if(!$(id)?.classList.contains('flow-section'))return;e.preventDefault();showSection(id,true)});
 $('flow-resume').onclick=()=>showSection(progressFor(steps,recordRef.fields).next,true);
 controls.querySelectorAll('[data-flow-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.flowMode;applyMode();if(mode==='focus')showSection(active,false)});
 refreshReviewFlow(record);applyMode();
}
function applyMode(){document.querySelectorAll('.flow-section').forEach(s=>s.hidden=mode==='focus'&&s.id!==active);document.querySelectorAll('[data-flow-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.flowMode===mode)));if($('flow-jump'))$('flow-jump').value=active;document.querySelectorAll('.review-aside a').forEach(a=>{if(a.hash==='#'+active)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')})}
function showSection(id,scroll){active=id;applyMode();history.replaceState(null,'',location.pathname+location.search+'#'+id);const section=$(id);if(scroll){section.scrollIntoView({block:'start',behavior:'instant'});const heading=section.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true})}}
export function refreshReviewFlow(record){recordRef=record;if(!$('flow-count'))return;const p=progressFor(steps,record.fields);$('flow-count').textContent=p.complete+' / '+p.total+' 模块完成';$('flow-pending').textContent=p.pending?'另有 '+p.pending+' 项待补数据':'完成后在模块底部标记状态';$('flow-fill').style.width=(p.total?p.complete/p.total*100:0)+'%';$('flow-resume').textContent=p.complete===p.total?'进入收尾 →':steps.some(id=>record.fields['status-'+id])?'继续复盘 →':'开始复盘 →';document.querySelectorAll('[data-for-section]').forEach(b=>{const status=record.fields['status-'+b.dataset.forSection];b.textContent=status||'';b.dataset.state=status||''});document.querySelectorAll('.review-aside a').forEach(a=>{const state=record.fields['status-'+a.hash.slice(1)];a.dataset.state=state||''})}
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if($(id)?.classList.contains('flow-section'))showSection(id,false)});
