import Constant from "../common/Constant";
import Area3D from "../model/Area3D";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import StructureManager from "./StructureManager";

export default class AreaDisplayerManager {
    static posMap = new Map();

    /*** private */
    private static add(pos: Pos3D, lens: number[], offset: number) {
        try {
            //保存方块
            let data: { blockEntityNbt: NbtCompound, blockNbt: NbtCompound } = {
                blockEntityNbt: null,
                blockNbt: null
            };
            let block = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
            if (block.hasBlockEntity()) {
                data.blockEntityNbt = block.getBlockEntity().getNbt();
            }
            data.blockNbt = block.getNbt();
            AreaDisplayerManager.posMap.set(pos, data);
            //替换方块为结构方块
            mc.setBlock(pos.x, pos.y, pos.z, pos.dimid, "minecraft:structure_block", 0);
            let blockEntity = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid).getBlockEntity();
            let entityNbt = blockEntity.getNbt();
            entityNbt.setTag("showBoundingBox", new NbtByte(1));
            entityNbt.setTag("xStructureSize", new NbtInt(lens[0]));
            entityNbt.setTag("yStructureSize", new NbtInt(lens[1]));
            entityNbt.setTag("zStructureSize", new NbtInt(lens[2]));
            entityNbt.setTag("yStructureOffset", new NbtInt(offset));
            blockEntity.setNbt(entityNbt);
        }
        catch (e) {
            throw new Error("区域显示: 设置结构方块失败, " + e.message);
        }
    };

    /*** private */
    private static undo(pos: Pos3D, player: Player, playerData: PlayerData) {
        try {
            const block = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
            let data = AreaDisplayerManager.posMap.get(pos);
            
            if (block != null) {
                block.setNbt(data.blockNbt);
                if (data.blockEntityNbt != null) {
                    block.getBlockEntity().setNbt(data.blockEntityNbt);
                }
            }
            else {
                player.teleport(pos.x, pos.y, pos.z, pos.dimid);
                StructureManager.savePos(player, playerData);
                const bl = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
                bl.setNbt(data.blockNbt);
                if (data.blockEntityNbt != null) {
                    bl.getBlockEntity().setNbt(data.blockEntityNbt);
                }
                StructureManager.tp(player, playerData, false);
            }

        }
        catch (e) { }
    };

    public static set(area: Area3D) {
        let tempArea = Area3D.fromArea3D(area);
        let top = tempArea.end.y;
        let bottom = tempArea.start.y;
        let lens = tempArea.getLens();
        let tempPos = tempArea.start;
        let mapPos;
        let offset = 0;
        let success = false;
        //寻找一个未被记录的位置
        for (let y = top + 1; y < Constant.SPACE.MAX_HIGHT; y++) {
            let canSet = true;
            tempPos.y = y;
            for (let map of AreaDisplayerManager.posMap) {
                mapPos = map[0];
                if (mapPos.equals(tempPos)) {
                    canSet = false;
                    break;
                }
            }
            if (mc.getBlock(tempPos.x, tempPos.y, tempPos.z, tempPos.dimid).hasContainer()) {
                //不替换容器方块
                continue;
            }
            if (canSet) {
                offset = -lens[1] - y + top + 1;
                success = true;
                break;
            }
        }
        if (success) {
            AreaDisplayerManager.add(tempPos, lens, offset);
            return tempPos;
        }
        //超过最高高度限制，改为向下寻找
        success = false;
        for (let y = bottom - 1; y > Constant.SPACE.MIN_HIGHT; y--) {
            let canSet = true;
            tempPos.y = y;
            for (let map of AreaDisplayerManager.posMap) {
                mapPos = map[0];
                if (mapPos.equals(tempPos)) {
                    canSet = false;
                    break;
                }
            }
            if (mc.getBlock(tempPos.x, tempPos.y, tempPos.z, tempPos.dimid).hasContainer()) {
                //不替换容器方块
                continue;
            }
            if (canSet) {
                offset = bottom - y;
                success = true;
                break;
            }
        }
        if (success) {
            AreaDisplayerManager.add(tempPos, lens, offset);
            return tempPos;
        }
        else {
            return null;
        }
    }

    public static remove(playerData: PlayerData) {
        let player = mc.getPlayer(playerData.xuid);
        AreaDisplayerManager.undo(playerData.displayPos, player, playerData);
        AreaDisplayerManager.posMap.delete(playerData.displayPos);
    }
}