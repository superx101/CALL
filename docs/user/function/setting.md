# 设置

?> 若您**不是**开发者，可**跳过**本节文档，**使用菜单**修改设置

## 概念
您可通过指令方式修改大部分个人设置，具体设置项请见[设置项](#可修改的设置项)

## 查询设置
#### 指令

> /call \<setting :enum\> \<get | ge :enum\> \<key :string\>

- `key`：设置项的键，例：`/call setting get "loadChuckTip"`

## 修改设置
#### 指令

> /call \<setting :enum\> \<set | se :enum\> \<json :json\>

- `json`：设置项的键值对对象，只需要填入要修改的键值对即可，需要**注意**：当前版本并未对设置项的修改进行检查，请修改前手动检查您要修改的键值，以免出错。  
例：同时修改barReplace和barReplaced项：`/call setting set {"barReplace":2,"barReplaced":3}`

## 可修改的设置项
#### `barReplace` 替换方块A序号
使用菜单填充替换时，从第 barReplace + 1 个物品栏选择一个方块进行替换

> 0 - 9 的整数

#### `barReplaced` 替换方块B序号
使用菜单填充替换时，从第 barReplaced + 1 个物品栏选择一个方块被替换

> 0 - 9 的整数

#### `saveArea` 退出时是否保存选区

> true 保存  
> false 不保存

#### `saveUndo` 退出时是否保存撤销与恢复栈

> true 保存  
> false 不保存

#### `saveCopy` 退出时是否保存剪贴板

> true 保存  
> false 不保存

#### `areaTextShow` 是否在物品栏上方显示选区

> true 显示  
> false 不显示

#### `displayArea` 是否显示选区

> true 显示  
> false 不显示

#### `oldCommandType` 1.19.50以下版本中启用旧指令格式
1.19.50后自动强制采用新版指令，可忽略此选项     
1.19.50前的部分版本下的实验模式中的指令也为新版指令，即部分实验模式下需将此项设为false

> true 采用  
> false 不采用

#### `loadChuckTip` 加载新区块时是否提示

> true 提示  
> false 不提示

#### `items` 快捷键
CALL已提供了[tool指令](/user/function/hotkey)查询和修改快捷键，此设置项主要用于第三方插件读取快捷键

> json对象 

解析：
```
"items":{
    "物品英文id": {
        "物品名称": {
            "cmds": ["指令1", "指令2"]
            "desribe": "描述"
        }
    }
}
```
上述json中英文键表示固定的键，中文键由您自己填写  
当需要匹配没有名称的物品时，`物品名称`为""
