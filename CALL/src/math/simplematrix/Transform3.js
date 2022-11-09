const Matrix3D = require("./Matrix3D")

/**
 * @deprecated
 * Originally defined for simple transformations, it is no longer used in new code
 */
class Transform3 {
    static getUnit() {
        return new Matrix3D([[
            1, 0, 0
        ], [
            0, 1, 0
        ], [
            0, 0, 1
        ]]);
    }

    static getBasicRota(degrees) {
        return new Matrix3D([[
            Math.round(Math.cos(degrees / 180.0 * Math.PI)), Math.round(-Math.sin(degrees / 180.0 * Math.PI)), 0
        ], [
            Math.round(Math.sin(degrees / 180.0 * Math.PI)), Math.round(Math.cos(degrees / 180.0 * Math.PI)), 0
        ], [
            0, 0, 1
        ]]);
    }

    static getRota(degrees, xlen, zlen) {
        let t1, t2;
        degrees = degrees % 360;
        switch (degrees) {
            case 0:
                t1 = 0;
                t2 = 0;
                break;
            case 90:
                t1 = zlen - 1;
                t2 = 0;
                break;
            case 180:
                t1 = xlen - 1;
                t2 = zlen - 1;
                break;
            case 270:
                t1 = 0;
                t2 = xlen - 1;
                break;
        }
        return new Matrix3D([[
            Math.round(Math.cos(degrees / 180.0 * Math.PI)), Math.round(-Math.sin(degrees / 180.0 * Math.PI)), t1
        ], [
            Math.round(Math.sin(degrees / 180.0 * Math.PI)), Math.round(Math.cos(degrees / 180.0 * Math.PI)), t2
        ], [
            0, 0, 1
        ]]);
    }

    static getMove(x, z) {
        return new Matrix3D([[
            1, 0, x
        ], [
            0, 1, z
        ], [
            0, 0, 1
        ]]);
    }

    static getBasicMirrorX() {
        return new Matrix3D([[
            1, 0, 0
        ], [
            0, -1, 0
        ], [
            0, 0, 1
        ]]);
    }

    static getBasicMirrorZ() {
        return new Matrix3D([[
            -1, 0, 0
        ], [
            0, 1, 0
        ], [
            0, 0, 1
        ]]);
    }

    static getMirror(mod) {
        if (mod == "z") {
            return new Matrix3D([[
                -1, 0, 0
            ], [
                0, 1, 0
            ], [
                0, 0, 1
            ]]);
        }
        else if (mod == "x") {
            return new Matrix3D([[
                1, 0, 0
            ], [
                0, -1, 0
            ], [
                0, 0, 1
            ]]);
        }
        else if (mod == "xz") {
            return this.getMirror("x").mul(this.getMirror("z"));
        }
        else {
            return new Matrix3D([[
                1, 0, 0
            ], [
                0, 1, 0
            ], [
                0, 0, 1
            ]]);
        }
    }
}

module.exports = Transform3;