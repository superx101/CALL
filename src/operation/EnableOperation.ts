import Activity from "../activity/Activity";
import Players from "../common/Players";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";


export default class EnableOperation {
    public static on(player: Player, output: CommandOutput, playerData: PlayerData) {
        if (!playerData.settings.enable) {
            playerData.settings.enable = true;
            Activity.onStart(player);
        }
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.EnableOperation.on")));
    }

    public static off(player: Player, output: CommandOutput, playerData: PlayerData) {
        if (playerData.settings.enable) {
            playerData.settings.enable = false;
            Activity.onStop(player);
        }
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.EnableOperation.off")));
    }

    public static isEnable(player: Player) {
        return Players.getData(player.xuid).settings.enable;
    }
}
