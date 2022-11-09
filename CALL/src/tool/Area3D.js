// const Pos3D = require("../tool/Pos3D")
// const Vector3D = require("../math/simplematrix/Vector3D")

class Area3D {
    constructor() {
        let start, end;
        if (arguments[0].start != null && arguments[0].end != null) {
            start = arguments[0].start;
            end = arguments[0].end;
        }
        else if (arguments[0] != null && arguments[1] != null) {
            start = arguments[0];
            end = arguments[1];
        }

        this.start = new Pos3D(start);
        this.end = new Pos3D(end);
        if (arguments[2] == null || arguments[2]) {
            this.normalize();
        }
    }

    addBoth(x, y, z) {
        this.start.add(x, y, z);
        this.end.add(x, y, z);
        return this;
    }

    transform2D(matrix) {
        let sta = new Vector3D(this.start.x, this.start.z, 1);
        let end = new Vector3D(this.end.x, this.end.z, 1);
        sta = matrix.mul(sta);
        end = matrix.mul(end);
        sta = new Pos3D(sta.arr[0], this.start.y, sta.arr[1], this.start.dimid);
        end = new Pos3D(end.arr[0], this.end.y, end.arr[1], this.start.dimid);
        return new Area3D(sta, end, false);
    }

    normalize() {
        if (this.start.x > this.end.x) {
            let t = this.start.x;
            this.start.x = this.end.x;
            this.end.x = t;
        }
        if (this.start.y > this.end.y) {
            let t = this.start.y;
            this.start.y = this.end.y;
            this.end.y = t;
        }
        if (this.start.z > this.end.z) {
            let t = this.start.z;
            this.start.z = this.end.z;
            this.end.z = t;
        }
        return this;
    }

    relative() {
        this.end.x -= this.start.x;
        this.start.x = 0;
        this.end.y -= this.start.y;
        this.start.y = 0;
        this.end.z -= this.start.z;
        this.start.z = 0;
        return this;
    }

    toString() {
        return `${this.start}->${this.end.toString()}`;
    }

    getLens() {
        return [this.end.x - this.start.x + 1, this.end.y - this.start.y + 1, this.end.z - this.start.z + 1];
    }

    getLensStr() {
        let arr = this.getLens();
        return `${arr[0]} ${arr[1]} ${arr[2]}`
    }

    equals(area) {
        if (this.start.equals(area.start) && this.end.equals(area.end)) {
            return true;
        }
        return false;
    }
}

module.exports = Area3D;