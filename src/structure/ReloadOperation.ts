import Config from "../common/Config";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class ReloadOperation {
    public static unload() {
        ll.listPlugins().forEach((v: string)=>{
            if(v == "CALL_Reloader") {
                mc.runcmd(`ll unload CALL_Reloader`)
            }
        })
    }

    public static start() {
        mc.getOnlinePlayers().forEach(pl => {
            pl.sendText(StrFactory.cmdTip(Tr._(pl.langCode, "dynamic.ReloadOperation.start.reload")));
        });
        mc.runcmd(`ll load "${Config.BIN}/CALL_Reloader.js"`);
    }
}