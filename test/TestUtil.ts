export default class TestUtil {
    public static log(...arr: any) {
        let str = "";
        arr.forEach((v: any)=>{
            if(typeof(v) == "string") {
                str += v + " ";
            }
            else {
                str += JSON.stringify(v) + " ";
            }
        })
        logger.info(str);
    }

    public static equal(title: string, f: Function, value: any) {
        if(f() == value)
            logger.info(`[Test] ${title} passed!`);
        else
            logger.error(`[Test] ${title} failed: expect=${value}, result=${f()}`);
    }
}