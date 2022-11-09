class Test {
    static log() {
        let str = "";
        Array.from(arguments).forEach(v=>{
            if(typeof(v) == "string") {
                str += v + " ";
            }
            else {
                str += JSON.stringify(v) + " ";
            }
        })
        log(str);
    }
}

module.exports = Test