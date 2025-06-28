import { Pos3 } from "./Pos3";
import { Matrix3D, Vector3D } from "../util/SimpleMatrix";

export default class Area3 {
    public isNormalize: boolean = false;
    constructor(public start: Pos3, public end: Pos3, normal: boolean = true) {
        this.start = Pos3.fromPos3(start);
        this.end = Pos3.fromPos3(end);

        if (normal) {
            this.normalize();
        }
    }

    public static fromArea3D(area: Area3 = undefined, normal: boolean = true) {
        return new Area3(area.start, area.end, normal);
    }

    public addBoth(x: number, y: number, z: number) {
        this.start.add(x, y, z);
        this.end.add(x, y, z);
        return this;
    }

    public transform2D(matrix: Matrix3D) {
        let sta = new Vector3D(this.start.x, this.start.z, 1);
        let end = new Vector3D(this.end.x, this.end.z, 1);
        sta = matrix.mul(sta) as Vector3D;
        end = matrix.mul(end) as Vector3D;
        return new Area3(new Pos3(sta.arr[0], this.start.y, sta.arr[1], this.start.dimid), new Pos3(end.arr[0], this.end.y, end.arr[1], this.start.dimid), false);
    }

    public normalize() {
        this.isNormalize = true;
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

    public relative() {
        this.end.x -= this.start.x;
        this.start.x = 0;
        this.end.y -= this.start.y;
        this.start.y = 0;
        this.end.z -= this.start.z;
        this.start.z = 0;
        return this;
    }

    public inArea(pos: Pos3) {
        if (!this.isNormalize) this.normalize();
        return pos.x >= this.start.x && pos.x <= this.end.x
            && pos.y >= this.start.y && pos.y <= this.end.y
            && pos.z >= this.start.z && pos.z <= this.end.z;
    }

    public toString() {
        return `${this.start}->${this.end.toString()}`;
    }

    public getLens() {
        return [this.end.x - this.start.x + 1, this.end.y - this.start.y + 1, this.end.z - this.start.z + 1];
    }

    public getLensStr() {
        let arr = this.getLens();
        return `${arr[0]} ${arr[1]} ${arr[2]}`
    }

    public equals(area: Area3) {
        if (this.start.equals(area.start) && this.end.equals(area.end)) {
            return true;
        }
        return false;
    }
}