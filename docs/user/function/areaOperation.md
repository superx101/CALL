# 选区操作
对选区的直接操作，需要选择一个选区，不然无法执行
## 填充 `fill`
CALL中的填充与原版填充相同，填充分为：实心、空心，空心（保留内部），但CALL的填充不限制方块总数。  
若使用菜单填充，则CALL从您的物品栏自动选择方块材质与状态值
#### 指令

> /call \<fill | fi :enum\> \<block :block\> \[states :string\] [hollow | outline | null | ho | ou | nu :enum] 

- `block`：要填充的方块名称
- `states`：要填充的方块状态值，缺省则为空
- `hollow | outline | null | ho | ou | nu`：缺省则为null  
&emsp;&emsp;`hollow | ho`：空心  
&emsp;&emsp;`outline | ou`：空心（保留内部）  
&emsp;&emsp;`null | nu`：实心

## 清除 `clear`
清空整个选区
#### 指令

> /call \<clear | cl :enum\>

## 替换 `replace`
指令一种方块替换选区内另一种方块
#### 指令

> /call \<replace | re :enum\> \<blockA :block\>  \<statesA :string\> \<blockB :block\> \<statesB :string\>

- `blockA`：方块种类  
- `statesA`：方块状态值  
- `blockB`：被替换的方块种类  
- `statesB`：被替换的方块状态值  

## 平移 `move`
将整个选区内容平移到另一点指定的区域，但选区位置不变，还是为未平移之前的选区  

#### 指令

> /call \<move | mo :enum\> \[pos :int\]

- `pos`：缺省则为玩家当前坐标  
移动位置，平移时将会把选区中**坐标值最小的顶点**设置为pos

## 堆叠 `stack`
将区域重复堆叠放置，支持三维堆叠  
在三维堆叠情况下，一个方块可以被堆叠 x=9 y=9 z=9 次后形成一个 10 * 10 * 10 的立方体

#### 指令

> /call \<stack | st :enum\> \<x :int\> \<y :int\> \<z :int\>

- `x`：x方向堆叠次数，若为负数则反向堆叠
- `y`：y方向堆叠次数，若为负数则反向堆叠
- `z`：z方向堆叠次数，若为负数则反向堆叠

❗ 注意：堆叠次数为1表示扩充一倍，若原来选区x方向长度为2，堆叠后长度则为4

## 镜像 `mirror`
根据一点所指定的平面，将区域在二维方向(x z)上对称

#### 指令

> /call \<mirror | mi :enum\> \<x | z | xz :enum\> \[pos :x y z\]

- `x | z | xz`：指定对称轴的方向
- `pos`：缺省则为玩家当前坐标  
镜像平面以pos指定的二维坐标(x z)点作为原点，对区域进行对称操作。  
其中y坐标可以任意填写

## 旋转 `rote` 
根据一点所指定的轴，将区域在二维方向(x z)上旋转

#### 指令

> /call \<rote | re :enum\> \<90_degrees | 180_degrees | 270_degrees :enum\> \[pos :x y z\]

- `90_degrees | 180_degrees | 270_degrees`：旋转角度
- `pos`：缺省则为玩家当前坐标  
区域会以该点作为原点旋转