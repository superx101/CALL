import Players from "../common/Players";
import StructureManager from "../manager/StructureManager";
import PlayerData from "../model/PlayerData";
import AreaOperation from "../operation/AreaOperation";
import SettingsOperation from "../operation/SettingsOperation";
 
export default class Activity {
    public static onServerCreate() {
        SettingsOperation.onServerCreate();
    }

    public static onCreate(player: Player) {
        let playerData = new PlayerData(player.xuid);
        Players.setData(player.xuid, playerData);
    }

    public static onStart(player: Player) {
        let playerData = Players.getData(player.xuid);
        AreaOperation.onStart(playerData);//Restore selection display
    }

    public static onStop(player: Player) {
        let playerData = Players.getData(player.xuid);
        AreaOperation.onStop(playerData);//clear selection display
    }

    public static onDestroy(player: Player) {
        let playerData = Players.getData(player.xuid);
        if(playerData != null) {
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
}