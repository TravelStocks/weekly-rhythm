const page=document.body.dataset.page||document.body.dataset.kind||'weekly';
const links=[['systems','systems.html','系统总览','00'],['weekly','index.html','每周日历','01'],['monthly','monthly.html','月度复盘','02'],['quarterly','quarterly.html','季度复盘','03'],['shopping','shopping.html','采购清单','04']];
document.body.insertAdjacentHTML('afterbegin',`<a class="skip-link" href="#page-content">跳到主要内容</a><div class="site-header"><a class="site-brand" href="index.html"><span class="site-mark">R.</span><span>RAYMOND<small>生活与成长工作台</small></span></a><nav class="site-nav" aria-label="主导航">${links.map(([id,url,name,n])=>`<a href="${url}" ${page===id?'aria-current="page"':''}><small>${n}</small>${name}</a>`).join('')}</nav><span class="site-caption">一步一步，留出余地。</span></div>`);
const content=document.querySelector('.main,.review-shell,.page');if(content)content.id='page-content';
// Keep occasional data tools available without competing with the main task.
for(const group of document.querySelectorAll('[data-utility]')){
 const details=document.createElement('details');details.className='utility-menu';
 const summary=document.createElement('summary');summary.textContent=group.dataset.utility;
 group.before(details);details.append(summary,group);group.classList.add('utility-content');
}
document.addEventListener('click',e=>document.querySelectorAll('.utility-menu[open]').forEach(d=>{if(!d.contains(e.target))d.open=false}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.utility-menu[open]').forEach(d=>d.open=false)});
