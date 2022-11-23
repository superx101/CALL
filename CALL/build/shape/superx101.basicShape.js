ll.registerPlugin("call-" + "superx101.basicShape".replaceAll(".", "-"), "CALL's shape package", [1,0,0], {});
const SHP = {
    _registerPackage: ll.import("call_shape_api", "registerPackage"),
    _getData: ll.import("call_shape_api", "getData"),
    THREE: {
        BufferGeometry: require("./CALL/lib/three.js/src/core/BufferGeometry.js").BufferGeometry,
        BoxGeometry: require("./CALL/lib/three.js/src/geometries/BoxGeometry").BoxGeometry,
        Interpolant: require('./CALL/lib/three.js/src/math/Interpolant.js').Interpolant,
        Triangle: require('./CALL/lib/three.js/src/math/Triangle.js').Triangle,
        MathUtils: require('./CALL/lib/three.js/src/math/MathUtils.js'),
        Spherical: require('./CALL/lib/three.js/src/math/Spherical.js').Spherical,
        Cylindrical: require('./CALL/lib/three.js/src/math/Cylindrical.js').Cylindrical,
        Plane: require('./CALL/lib/three.js/src/math/Plane.js').Plane,
        Frustum: require('./CALL/lib/three.js/src/math/Frustum.js').Frustum,
        Sphere: require('./CALL/lib/three.js/src/math/Sphere.js').Sphere,
        Ray: require('./CALL/lib/three.js/src/math/Ray.js').Ray,
        Matrix4: require('./CALL/lib/three.js/src/math/Matrix4.js').Matrix4,
        Matrix3: require('./CALL/lib/three.js/src/math/Matrix3.js').Matrix3,
        Box3: require('./CALL/lib/three.js/src/math/Box3.js').Box3,
        Box2: require('./CALL/lib/three.js/src/math/Box2.js').Box2,
        Line3: require('./CALL/lib/three.js/src/math/Line3.js').Line3,
        Euler: require('./CALL/lib/three.js/src/math/Euler.js').Euler,
        Vector4: require('./CALL/lib/three.js/src/math/Vector4.js').Vector4,
        Vector3: require('./CALL/lib/three.js/src/math/Vector3.js').Vector3,
        Vector2: require('./CALL/lib/three.js/src/math/Vector2.js').Vector2,
    },
    getData: function (player) {
        let res = this._getData(player.xuid);
        if (res == null) return null;
        let comp = player.getInventory();
        let itemA = comp.getItem(res.itemAIndex);
        let itemB = comp.getItem(res.itemBIndex);
        let posA = (res.posA.dimid == null ? null : mc.newIntPos(res.posA.x, res.posA.y, res.posA.z, res.posA.dimid));
        let posB = (res.posB.dimid == null ? null : mc.newIntPos(res.posB.x, res.posB.y, res.posB.z, res.posB.dimid));
        return {
            posA,
            posB,
            itemAIndex: res.itemAIndex,
            itemBIndex: res.itemBIndex,
            itemA,
            itemB
        }
    },
    registerPackage: function (name, shapeNames, introduction) {
        this._registerPackage("superx101.basicShape", name, shapeNames, introduction);
    },
    Message: {
        warn: function (player, str, mode = 0) {
            player.sendText(Format.Gold + `[${"superx101.basicShape"}][警告] ` + str, mode);
        },
        error: function (player, str, mode = 0) {
            player.sendText(Format.Red + `[${"superx101.basicShape"}][错误] ` + str, mode);
        },
        info: function (player, str, mode = 0) {
            player.sendText(Format.White + `[${"superx101.basicShape"}] ` + str, mode);
        },
        success: function (player, str, mode = 0) {
            player.sendText(Format.Gold + `[${"superx101.basicShape"}] ` + str, mode);
        }
    },
    setBlock: function (x, y, z, block_palette = '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}', block_position_data = null) {
        return { x, y, z, block_palette, block_position_data };
    },
    getPackageName: function () {
        return "superx101.basicShape";
    },
    getVector3: function (x, y, z) {
        return new this.THREE.Vector3(x, y, z);
    },
    getVector4: function (x, y, z, w) {
        return new this.THREE.Vector4(x, y, z, w);
    },
    getMAT4: function () {
        return new this.THREE.Matrix4();
    },
    getRoteMAT4: function (x, y, z, order) {
        return this.getMAT4().makeRotationFromEuler(new this.THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, z * Math.PI / 180, order));
    },
    getScaleMAT4: function (x, y, z) {
        return this.getMAT4().makeScale(x, y, z);
    },
    getTranslationMAT4: function (x, y, z) {
        return this.getMAT4().makeTranslation(x, y, z);
    },
    getShearMAT4: function (xy, xz, yx, yz, zx, zy) {
        return this.getMAT4().makeShear(xy, xz, yx, yz, zx, zy);
    },
    getMirrorMAT4: function (x, y, z) {
        return this.getMAT4().set(
            1 - 2 * x * x, -2 * x * y, -2 * x * z, 0,
            -2 * x * y, 1 - 2 * y, -2 * y * z, 0,
            -2 * x * z, -2 * y * z, 1 - 2 * z, 0,
            0, 0, 0, 1
        );
    },
    transform: function (shape, m4) {
        shape.arr.forEach(v => {
            let vec = Vector4(v[0], v[1], v[2], 1).applyMatrix4(m4);
            v[0] = vec.x;
            v[1] = vec.y;
            v[2] = vec.z;
        });
    }
}
Object.keys(SHP).forEach(key => { Object.freeze(SHP[key]); });
SHP.registerPackage("基础形状", ["自由立方体", "自由平面", "两点生成直线"], "CALL自带的一个简单形状包");

