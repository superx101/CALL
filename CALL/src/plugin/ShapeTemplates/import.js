ll.registerPlugin("call-" + PKG.replaceAll(".", "-"), "CALL's shape package", VERSION, {});
const SHP = {
    _registerPackage: ll.import(APISAPCE, "registerPackage"),
    _getData: ll.import(APISAPCE, "getData"),
    THREE: require("./CALL/lib/three.js/src/Three"),
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
        this._registerPackage(PKG, name, shapeNames, introduction);
    },
    Message: {
        warn: function (player, str, mod = 0) {
            player.sendText(Format.Gold + `[${PKG}][警告] ` + str, mod);
        },
        error: function (player, str, mod = 0) {
            player.sendText(Format.Red + `[${PKG}][错误] ` + str, mod);
        },
        info: function (player, str, mod = 0) {
            player.sendText(Format.White + `[${PKG}] ` + str, mod);
        },
        success: function (player, str, mod = 0) {
            player.sendText(Format.Gold + `[${PKG}] ` + str, mod);
        }
    },
    setBlock: function (x = 0, y = 0, z = 0, block_palette = '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}', block_position_data = null) {
        return { x, y, z, block_palette, block_position_data };
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
    getPackageName: function () {
        return PKG;
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