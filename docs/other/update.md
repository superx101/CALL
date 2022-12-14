# 更新日志

## 1.0.2
### Bug修复
> - 修复了call off关闭插件时选区提示依然存在
> - 修复了无法在非主世界维度使用

### 存在问题
> - 非主世界使用时, 需要拥有op指令权限。(LL后台执行指令时默认为主世界, 因此暂无法修复)

## 1.0.1
### Bug修复
> - 修复了快捷键菜单中返回上一级报错

## 1.0.0
### 新特性

> - 重构为ts + nodejs插件，将数据与代码分离
> - 加入自动更新器，可在配置中开启自动检查并更新
> - 加入数据适配器，自动更新数据格式，自动更新默认形状包

> - 为菜单添加图标
> - 当表单中没有 `返回上一级` 按钮时，可点击关闭按钮返回上一级
> - 快捷键加入破坏触发模式, 左键点击方块后触发
> - 新增快捷键变量100余种
> - 基础形状包增加：`球体`、`椭球体`、`圆柱体`、`圆锥`，具有实心和空心模式，可自由变换
> - 加入`方块属性编辑器`, 可强制编辑方块

> - 形状包添加新API `SHP.getVersion` `SHP.listForm`
> - 将形状包中强制定义导出函数的模式，改为使用 `SHP.export_cmd` `SHP.export_form` `SHP.export_tutorial` 导出函数
> - `CALL/plugins` 中添加了API定义文件 `Shape.d.ts`. 可在js文件中加入 `/// <reference path="../Shape.d.ts"/> ` 来获取IDE代码提示
### Bug修复

> - 修复了菜单指令 `/call menu "1 2"` 中无法使用第三参数打开子菜单
> - 修复了控制台无法使用 `/call add` 添加自定义玩家
> - 优化了选区后频繁刷新区块和传送

## 0.2.0
### 适配修改

> - 0.2.0即以后版本不再对BDS版本1.19.50前的版本做兼容处理，若旧版中使用出现问题请安装0.1.2
> - 适配1.19.50中删除的指令参数Block，使CALL-0.2.0支持1.19.50

### 新特性

> - 快捷键指令支持表达式，如：/say ${(pos.x + 3) * 2}

### Bug修复

> - 修复 默认快捷键配置文件中复制、粘贴指令错误

## 0.1.2
### Bug修复

> - 修复 LiteLoader版本低于2.8.1时无法正常加载第三方库Three.js
> - 修复 简介图片失效

## 0.1.1
### Bug修复

> - 修复 加载大区域时结构不完整
> - 修复 未使用过结构功能的玩家退出后产生异常

## 0.1.0

> CALL 0.1.0 发布