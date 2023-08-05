import Players from "../common/Players";
import StructureManager from "../manager/StructureManager";
import CAPlayer from "../model/CAPlayer";
import AreaOperation from "../operation/AreaOperation";
import SettingsOperation from "../operation/SettingsOperation";

export default class Activity {
    public static onServerCreate() {
        SettingsOperation.onServerCreate();
    }

    public static onCreate(xuid: string) {
        Players.createCAPlayer(xuid);
    }

    public static onStart(caPlayer: CAPlayer) {
        AreaOperation.onStart(caPlayer);//Restore selection display
    }

    public static onStop(caPlayer: CAPlayer) {
        AreaOperation.onStop(caPlayer);//clear selection display
    }

    public static onDestroy(caPlayer: CAPlayer) {
        if (caPlayer == null) return;
        caPlayer.saveAll();
        Players.dataMap.delete(caPlayer.xuid);
        if (!caPlayer.settings.saveUndo) {
            StructureManager.clearUndoList(caPlayer);
            StructureManager.clearRedoList(caPlayer);
        }
        if (!caPlayer.settings.saveCopy) {
            StructureManager.clearCopy(caPlayer);
        }
    }
}