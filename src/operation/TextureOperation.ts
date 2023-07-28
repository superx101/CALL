import BlockType from "../model/BlockType";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class TextureOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData, res: { intPos: IntPos; enum_1: "a" | "b" }) {
        const block = mc.getBlock(res.intPos);
        const blockType = BlockType.generateFromBlock(block);

        if (res.enum_1 === 'a') 
            playerData.settings.texture.a = { type: blockType.type, states: blockType.states };
        else
            playerData.settings.texture.b = { type: blockType.type, states: blockType.states };
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.TextureOperation.start.s0", res.enum_1, blockType.toString())));

    }
}