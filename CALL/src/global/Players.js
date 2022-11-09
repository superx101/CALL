// const Config = require("./Config")
// const PermissionOperation = require("../operation/PermissionOperation")
// const Pos3D = require("../tool/Pos3D")
// const StrFactory = require("../tool/StrFactory")

class Players {
    static dataMap = new Map();

    static hasPermission(player) {
        switch (Config.get(Config.GLOBAL, "permission")) {
            case "all":
                return true;
            case "op":
                return player.isOP();
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
        cmd = `/execute "${player.realName}" ${new Pos3D(player.pos).floor().formatStr()} ` + cmd;
        let res = mc.runcmdEx(cmd);
        log(cmd)
        if (!res.success && isTell) {
            player.sendText(StrFactory.cmdErr(res.output));
        }
        return res;
    }
}

module.exports = Players;