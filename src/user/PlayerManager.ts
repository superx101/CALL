import Constant from "../temp/Constant";
import Players from "./Players";
import CAPlayer from "./CAPlayer";

export default  class PlayerManager {
    public static refreshChunks(player:  LLSE_Player) {
        player.refreshChunks();
    }

    public static refreshPlayersChunks(caPlayer: CAPlayer) {
        Players.dataMap.forEach((v, xuid) => {
            let pl = mc.getPlayer(xuid);
            if (pl.pos.dimid == caPlayer.$.pos.dimid) {
                if (pl.distanceToSqr(caPlayer.$.pos) < Constant.CHUNK.R_SQR) {
                    pl.refreshChunks();
                }
            }
        });
    }
}