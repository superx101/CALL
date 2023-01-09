export default class Test {
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
}