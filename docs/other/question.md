# 常见问题
## 使用操作类
### 怎么打开菜单？
1. 方法一：快捷键方式：  
使用打开菜单快捷键点击任意方块即可打开菜单。  
（**默认**打开菜单的快捷键为**钟**，服务器管理员可能会更改默认快捷键，请以服务器为准）
2. 方法二：指令方式：  
输入指令 `/ca` 或 `/call` 或 `/ca menu` 或 `/call menu` 或 `/ca me` 或 `/ca menu` 均可打开菜单。

### 怎么获取快捷键？
可通过输入指令 `/call` 进入菜单，进入选项 `设置->快捷键设置->获取所有快捷键` 点击即可获取快捷键。

### 怎么修改快捷键？
可通过输入指令 `/call` 进入菜单，进入选项 `设置->快捷键设置->xx模式->xxx快捷键` 修改相应的快捷键设置即可

### 怎么选区？
1. 方法一：A点B点选择工具  
获取快捷键 `A点选区工具` 和 `B点选区工具`，使用A点工具点击方块选取A点，使用B点工具点击方块选取B点。

2. 方法二：AB轮换选择工具  
获取快捷键 `选区工具`，第一次点击方块选取A点，第二次点击方块选取B点。

### 选区中，可以点击选A点，破坏选B点吗？
可以在 `设置->快捷键设置` 将同一个快捷键的右键模式设置为选A点，左键模式设置为B点

### 怎么清除选区？
1. 方法一：使用菜单  
打开菜单，进入 `选区->清除选区`

2. 方法二：输入指令  
输入指令 `/call area cancel`

### 我看到的方块和别人不一样？看到假方块？
这是由于其他人修改区域后，您未能正常刷新区块所导致。CALL将会在以后的版本尽可能修复这种情况。  
您可刷新区块后恢复正常
1. 方法一：菜单  
打开菜单，选区 `刷新区块`

2. 方法二：指令  
输入指令 `/call refresh` 或 `/ca rf`

### 如何精准的生成斜的几何体？
-- 来自用户: Ye111566

1. 拿出右手 四个手指一开始位置记x正 向内挥手90度的位置记为z正，大拇指位置记y正

2. 拿出草稿纸画图 把你设置的物体形状不算欧拉角的部分画出来，再把你想要的旋转后的形状画出来

3. 在你原来的形状和xyz正轴的部分利用空间想象力画出来旋转后这三个轴是在哪里（记得画剪头）

4. 利用空间想象力想出来分别是从x正轴下方，向x正方向看时候顺时针旋转a度 
从y正轴下方，向y正方向看时候顺时针旋转a度
从z正轴下方，向z正方向看时候顺时针旋转a度
最后你选择欧拉角模式为xyz，x=a,y=b,z=c


## 后台管理类
### 怎么让所有人都能使用CALL？
修改[配置文件](user/config)的permission项为"all"，修改后在后台输入指令 `ca r` 或 `call reload` 重新加载CALL即可

### 怎么让一部分人能使用CALL？
1. 步骤一：
修改[配置文件](user/config)的permission项为"customize"，修改后在后台输入指令 `ca r` 或 `call reload` 重新加载CALL。

2. 步骤二：
后台输入指令 `/call add "玩家名"` 添加一个玩家  
后台输入指令 `/call ban "玩家名"` 移除一个玩家

### 怎么导出结构？
1. 使用 `/call list` 命令查看需要导出结构的id
2. 在后台输入指令：`call export <格式名> <结构id> [是否包含实体] [文件名称]` 即可将CALL中保存的结构导出 
3. 在 `CALL/export` 目录下可找到导出后的文件

指令说明：
- `格式名` 目前支持的格式有: mcstructure
- `结构id` 一串字符组成的id
- `是否包含实体` 可不输入，默认为false
- `文件名称` 导出后文件的名称，可不输入，默认为结构id

### 怎么导入文件为结构？
1. 将需要导入的文件放入 `call/userdata/import` 目录下
2. 在后台输入指令：`call import <文件名> <玩家名> [是否包含实体] [结构名称]` 即可将文件导入为结构给某个玩家

指令说明：
- `文件名` 需要导入文件的名称（需要输入后缀名），目前支持的格式有: mcstructure
- `玩家名` 一个使用过CALL的玩家的玩家名，导入后会将结构加入到该玩家的保存中
- `是否包含实体` 可不输入，默认为false
- `结构名称` 结构的名称，默认为当前时间

### 怎么在另一个存档使用保存的建筑？
在不删除CALL/data文件夹的情况下，直接更改存档即可使用保存的建筑

### 怎么更新CALL？
- 自动更新
1. 将配置文件：`CALL/config/configs.json` 中的`autoUpdate` 项设置为true后输入指令 `ca r` 或 `call reload` 重新加载CALL

- 手动更新
1. 下载需要更新的CALL版本
2. 将CALL/shape中的形状包文件替换
3. 将下载的CALL.llplugin放入`plugins/`目录

