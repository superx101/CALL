import Players from "./user/Players";
import StructureService from "./structure/StructureService";
import CAPlayer from "./user/CAPlayer";
import AreaOperation from "./structure/AreaOperation";
import SettingsOperation from "./user/SettingsOperation";

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
            StructureService.clearUndoList(caPlayer);
            StructureService.clearRedoList(caPlayer);
        }
        if (!caPlayer.settings.saveCopy) {
            StructureService.clearCopy(caPlayer);
        }
    }
}