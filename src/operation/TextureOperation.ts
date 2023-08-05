import BlockType from "../model/BlockType";
import CAPlayer from "../model/CAPlayer";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class TextureOperation {
    public static start(output: CommandOutput, caPlayer: CAPlayer, res: { intPos: IntPos; enum_1: "a" | "b" }) {
        const block = mc.getBlock(res.intPos);
        const blockType = BlockType.generateFromBlock(block);

        if (res.enum_1 === 'a') 
            caPlayer.settings.texture.a = { type: blockType.type, states: blockType.states };
        else
            caPlayer.settings.texture.b = { type: blockType.type, states: blockType.states };
        output.success(StrFactory.cmdSuccess(Tr._(caPlayer.$.langCode, "dynamic.TextureOperation.start.s0", res.enum_1, blockType.toString())));

    }
}