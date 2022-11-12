# 形状包API
## 导出函数
形状包中您需要定义一个生成形状函数，通过指令生成形状。再定义一个表单帮助玩家输入参数，提交表单后执行形状生成指令。这样就定义两种方式生成表单，其他插件也可通过指令方式调用此形状。
### 生成形状
`function export_cmd(player, index, intPos, param) {}`

[示例](dev/plugin?id=%e7%a4%ba%e4%be%8b)

用于导出的函数，**名称必须是export_cmd**，您需要在您的代码中自己定义该函数

**该函数用于处理玩家发送的指令，并生成对应形状**

- 参数 **player**
  - 说明：玩家对象
  - 类型：Player

- 参数 **index**
  - 说明：玩家在指令中输入的参数，表示选择形状包中第index号对象。
  - 类型：int

- 参数 **intPos**
  - 说明：玩家在指令中输入的参数，表示生成形状的目标点
  - 类型：IntPos

- 参数 **param**
  - 说明：玩家在指令中输入的参数对象，用json对象表示形状的参数，详见[shape指令](user/function/shape?id=%e7%94%9f%e6%88%90%e5%bd%a2%e7%8a%b6)
  - 类型：object

- 返回值
  - 说明：一个用于简单描述形状的对象，需要您自己构建该对象并返回，对象包括
    - pos 
      - 说明：长度为3的数组，定义生成形状的目标点。例：[1, 2, 3]
      - 类型：Array\<int\>
    - arr 
      - 说明：[方法对象](#设置方块) 的**数组**  
        ❗ ❗ ❗ 注意1：这里的方块数据对象是 `SHP.setBlock` 获取的方块对象，并非 ll 中的方块对象Block  
        ❗ ❗ ❗ 注意2：arr中只用包含非空方块，不必将一个区域内的所有方块数据都加入到arr

      - 类型：Array\<object\>

  - 类型：object
    ```
    {
      pos,
      arr
    }
    ```

### 参数表单
`function export_form(player, index, intPos) {}`

[示例](dev/plugin?id=%e7%a4%ba%e4%be%8b)

用于导出的函数，名称必须是export_form，您需要在您的代码中自己定义该函数

- 表单
  
  CALL会根据您使用`SHP.registerPlugin`方法提交的包名和形状名数组在 `菜单->生成形状` 表单中**自动生成**一个目录，您只需要根据形状序号 index 发送对应的表单帮助玩家填写形状参数即可。

- 回调
  
  玩家填写完表单后，需要您为玩家手动执行`/call shape load 您的包名 index 参数json对象 生成目标点`

  其中 `参数json对象` 的内容由您自己定义，这个对象作为 `export_cmd` 的 param 参数

### 帮助/教程
`function export_tutorial() {}`

[示例](dev/plugin?id=%e7%a4%ba%e4%be%8b)

用于导出的函数，名称必须是export_tutorial，您需要在您的代码中自己定义该函数

定义一个教程，在 `菜单->基础教程` 中可以看到这个教程

- 返回值 
  - 说明：一个对象。对象的键表示表单的按钮，对象的值表示点击按钮后显示的内容，同时值也可以是一个对象，该对象内再定义一个表单。

  例：

  ```javascript
  function export_tutorial() {
    return {
        简介: "简介内容"
        立方体: "立方体参数解释",
        球体: {
          椭球体: "椭球体参数解释",
          正球体: "正球体参数解释",
        }
      }
  }
  ```

## SHP 对象
CALL为形状包提供的一个对象，该对象内包含一些形状包开发所需的方法

### 注册形状包
`SHP.registerPackage(name, shapeNames, introduction)`

- 参数 **name**
  - 说明：菜单中显示的形状包名称，建议为中文。  
    注：请区分 *形状包名* 和 *形状包名称* 的概念，**形状包名** 是包的唯一识别英文名，例：superx101.myShape，**形状包名称** 是玩家看到的形状包的名称，通常是描述性的文字
  - 类型：string

- 参数 **shapeNames**
  - 说明：形状名称序列，例：["立方体", "球体"]
  - 类型：Array\<string\>

- 参数 **introduction**
  - 说明：形状包介绍
  - 类型：string

- 返回值
  - 说明：无

### 获取形状包名
`SHP.getPackageName()`

- 返回值
  - 说明：获取形状包名，用于注册
  - 类型：string

### 获取玩家数据
`SHP.getData(player)`

- 参数 **player**
  - 说明：玩家对象
  - 类型：Player
- 返回值
  - 说明：返回一个对象，包括
    - posA
      - 说明：玩家的选区a点，若无选区则为null
      - 类型：IntPos        
    - posB
      - 说明：玩家的选区b点，若无选区则为null
      - 类型：IntPos 
    - itemAIndex
      - 说明：[替换方块A序号](user/function/setting?id=barreplace-%e6%9b%bf%e6%8d%a2%e6%96%b9%e5%9d%97a%e5%ba%8f%e5%8f%b7)
      - 类型：Int  
    - itemBIndex
      - 说明：[替换方块B序号](user/function/setting?id=barreplaced-%e6%9b%bf%e6%8d%a2%e6%96%b9%e5%9d%97b%e5%ba%8f%e5%8f%b7)
      - 类型：Int 
    - itemA
      - 说明：替换方块A，从填充方块A序号得到的物品对象。可能为空对象，需要用isNull判断
      - 类型：Item  
    - itemB
      - 说明：替换方块B，从填充方块A序号得到的物品对象。可能为空对象，需要用isNull判断
      - 类型：Item  
  - 类型：object
    ```
    {
        posA,
        posB,
        itemAIdex,
        itemBIdex,
        itemA,
        itemB
    }
    ```

### 发送消息
`SHP.Message.info(player, str, mode = 0)`

以特定格式发送一个消息

- 参数 **player**
  - 说明：玩家对象
  - 类型：Player

- 参数 **str**
  - 说明：发送的字符串
  - 类型：string

- 参数 **mode**
  - 说明：发送的文本消息类型
    详见ll文档 [player.sendText命令](https://docs.litebds.com/zh-Hans/#/LLSEPluginDevelopment/GameAPI/Player?id=%e5%8f%91%e9%80%81%e4%b8%80%e4%b8%aa%e6%96%87%e6%9c%ac%e6%b6%88%e6%81%af%e7%bb%99%e7%8e%a9%e5%ae%b6)
  - 默认值：0
  - 类型：int

- 返回值 
  - 说明：无  

`SHP.Message.success(player, str, mode = 0)`

以特定格式发送一个指令成功消息

- 参数 **player**
  - 说明：玩家对象
  - 类型：Player

- 参数 **str**
  - 说明：发送的字符串
  - 类型：string

- 参数 **mode**
  - 说明：发送的文本消息类型
    详见ll文档 [player.sendText命令](https://docs.litebds.com/zh-Hans/#/LLSEPluginDevelopment/GameAPI/Player?id=%e5%8f%91%e9%80%81%e4%b8%80%e4%b8%aa%e6%96%87%e6%9c%ac%e6%b6%88%e6%81%af%e7%bb%99%e7%8e%a9%e5%ae%b6)
  - 类型：int

- 返回值 
  - 说明：无

`SHP.Message.warn(player, str, mode = 0)`

以特定格式发送一个警告

- 参数 **player**
  - 说明：玩家对象
  - 类型：Player

- 参数 **str**
  - 说明：发送的字符串
  - 类型：string

- 参数 **mode**
  - 说明：发送的文本消息类型
    详见ll文档 [player.sendText命令](https://docs.litebds.com/zh-Hans/#/LLSEPluginDevelopment/GameAPI/Player?id=%e5%8f%91%e9%80%81%e4%b8%80%e4%b8%aa%e6%96%87%e6%9c%ac%e6%b6%88%e6%81%af%e7%bb%99%e7%8e%a9%e5%ae%b6)
  - 类型：int

- 返回值 
  - 说明：无

`SHP.Message.error(player, str, mode = 0)`

以特定格式发送一个错误消息

- 参数 **player**
  - 说明：玩家对象
  - 类型：Player

- 参数 **str**
  - 说明：发送的字符串
  - 类型：string

- 参数 **mode**
  - 说明：发送的文本消息类型
    详见ll文档 [player.sendText命令](https://docs.litebds.com/zh-Hans/#/LLSEPluginDevelopment/GameAPI/Player?id=%e5%8f%91%e9%80%81%e4%b8%80%e4%b8%aa%e6%96%87%e6%9c%ac%e6%b6%88%e6%81%af%e7%bb%99%e7%8e%a9%e5%ae%b6)
  - 类型：int

- 返回值 
  - 说明：无


### 设置方块

`SHP.setBlock(x, y, z, block_palette, block_position_data = null)`

- 参数 **x**
  - 说明：方块相对坐标x分量
  - 类型：int

- 参数 **y**
  - 说明：方块相对坐标y分量
  - 类型：int

- 参数 **z**
  - 说明：方块相对坐标z分量
  - 类型：int

❗ ❗ ❗ 注意：x, y, z是相对于形状生成点的坐标。例如生成点为[20, 30, 40]，x=0,y=0,z=0 时方块会生成到 [20, 30, 40]

- 参数 **block_palette**
  - 说明：方块的SNBT值，默认为白色混凝土
  - 默认值：'{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}'
  - 类型：string

- 参数 **block_position_data**
  - 说明：方块实体的SNBT值，设置容器或其他可交互方块时需要填写
  - 类型：string

- 返回值
  - 说明：一个存放方块数据的对象，并非方块对象，用于构造[export_cmd](#生成形状)的返回值对象
  - 类型：object
    ```
    {
        x, y, z, 
        block_palete, 
        block_position_data
    }
    ```

### THREE
`SHP.THREE`

[three.js库](https://github.com/mrdoob/three.js)的THREE对象

!> CALL中只引入了极小一部分three.js代码，功能并不完全，`plugins/CALL/lib/three.js/src/Three.js` 中查看引入的类。如有需求，建议您在自己的形状包文件夹中引入更全的three.js

### 获取三维向量
`SHP.getVector3(x, y, z)`

基于three.js

- 参数 **x**
  - 说明：x值
  - 类型：number

- 参数 **y**
  - 说明：y值
  - 类型：number

- 参数 **z**
  - 说明：z值
  - 类型：number

- 返回值
  - 说明：three.js的Vecter3对象
  - 类型：Vector3


### 获取四维向量
`SHP.getVector4(x, y, z, w)`

基于three.js

- 参数 **x**
  - 说明：x值
  - 类型：number

- 参数 **y**
  - 说明：y值
  - 类型：number

- 参数 **z**
  - 说明：z值
  - 类型：number

- 参数 **w**
  - 说明：w值
  - 类型：number

- 返回值
  - 说明：three.js的Vecter4对象
  - 类型：Vector4

### 获取四维单位矩阵
`SHP.getMAT4()`

基于three.js

- 返回值
  - 说明：three.js的Matrix4对象
  - 类型：Matrix4

### 获取四维旋转矩阵
`SHP.getRoteMAT4(x, y, z, order)`

基于three.js

- 参数 **x**
  - 说明：x旋转角度（非弧度）
  - 类型：number

- 参数 **y**
  - 说明：y旋转角度（非弧度）
  - 类型：number

- 参数 **z**
  - 说明：z旋转角度（非弧度）
  - 类型：number

- 参数 **order**
  - 说明：旋转顺序 XYZ的六种组合，例："XYZ"
  - 类型：string

- 返回值
  - 说明：three.js的Matrix4对象
  - 类型：Matrix4

### 获取四维缩放矩阵
`SHP.getScaleMAT4(x, y, z)`

基于three.js

- 参数 **x**
  - 说明：x缩放值
  - 类型：number

- 参数 **y**
  - 说明：y缩放值
  - 类型：number

- 参数 **z**
  - 说明：z缩放值
  - 类型：number

- 返回值
  - 说明：three.js的Matrix4对象
  - 类型：Matrix4

### 获取四维平移矩阵
`SHP.getTranslationMAT4(x, y, z)`

基于three.js

- 参数 **x**
  - 说明：x平移值
  - 类型：number

- 参数 **y**
  - 说明：y平移值
  - 类型：number

- 参数 **z**
  - 说明：z平移值
  - 类型：number

- 返回值
  - 说明：three.js的Matrix4对象
  - 类型：Matrix4

### 获取四维剪切矩阵
`SHP.getTranslationMAT4(xy, xz, yx, yz, zx, zy)`

基于three.js

- 参数 **xy**
  - 说明：xy方向剪切值
  - 类型：number

- 参数 **xz**
  - 说明：xz方向剪切值
  - 类型：number

- 参数 **yx**
  - 说明：yx方向剪切值
  - 类型：number

- 参数 **yz**
  - 说明：yz方向剪切值
  - 类型：number

- 参数 **zx**
  - 说明：zx方向剪切值
  - 类型：number

- 参数 **zy**
  - 说明：zy方向剪切值
  - 类型：number

- 返回值
  - 说明：three.js的Matrix4对象
  - 类型：Matrix4

### 获取四维镜像矩阵
`SHP.getMirrorMAT4(x, y, z)`

以某个平面进行对称

- 参数 **x**
  - 说明：平面法向量x值
  - 类型：number

- 参数 **y**
  - 说明：平面法向量y值
  - 类型：number

- 参数 **z**
  - 说明：平面法向量z值
  - 类型：number

- 返回值
  - 说明：three.js的Matrix4对象
  - 类型：Matrix4


### 简单变换
`SHP.transform(shape, m4)`

一个简单的对所有坐标的变换，不能保证精度。建议先用模型的变换方法对模型变换后再求坐标。

- 参数 **shape**
  - 说明：[export_cmd](#生成形状)中定义的作为返回值的形状对象
  - 类型：object
    ```
    {
        pos,
        arr
    }
    ```


- 参数 **m4**
  - 说明：四维矩阵
  - 类型：Matrix4

- 返回值 无