//检查数字参数
function checkNumber(p, negative = true) {
    if (p == null || typeof (p) != "number") throw new Error(`参数 ${p} 不合法, 请输入数字`);
    else if (p < 0 && !negative) throw new Error(`参数 ${p} 不能为负数`)
}

//检查向量参数
function checkVec3(v3, negative = true) {
    if (v3 != null) {
        checkNumber(v3.x, negative);
        checkNumber(v3.y, negative);
        checkNumber(v3.z, negative);
    }
    else {
        throw new Error(`向量${v3}不能为空`);
    }
}

//从item获取方块SNBT
function getBlockSNbt(item, player) {
    try {
        return item.getNbt().getTag("Block").toString();
    }
    catch (e) {
        SHP.Message.warn(player, "未检测到物品栏方块, 使用默认材质");
    }
    return '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}';
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
    checkVec3(param, false);
    checkNumber(param.xrote, false);
    checkNumber(param.yrote, false);
    checkNumber(param.zrote, false);

    let blockSNBT = getBlockSNbt(itemA, player);
    let cube = new SHP.THREE.BoxGeometry(param.x, param.y, param.z, 1, 1, 1);
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);//旋转变换矩阵
    return simpleCubeVoxelization(cube, m4, blockSNBT);
}

//生成平面
function plane(param, player, itemA) {
    checkVec3(param.v);
    checkNumber(param.x, false);
    checkNumber(param.z, false);

    let blockSNBT = getBlockSNbt(itemA, player);
    let cube = new SHP.THREE.BoxGeometry(param.x, 1, param.z, 1, 1, 1);
    let va = SHP.getVector3(0, 1, 0);
    let vb = SHP.getVector3(param.v.x, param.v.y, param.v.z);
    let angle = va.angleTo(vb);//向量之间的角度
    va.cross(vb);//叉积(求垂直两个向量的向量)

    let m4 = SHP.getMAT4().makeRotationAxis(va.normalize(), angle);
    return simpleCubeVoxelization(cube, m4, blockSNBT);
}

//生成直线
function line(param, intPos, player, itemA) {
    checkVec3(param);

    let shape = {};
    let blockSNBT = getBlockSNbt(itemA, player);

    let va = SHP.getVector3(0, 0, 1);
    let v = SHP.getVector3(param.x, param.y, param.z)
    v.sub(SHP.getVector3(intPos.x, intPos.y, intPos.z));
    let cube = new SHP.THREE.BoxGeometry(1, 1, v.length() + 1, 1, 1, 1);
    let angle = va.angleTo(v);

    let m4 = SHP.getMAT4().makeRotationAxis(va.normalize(), angle);
    shape.arr = simpleCubeVoxelization(cube, m4, blockSNBT);
    shape.pos = mc.newIntPos(Math.round((param.x + intPos.x) / 2), Math.round((param.y + intPos.y) / 2), Math.round((param.z + intPos.z) / 2), intPos.dimid);
    return shape;
}

