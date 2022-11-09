class Version {
    constructor(str) {
        try {
            let arr = str.split(".");
            this.arr = [];
            this.str = str;
            this.arr.push(parseInt(arr[0]));
            this.arr.push(parseInt(arr[1]));
            this.arr.push(parseInt(arr[2]));
        }
        catch (e) {
            return null;
        }
    }

    compare(v) {
        for(let n = 0; n < this.arr.length; n++) {
            if(this.arr[n] > v.arr[n]) {
                return 1;
            }
            else if(this.arr[n] < v.arr[n]) {
                return -1;
            }
        }
        return 0;
    }
}

module.exports = Version;