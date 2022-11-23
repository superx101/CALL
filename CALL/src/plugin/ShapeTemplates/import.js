ll.registerPlugin("call-" + PKG.replaceAll(".", "-"), "CALL's shape package", VERSION, {});
const SHP = {
    _registerPackage: ll.import(APISAPCE, "registerPackage"),
    _getData: ll.import(APISAPCE, "getData"),
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
        this._registerPackage(PKG, name, shapeNames, introduction);
    },
    Message: {
        warn: function (player, str, mode = 0) {
            player.sendText(Format.Gold + `[${PKG}][警告] ` + str, mode);
        },
        error: function (player, str, mode = 0) {
            player.sendText(Format.Red + `[${PKG}][错误] ` + str, mode);
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
Object.keys(SHP).forEach(key => { Object.freeze(SHP[key]); });