import Activity from "../activity/Activity";
import Players from "../common/Players";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";


export default class EnableOperation {
    public static on(player: Player, output: CommandOutput, playerData: PlayerData) {
        if (!playerData.settings.enable) {
            playerData.settings.enable = true;
            Activity.onStart(player);
        }
        output.success(StrFactory.cmdSuccess("已启用CALL"));
    }

    public static off(player: Player, output: CommandOutput, playerData: PlayerData) {
        if (playerData.settings.enable) {
            playerData.settings.enable = false;
            Activity.onStop(player);
        }
        output.success(StrFactory.cmdSuccess("已禁用CALL (/call on指令再次启动)"));
    }

    public static isEnable(player: Player) {
        return Players.getData(player.xuid).settings.enable;
    }
}
