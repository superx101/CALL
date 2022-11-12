const StrFactory = require("../tool/StrFactory");
const PlayerManager = require("../basicfun/PlayerManager");

class ChunkOperation {
    static start(player, output, playerData) {
        PlayerManager.refreshChunks(player);
        output.success(StrFactory.cmdSuccess("已为您刷新区块"));
    }
}

module.exports = ChunkOperation;