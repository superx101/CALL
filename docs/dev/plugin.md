# 开发须知
## 形状包开发
不同于固定的结构（例如结构方块保存的结构），CALL中将形状定义为**动态生成**的结构，一般由玩家输入参数后由特定算法生成形状。  

### 须知
- **源文件**  
&emsp;&emsp;形状包可由一个或多个文件构成，但必须包含一个js文件，这个js文件定义了形状包路径、形状包名、形状名数组、版本号。

- **位置**  
&emsp;&emsp;所有形状包需**放置到** `plugins/CALL/plugins/shape` 目录下，CALL会自动读取shape目录下的所有js文件并进行一些加工，在 `plugins/CALL/build/shape` 目录下生成加工后的js并加载。因此，**实际执行的文件在 build 目录下**。

    ❗ ❗ ❗ 注意1：插件被 ll 加载后的**根路径**为 `服务器目录`，引入第三方库时需**注意区分**

    ❗ ❗ ❗ 注意2：`plugins/build/shape` 目录下的文件由程序自动构建，每次重启插件后将会**删除重构**。**请勿**将修改的代码写到 `plugins/build/shape/形状包名.js` 文件中，否则修改无效。

- **封装与加工**  
&emsp;&emsp;形状包返回数据的方式是通过ll.export()将特定函数返回给CALL调用，为了简化和命名空间冲突的问题，CALL封装了export和import的代码，因此您在您的js文件中**无需写任何的export和import**。  
&emsp;&emsp;根据您插件的版本号，程序自动选择版本号最高的js文件并为该文件添加import和export代码，处理后的文件将放置于 `CALL/build` 目录下

- **第三方库引入**  
&emsp;&emsp;若要引入第三方库，您需要在 shape 目录下创建一个：与js文件同名的文件夹，将库文件放入其中（*此方式是为了防止文件重名的情况，非必须*）
```
└─┬─CALL
    └─┬─plugins
      └─┬─shape
        ├───superx101.myShape_1.0.0.js
        └─┬─superx101.myShape_1.0.0
          └───lib
```

- **其他语言**  
&emsp;&emsp;若您需要使用其他语言开发，可在js文件中使用ll.export与ll.import与另一语言插件交互

### 命名规范
为防止多个形状包文件名冲突，所有形状包文件必须遵守相同的命名规范
#### js文件

命名：`形状包名_版本号.js`

&emsp;*解释*：  
&emsp;`形状包名`：格式->`call.作者名.包名`  
&emsp;&emsp;作者名和包名 由 英文、数字 组成     
&emsp;&emsp;作者名建议为github用户名或其他不会冲突的名称    

&emsp;&emsp;例：`call.superx101.myShape`

&emsp;`版本号`：由三个整数组成，整数间用 "." 分隔

&emsp;&emsp;例：`1.0.0`

完整的js文件命名示例：`call.super101.myShape_1.0.0.js`

### 调试
#### 输出
CALL默认不会输出异常，您需要在配置文件中设置 [debugMod](user/config?id=debugmod-%e6%98%af%e5%90%a6%e5%90%af%e7%94%a8%e8%b0%83%e8%af%95%e6%a8%a1%e5%bc%8f) 为 true 开启异常输出

#### 重载
若只重载形状包插件而不重载CALL则会造成重复注册，CALL为您提供一个较为简单的重载方式，您只需在后台使用 [`ca r`](user/function/console?id=%e9%87%8d%e5%90%af%e6%8f%92%e4%bb%b6-reload) 命令或 直接重载CALL插件。CALL插件重载后会自动重载，`plugins/CALL/plugins/shape`目录下的所有插件

### 代码规范
一个合法的形状包js文件中至少包括如下内容
```javascript
//注册形状包
SHP.registerPackage("形状包中文名称", ["形状名称"], "简介");

//导出函数--根据指令中的参数生成形状
SHP.export_cmd((player, index, intPos, param)=>{
    return {pos: [0, 0, 0], arr: []}
})

//导出函数--参数表单
SHP.export_form((player, index, intPos)=>{

})

//导出函数--帮助文本
SHP.export_tutorial(()=>{
    return {
        名称: "详细说明"
    }
});
```
代码中的的函数用于导出。函数详细功能请见 [形状包API](dev/shape.md)

### 开发思路
?> 形状包生成本质是将一个结构NBT对象放置到指定位置。为了简化开发，CALL封装了构造NBT对象的部分，因此您只需要传入一些列的方块坐标和材质即可，不必关心如何构造一个NBT对象。

