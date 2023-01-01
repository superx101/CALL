import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import StrFactory from "../util/StrFactory";
import BlockEditerForm from "../views/BlockEditerForm";

export default class BlockEditerOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData, res: {intPos: IntPos, nbt: string, BlockEntity: string, enum_1: string}) {
        switch (res.enum_1) {
            case undefined:
                BlockEditerOperation.edit(output, res.intPos, res.nbt, res.BlockEntity);
                break;
            case "menu":
            case "me":
                new BlockEditerForm(player, playerData).init(Pos3D.fromPos(res.intPos).floor());
                break;
        }
    }

    private static edit(output: CommandOutput, intPos: IntPos, nbt: string, BlockEntity: string) {
        let block = mc.getBlock(intPos);
        let blockRes: boolean, entityRes: boolean = true;
        if(block == null) throw new Error("无法读取方块, 请保证修改的方块已被加载");

        blockRes = block.setNbt(NBT.parseSNBT(nbt));

        if(BlockEntity != null && block.hasBlockEntity()) {
            const entity = block.getBlockEntity();
            if(entity != null) block.getBlockEntity().setNbt(NBT.parseSNBT(BlockEntity));
        }

        if(blockRes && entityRes) {
            output.success(StrFactory.cmdSuccess(`${Pos3D.fromPos(block.pos).toString()} 处方块属性已写入`));
        }
        else {
            if(!blockRes) {
                output.error(StrFactory.cmdErr(`${Pos3D.fromPos(block.pos).toString()} 处方块nbt写入失败`));
            }
            if(!entityRes) {
                output.error(StrFactory.cmdErr(`${Pos3D.fromPos(block.pos).toString()} 处方块实体nbt写入失败 `));
            }
        }
    }
}