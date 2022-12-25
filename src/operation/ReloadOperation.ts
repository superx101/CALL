import Config from "../common/Config";
import StrFactory from "../util/StrFactory";

export default class ReloadOperation {
    public static unload() {
        ll.listPlugins().forEach((v: string)=>{
            if(v == "CALL_Reloader") {
                mc.runcmd(`ll unload CALL_Reloader`)
            }
        })
    }

    public static start(msg: string) {
        mc.getOnlinePlayers().forEach(pl => {
            pl.sendText(StrFactory.cmdTip(msg));
        });
        mc.runcmd(`ll load "${Config.BIN}/CALL_Reloader.js"`);
    }
}