// const Config = require("./Config")
// const PermissionOperation = require("../operation/PermissionOperation")
// const Pos3D = require("../tool/Pos3D")
// const StrFactory = require("../tool/StrFactory")

const Activity = require("../main/Activity");
const Config = require("../global/Config");

class Players {
    static dataMap = new Map();

    static hasPermission(player) {
        switch (Config.get(Config.GLOBAL, "permission")) {
            case "all":
                return true;
            case "op":
                let isOp = player.isOP();
                let playerData = Players.getData(player.xuid);
                if(isOp && playerData == null) {
                    Activity.onCreate(player);
                }
                else if(!isOp && playerData != null) {
                    Activity.onDestroy(player);
                }
                return isOp;
            case "customize":
                return PermissionOperation.find(player.realName);
            default:
                return false;
        }
    }

    static setData(xuid, data) {
        Players.dataMap.set(xuid, data);
    }

    static getData(xuid) {
        return Players.dataMap.get(xuid);
    }

    static cmd(player, cmd, isTell = false) {
        if(Config.get(Config.GLOBAL, "oldCommandType") && Config.ISOLDCOMMAND) {
            cmd = `/execute "${player.realName}" ${new Pos3D(player.pos).floor().formatStr()} ` + cmd;
        }
        else {
            cmd = `/execute as "${player.realName}" positioned ${new Pos3D(player.pos).floor().formatStr()} run ` + cmd;
        }
        let res = mc.runcmdEx(cmd);
        if (!res.success && isTell) {
            player.sendText(StrFactory.cmdErr(res.output));
        }
        return res;
    }
}

module.exports = Players;