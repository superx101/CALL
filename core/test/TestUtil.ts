export default class TestUtil {
    public static log(...arr: any) {
        let str = "";
        arr.forEach((v: any) => {
            if (typeof (v) == "string") {
                str += v + " ";
            }
            else {
                str += JSON.stringify(v) + " ";
            }
        })
        logger.info(str);
    }

    public static objEqual(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
            return true;
        }
        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            if (!keys2.includes(key) || !TestUtil.objEqual(obj1[key], obj2[key])) {
                return false;
            }
        }
        return true;
    }

    public name: string = "";

    constructor(name: string) {
        this.name = name;
    }

    public equal(title: string, f: Function, value: any) {
        let result = f();
        if (result == value)
            logger.info(`[Test] (passed) ${this.name}.${title}`);
        else
            logger.error(`[Test] (failed) ${this.name}.${title} :expect=${value}, result=${result}`);
    }

    public check(title: string, f: Function, check: (res: any) => { success: boolean, msg: string }) {
        let { success, msg } = check(f());
        if (success)
            logger.info(`[Test] (passed) ${this.name}.${title}`);
        else
            logger.error(`[Test] (failed) ${this.name}.${title} :message=${msg}`);
    }


}