import Activity from "../Activity";
import CAPlayer from "./CAPlayer";
import { Pos3 } from "../common/Pos3";
import PermissionOperation from "./PermissionOperation";
import { PermissionsType } from "../common/Config";
import StrFactory from "../util/StrFactory";
import Config from "../common/Config";

export default class Players {
    public static dataMap = new Map<string, CAPlayer>();

    public static hasPermission(player: LLSE_Player) {
        const suvialActive = Config.get(Config.GLOBAL, "suvivalModeActive", false);
        if (!suvialActive && player.gameMode != 1)
            return false;

        switch (Config.get(Config.GLOBAL, "permission")) {
            case PermissionsType.ALL:
                return true;
            case PermissionsType.OP:
                return player.isOP();
            case PermissionsType.CUSTOMIZE:
                return PermissionOperation.find(player.realName);
            case PermissionsType.FROM_FILE:
                return PermissionOperation.findByFile(player.realName);
            case PermissionsType.FROM_TAG:
                return PermissionOperation.checkTag(player);
            default:
                return false;
        }
    }

    public static createCAPlayer(xuid: string) {
        const caPlayer = new CAPlayer(xuid);
        Players.dataMap.set(xuid, caPlayer);
        return caPlayer;
    }

    public static fetchCAPlayer(xuid: string) {
        if (!Players.dataMap.has(xuid)) {
            Players.createCAPlayer(xuid);
        }
        return Players.getCAPlayer(xuid);
    }

    public static setCAPlayer(xuid: string, data: CAPlayer) {
        Players.dataMap.set(xuid, data);
    }

    public static getCAPlayer(xuid: string) {
        return Players.dataMap.get(xuid);
    }

    /**
     * @deprecated
     */
    public static silenceCmd(caPlayer: CAPlayer, cmd: string) {
        caPlayer.$.runcmd(cmd);
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

    public static async tpAsync(
        caPlayer: CAPlayer,
        x: number,
        y: number,
        z: number,
        dimid: 0 | 1 | 2,
        waitTime = 0
    ): Promise<boolean> {
        let max = 15;
        return new Promise((resolve) => {
            let id = setInterval(() => {
                if (caPlayer.$.teleport(x, y, z, dimid)) {
                    resolve(true);
                    clearInterval(id);
                } else {
                    if (max <= 0) {
                        resolve(false);
                        clearInterval(id);
                        return;
                    }
                    --max;
                }
            }, 50);
        });
    }
}
