ll.registerPlugin(PKG.replaceAll(".", "_"), "CALL's shape package", VERSION, {});
const SHP = {
    _registerPackage: ll.import(APISAPCE, "registerPackage"),
    _getData: ll.import(APISAPCE, "getData"),
    _listForm: ll.import(APISAPCE, "listForm"),
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
            return ll.export(f, EXPORTSAPCE, PKG + CMD);
        } else {
            throw new Error("Please do not repeat call: export_cmd");
        }
    },
    export_form: function (f) {
        if (!this._state.form && typeof f == 'function') {
            this._state.form = true;
            return ll.export(f, EXPORTSAPCE, PKG + FORM);
        } else {
            throw new Error("Please do not repeat call: export_form");
        }
    },
    export_info: function (f) {
        if (!this._state.info && typeof f == 'function') {
            this._state.info = true;
            return ll.export(f, EXPORTSAPCE, PKG + INFO);
        } else {
            throw new Error("Please do not repeat call: export_info");
        }
    },
    getVersion() {
        return VERSION;
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
    registerPackage: function (shapeNum, icon) {
        if (!this._state.register) {
            this._state.register = true;
            this._registerPackage(VERSION, PKG, shapeNum, icon);
        } else {
            throw new Error("Please do not repeat call: registerPackage");
        }
    },
    listForm: function (player) {
        this._listForm(player);
    },
    Message: {
        warn: function (player, str, mode = 0) {
            player.sendText(Format.Gold + `[${PKG}][warn] ` + str, mode);
        },
        error: function (player, str, mode = 0) {
            player.sendText(Format.Red + `[${PKG}][warn] ` + str, mode);
        },
        info: function (player, str, mode = 0) {
            player.sendText(Format.White + `[${PKG}] ` + str, mode);
        },
        success: function (player, str, mode = 0) {
            player.sendText(Format.Gold + `[${PKG}] ` + str, mode);
        }
    },
    setBlock: function (x, y, z, block_palette = '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}', block_position_data = null) {
        return { x, y, z, block_palette, block_position_data };
    },
    getPackageName: function () {
        return PKG;
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
CODE
if(!SHP._state.cmd) throw new Error("CALL shapePackage " + PKG + ": function not used: export_cmd");
if(!SHP._state.form) throw new Error("CALL shapePackage " + PKG + ": function not used: export_form");
if(!SHP._state.info) throw new Error("CALL shapePackage " + PKG + ": function not used: export_info");