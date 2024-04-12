import { Compare } from "../temp/Common";

export default class Version {
    public constructor(public major: number, public minor: number, public revision: number) {
    }

    /**
     * @throws {Error}
     * @param str 
     * @returns 
     */
    public static fromString(str: string) {
        let arr = str.split(".");
        return new Version(parseInt(arr[0]),  parseInt(arr[1]), parseInt(arr[2]));
    }

    /**
     * @throws {Error}
     */
    public static fromArr(arr: number[]) {
        return new Version(arr[0], arr[1], arr[2]);
    }

    public compare(v: Version): Compare {
        if(this.major != v.major) {
            return this.major > v.major ? Compare.GREATER : Compare.LESSER;
        }
        if(this.minor != v.minor) {
            return this.minor > v.minor ? Compare.GREATER : Compare.LESSER;
        }
        if(this.revision != v.revision) {
            return this.revision > v.revision ? Compare.GREATER : Compare.LESSER;
        }
        return Compare.EQUAL;
    }

    public toString() {
        return `${this.major}.${this.minor}.${this.revision}`;
    }
}