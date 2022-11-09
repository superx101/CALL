const Vector3D = require("./Vector3D")

/**
 * @deprecated
 * Originally defined for simple transformations, it is no longer used in new code
 */
class Matrix3D {
    constructor(arr) {
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

    mul(obj) {
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
module.exports = Matrix3D;