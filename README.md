# 每周节奏与月季复盘

固定周历、季度技能安排、每周采购清单，以及独立保存的月度和季度整日复盘。

## 网页

- [每周固定日历](https://travelstocks.github.io/weekly-rhythm/)
- [月度复盘](https://travelstocks.github.io/weekly-rhythm/monthly.html)
- [季度复盘](https://travelstocks.github.io/weekly-rhythm/quarterly.html)
- [每周采购清单](https://travelstocks.github.io/weekly-rhythm/shopping.html)

日历支持拖动、调整时长、新增、修改、删除与锁定。月度流程为 08:30–20:00，季度流程为 08:30–18:00，依据 2026-10-28 执行手册整理。三条主线为主业、股票、个人成长。

复盘页默认逐步填写，每步明确预期产出。支持继续复盘、模块跳转、完整浏览和完成进度；“已完成但待补数据”单独显示，不计作完成。

采购清单按单人 7 天计算：每次用量 × 每周次数 − 现有库存，结果不低于 0，不自动凑整包装。品类来自用户的 Notion；食物份量为用户同意的可调整参考草案，药物仅换算 Notion 中明确记录的消耗量。名称或用量不完整的项目暂不列入待买。库存留空表示未盘点，不等于没有库存。

可直接填写库存，或点击“调整”修改用量、频次和单位。开始新一轮清除勾选与旧库存，保留用量和备注；支持撤销、导出和导入。旧清单自动迁移，保留自定义名称、原采购备注、勾选和删除结果；不猜测原有自由文本数量，升级前在同一浏览器另存一份原始记录。

## 保存和迁移

页面是静态模板。用户填写的内容仅保存在当前浏览器的 localStorage，不上传 GitHub，不自动跨设备同步。

从旧网址迁移时，在旧站的日历、采购清单、月度与季度页面分别导出 JSON 备份，再在新站对应页面导入。月季导入只新增尚不存在的周期，重复周期保留新站现有记录。浏览器清理数据前请先备份。

## 发布与维护

GitHub Pages 从 `main` 分支的 `/docs` 目录发布。修改 `docs/` 后提交并推送到 `main`，等待 Pages 部署完成。

无需安装前端依赖。可用 Python 在 `docs` 目录启动静态服务器预览。

测试（Node.js 22 或更高版本）：

```sh
node --test tests/review-model.test.mjs tests/review-manual.test.mjs tests/template-update.test.mjs tests/review-progress.test.mjs tests/shopping-quantities.test.mjs
```

仓库只包含网页模板、样式、脚本及测试，不包含原 Word 手册、浏览器备份或 Sites 的凭据与部署配置。
