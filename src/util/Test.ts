export default class Test {
    public static log() {
        let str = "";
        Array.from(arguments).forEach(v=>{
            if(typeof(v) == "string") {
                str += v + " ";
            }
            else {
                str += JSON.stringify(v) + " ";
            }
        })
    }
}