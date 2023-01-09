import Activity from "../activity/Activity";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import PermissionOperation from "../operation/PermissionOperation";
import { PermissionsType } from "../type/Config";
import StrFactory from "../util/StrFactory";
import Config from "./Config";

export default class Players {
    public static dataMap = new Map<string, PlayerData>();

    public static hasPermission(player: Player) {
        switch (Config.get(Config.GLOBAL, "permission")) {
            case PermissionsType.ALL:
                return true;
            case PermissionsType.OP:
                let isOp = player.isOP();
                let playerData = Players.getData(player.xuid);
                if (isOp && playerData == null) {
                    Activity.onCreate(player);
                }
                else if (!isOp && playerData != null) {
                    Activity.onDestroy(player);
                }
                return isOp;
            case PermissionsType.CUSTOMIZE:
                return PermissionOperation.find(player.realName);
            default:
                return false;
        }
    }

    public static setData(xuid: string, data: PlayerData) {
        Players.dataMap.set(xuid, data);
    }

    public static getData(xuid: string) {
        return Players.dataMap.get(xuid);
    }

    public static silenceCmd(player: Player, cmd: string) {
        if (!Config.get(Config.GLOBAL, "outputCmd", false)) {
            player.runcmd(cmd);
            //控制台清除输出
            process.stdout.write('\x1B[1A');
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
        }
    }

    public static cmd(player: Player, cmd: string, isTell: boolean = true) {
        if (Config.get(Config.GLOBAL, "oldCommandType") && Config.ISOLDVERSION) {
            cmd = `/execute "${player.realName}" ${Pos3D.fromPos(player.pos).floor().formatStr()} ` + cmd;
        }
        else {
            cmd = `/execute at "${player.realName}" run ` + cmd;
        }
        //sendText
        let res = mc.runcmdEx(cmd);
        if (!res.success && isTell) {
            player.sendText(StrFactory.cmdErr(res.output));
        }
        //debug
        if(Config.get(Config.GLOBAL, "debugMod", false)) {
            logger.debug(cmd);
            logger.debug(res);
        }
        if(Config.get(Config.GLOBAL, "outputCmd", false) || true) {
            logger.info(cmd);
        }
        return res;
    }
}