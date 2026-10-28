export const SOURCE_URL = 'https://www.notion.so/4077af2f574e807c8099c5101667d3fb';
export const GROUPS = [
  {id:'fruit', name:'水果', icon:'🍎', caption:'轮换吃 · 克数按可食部分估算', names:['木瓜','苹果','蓝莓','橘子','香蕉','草莓']},
  {id:'nuts', name:'坚果与籽粉', icon:'🥜', caption:'分着吃，共用一份量；已有大包装先消耗', names:['黑芝麻粉','白芝麻粉','杏仁','核桃','南瓜子','巴达木','碧根果']},
  {id:'vegetables', name:'蔬菜与薯类', icon:'🥦', caption:'蔬菜轮换搭配 · 土豆单独计入薯类', names:['菠菜','西兰花','胡萝卜','香菇','小番茄','蒸土豆']},
  {id:'dairy', name:'奶与酸奶', icon:'🥛', caption:'按容量扣库存，包装大小另行核对', names:['牛奶','酸奶']},
  {id:'medicine', name:'药物与补充剂', icon:'◌', caption:'仅按 Notion 记录核算 7 天消耗，不新增或调整服用方案。药名、规格和用量以已确认的处方／标签为准。', names:['非那雄安','米诺地尔','睡眠糖GABA','南非醉茄','盐酸','前列倍喜','D3+K2','心脏保护剂']}
];
export const UNITS = ['克','毫升','个','根','盒','袋','片','粒','份'];
const food = (amount, times, hint='') => ({amount, times, unit:'克', stock:null, origin:'draft', basis:'单人一周参考草案', hint});
const recorded = (amount, times, unit, basis, hint='') => ({amount,times,unit,stock:null,origin:'notion',basis,hint});
const PLANS = {
  '木瓜':food(200,2,'400 克可食部分，按实际果肉重量选购。'),
  '苹果':food(200,2,'约 2 个，大小不同请按可食重量调整。'),
  '蓝莓':food(62.5,2,'本周共 125 克，不默认增加到大盒。'),
  '橘子':food(150,2,'约 2–3 个，按大小调整。'),
  '香蕉':food(125,2,'约 2–3 根，按大小调整。'),
  '草莓':food(125,2,'本周共 250 克。'),
  '黑芝麻粉':food(10,2,'与下列坚果／籽仁合计约 70 克／周。'),
  '白芝麻粉':{...food(null,null,'正文写“白杂粮粉”，关联食材库写“白芝麻粉”；请先确认实际品类，再填写用量。'),issue:true},
  '杏仁':food(10,1,'按去壳果仁重量。'),
  '核桃':food(10,1,'按去壳果仁重量。'),
  '南瓜子':food(10,1,'按去壳籽仁重量。'),
  '巴达木':food(10,1,'按去壳果仁重量；通常商品名为“巴旦木”。'),
  '碧根果':food(10,1,'按去壳果仁重量。'),
  '菠菜':food(200,3), '西兰花':food(250,3), '胡萝卜':food(150,2),
  '香菇':food(100,3,'按鲜香菇重量；干香菇不可直接按此克数购买。'),
  '小番茄':food(100,5), '蒸土豆':food(200,2,'采购生土豆，克数按可食部分估算。'),
  '牛奶':{...food(250,7,'若每盒 250 毫升，一周为 7 盒；按实际包装换算。'),unit:'毫升'},
  '酸奶':food(100,7,'若每杯 100 克，一周为 7 杯；按实际包装换算。'),
  '非那雄安':{...recorded(1,7,'片','Notion：每天一次，一次一片','原记录名称为“非那雄安”；请核对完整药名和每片规格。'),issue:true},
  '米诺地尔':recorded(1,7,'毫升','Notion：一次 1 ml，每天一次','只核算 7 毫升消耗，不换算喷数，也不默认每周买一瓶。'),
  '睡眠糖GABA':recorded(null,null,'粒','Notion 仅写“200mg OM”','缺少每粒含量与实际粒数，不能换算采购粒数。'),
  '南非醉茄':recorded(null,null,'粒','Notion 仅写“0.5mg Nocte”','原记录单位和每次粒数需核对，暂不换算。'),
  '盐酸':{...recorded(null,null,'片','Notion 未填写有效用量','“盐酸”不是完整药名，请补充药名、规格及已确认用量。'),issue:true},
  '前列倍喜':{...recorded(6,21,'粒','Notion：6 粒／次 × 3 次／天 × 7 天','7 天记录消耗为 126 粒；请核对完整名称和规格。'),issue:true},
  'D3+K2':recorded(1,7,'粒','Notion：1 粒／天 × 7 天','按现有产品库存补缺口。'),
  '心脏保护剂':{...recorded(1,7,'粒','Notion：1 粒／天 × 7 天','缺少具体产品名称和规格，确认后才列入待买。'),issue:true}
};
export const clone = data => JSON.parse(JSON.stringify(data));
export const blankPlan = () => ({amount:null,times:null,unit:'克',stock:null,origin:'user',basis:'手动填写',hint:''});
export function defaults() {
  return GROUPS.flatMap(g=>g.names.map((name,i)=>({id:`${g.id}-${i}`,group:g.id,name,quantity:'',note:'',confirm:!!PLANS[name].issue,done:false,plan:clone(PLANS[name])})));
}
export function migrate(items) {
  return items.map(item=>{
    if(item.plan) return clone(item);
    const sameDefault=GROUPS.some(g=>g.id===item.group && `${g.id}-${g.names.indexOf(item.name)}`===item.id);
    const plan=sameDefault&&!item.quantity.trim()?clone(PLANS[item.name]):blankPlan();
    if(item.quantity.trim()) plan.hint='保留了原采购备注；请填写用量、频次与库存后再计算。';
    return {...item,confirm:item.confirm||!!plan.issue,plan};
  });
}
const numberOrNull = n => n===null || (typeof n==='number' && Number.isFinite(n) && n>=0 && n<=1e7);
export function valid(items) {
  return Array.isArray(items)&&items.length<=1000&&new Set(items.map(x=>x?.id)).size===items.length&&items.every(x=>
    x && typeof x.id==='string'&&x.id.length<=150&&typeof x.name==='string'&&x.name.trim()&&x.name.length<=100&&GROUPS.some(g=>g.id===x.group)&&
    typeof x.quantity==='string'&&x.quantity.length<=1000&&typeof x.note==='string'&&x.note.length<=5000&&typeof x.done==='boolean'&&typeof x.confirm==='boolean'&&
    (!x.plan || (numberOrNull(x.plan.amount)&&numberOrNull(x.plan.times)&&numberOrNull(x.plan.stock)&&x.plan.times<=100&&UNITS.includes(x.plan.unit)&&['draft','notion','user'].includes(x.plan.origin)&&typeof x.plan.basis==='string'&&typeof x.plan.hint==='string'))
  );
}
export const rounded = n => Math.round((n+Number.EPSILON)*1000)/1000;
export const format = n => new Intl.NumberFormat('zh-CN',{maximumFractionDigits:3}).format(n);
export function quantityFor(item) {
  const p=item.plan;
  const weekly=p&&p.amount!==null&&p.times!==null?rounded(p.amount*p.times):null;
  const buy=weekly!==null&&p.stock!==null?rounded(Math.max(0,weekly-p.stock)):null;
  const state=item.done?'ready':item.confirm?'confirm':weekly===null?'quantity':weekly===0?'ready':p.stock===null?'stock':buy===0?'ready':'buy';
  return {weekly,buy,state};
}
export function newRound(items) {return items.map(x=>({...x,done:false,plan:{...x.plan,stock:null}}));}
