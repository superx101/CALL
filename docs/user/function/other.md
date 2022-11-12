# 其他操作
## 启用和关闭 `on-off`
可通过指令启用或关闭您的CALL，仅关闭指令执行者的CALL，不影响他人正常使用
#### 指令

> /call \<on | off | of :enum\>

- `on | off | of`：  
&emsp;&emsp;`on`：启用CALL  
&emsp;&emsp;`off | of`：关闭CALL

## 撤销 `undo`
所有CALL引起的结构变换的操作均可撤销，包括选区操作、粘贴、加载、形状生成、恢复  

最大撤销步数由全局配置[maxUndoStep](user/config?id=maxundostep-%e6%9c%80%e5%a4%a7%e6%92%a4%e9%94%80%e4%b8%8e%e6%81%a2%e5%a4%8d%e6%ad%a5%e6%95%b0)决定
#### 指令

> /call \<undo | ud :enum\>

❗ 注：undo指令的简写为ud

## 恢复 `redo`
若有撤销时，可以恢复撤销，将结构恢复到撤销前的状态
#### 指令

> /call \<redo | rd :enum\>

❗ 注：redo指令的简写为rd

## 复制 `copy`
将当前选区复制到剪贴板  
当前版本中CALL仅设置了一个剪贴板，再次复制时将会清空上一个复制
#### 指令

> /call \<copy | co :enum\>

## 粘贴 `paste`
将剪贴板中复制的结构粘贴到当前坐标  
#### 指令

> /call \<paste | pa :enum\> \<pos: x y z\>

- `pos`：粘贴的目标点，详见[加载结构](#加载结构-load)

## 保存 `save`
将选区保存为一个结构
#### 指令

> /call \<save | sa :enum\> \[name :string\]

- `name`：为结构取一个名称，缺省则为当前时间

## 查询结构 `list`
查询所有保存的结构
#### 指令

> /call \<list | li :enum\> 

## 结构公开 `public`
将您自己保存的结构公开给全部人
#### 指令

> /call \<public | pu :enum\> \<id :string\>

- `id`：结构的id，使用`/call list`查看所有保存的结构的id

## 结构私有 `private`
取消一个的结构的公开
#### 指令

> /call \<private | pr :enum\> \<id :string\>

- `id`：结构的id，使用`/call list`查看所有保存的结构的id

## 加载结构 `load`
将保存的结构加载到指定位置 
#### 指令

> /call \<load | lo :enum\> \<id :string\> \[pos :int\] \[0_degrees | 90_degrees | 180_degrees | 270_degrees :enum\] \[none | x | z | xz\]

- `id`：结构的id，使用`/call list`查看所有保存的结构的id
- `pos`：加载位置，结构中坐标最小的顶点对应pos，缺省则为当前您的坐标
- `0_degrees | 90_degrees | 180_degrees | 270_degrees`：旋转角度，缺省则为0_degrees
- `none | x | z | xz`：镜像轴，缺省则为none

## 删除结构 `delete`
删除保存的结构 
#### 指令

> /call \<delete | de :enum\> \<id :string\>