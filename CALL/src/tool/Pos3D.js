// const Pos3D = require("../tool/Pos3D")
// const Vector3D = require("../math/simplematrix/Vector3D")

class Pos3D {
    /*** private*/
    init(x, y, z, dimid) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.dimid = dimid;
    }

    constructor() {
        if (arguments[0].x != null
            && arguments[0].y != null
            && arguments[0].z != null
            && arguments[0].dimid != null) {
            this.init(arguments[0].x, arguments[0].y, arguments[0].z, arguments[0].dimid);
        }
        else {
            this.init(arguments[0], arguments[1], arguments[2], arguments[3])
        }
    }

    static directionToPosArr(direction) {
        let l = 10;
        let cosP = Math.cos(direction.pitch * Math.PI / 180.0);
        let sinP = Math.sin(direction.pitch * Math.PI / 180.0);
        let cosY = Math.cos(direction.yaw * Math.PI / 180.0);
        let sinY = Math.sin(direction.yaw * Math.PI / 180.0);
        return [parseFloat((-l * cosP * sinY).toFixed(2)), parseFloat((-l * sinP).toFixed(2)), parseFloat((l * cosP * cosY).toFixed(2))];
    }

    add(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    calibration() {
        return this.add(0, -1, 0);
    }

    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }

    transform2D(matrix) {
        let v = matrix.mul(new Vector3D(this.x, this.z, 1));
        return new Pos3D(v.arr[0], this.y, v.arr[1], this.dimid);
    }

    toString() {
        return `(${this.x},${this.y},${this.z})`;
    }

    formatStr() {
        return `${this.x} ${this.y} ${this.z}`;
    }

    equals(pos) {
        try {
            if (pos.x == this.x && pos.y == this.y && pos.z == this.z && pos.dimid == this.dimid) {
                return true;
            }
        }
        catch (e) { };
        return false;
    }

}

module.exports = Pos3D;