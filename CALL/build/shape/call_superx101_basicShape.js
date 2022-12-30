ll.registerPlugin("call.superx101.basicShape".replaceAll(".", "_"), "CALL's shape package", [1,0,0], {});
const SHP = {
    _registerPackage: ll.import("call_shape_api", "registerPackage"),
    _getData: ll.import("call_shape_api", "getData"),
    _state: {
        register: false,
        cmd: false,
        form: false,
        tutorial: false
    },
    THREE: require("./nodejs/CALL/third-party/three.js/src/Three.js"),
    export_cmd: function (f) {
        if (!this._state.cmd && typeof f == 'function') {
            this._state.cmd = true;
            return ll.export(f, "call_shape_plugin", "call.superx101.basicShape" + "_cmd");
        } else {
            throw new Error("请勿重复调用: export_cmd");
        }
    },
    export_form: function (f) {
        if (!this._state.form && typeof f == 'function') {
            this._state.form = true;
            return ll.export(f, "call_shape_plugin", "call.superx101.basicShape" + "_form");
        } else {
            throw new Error("请勿重复调用: export_form");
        }
    },
    export_tutorial: function (f) {
        if (!this._state.tutorial && typeof f == 'function') {
            this._state.tutorial = true;
            return ll.export(f, "call_shape_plugin", "call.superx101.basicShape" + "_tutorail");
        } else {
            throw new Error("请勿重复调用: export_tutorial");
        }
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
    registerPackage: function (name, shapeNames, introduction, shapeImages, icon) {
        if (!this._state.register) {
            this._state.register = true;
            this._registerPackage("call.superx101.basicShape", name, shapeNames, introduction, shapeImages, icon);
        } else {
            throw new Error("请勿重复调用: registerPackage");
        }
    },
    Message: {
        warn: function (player, str, mode = 0) {
            player.sendText(Format.Gold + `[${"call.superx101.basicShape"}][警告] ` + str, mode);
        },
        error: function (player, str, mode = 0) {
            player.sendText(Format.Red + `[${"call.superx101.basicShape"}][错误] ` + str, mode);
        },
        info: function (player, str, mode = 0) {
            player.sendText(Format.White + `[${"call.superx101.basicShape"}] ` + str, mode);
        },
        success: function (player, str, mode = 0) {
            player.sendText(Format.Gold + `[${"call.superx101.basicShape"}] ` + str, mode);
        }
    },
    setBlock: function (x, y, z, block_palette = '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}', block_position_data = null) {
        return { x, y, z, block_palette, block_position_data };
    },
    getPackageName: function () {
        return "call.superx101.basicShape";
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
Object.keys(SHP).forEach(key => {if(key !== '_state') Object.freeze(SHP[key]); });
SHP.registerPackage("基础形状", ["§l自由§2立方体", "§l自由§2平面", "§l两点生成§2直线", "§l§9球体", "§l自由§9椭球体", "§l自由§9圆柱体", "§l自由§9圆锥"], "CALL自带的一个简单形状包", [], "textures/ui/switch_face_button_down.png");
SHP.export_cmd(cmd);
SHP.export_form(form);
SHP.export_tutorial(tutorial);
class Box {
    constructor(min = new SHP.THREE.Vector3(+ Infinity, + Infinity, + Infinity), max = new SHP.THREE.Vector3(- Infinity, - Infinity, - Infinity)) {
        this.min = min;
        this.max = max;
    }
    set(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }
    copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }
    clone() {
        return new this.constructor().copy(this);
    }
    setFromVector3(array) {
        let minX = + Infinity;
        let minY = + Infinity;
        let minZ = + Infinity;
        let maxX = - Infinity;
        let maxY = - Infinity;
        let maxZ = - Infinity;
        for (let i = 0, l = array.length; i < l; i++) {
            const x = Math.round(array[i].x);
            const y = Math.round(array[i].y);
            const z = Math.round(array[i].z);
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;
        }
        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);
        return this;
    }
}
class Cube {
    constructor(box) {
        this.arr = [];
        this.boundingBox = box.clone();
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.min.y, box.min.z)) 
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.min.y, box.min.z)) 
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.max.y, box.min.z)) 
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.max.y, box.min.z)) 
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.min.y, box.max.z)) 
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.min.y, box.max.z)) 
        this.arr.push(new SHP.THREE.Vector3(box.min.x, box.max.y, box.max.z)) 
        this.arr.push(new SHP.THREE.Vector3(box.max.x, box.max.y, box.max.z)) 
    }
    applyMatrix4(m4) {
        this.arr.forEach(v3 => {
            v3.applyMatrix4(m4);
        })
        return this;
    }
    getBoundingBox() {
        return this.boundingBox.setFromVector3(this.arr);
    }
}
class Geometry {
    constructor() {
        this.boundingBox = null;
    }
    computeBoundingBox() { }
    isPointInsideGeometry() { }
    isPointOnSurface() { }
    transformedBoundingBox(m4) {
        this.boundingBox = new Cube(this.boundingBox)
            .applyMatrix4(m4)
            .getBoundingBox();
        return this;
    }
}
function common_checkNumber(p, negative = true) {
    if (p == null || typeof (p) != "number") throw new Error(`参数 ${p} 不合法, 请输入数字`);
    else if (p < 0 && !negative) throw new Error(`参数 ${p} 不能为负数`)
}
function common_checkVec3(v3, negative = true) {
    if (v3 != null) {
        common_checkNumber(v3.x, negative);
        common_checkNumber(v3.y, negative);
        common_checkNumber(v3.z, negative);
    }
    else {
        throw new Error(`向量${v3}不能为空`);
    }
}
function common_getBlockSNBT(item, player) {
    try {
        return item.getNbt().getTag("Block").toString();
    }
    catch (e) {
        SHP.Message.warn(player, "未检测到物品栏方块, 使用默认材质");
    }
    return '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}';
}
function common_checkSNBT(snbt) {
    if (snbt == null) throw new Error("材质为空, 请输入材质")
}
function common_boxForeach(box, isOddX, isOddY, isOddZ, snbt, callback) {
    const arr = [];
    const nx = isOddX ? 0 : 0.5;
    const ny = isOddY ? 0 : 0.5;
    const nz = isOddZ ? 0 : 0.5;
    for (let x = box.min.x + nx; x <= box.max.x + nx; x++) {
        for (let y = box.min.y + ny; y <= box.max.y + ny; y++) {
            for (let z = box.min.z + nz; z <= box.max.z + nz; z++) {
                if (callback(x, y, z)) {
                    arr.push(SHP.setBlock(x - nx, y - ny, z - nz, snbt, null));
                }
            }
        }
    }
    if (arr.length == 0)
        arr.push(SHP.setBlock(0, 0, 0, snbt, null));
    return arr;
}
function cube_simpleCubeVoxelization(cube, m4, SNBT) {
    const arr = [];
    cube.center();
    cube.computeBoundingBox();
    let pre_box = cube.boundingBox.clone();
    let m4_i = m4.clone().invert();
    cube.applyMatrix4(m4);
    cube.computeBoundingBox();
    let box = cube.boundingBox;
    for (let x = box.min.x + 0.5; x < box.max.x; x++) {
        for (let y = box.min.y + 0.5; y < box.max.y; y++) {
            for (let z = box.min.z + 0.5; z < box.max.z; z++) {
                const v4 = SHP.getVector4(x, y, z, 1).applyMatrix4(m4_i);
                if (pre_box.containsPoint(v4)) {
                    arr.push(SHP.setBlock(Math.round(x), Math.round(y), Math.round(z), SNBT, null));
                }
            }
        }
    }
    return arr;
}
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
            json.snbt = common_getBlockSNBT(plData.itemA, player);
            strs = data[1].split(" ");
            json.x = parseInt(strs[0]);
            json.y = parseInt(strs[1]);
            json.z = parseInt(strs[2]);
            strs = data[2].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);
            json.order = orderArr[data[3]];
            json.xrote = parseFloat(data[4]);
            json.yrote = parseFloat(data[5]);
            json.zrote = parseFloat(data[6]);
            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    })
}
function cube_generate(param, player, itemA) {
    common_checkVec3(param, false);
    common_checkNumber(param.xrote, false);
    common_checkNumber(param.yrote, false);
    common_checkNumber(param.zrote, false);
    common_checkSNBT(param.snbt);
    let cube = new SHP.THREE.BoxGeometry(param.x, param.y, param.z, 1, 1, 1);
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);
    return cube_simpleCubeVoxelization(cube, m4, param.snbt);
}
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
            json.snbt = common_getBlockSNBT(plData.itemA, player);
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
function plane_generate(param, player, itemA) {
    common_checkVec3(param.v);
    common_checkNumber(param.x, false);
    common_checkNumber(param.z, false);
    common_checkSNBT(param.snbt);
    let cube = new SHP.THREE.BoxGeometry(param.x, 1, param.z, 1, 1, 1);
    let va = SHP.getVector3(0, 1, 0);
    let vb = SHP.getVector3(param.v.x, param.v.y, param.v.z);
    let angle = va.angleTo(vb);
    va.cross(vb);
    let m4 = SHP.getMAT4().makeRotationAxis(va.normalize(), angle);
    return cube_simpleCubeVoxelization(cube, m4, param.snbt);
}
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
            json.snbt = common_getBlockSNBT(plData.itemA, player);
            strs = data[2].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);
            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    });
}
function line_generate(param, intPos, player, itemA) {
    common_checkVec3(param);
    common_checkSNBT(param.snbt);
    let shape = {};
    let va = SHP.getVector3(0, 0, 1);
    let v = SHP.getVector3(param.x, param.y, param.z)
    v.sub(SHP.getVector3(intPos.x, intPos.y, intPos.z));
    let cube = new SHP.THREE.BoxGeometry(1, 1, v.length() + 1, 1, 1, 1);
    let angle = va.angleTo(v);
    let m4 = SHP.getMAT4().makeRotationAxis(va.normalize(), angle);
    shape.arr = cube_simpleCubeVoxelization(cube, m4, param.snbt);
    shape.pos = mc.newIntPos(Math.round((param.x + intPos.x) / 2), Math.round((param.y + intPos.y) / 2), Math.round((param.z + intPos.z) / 2), intPos.dimid);
    return shape;
}
class Sphere extends Geometry {
    constructor(r) {
        super();
        this.r = r;
        this.computeBoundingBox();
        this.r2 = this.r ** 2;
        this.rn = this.r2 - 2 * this.r + 1;
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.r, -this.r, -this.r), new SHP.THREE.Vector3(this.r, this.r, this.r));
    }
    isPointInsideGeometry(x, y, z) {
        return x ** 2 + y ** 2 + z ** 2 <= this.r2;
    }
    isPointOnSurface(x, y, z) {
        const d = x ** 2 + y ** 2 + z ** 2;
        return d > this.rn && d <= this.r2;
    }
}
function sphere_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    let form = mc.newCustomForm()
        .setTitle("球体参数")
        .addLabel(`材质: 从${plData.itemAIndex + 1}号物品栏选择\n:${itemStr}`)
        .addInput("球体半径", "输入正整数", "")
        .addSwitch("是否空心", false)
        .addInput("输入生成位置\n默认为当前坐标", "输入三个正数(空格隔开)", `${intPos.x} ${intPos.y} ${intPos.z}`)
    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;
            json.r = parseInt(data[1]);
            json.isHollow = data[2];
            json.snbt = common_getBlockSNBT(plData.itemA, player);
            strs = data[3].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);
            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    });
}
function sphere_generate(param, player, itemA) {
    common_checkNumber(param.r, false);
    common_checkSNBT(param.snbt);
    const sphere = new Sphere(param.r);
    const isOdd = (sphere.r % 2 != 0);
    if (param.isHollow) {
        return common_boxForeach(sphere.boundingBox, isOdd, isOdd, isOdd, param.snbt, (x, y, z) => {
            return sphere.isPointOnSurface(x, y, z);
        })
    }
    else {
        return common_boxForeach(sphere.boundingBox, isOdd, isOdd, isOdd, param.snbt, (x, y, z) => {
            return sphere.isPointInsideGeometry(x, y, z);
        })
    }
}
class Ellipsiod extends Geometry {
    constructor(a, b, c) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;
        this.a2 = a ** 2;
        this.b2 = b ** 2;
        this.c2 = c ** 2;
        this.a_2 = (a - 1) ** 2;
        this.b_2 = (b - 1) ** 2;
        this.c_2 = (c - 1) ** 2;
        this.p = {
            a: this.a == 1,
            b: this.b == 1,
            c: this.c == 1,
        }
        this.computeBoundingBox();
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.a, -this.b, -this.c), new SHP.THREE.Vector3(this.a, this.b, this.c));
    }
    isPointInsideGeometry(x, y, z) {
        return x ** 2 / this.a2 + y ** 2 / this.b2 + z ** 2 / this.c2 <= 1;
    }
    isPointOnSurface(x, y, z) {
        const x2 = x ** 2;
        const y2 = y ** 2;
        const z2 = z ** 2;
        const p1 = this.p.a ? 0 : x2 / this.a_2
        const p2 = this.p.b ? 0 : y2 / this.b_2
        const p3 = this.p.c ? 0 : z2 / this.c_2
        return p1 + p2 + p3 >= 1 && x2 / this.a2 + y2 / this.b2 + z2 / this.c2 <= 1;
    }
}
function ellipsoid_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];
    let form = mc.newCustomForm()
        .setTitle("椭球体参数")
        .addLabel(`材质: 从${plData.itemAIndex + 1}号物品栏选择\n:${itemStr}`)
        .addInput("椭球体半长轴abc", "输入三个正数(空格隔开)", "")
        .addSwitch("是否空心", false)
        .addInput("输入生成位置\n默认为当前坐标", "输入三个正数(空格隔开)", `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addLabel("  变换部分：")
        .addStepSlider("绕轴旋转顺序(欧拉角)", orderArr)
        .addSlider("绕x轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕y轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕z轴旋转角度", 0, 360, 1, 0)
    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;
            strs = data[1].split(" ");
            json.a = parseInt(strs[0]);
            json.b = parseInt(strs[1]);
            json.c = parseInt(strs[2]);
            json.isHollow = data[2];
            json.snbt = common_getBlockSNBT(plData.itemA, player);
            strs = data[3].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);
            json.order = orderArr[data[5]];
            json.xrote = parseFloat(data[6]);
            json.yrote = parseFloat(data[7]);
            json.zrote = parseFloat(data[8]);
            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    });
}
function ellipsoid_generate(param, player, itemA) {
    common_checkNumber(param.xrote, false);
    common_checkNumber(param.yrote, false);
    common_checkNumber(param.zrote, false);
    common_checkNumber(param.a, false);
    common_checkNumber(param.b, false);
    common_checkNumber(param.c, false);
    common_checkSNBT(param.snbt);
    const ellipsoid = new Ellipsiod(param.a, param.b, param.c);
    const isOddX = (ellipsoid.a % 2 != 0);
    const isOddY = (ellipsoid.b % 2 != 0);
    const isOddZ = (ellipsoid.c % 2 != 0);
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);
    let m4_i = m4.clone().invert();
    ellipsoid.transformedBoundingBox(m4);
    const box = ellipsoid.boundingBox;
    if (param.isHollow) {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return ellipsoid.isPointOnSurface(v3.x, v3.y, v3.z);
        })
    }
    else {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return ellipsoid.isPointInsideGeometry(v3.x, v3.y, v3.z);
        })
    }
}
class Cylinder extends Geometry {
    constructor(a, b, h) {
        super();
        this.a = a;
        this.b = b;
        this.h = h;
        this.a2 = a ** 2;
        this.b2 = b ** 2;
        this.a_2 = (a - 1) ** 2;
        this.b_2 = (b - 1) ** 2;
        this.h_half = h / 2;
        this.h_half_n = -this.h_half;
        this.p = {
            a: this.a == 1,
            b: this.b == 1,
        }
        this.computeBoundingBox();
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.a, -this.h_half, -this.b), new SHP.THREE.Vector3(this.a, this.h_half, this.b));
    }
    isPointInsideGeometry(x, y, z) {
        return x ** 2 / this.a2 + z ** 2 / this.b2 <= 1 && this.h_half >= (y < 0 ? -y : y);
    }
    isPointOnSurface(x, y, z) {
        const x2 = x ** 2;
        const z2 = z ** 2;
        const p1 = this.p.a ? 0 : x2 / this.a_2
        const p2 = this.p.b ? 0 : z2 / this.b_2
        return p1 + p2 >= 1 && x2 / this.a2 + z2 / this.b2 <= 1 && this.h_half >= (y < 0 ? -y : y);
    }
}
function cylinder_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];
    let form = mc.newCustomForm()
        .setTitle("椭圆柱体参数")
        .addLabel(`材质: 从${plData.itemAIndex + 1}号物品栏选择\n:${itemStr}`)
        .addInput("椭圆面半长轴: a b", "输入两个正数(空格隔开)", "")
        .addInput("高", "输入正数", "")
        .addSwitch("是否中空", false)
        .addInput("输入生成位置\n默认为当前坐标", "输入三个正数(空格隔开)", `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addLabel("  变换部分：")
        .addStepSlider("绕轴旋转顺序(欧拉角)", orderArr)
        .addSlider("绕x轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕y轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕z轴旋转角度", 0, 360, 1, 0)
    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;
            strs = data[1].split(" ");
            json.a = parseInt(strs[0]);
            json.b = parseInt(strs[1]);
            json.h = parseInt(data[2]);
            json.isHollow = data[3];
            json.snbt = common_getBlockSNBT(plData.itemA, player);
            strs = data[4].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);
            json.order = orderArr[data[6]];
            json.xrote = parseFloat(data[7]);
            json.yrote = parseFloat(data[8]);
            json.zrote = parseFloat(data[9]);
            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    });
}
function cylinder_generate(param, player, itemA) {
    common_checkNumber(param.xrote, false);
    common_checkNumber(param.yrote, false);
    common_checkNumber(param.zrote, false);
    common_checkNumber(param.a, false);
    common_checkNumber(param.b, false);
    common_checkNumber(param.h, false);
    common_checkSNBT(param.snbt);
    const cylinder = new Cylinder(param.a, param.b, param.h);
    const isOddX = (cylinder.a % 2 != 0);
    const isOddY = (cylinder.h % 2 != 0);
    const isOddZ = (cylinder.b % 2 != 0)
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);
    let m4_i = m4.clone().invert();
    cylinder.transformedBoundingBox(m4);
    const box = cylinder.boundingBox;
    if (param.isHollow) {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cylinder.isPointOnSurface(v3.x, v3.y, v3.z);
        })
    }
    else {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cylinder.isPointInsideGeometry(v3.x, v3.y, v3.z);
        })
    }
}
class Cone extends Geometry {
    constructor(a, b, h) {
        super();
        this.a = a;
        this.b = b;
        this.h = h;
        this.a2 = a ** 2;
        this.b2 = b ** 2;
        this.h_ = h - 1;
        this.a_2 = (a - 1.2) ** 2;
        this.b_2 = (b - 1.2) ** 2;
        this.p = {
            a: this.a == 1,
            b: this.b == 1,
        }
        this.computeBoundingBox();
    }
    computeBoundingBox() {
        if (this.boundingBox == null) {
            this.boundingBox = new Box();
        }
        this.boundingBox.set(new SHP.THREE.Vector3(-this.a, 0, -this.b), new SHP.THREE.Vector3(this.a, this.h, this.b));
    }
    isPointInsideGeometry(x, y, z) {
        const n = this.h / (this.h - y);
        return (x ** 2 / this.a2 + z ** 2 / this.b2) * n <= 1 && y <= this.h; 
    }
    isPointOnSurface(x, y, z) {
        const x2 = x ** 2;
        const z2 = z ** 2;
        if(y >= this.h_) 
            return (x2 / this.a2 + z2 / this.b2) * this.h / (this.h - y) <= 1 && y <= this.h;
        else 
            return (x2 / this.a2 + z2 / this.b2) * this.h / (this.h - y) <= 1 && (x2 / this.a_2 + z2 / this.b_2) * this.h_ / (this.h_ - y) >= 1 && y <= this.h;
    }
}
function cone_form(player, index, intPos, plData) {
    let itemStr = plData.itemA.isNull() ? "" : `${plData.itemA.type} ${plData.itemA.aux}`;
    const orderArr = ["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"];
    let form = mc.newCustomForm()
        .setTitle("椭圆柱体参数")
        .addLabel(`材质: 从${plData.itemAIndex + 1}号物品栏选择\n:${itemStr}`)
        .addInput("椭圆面半长轴: a b", "输入两个正数(空格隔开)", "")
        .addInput("高", "输入正数", "")
        .addSwitch("是否空心", false)
        .addInput("输入生成位置\n默认为当前坐标", "输入三个正数(空格隔开)", `${intPos.x} ${intPos.y} ${intPos.z}`)
        .addLabel("  变换部分：")
        .addStepSlider("绕轴旋转顺序(欧拉角)", orderArr)
        .addSlider("绕x轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕y轴旋转角度", 0, 360, 1, 0)
        .addSlider("绕z轴旋转角度", 0, 360, 1, 0)
    player.sendForm(form, (pl, data) => {
        if (data != null) {
            let json = {};
            let pos = {};
            let strs;
            strs = data[1].split(" ");
            json.a = parseInt(strs[0]);
            json.b = parseInt(strs[1]);
            json.h = parseInt(data[2]);
            json.isHollow = data[3];
            json.snbt = common_getBlockSNBT(plData.itemA, player);
            strs = data[4].split(" ");
            pos.x = parseInt(strs[0]);
            pos.y = parseInt(strs[1]);
            pos.z = parseInt(strs[2]);
            json.order = orderArr[data[6]];
            json.xrote = parseFloat(data[7]);
            json.yrote = parseFloat(data[8]);
            json.zrote = parseFloat(data[9]);
            pl.runcmd(`/call shape load "${SHP.getPackageName()}" ${index} ${JSON.stringify(json)} ${pos.x} ${pos.y} ${pos.z}`);
        }
    });
}
function cone_generate(param, player, itemA) {
    common_checkNumber(param.xrote, false);
    common_checkNumber(param.yrote, false);
    common_checkNumber(param.zrote, false);
    common_checkNumber(param.a, false);
    common_checkNumber(param.b, false);
    common_checkNumber(param.h, false);
    common_checkSNBT(param.snbt);
    const cone = new Cone(param.a, param.b, param.h);
    const isOddX = (cone.a % 2 != 0);
    const isOddY = (cone.h % 2 != 0);
    const isOddZ = (cone.b % 2 != 0)
    let m4 = SHP.getRoteMAT4(param.xrote, param.yrote, param.zrote, param.order);
    let m4_i = m4.clone().invert();
    cone.transformedBoundingBox(m4);
    const box = cone.boundingBox;
    if (param.isHollow) {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cone.isPointOnSurface(v3.x, v3.y, v3.z);
        })
    }
    else {
        return common_boxForeach(box, isOddX, isOddY, isOddZ, param.snbt, (x, y, z) => {
            const v3 = new SHP.THREE.Vector3(x, y, z).applyMatrix4(m4_i);
            return cone.isPointInsideGeometry(v3.x, v3.y, v3.z);
        })
    }
}
function cmd(player, index, intPos, param) {
    try {
        let plData = SHP.getData(player);
        let shape = { pos: null, arr: null };
        switch (index) {
            case 0:
                shape.arr = cube_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 1:
                shape.arr = plane_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 2:
                shape = line_generate(param, intPos, player, plData.itemA);
                break;
            case 3:
                shape.arr = sphere_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 4:
                shape.arr = ellipsoid_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 5:
                shape.arr = cylinder_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
            case 6:
                shape.arr = cone_generate(param, player, plData.itemA);
                shape.pos = intPos;
                break;
        }
        return shape;
    } catch (e) {
        SHP.Message.error(player, e.message);
    }
}
function form(player, index, intPos) {
    let plData = SHP.getData(player);
    try {
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
            case 3:
                sphere_form(player, index, intPos, plData);
                break;
            case 4:
                ellipsoid_form(player, index, intPos, plData);
                break;
            case 5:
                cylinder_form(player, index, intPos, plData);
                break;
            case 6:
                cone_form(player, index, intPos, plData);
                break;
        }
    }
    catch (e) {
        SHP.Message.error(player, '表单异常: ' + e.message);
    }
}
function tutorial() {
    return {
        基础概念介绍: "[自由变换]\n  本形状包中的“自由变换”为任意角度的旋转\n[生成位置]\n  默认的生成位置为您脚下\n您也可自定义生成位置\n  形状包将以您指定的位置为中心生成形状",
        立方体: "生成立方体\n可自由变换角度",
        平面: "生成平面\n可定义平面的法向量\n(即定义平面的朝向)",
        直线: "根据您选区中的两点生成一条直线\n或自定义两点来生成直线"
    }
}

if(!SHP._state.cmd) throw new Error("CALL形状包 " + "call.superx101.basicShape" + ": 未使用export_cmd导出指令处理函数");
if(!SHP._state.form) throw new Error("CALL形状包 " + "call.superx101.basicShape" + ": 未使用export_form导出表单函数");
if(!SHP._state.tutorial) throw new Error("CALL形状包 " + "call.superx101.basicShape" + ": 未使用export_tutorial导出教程函数");
