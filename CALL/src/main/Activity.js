// const Players = require("../global/Players")
// const PlayerData = require("../tool/PlayerData")
// const StructureManager = require("../basicfun/StructureManager")
// const AreaOperation = require("../operation/AreaOperation")
// const SettingsOperation = require("../operation/SettingsOperation")

class Activity {
    static onServerCreate() {
        SettingsOperation.onServerCreate();
    }

    static onCreate(player) {
        let playerData = new PlayerData(player.xuid);
        Players.setData(player.xuid, playerData);
    }

    static onStart(player) {
        let playerData = Players.getData(player.xuid);
        AreaOperation.onStart(playerData);//area 恢复选区显示
    }

    static onStop(player) {
        let playerData = Players.getData(player.xuid);
        AreaOperation.onStop(playerData);//area 清除选区
    }

    static onDestroy(player) {
        let playerData = Players.getData(player.xuid);
        playerData.saveAll();
        Players.dataMap.delete(player.xuid);
        if (!playerData.settings.saveUndo) {
            StructureManager.clearUndoList(player);
            StructureManager.clearRedoList(player);
        }
        if (!playerData.settings.saveCopy) {
            StructureManager.clearCopy(player);
        }
    }
}

module.exports = Activity;