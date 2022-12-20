import PlayerManager from "../manager/PlayerManager";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";

export default class ChunkOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData) {
        PlayerManager.refreshChunks(player);
        output.success(StrFactory.cmdSuccess("已为您刷新区块"));
    }
}
