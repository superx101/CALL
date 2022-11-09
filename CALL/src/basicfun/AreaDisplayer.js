// const Constant = require("../global/Constant")

class AreaDisplayer {
    static posMap = new Map();

    /*** private */
    static add(pos, lens, offset) {
        try {
            //保存方块
            let data = {};
            let block = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
            if (block.hasBlockEntity()) {
                data.blockEntityNbt = block.getBlockEntity().getNbt();
            }
            else {
                data.blockEntityNbt = false;
            }
            data.blockNbt = block.getNbt();
            AreaDisplayer.posMap.set(pos, data);
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
            AreaDisplayer.undo();
            throw new Error("区域显示: 设置结构方块失败, " + e.message);
        }
    };

    /*** private */
    static undo(pos) {
        try {
            let data = AreaDisplayer.posMap.get(pos);
            mc.getBlock(pos.x, pos.y, pos.z, pos.dimid).setNbt(data.blockNbt);
            if (data.blockEntityNbt) {
                mc.getBlock(pos.x, pos.y, pos.z, pos.dimid).getBlockEntity().setNbt(data.blockEntityNbt);
            }
        }
        catch (e) {
            return false;
        }
        return false;
    };

    /**
     * @param {Area3D} area
     * @returns 
     */
    static set(area) {
        let tempArea = new Area3D(area);
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
            for (let map of AreaDisplayer.posMap) {
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
            AreaDisplayer.add(tempPos, lens, offset);
            return tempPos;
        }
        //超过最高高度限制，改为向下寻找
        success = false;
        for (let y = bottom - 1; y > Constant.SPACE.MIN_HIGHT; y--) {
            let canSet = true;
            tempPos.y = y;
            for (let map of AreaDisplayer.posMap) {
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
            AreaDisplayer.add(tempPos, lens, offset);
            return tempPos;
        }
        else {
            return null;
        }
    }

    static remove(pos) {
        AreaDisplayer.undo(pos);
        AreaDisplayer.posMap.delete(pos);
    }
}

module.exports = AreaDisplayer;