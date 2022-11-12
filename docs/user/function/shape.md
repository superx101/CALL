# 形状 `shape`
形状是一种结构生成算法，形状包则是形状的一个集合
## 查询形状
列出所有形状包和包中形状
#### 指令

> /call \<shape | sh :enum\> \<list | li :enum\>

## 生成形状
生成形状需输入json参数，参数由形状包作者自行定义  
若您不是开发者，建议您使用菜单来执行该功能
#### 指令

> /call \<shape | sh :enum\> \<load | lo :enum\> \<package :string\> \<index :int\> \[json :json\] \[pos :x y z\]

- `package`：形状包名，例："superx101.basicShape"
- `index`：形状序号，选择形状包内第index个形状，序号从0开始
- `json`：对应形状的参数json对象
- `pos`：生成目标位置