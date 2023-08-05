import PlayerManager from "../manager/PlayerManager";
import CAPlayer from "../model/CAPlayer";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class ChunkOperation {
    public static start(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        PlayerManager.refreshChunks(player);
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.ChunkOperation.start.success")));
    }
}
