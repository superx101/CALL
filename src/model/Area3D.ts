import Pos3D from "./Pos3D";
import { Matrix3D, Vector3D } from "../util/SimpleMatrix";

export default class Area3D {
    constructor(public start:Pos3D, public end: Pos3D, normal: boolean = true) {
        this.start = Pos3D.fromPos3D(start);
        this.end = Pos3D.fromPos3D(end);

        if (normal) {
            this.normalize();
        }
    }

    public static fromArea3D(area: Area3D = undefined, normal: boolean  = true) {
        return new Area3D(area.start, area.end, normal);
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
        return new Area3D(new Pos3D(sta.arr[0], this.start.y, sta.arr[1], this.start.dimid), new Pos3D(end.arr[0], this.end.y, end.arr[1], this.start.dimid), false);
    }

    public normalize() {
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

    public equals(area: Area3D) {
        if (this.start.equals(area.start) && this.end.equals(area.end)) {
            return true;
        }
        return false;
    }
}