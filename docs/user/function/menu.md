# 菜单 `menu`
## 概念
为了简化操作和兼容不想使用指令的玩家，CALL给出了图形化菜单。菜单基于指令开发，除了帮助您输入指令外，菜单也配置一些指令中没有的功能，例如填充时自动选择材质等。
## 菜单
指令输入`/call`可**打开菜单**，或使用[快捷键](/user/function/hotkey)打开菜单

#### 指令

> /call \[menu | me :enum\] [option :string]

- `option`：菜单目录选项序列，由一些由空格隔开的数字组成，从左到右逐级进入目录  
例：对于如下目录  
```
├─目录1
├──┬─子目录1
│  ├────功能1
│  └────功能2
├──┬─子目录2
│  └────功能3
├─目录2
└─目录3
```
执行`/call menu "0 0"`将直接弹出功能1的表单  
注：option**只能进入目录**（按钮界面），若执行`/call menu "0 0 0"`则还是弹出功能1表单

## 使用菜单获取快捷键

打开菜单，进入 `设置->快捷键设置->快捷键名` 选择执行操作为：`获取快捷键物品`，选择好后点击提交，即可获取对于的快捷键

## 更多菜单教程

打开菜单，进入 `基础教程` 即可查看菜单教程