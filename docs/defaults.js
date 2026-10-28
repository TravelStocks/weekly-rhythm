
const names=['周一','周二','周三','周四','周五','周六','周日'];
const en=['MON','TUE','WED','THU','FRI','SAT','SUN'];
export const defaults=[];
for(let day=0;day<5;day++){
 defaults.push({day,start:'08:40',end:'09:15',title:'规划一天',color:'rose',compact:true,desc:'用早晨的 35 分钟确定当天重点。',items:['梳理当天事项','确定优先级与时间安排']});
 defaults.push({day,flex:true,title:'中午 · 碎片事项',desc:'中午抽空集中处理零散事务；具体起止时间随当天情况安排。',color:'grey'});
 defaults.push({day,start:'21:00',end:'22:00',title:'洗澡 · 复盘 · 次日准备',color:'rose',items:['到家后洗澡','简短回顾当天','收拾第二天要用的东西'],desc:'用一小时完成每日收尾。'});
 defaults.push({day,start:'22:00',end:'23:00',openEnd:true,title:'上床放松 · 酝酿睡意',color:'grey',desc:'22:00 开始上床放松，逐渐进入睡眠。',rule:'这是开始休息的时间；卡片下沿不代表睡眠结束时间。'});
}
defaults.push({day:5,start:'09:30',end:'11:30',title:'财务经济梳理',color:'gold',locked:true,desc:'经济财务周／月／季复盘。周六上午两小时，雷打不动。',items:['经济与财务周度复盘','按周期进行月度／季度复盘','分配下一周预算'],rule:'固定保留 09:30–11:30，不被其他安排挪用。'});
defaults.push({day:5,flex:true,title:'陪伴与自由活动',subtitle:'下午｜午餐、出游、玩耍、休息',color:'green',desc:'下午留给陪伴与自由活动，不设固定起止时间。',items:['午餐','出游','玩耍','休息'],rule:'一周物资采购可结合当天安排灵活处理。'});
defaults.push({day:6,start:'08:30',end:'12:00',title:'阅读与成长',color:'blue',desc:'阅读／练习＋简短复盘',items:['阅读书籍与练习','回顾周中学到的知识和其他信息','做一次简短成长复盘']});
defaults.push({day:6,start:'13:30',end:'18:00',title:'股票复盘',color:'blue',items:['周度交割复盘','周五盘面复盘','短线投机知识学习','战法模式补充']});
defaults.push({day:6,start:'19:00',end:'20:30',title:'工作推进与下周安排',color:'blue',items:['检查工作进度、确认卡点、安排下周','实际修改方案、写报告、处理项目'],rule:'20:30 收尾，为次日准备与放松留出空间。'});
defaults.push({day:6,start:'20:30',end:'23:00',openEnd:true,title:'次日准备 · 自由活动 · 放松',color:'green',desc:'为原定作息留出空间。',items:['准备第二天的用品','自由活动与放松','衔接原定睡前作息'],rule:'20:30 以后留给生活；卡片下沿不代表固定结束时间。'});

defaults.push({id:'q4-skills-saturday',day:5,start:'08:00',end:'09:30',title:'技能综合练习',color:'blue',desc:'2026 年第四季度技能目标，结合本周学习进行综合练习。',items:['英语口语','销售和 Marketing 思维与常见方案','AI 使用']});
defaults.push({id:'weekly-saturday-shopping',day:5,start:'11:30',end:'13:00',title:'采购、生活补给（建议时段）',color:'green',desc:'财务梳理之后采购与生活补给；11:30–13:00 是建议时段，需要根据实际路程验证和调整。',items:['查看每周采购清单','按库存补充饮食和药物条目']});
for(let day=0;day<5;day++)defaults.push({id:'q4-skills-weekday-'+day,day,flex:true,title:'技能练习 · 自选主题',subtitle:'周中弹性｜不占固定时段',color:'blue',desc:'从本季度三个技能目标中选择主题，结合当天空闲时间练习。',items:['英语口语','销售和 Marketing 思维与常见方案','AI 使用']});

