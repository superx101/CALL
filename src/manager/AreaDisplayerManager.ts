import Constant from "../type/Constant";
import Area3D from "../model/Area3D";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import { Warn } from "../type/Error";
import StrFactory from "../util/StrFactory";
import StructureManager from "./StructureManager";
import Enums from "../type/Enums";
import Tr from "../util/Translator";

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
            throw new Error(`dynamic.AreaDisplayerManager.add.error&&${e.message}`);
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
                player.sendText(StrFactory.cmdWarn(Tr._(player.langCode, 'dynamic.AreaDisplayerManager.undo.cancel')));
                StructureManager.savePos(player, playerData);

                const id = setInterval(()=>{
                    player.teleport(pos.x, pos.y, pos.z, pos.dimid);
                    const bl = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
                    if(bl != null) {
                        bl.setNbt(data.blockNbt);
                        if (data.blockEntityNbt != null) {
                            bl.getBlockEntity().setNbt(data.blockEntityNbt);
                        }
                        StructureManager.tp(player, playerData, false);
                        player.sendText(StrFactory.cmdTip(Tr._(player.langCode, 'dynamic.AreaDisplayerManager.undo.canceled')));
                        clearInterval(id);
                    }
                }, 200);
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
            throw new Error("dynamic.AreaDisplayerManager.set.cannotDisplay");
        }
    }

    public static remove(playerData: PlayerData) {
        let player = mc.getPlayer(playerData.xuid);
        AreaDisplayerManager.undo(playerData.displayPos, player, playerData);
        AreaDisplayerManager.posMap.delete(playerData.displayPos);
    }

    public static areaTextTip(player: Player, playerData: PlayerData) {
        if(playerData.settings.areaTextShow && playerData.hasSetArea && playerData.settings.enable) {
            const area = Area3D.fromArea3D(playerData.settings.area);
            const lens = area.getLens();
            const str0 = Tr._(player.langCode, `${playerData.settings.area.start}->${playerData.settings.area.end}`);
            const str1 = Tr._(player.langCode,`${Format.Red}${lens[0]} ${Format.Green}${lens[1]} ${Format.Aqua}${lens[2]}`);
            const space = (str0.length - str1.length + 3) / 2;
            player.sendText(`${str0}\n${Array.from({length: space}, ()=>' ').join('') + str1}`, Enums.msg.TIP);
        }
    }
}