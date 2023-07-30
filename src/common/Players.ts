import Activity from "../activity/Activity";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import PermissionOperation from "../operation/PermissionOperation";
import { PermissionsType } from "../type/Config";
import StrFactory from "../util/StrFactory";
import Config from "./Config";
import * as os from "os"

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
        player.runcmd(cmd);
        if (!Config.get(Config.GLOBAL, "outputCmd", true)) {
            //控制台清除输出 (密集输出时删除错误)
            process.stdout.write('\x1B[1A');
            switch (os.platform()) {
                case "win32":
                    process.stdout.write('\x1b[K');
                    break;
                case "darwin":
                case "linux":
                    process.stdout.write('\x20');
                default:
                    break;
            }
        }
    }

    public static cmd(player: Player, cmd: string, isTell: boolean = true) {
        cmd = `/execute at "${player.realName}" run ` + cmd;

        //sendText
        let res = mc.runcmdEx(cmd);
        if (!res.success && isTell) {
            player.sendText(StrFactory.cmdErr(res.output));
        }
        //debug
        if (Config.get(Config.GLOBAL, "debugMod", false)) {
            logger.debug(cmd);
            logger.debug(res);
        }
        if (Config.get(Config.GLOBAL, "outputCmd", false)) {
            logger.info(cmd);
        }
        return res;
    }

    public static async tpAsync(player: Player, x: number, y: number, z: number, dimid: 0 | 1 | 2, waitTime = 0): Promise<boolean> {
        let max = 15;
        return new Promise(resolve => {
            let id = setInterval(() => {
                if (player.teleport(x, y, z, dimid)) {
                    resolve(true);
                    clearInterval(id);
                }
                else {
                    if (max <= 0) {
                        resolve(false);
                        clearInterval(id);
                        return;
                    }
                    --max;
                }
            }, 50)
        })
    }
}