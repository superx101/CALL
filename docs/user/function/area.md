# 选区 area
## 概念
CALL中的选区是一个三维立方体，需要指定同一维度内的两点来选择一个区域

## 设置选区a点
#### 指令

> /call \<area | ar :enum\> \<start | st | a :enum\> [pos :x y z]

- `pos`：将选区的**点a**坐标设为pos

## 设置选区b点
#### 指令

> /call \<area | ar :enum\> \<end | ed | b :enum\> [pos :x y z]

- `pos`：将选区的**点b**坐标设为pos

## 轮流设定ab点
初次执行时为a设置选点，再次执行时为b设置选点，第三次执行时清除选区并为a设置选点
#### 指令

> /call \<area | ar :enum\> \<set | se  :enum\> [pos :x y z]

- `pos`：将选区的点a**或**点b坐标设为pos

## 视线设置选区a点

将视野中心看到的方块的坐标设置为选区a点，视野范围由全局配置[viewMaxDistance](user/config?id=viewmaxdistance-%e8%a7%86%e9%87%8e%e9%80%89%e5%8f%96%e6%96%b9%e5%9d%97%e7%9a%84%e6%9c%80%e5%a4%a7%e8%b7%9d%e7%a6%bb)
决定
#### 指令

> /call \<area | ar :enum\> \<start | st | a :enum\> \<view | vi  :enum\>

## 视线设置选区b点

将视野中心看到的方块的坐标设置为选区b点，视野范围由全局配置[viewMaxDistance](user/config?id=viewmaxdistance-%e8%a7%86%e9%87%8e%e9%80%89%e5%8f%96%e6%96%b9%e5%9d%97%e7%9a%84%e6%9c%80%e5%a4%a7%e8%b7%9d%e7%a6%bb)
决定
#### 指令

> /call \<area | ar :enum\> \<end | ed | b :enum\> \<view | vi  :enum\>

## 清除选区
#### 指令

> /call \<area | ar :enum\> \<cancel | cc :enum\>

## 显示选区范围
CALL使用结构方块的三维线条展示一个选区
#### 指令

> /call \<area | ar :enum\> \<show | sh :enum\> \[on | off | of :enum\]

- `on | off | of`: 缺省则为 on

&emsp;&emsp;`on`：打开区域显示  
&emsp;&emsp;`off | of`：关闭区域显示