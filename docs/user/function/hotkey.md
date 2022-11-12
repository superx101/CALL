# 快捷键 `tool`
## 概念
为了方便执行指令、以免与其他插件的热键冲突，CALL提供了一个快捷键机制：  
您可通过使用一个**特定种类**、**特定名称**的物品**点击任意方块**激活快捷键，激活后将**执行**一组提前绑定好的**指令**序列。

## 绑定指令

#### 指令

> /call \<tool | to :enum\> \<bind | bi :enum\> \<item :item\> \<cmd :string\> \<describe :string\> \[name :string\]

- `item`：绑定物品的id
- `cmd`：指令组字符串，用;分隔多条指令。例如：`"/say hello;/say world"`

    > 为拓展指令功能，定义如下变量，执行指令时将会把变量替换为指定的值
    | 变量名 | 类型 | 说明 |
    | :-: | :-: | :-: |
    | ${posf.x} | float | 执行指令玩家的浮点坐标x |
    | ${posf.y} | float | 执行指令玩家的浮点坐标y |
    | ${posf.z} | float | 执行指令玩家的浮点坐标z |
    | ${pos.x} | int | 执行指令玩家的整数坐标x |
    | ${pos.y} | int | 执行指令玩家的整数坐标y |
    | ${pos.z} | int | 执行指令玩家的整数坐标z |
    | ${type} | string | 点击的方块的英文id |
    | ${tileData} | int | 点击的方块的特殊值 |
    >
    > 示例: `"/give @s ${type} 1 ${tileData};/say haha"` 表示给玩家一个快捷键点击到的方块，并发送一句haha

- `describe`：快捷键描述，一个简单的说明，不影响快捷键匹配
- `name`：物品名称，若不输入则匹配没有名字的物品作为快捷键

## 解除绑定
#### 指令

> /call \<tool | to :enum\> \<unbind | un :enum\> \<item :item\> \[name :string\]

- `item`：绑定物品的id
- `name`：物品名称，若不输入则匹配没有名字的物品作为快捷键

## 列出快捷键

#### 指令

> /call \<shape | sh :enum\> \<list | li :enum\>

## 默认快捷键

!> 服务器后台管理员可更换默认快捷键，**实际快捷键**请**以服务器为准**

- [打开菜单](user/function/menu?id=%e6%89%93%e5%bc%80%e8%8f%9c%e5%8d%95-menu): **钟**`id: minecraft:clock`
- [设置选区a点](user/function/area?id=%e8%ae%be%e7%bd%ae%e9%80%89%e5%8c%baa%e7%82%b9)：**箭矢**`id: minecraft:stick`
- [设置选区b点](user/function/area?id=%e8%ae%be%e7%bd%ae%e9%80%89%e5%8c%bab%e7%82%b9)：**木棍**`id: minecraft:arrow`
- [轮流设定ab点](user/function/area?id=%e8%bd%ae%e6%b5%81%e8%ae%be%e5%ae%9aab%e7%82%b9)：**木斧**`id: minecraft:wooden_axe`
- [复制](user/function/other?id=%e5%a4%8d%e5%88%b6-copy)：**烈焰棒**`id: minecraft:blaze_rod`
- [粘贴](user/function/other?id=%e7%b2%98%e8%b4%b4-paste)：**骨头**`id: minecraft:bone`
- 获取点击的方块：**木稿**`id: minecraft:wooden_pickaxe`