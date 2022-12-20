import { dimid } from '../type/Pos';
import { Matrix3D, Vector3D } from '../util/SimpleMatrix';

export default class Pos3D {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0, public dimid: dimid = 0) {}

    public static fromPos3D(pos: Pos3D) {
        return new Pos3D(pos.x, pos.y, pos.z, pos.dimid);
    }

    public static fromPos(pos: IntPos | FloatPos) {
        return new Pos3D(pos.x, pos.y, pos.z, pos.dimid);
    }

    public static directionToPosArr(direction: DirectionAngle) {
        let l = 10;
        let cosP = Math.cos(direction.pitch * Math.PI / 180.0);
        let sinP = Math.sin(direction.pitch * Math.PI / 180.0);
        let cosY = Math.cos(direction.yaw * Math.PI / 180.0);
        let sinY = Math.sin(direction.yaw * Math.PI / 180.0);
        return [parseFloat((-l * cosP * sinY).toFixed(2)), parseFloat((-l * sinP).toFixed(2)), parseFloat((l * cosP * cosY).toFixed(2))];
    }

    public add(x: number, y: number, z: number) {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    public calibration() {
        return this.add(0, -1, 0);
    }

    public floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }

    public transform2D(matrix: Matrix3D) {
        let v = matrix.mul(new Vector3D(this.x, this.z, 1)) as Vector3D;
        return new Pos3D(v.arr[0], this.y, v.arr[1], this.dimid);
    }

    public toString() {
        return `(${this.x},${this.y},${this.z})`;
    }

    public formatStr() {
        return `${this.x} ${this.y} ${this.z}`;
    }

    public equals(pos: Pos3D) {
        try {
            if (pos.x == this.x && pos.y == this.y && pos.z == this.z && pos.dimid == this.dimid) {
                return true;
            }
        }
        catch (e) { };
        return false;
    }

}