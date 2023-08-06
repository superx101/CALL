import Constant from "../type/Constant";
import Area3D from "../model/Area3D";
import CAPlayer from "../model/CAPlayer";
import Pos3D from "../model/Pos3D";
import { Warn } from "../type/Error";
import StrFactory from "../util/StrFactory";
import StructureManager from "./StructureManager";
import Enums from "../type/Enums";
import Tr from "../util/Translator";

export default class AreaDisplayerManager {
    static posMap = new Map();

    /*** private */
    private static add(pos: Pos3D, lens: number[], offset: number, caPlayer: CAPlayer) {
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
            throw new Error(Tr._(caPlayer.$.langCode, "dynamic.AreaDisplayerManager.add.error", `${e.message}`));
        }
    };

    /*** private */
    private static undo(pos: Pos3D, caPlayer: CAPlayer) {
        const player = mc.getPlayer(caPlayer.xuid);
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
                player.sendText(StrFactory.cmdWarn(Tr._(player.langCode, 'dynamic.AreaDisplayerManager.undo.cancel')));
                StructureManager.savePos(caPlayer);

                const id = setInterval(()=>{
                    player.teleport(pos.x, pos.y, pos.z, pos.dimid);
                    const bl = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
                    if(bl != null) {
                        bl.setNbt(data.blockNbt);
                        if (data.blockEntityNbt != null) {
                            bl.getBlockEntity().setNbt(data.blockEntityNbt);
                        }
                        StructureManager.tp(caPlayer);
                        player.sendText(StrFactory.cmdTip(Tr._(player.langCode, 'dynamic.AreaDisplayerManager.undo.canceled')));
                        clearInterval(id);
                    }
                }, 200);
            }
        }
        catch (e) { }
    };

    public static set(area: Area3D, caPlayer: CAPlayer) {
        let tempArea = Area3D.fromArea3D(area);
        let top = tempArea.end.y;
        let bottom = tempArea.start.y;
        let lens = tempArea.getLens();
        let tempPos = tempArea.start;
        let mapPos;
        let offset = 0;
        let success = false;

        //无法加载则退出
        if (mc.getBlock(tempPos.x, tempPos.y, tempPos.z, tempPos.dimid) == null) {
            throw new Warn("dynamic.AreaDisplayerManager.set.cannotLoad")
        }

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
            AreaDisplayerManager.add(tempPos, lens, offset, caPlayer);
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
            AreaDisplayerManager.add(tempPos, lens, offset, caPlayer);
            return tempPos;
        }
        else {
            throw new Error(Tr._(caPlayer.$.langCode, "dynamic.AreaDisplayerManager.set.cannotDisplay"));
        }
    }

    public static remove(caPlayer: CAPlayer) {
        AreaDisplayerManager.undo(caPlayer.displayPos, caPlayer);
        AreaDisplayerManager.posMap.delete(caPlayer.displayPos);
    }

    public static areaTextTip(caPlayer: CAPlayer) {
        if(caPlayer.settings.areaTextShow && caPlayer.hasSetArea && caPlayer.settings.enable) {
            const area = Area3D.fromArea3D(caPlayer.settings.area);
            const lens = area.getLens();
            const str0 = Tr._(caPlayer.$.langCode, "dynamic.AreaDisplayerManager.areaTextTip.str0", `${caPlayer.settings.area.start}->${caPlayer.settings.area.end}`);
            const str1 = Tr._(caPlayer.$.langCode, "dynamic.AreaDisplayerManager.areaTextTip.str1", `${Format.Red}${lens[0]} ${Format.Green}${lens[1]} ${Format.Aqua}${lens[2]}`);
            const space = (str0.length - str1.length + 3) / 2;
            caPlayer.$.sendText(`${str0}\n${Array.from({length: space}, ()=>' ').join('') + str1}`, Enums.msg.TIP);
        }
    }
}