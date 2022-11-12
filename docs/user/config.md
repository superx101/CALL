# 配置

?> 若您**不是**服务器后台管理者，可**跳过**本节文档

## 全局配置
### 介绍
&emsp;&emsp;在`CALL/config/configs.json`文件中存放有本插件的全局配置，全局配置决定了所有玩家的操作方式和默认设置。您可根据下面的[说明](#配置项解析)修改配置项。 

### 须知
- 配置文件仅在**插件启动时加载**，当插件启动后修改配置将不会生效。此时您可以在后台使用命令`/call reload`重载插件使配置文件生效，或等下次服务器重启后自动生效。
- 配置文件为**json格式**，请遵循该格式语法，否则将无法读取配置。

### 配置项解析
灰底字表示配置的项，区块内容表示项的值，值后面的文件为对值的解释
#### `enable` 是否启用插件
关闭后CALL则不会加载，所有玩家都不可使用
> true&emsp;&emsp;启用插件CALL  
> false&emsp;&emsp;关闭插件CALL

#### `permission` 使用权限
定义哪些玩家可以使用CALL
> "all"&emsp;&emsp;所有玩家都可以使用CALL  
> "op"&emsp;&emsp;仅OP可以使用CALL  
> "customize"&emsp;&emsp;自定义可使用CALL的玩家，详见[权限列表](#权限列表)

#### `debugMod` 是否启用调试模式
形状包开发者可开启调试模式查看报错情况，默认情况下CALL不输出插件报错内容
> true&emsp;&emsp;开启  
> false&emsp;&emsp;关闭

#### `displayLogo` 加载CALL时是否显示字符Logo

> true&emsp;&emsp;显示  
> false&emsp;&emsp;不显示

#### `maxSaveStructure` 一个玩家最多可以保存的结构数量
推荐取值：30
> 整数数字&emsp;&emsp;范围：0--200

#### `maxUndoStep` 最大撤销与恢复步数
推荐取值：10以内
> 整数数字&emsp;&emsp;范围：0--100

#### `viewMaxDistance` 视野选取方块的最大距离
用于[视野选区]()，定义视线最大距离  
推荐取值：150以内
> 整数数字&emsp;&emsp;范围：1--300

#### `maxLoadCheckNum` 最大区块加载次数
当处理大区域时需要等待区块加载，若超过加载次数则退出执行  
推荐取值：5
> 整数数字&emsp;&emsp;范围：1--20

#### `default` 默认设置
定义了玩家第一次使用CALL时的默认设置，在此定义默认的快捷键等设置  
若您没有json语法基础，*不建议您对其修改*，以免产生一些错误导致系统瘫痪  
若您为开发者，该对象格式请见[开发文档]()
> json对象&emsp;&emsp;  


## 权限列表
- `CALL/config/userlist.json`文件中存有玩家名字的白名单，处于白名单内的玩家可以使用CALL。  
注：当配置项[`permission`](#permission-使用权限)为`"customize"`时，才开启白名单。

?> 不建议您直接修改`userlist.json`文件，CALL提供了后台命令帮助您快速[添加和移除]()白名单内玩家