function export_cmd(player, index, intPos, param) {
    try {
        let plData = SHP.getData(player);
        let shape = { pos: null, arr: null };
        switch (index) {
            case 0:
                shape.arr = cube(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 1:
                shape.arr = plane(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 2:
                shape = line(param, intPos, player, plData.itemA);
                break;
        }
        return shape;
    } catch (e) {
        SHP.Message.error(player, e.message);
    }
}

//立方体参数表单
function cube_form(player, index, intPos, plData) {
    let orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    let form = mc.newCustomForm()
        .setTitle("立方体参数")
        .addLabel(`材质: 从${plData.itemAIndex + 1}号物品栏选择\n:${itemStr}`)
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

//平面参数表单
function plane_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    let form = mc.newCustomForm()
        .setTitle("平面参数")
        .addLabel(`材质: 从${plData.itemAIndex + 1}号物品栏选择\n:${itemStr}`)
        .addInput("平面法向量(垂直平面的向量)\n  法向量默认向上", "输入三维向量(空格分割)", "0 1 0")
        .addInput("输入尺寸 x z", "输入两个数(空格分割)")
        .addInput("输入生成位置\n默认为当前坐标", "输入三个正数(空格隔开)", `${intPos.x} ${intPos.y} ${intPos.z}`)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            strs = data[1].split(" ");
            json.v = {};
            json.v.x = parseInt(strs[0]);
            json.v.y = parseInt(strs[1]);
            json.v.z = parseInt(strs[2]);

            strs = data[2].split(" ");
            json.x = parseInt(strs[0]);
            json.z = parseInt(strs[1]);

            strs = data[3].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    });
}

//直线参数表单
function line_form(player, index, intPos, plData) {
    let posAStr = plData.posA == null ? "" : `${plData.posA.x} ${plData.posA.y} ${plData.posA.z}`;
    let posBStr = plData.posB == null ? "" : `${plData.posB.x} ${plData.posB.y} ${plData.posB.z}`;
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    let form = mc.newCustomForm()
        .setTitle("直线参数")
        .addLabel(`材质: 从${plData.itemAIndex + 1}号物品栏选择\n:${itemStr}`)
        .addInput(`输入点1 默认为您选区的点A坐标`, "输入三个正数(空格隔开)", posAStr)
        .addInput(`输入点2 默认为您选区的点B坐标`, "输入三个正数(空格隔开)", posBStr)

    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;

            strs = data[1].split(" ");
            json.x = parseInt(strs[0]);
            json.y = parseInt(strs[1]);
            json.z = parseInt(strs[2]);

            strs = data[2].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);

            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    });
}

function export_form(player, index, intPos) {
    let plData = SHP.getData(player);
    switch (index) {
        case 0:
            cube_form(player, index, intPos, plData);
            break;
        case 1:
            plane_form(player, index, intPos, plData);
            break;
        case 2:
            line_form(player, index, intPos, plData);
            break;
    }
}

function export_tutorial() {
    return {
        基础概念介绍: "[自由变换]\n  本形状包中的“自由变换”为任意角度的旋转\n[生成位置]\n  默认的生成位置为您脚下\n您也可自定义生成位置\n  形状包将以您指定的位置为中心生成形状",
        立方体: "生成立方体\n可自由变换角度",
        平面: "生成平面\n可定义平面的法向量\n(即定义平面的朝向)",
        直线: "根据您选区中的两点生成一条直线\n或自定义两点来生成直线"
    }
}
try {
    ll.export(export_cmd, "call_shape_plugin", "superx101.basicShape" + "_cmd");
    ll.export(export_form, "call_shape_plugin", "superx101.basicShape" + "_form");
    ll.export(export_tutorial, "call_shape_plugin", "superx101.basicShape" + "_tutorail");
}
catch (e) {
    if (/'export_cmd'/.test(e.message)) {
        throw new Error("CALL形状包 " + "superx101.basicShape" + ": 未定义函数export_cmd");
    }
    else if (/'export_form'/.test(e.message)) {
        throw new Error("CALL形状包 " + "superx101.basicShape" + ": 未定义函数export_form");
    }
    else if (/'export_tutorial'/.test(e.message)) {
        throw new Error("CALL形状包 " + "superx101.basicShape" + ": 未定义函数export_tutorial");
    }
    else {
        throw new Error(e);
    }
}
