import {defaults} from './defaults.js?v=20261028-ux1';
export const TEMPLATE_REVISION=2;
export function upgradeTemplate(saved){
 const next=JSON.parse(JSON.stringify(saved));
 if((saved.templateRevision||0)>=TEMPLATE_REVISION)return next;
 const finance=next.events.find(e=>e.id==='template-20')||next.events.find(e=>e.day===5&&e.title==='经济财务周／月／季复盘');
 if(finance)Object.assign(finance,{...defaults[20],id:finance.id});
 else next.events.push({...defaults[20],id:'template-20'});
 for(const event of defaults.filter(e=>e.id))if(!next.events.some(e=>e.id===event.id))next.events.push(JSON.parse(JSON.stringify(event)));
 next.templateRevision=TEMPLATE_REVISION;
 return next;
}
