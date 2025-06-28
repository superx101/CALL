/**
 * @deprecated
 * Originally defined for simple transformations, it is no longer used in new code
 */
 export class Vector3D {
    public arr: Array<number>

    constructor(x: number, y:number, z:number) {
        this.arr = [x, y, z];
    }
}

/**
 * @deprecated
 * Originally defined for simple transformations, it is no longer used in new code
 */   
export class Matrix3D {
    constructor(public arr: Array<Array<number>>) {
        let is3D = false;
        if (Array.isArray(arr)) {
            if (arr.length == 3) {
                is3D = true;
                for (let a of arr) {
                    if (a.length != 3) {
                        is3D = false;
                        break;
                    }
                }
            }
        }
        if (is3D) {
            this.arr = arr;
        }
    }

    get m() {
        return this.arr.length;
    }

    get n() {
        return this.arr[0].length;
    }

    mul(obj: Matrix3D | Vector3D) {
        if ((obj instanceof Vector3D)) {
            let a = obj.arr[0] * this.arr[0][0] + obj.arr[1] * this.arr[0][1] + obj.arr[2] * this.arr[0][2];
            let b = obj.arr[0] * this.arr[1][0] + obj.arr[1] * this.arr[1][1] + obj.arr[2] * this.arr[1][2];
            let c = obj.arr[0] * this.arr[2][0] + obj.arr[1] * this.arr[2][1] + obj.arr[2] * this.arr[2][2];
            return new Vector3D(a, b, c);
        }
        else if ((obj instanceof Matrix3D)) {
            let a = new Array(this.m);
            for (let i = 0; i < this.m; i++) {
                a[i] = new Array(obj.n);
                for (let j = 0; j < obj.n; j++) {
                    a[i][j] = 0;
                    for (let k = 0; k < this.n; k++) {
                        a[i][j] += this.arr[i][k] * obj.arr[k][j];
                    }
                }
            }
            return new Matrix3D(a);
        }
    }

    toString() {
        return `\n|${this.arr[0][0]} ${this.arr[0][1]} ${this.arr[0][2]}|\n|${this.arr[1][0]} ${this.arr[1][1]} ${this.arr[1][2]}|\n|${this.arr[2][0]} ${this.arr[2][1]} ${this.arr[2][2]}|`;
    }
}

/**
 * @deprecated
 * Originally defined for simple transformations, it is no longer used in new code
 */
export class Transform3 {
    static getUnit() {
        return new Matrix3D([[
            1, 0, 0
        ], [
            0, 1, 0
        ], [
            0, 0, 1
        ]]);
    }

    static getBasicRota(degrees: number) {
        return new Matrix3D([[
            Math.round(Math.cos(degrees / 180.0 * Math.PI)), Math.round(-Math.sin(degrees / 180.0 * Math.PI)), 0
        ], [
            Math.round(Math.sin(degrees / 180.0 * Math.PI)), Math.round(Math.cos(degrees / 180.0 * Math.PI)), 0
        ], [
            0, 0, 1
        ]]);
    }

    static getRota(degrees: number, xlen: number, zlen: number) {
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

    static getMove(x: number, z: number) {
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

    static getMirror(mod: string): Matrix3D {
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
            return new Matrix3D([[
                -1, 0, 0
            ], [
                0, -1, 0
            ], [
                0, 0, 1
            ]]);
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