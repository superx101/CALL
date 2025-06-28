import Activity from "../Activity";
import Players from "./Players";
import CAPlayer from "./CAPlayer";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";


export default class EnableOperation {
    public static on(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        if (!caPlayer.settings.enable) {
            caPlayer.settings.enable = true;
            Activity.onStart(caPlayer);
        }
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.EnableOperation.on")));
    }

    public static off(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        if (caPlayer.settings.enable) {
            caPlayer.settings.enable = false;
            Activity.onStop(caPlayer);
        }
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.EnableOperation.off")));
    }

    public static isEnable(caPlayer: CAPlayer) {
        return caPlayer.settings.enable;
    }
}
