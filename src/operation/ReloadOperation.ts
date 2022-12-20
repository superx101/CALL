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

    public static start(output: CommandOutput) {
        mc.getOnlinePlayers().forEach(pl => {
            pl.sendText(StrFactory.cmdTip("管理员已重载插件"));
        });
        mc.runcmd(`ll load "${Config.BIN}/CALL_Reloader.js"`);
    }
}