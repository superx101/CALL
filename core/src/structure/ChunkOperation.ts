import PlayerManager from "../user/PlayerManager";
import CAPlayer from "../user/CAPlayer";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class ChunkOperation {
    public static start(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        PlayerManager.refreshChunks(player);
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.ChunkOperation.start.success")));
    }
}
