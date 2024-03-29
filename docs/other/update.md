# 更新日志
## 1.2.1
### Bug修复
> - 修复非主世界中加载结构错误
> - 修复形状包方形和直线错误
### 修改
> - 将大部分方法中的参数: player, playerData, 合并重构为caPlayer
> - 加入刷新区块设置，可选择操作完成后是否刷新区块

## 1.2.0
### 新特性
> - 添加文本国际化，可通过改变客户端语言来改变插件语言
> - 形状包国际化
> - 添加快捷键变量: block.states
### 修改
> - 修改方块状态值表述方式，适配BDS-1.20.10及以后版本
### Bug修复
> - 修复菜单中边界填充指令错误
> - 修复ca load坐标识别错误
> - 修复无法使用命令方块execute执行ca相关指令

## 1.1.6
### Bug修复
> - 修复进服中途退出时报错
> - 修复自动更新时，服务器拒绝访问导致的程序错误

### 存在问题
> - 超大区域加载时出现个别区块加载失败

## 1.1.5
### 修改
> - 修改方块特殊值为状态值，用于适配1.19.70

### 存在问题
> - 超大区域加载时出现个别区块加载失败

## 1.1.4
### Bug修复
> - 修复了保存的结构中，列表按钮与对应结构顺序相反
> - 修复了导入的结构出现重复局部的错误

### 修改
> - 自动更新解压使用7za.exe解压, 速度更快

### 存在问题
> - 超大区域加载时出现个别区块加载失败

## 1.1.3
### Bug修复
> - 修复快捷键列表界面中无法显示部分快捷键图标
> - 修复call fill时无方块名称提示

### 修改
> - 快捷键列表界面中加入物品名称提示
> - 取消对LL: 2.9.1即以下版本的支持, 当前版本需要在LL2.9.2即以上版本使用 

### 存在问题
> - 超大区域加载时出现个别区块加载失败

## 1.1.2
### Bug修复
> - 修复无法打开快捷键修改界面
> - 修复材质选择不全时报错并无法填充

### 存在问题
> - 填充方块无法自适应以后的游戏版本，且输入fill指令时无方块补全提示
> - 超大区域加载时出现个别区块加载失败

## 1.1.1
### 新特性
> - 添加方块材质选择器，可用快捷键选择材质
> - 添加依赖更新方法

### Bug修复
> - 修复了自动更新中无法删除、写入文件
> - 修复了使用面板时静默执行指令报错
> - 修复了保存界面关闭按钮无法关闭

### 存在问题
> - 填充方块无法自适应以后的游戏版本，且输入fill指令时无方块补全提示
> - 超大区域加载时出现个别区块加载失败

## 1.1.0
### 新特性
> - 添加`保存实体`设置, 保存时可选择是否保存实体
> - 添加配置项`outputCmd`, 可关闭控制台的指令输出
> - 添加import指令, 可从后台导入mcstructure文件
> - 添加export指令, 可导出结构为mcstructure文件到后台

### 重构
> - 重构区块遍历方法, 修复大区域加载不完全
> - 加载区块时可显示进度条
> - 将GUI中结构显示按设置为按时间逆序显示

### Bug修复
> - 修复了在非主世界使用时需要op权限
> - 修复了部分GUI关闭时报错
> - 修复了快捷键指令中字符串被加上前缀
> - 修复了空心填充、移动、撤销时区域不完全
> - 修复了无法填充水、岩浆等方块
> - 修复了部分界面点击关闭时无法回到上一级

### 存在问题
> - 填充方块无法自适应以后的游戏版本，且输入fill指令时无方块补全提示
> - 超大区域加载时出现个别区块加载失败

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