您只需要考虑用算法求出形状中的每个方块坐标
1. 直接编写算法求点
2. 通过将模型体素化(像素化)的方法，此方法需要一定的数学知识，但可以实现更多操作。CALL建议您使用这种方法

    参考资料  
    <https://github.com/mrdoob/three.js>  
    <http://www.euclideanspace.com/maths/geometry/transform/index.htm>  
    <https://zhuanlan.zhihu.com/p/485191975>   
    <https://blog.csdn.net/zkl99999/article/details/44627911>

### 示例
该示例为 `plugins/CALL/plugins/shape/call.superx101.basicShape_2.0.0.js` 中的部分代码，用体素的方法生成了一个可自由旋转的立方体
```javascript
//立方体参数表单
function cube_form(player, index, intPos, plData) {
    let orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];
    let form = mc.newCustomForm()
        .setTitle("立方体参数")
        .addInput("输入三维边长\n  x y z", "输入三个正数(空格隔开)")
        .addInput("输入生成位置\n  默认为当前坐标", "输入三个正数(空格隔开)", `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addStepSlider("绕轴旋转顺序(欧拉角)\n  注: 本选项的轴指物体的轴\n  并非世界绝对坐标轴\n", orderArr)
        .addSlider("绕x轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕y轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕z轴旋转角度", 0, 360, 1, 0)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            //边长
            strs = data[1].split(" ");
            json.x = parseInt(strs[0]);
            json.y = parseInt(strs[1]);
            json.z = parseInt(strs[2]);

            //生成点
            strs = data[2].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            json.order = orderArr[data[3]];//绕轴旋转顺序
            //旋转值
            json.xrote = parseFloat(data[4]);
            json.yrote = parseFloat(data[5]);
            json.zrote = parseFloat(data[6]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    })
}

//简单的立方体体素化算法
function simpleCubeVoxelization(cube, m4, SNBT) {
    const arr = [];

    //变换前包围盒
    cube.center();
    cube.computeBoundingBox();
    let pre_box = cube.boundingBox.clone();

    //逆矩阵
    let m4_i = m4.clone().invert();

    //包围盒
    cube.applyMatrix4(m4);
    cube.computeBoundingBox();
    let box = cube.boundingBox;

    //遍历包围盒求体素
    for (let x = box.min.x + 0.5; x < box.max.x; x++) {
        for (let y = box.min.y + 0.5; y < box.max.y; y++) {
            for (let z = box.min.z + 0.5; z < box.max.z; z++) {
                //方体变换后求点是否在内部 == 点反向变换后求是否在方体内部
                const v4 = SHP.getVector4(x, y, z, 1).applyMatrix4(m4_i);
                if (pre_box.containsPoint(v4)) {
                    arr.push(SHP.setBlock(Math.round(x), Math.round(y), Math.round(z), SNBT, null));
                }
            }
        }
    }
    return arr;
}

//生成立方体
function cube(param, player, itemA) {
    //省略参数检查

    let blockSNBT = '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}';
    let cube = new SHP.THREE.BoxGeometry(param.x, param.y, param.z, 1, 1, 1);
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);//旋转变换矩阵
    return simpleCubeVoxelization(cube, m4, blockSNBT);
}

function form(player, index, intPos) {
    let plData = SHP.getData(player);
    switch (index) {
        case 0:
            cube_form(player, index, intPos, plData);
            break;
        //省略其他
    }
}

function cmd(player, index, intPos, param) {
    try {
        let plData = SHP.getData(player);
        let shape = { pos: null, arr: null };
        switch (index) {
            case 0:
                shape.arr = cube(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            //省略其他
        }
        return shape;
    } catch (e) {
        SHP.Message.error(player, e.message);
    }
}

function tutorial() {
    return {
        基础概念介绍: "[自由变换]\n  本形状包中的“自由变换”为任意角度的旋转\n[生成位置]\n  默认的生成位置为您脚下\n您也可自定义生成位置\n  形状包将以您指定的位置为中心生成形状",
        立方体: "生成立方体\n可自由变换角度",
    }
}

SHP.registerPackage("基础形状", ["自由立方体"], "CALL自带的一个简单形状包", [], "textures/ui/switch_face_button_down.png");
SHP.export_cmd(cmd);
SHP.export_form(form);
SHP.export_tutorial(tutorial);
```