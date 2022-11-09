// const Players = require("../global/Players")
// const StrFactory = require("../tool/StrFactory")
// const Activity = require("../main/Activity")

class EnableOperation {
    static on(player, output, playerData) {
        if (!playerData.settings.enable) {
            playerData.settings.enable = true;
            Activity.onStart(player);
        }
        output.success(StrFactory.cmdSuccess("已启用CALL"));
    }

    static off(player, output, playerData) {
        if (playerData.settings.enable) {
            playerData.settings.enable = false;
            Activity.onStop(player);
        }
        output.success(StrFactory.cmdSuccess("已禁用CALL (/call on指令再次启动)"));
    }

    static isEnable(player) {
        return Players.getData(player.xuid).settings.enable;
    }
}

module.exports = EnableOperation;