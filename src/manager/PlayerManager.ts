import Constant from "../common/Constant";
import Players from "../common/Players";

export default  class PlayerManager {
    public static refreshChunks(player:  Player) {
        player.refreshChunks();
    }

    public static refreshPlayersChunks(player: Player) {
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