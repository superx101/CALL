import Activity from "../activity/Activity";
import CAPlayer from "../model/CAPlayer";
import Pos3D from "../model/Pos3D";
import PermissionOperation from "../operation/PermissionOperation";
import { PermissionsType } from "../type/Config";
import StrFactory from "../util/StrFactory";
import Config from "./Config";
import * as os from "os"

export default class Players {
    public static dataMap = new Map<string, CAPlayer>();

    private static hasPermission(player: LLSE_Player) {
        switch (Config.get(Config.GLOBAL, "permission")) {
            case PermissionsType.ALL:
                return true;
            case PermissionsType.OP:
                return player.isOP();
            case PermissionsType.CUSTOMIZE:
                return PermissionOperation.find(player.realName);
            default:
                return false;
        }
    }

    public static checkPermission(player: LLSE_Player) {
        let caPlayer = Players.getCAPlayer(player.xuid);
        const hasPermission = Players.hasPermission(player);
        if(hasPermission && caPlayer == null) {
                Activity.onCreate(player.xuid);
        }
        else if (!hasPermission && caPlayer != null) {
            Activity.onDestroy(caPlayer);
        }
        return hasPermission;
    }

    public static createCAPlayer(xuid: string) {
        Players.dataMap.set(xuid, new CAPlayer(xuid));
    }

    public static setCAPlayer(xuid: string, data: CAPlayer) {
        Players.dataMap.set(xuid, data);
    }

    public static getCAPlayer(xuid: string) {
        return Players.dataMap.get(xuid);
    }

    public static silenceCmd(caPlayer: CAPlayer, cmd: string) {
        caPlayer.$.runcmd(cmd);
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

    public static cmd(caPlayer: CAPlayer, cmd: string, isTell: boolean = true) {
        cmd = `/execute at "${caPlayer.$.realName}" run ` + cmd;

        //sendText
        let res = mc.runcmdEx(cmd);
        if (!res.success && isTell) {
            caPlayer.$.sendText(StrFactory.cmdErr(res.output));
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

    public static async tpAsync(caPlayer: CAPlayer, x: number, y: number, z: number, dimid: 0 | 1 | 2, waitTime = 0): Promise<boolean> {
        let max = 15;
        return new Promise(resolve => {
            let id = setInterval(() => {
                if (caPlayer.$.teleport(x, y, z, dimid)) {
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