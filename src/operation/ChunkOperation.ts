import PlayerManager from "../manager/PlayerManager";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class ChunkOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData) {
        PlayerManager.refreshChunks(player);
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.ChunkOperation.start.success")));
    }
}
