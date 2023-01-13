import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";

export default class TextureOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData, res: { intPos: IntPos; enum_1: "a" | "b" }) {
        const block = mc.getBlock(res.intPos);

        if (res.enum_1 === 'a')
            playerData.settings.texture.a = { type: block.type, tileData: block.tileData };
        else
            playerData.settings.texture.b = { type: block.type, tileData: block.tileData };
        output.success(StrFactory.cmdSuccess(`已选择材质${res.enum_1}: ${block.type}`));

    }
}