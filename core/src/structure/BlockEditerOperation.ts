import CAPlayer from "../user/CAPlayer";
import { Pos3 } from "../common/Pos3";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
import BlockEditerForm from "../view/BlockEditerForm";

export default class BlockEditerOperation {
    public static start(output: CommandOutput, caPlayer: CAPlayer, res: {intPos: IntPos, nbt: string, BlockEntity: string, enum_1: string}) {
        switch (res.enum_1) {
            case undefined:
                BlockEditerOperation.edit(caPlayer, output, res.intPos, res.nbt, res.BlockEntity);
                break;
            case "menu":
            case "me":
                new BlockEditerForm(caPlayer).init(Pos3.fromPos(res.intPos).floor());
                break;
        }
    }

    private static edit(caPlayer: CAPlayer, output: CommandOutput, intPos: IntPos, nbt: string, BlockEntity: string) {
        let block = mc.getBlock(intPos);
        let blockRes: boolean, entityRes: boolean = true;
        if(block == null) throw new Error(Tr._(caPlayer.$.langCode, "dynamic.BlockEditerOperation.edit.error"));

        blockRes = block.setNbt(NBT.parseSNBT(nbt));

        if(BlockEntity != null && block.hasBlockEntity()) {
            const entity = block.getBlockEntity();
            if(entity != null) block.getBlockEntity().setNbt(NBT.parseSNBT(BlockEntity));
        }

        if(blockRes && entityRes) {
            output.success(StrFactory.cmdSuccess(Tr._(caPlayer.$.langCode, `${Pos3.fromPos(block.pos).toString()}`)));
        }
        else {
            if(!blockRes) {
                output.error(StrFactory.cmdErr(Tr._(caPlayer.$.langCode, `${Pos3.fromPos(block.pos).toString()}`)));
            }
            if(!entityRes) {
                output.error(StrFactory.cmdErr(Tr._(caPlayer.$.langCode, `${Pos3.fromPos(block.pos).toString()}`)));
            }
        }
    }
}