const Constant = require("../global/Constant");

class PlayerManager {
    static refreshChunks(player) {
        player.refreshChunks();
    }

    static refreshPlayersChunks(player) {
        Players.dataMap.forEach((v, xuid) => {
            let pl = mc.getPlayer(xuid);
            if (pl.pos.dimid == player.pos.dimid) {
                if (pl.distanceToSqr(player.pos) < Constant.CHUNK.R_SQR) {
                    pl.refreshChunks();
                }
            }
        });
    }
}

module.exports = PlayerManager;