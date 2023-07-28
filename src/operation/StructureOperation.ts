import Config from "../common/Config";
import Constant from "../type/Constant";
import StructureManager from "../manager/StructureManager";
import Area3D from "../model/Area3D";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import Structure from "../model/Structure";
import { Complex, Data } from "../type/Structure";
import StrFactory from "../util/StrFactory";
import AreaOperation from "./AreaOperation";
import { Pos } from "../type/Pos";
import Tr from "../util/Translator";

export default class StructureOperation {
    public static findId(input: string, player: Player) {
        let xuid = player.xuid;
        let data = StructureManager.getData(xuid);
        let saveList = data.saveList;
        let structid;
        if (saveList[input] != null) {
            structid = input;
        }
        if (structid == null) {
            //从public寻找id
            StructureManager.publicForEach((id: string, key: string) => {
                if (id === input) {
                    structid = id;
                    xuid = key;
                }
            });
        }
        
        if (structid == null) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.findId.s0"));
        }
        else {
            return { xuid, structid };
        }
    }

    public static checkTargetStruct(area: Area3D, pos: Pos3D, player: Player) {
        area = Area3D.fromArea3D(area);
        let lens = area.getLens();
        if (pos.y < Constant.SPACE.MIN_HIGHT) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.checkTargetStruct.s1") + Constant.SPACE.MIN_HIGHT);
        }
        else if (pos.y + lens[1] > Constant.SPACE.MAX_HIGHT) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.checkTargetStruct.s2", lens[1], pos.y, pos.y + lens[1], Constant.SPACE.MAX_HIGHT))
        }
    }

    public static save(player: Player, output: CommandOutput, playerData: PlayerData, res: { Name: any; }) {
        let name = res.Name;
        let data = StructureManager.getData(player.xuid);
        if (StrFactory.isLegalName(name)) {
            name = `save_${system.getTimeStr()}`;
        }
        AreaOperation.hasArea(playerData);//throw
        let maxNum = Config.get(Config.GLOBAL, "maxSaveStructure")
        if (Object.keys(data.saveList).length >= maxNum) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.save.s3", maxNum));
        }
        let st = new Structure(playerData.settings.area, name);
        StructureManager.savePos(player, playerData);
        StructureManager.save(player, playerData, st, 0, 1, (structid: string, data: Data) => {
            data.saveList[`${structid}`] = st;
            Config.set(Config.STRUCTURES, `private.${player.xuid}`, data);
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.save.s4", Area3D.fromArea3D(data.saveList[structid].area), structid, name)));
        });
    }

    public static load(player: Player, output: CommandOutput, playerData: PlayerData, res: { id: string; IntPos: IntPos; Mirror: string; Degrees: string; IncludeEntities: boolean; IncludeBlocks: boolean; Waterlogged: boolean; Integrity: number; Seed: string; }) {
        let r = StructureOperation.findId(res.id, player);
        let st = Config.get(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}`);
        let structure = new Structure(st.area, st.name, st.isPublic);
        let pos: Pos3D;
        if (res.IntPos == null) {
            pos = Pos3D.fromPos(player.pos).calibration().floor();
        }
        else {
            pos = Pos3D.fromPos(res.IntPos);
        }
        StructureOperation.checkTargetStruct(st.area, pos, player);
        let targetArea = Area3D.fromArea3D(st.area)
            .relative()
            .addBoth(pos.x, pos.y, pos.z);
        StructureManager.savePos(player, playerData);
        //撤销保存
        StructureManager.undoSave(player, playerData, [new Structure(targetArea)], () => {
            StructureManager.load(player, playerData, structure, r.structid, pos, 0, 1, res.Mirror, res.Degrees, res.IncludeEntities, res.IncludeBlocks, res.Waterlogged, res.Integrity, res.Seed, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.load.s5", st.name, pos, r.structid, targetArea)));
            });
        });

    }

    public static delete(player: Player, output: CommandOutput, playerData: PlayerData, res: { id: any; }) {
        let data = StructureManager.getData(player.xuid);
        let saveList = data.saveList;
        let sid = res.id;
        let st = saveList[sid];
        if (st == null) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.delete.s6"));
        }
        //删除 public
        if (st.isPublic) {
            let puArr = Config.get(Config.STRUCTURES, `public.${player.xuid}`);;
            delete puArr[puArr.indexOf(sid)];
            Config.set(Config.STRUCTURES, `public.${player.xuid}`, puArr);
        }
        StructureManager.delete(player, sid, st);
        let tempSt = saveList[sid];
        //删除 savelist
        delete saveList[sid];
        Config.set(Config.STRUCTURES, `private.${player.xuid}.saveList`, saveList);
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.delete.s7", sid, tempSt.name)));
    }

    public static list(player: Player, output: CommandOutput, playerData: PlayerData) {
        let prArr = StructureManager.getPrivateArr(player);
        let puArr = StructureManager.getPublicArr();
        let arr: Array<any> = [Format.White + Format.Bold + Tr._(player.langCode, "dynamic.StructureOperation.list.s8"), new Array(), Format.White + Format.Bold + Tr._(player.langCode, "dynamic.StructureOperation.list.s9"), new Array()];
        puArr.forEach((v: any) => {
            arr[1].push(Format.Bold + Format.MinecoinGold + v.id + Format.Clear, [Format.Gray + Tr._(player.langCode, "dynamic.StructureOperation.list.s10", v.name), Format.Gray + Tr._(player.langCode, "dynamic.StructureOperation.list.s11", data.xuid2name(v.author))]);
        });
        prArr.forEach((v: any) => {
            arr[3].push(Format.Bold + Format.MinecoinGold + v.id + Format.Clear, [Format.Gray + Tr._(player.langCode, "dynamic.StructureOperation.list.s10", v.name)]);
        });
        player.sendText(StrFactory.cmdMsg(Tr._(player.langCode, "dynamic.StructureOperation.list.s13")) + StrFactory.catalog(arr));
    }

    public static public(player: Player, output: CommandOutput, playerData: PlayerData, res: { id: string; }) {
        let r = StructureOperation.findId(res.id, player);
        if (r.xuid != player.xuid) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.public.s14"));
        }
        let st = Config.get(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}`);
        if (!st.isPublic) {
            let arr = Config.get(Config.STRUCTURES, `public.${r.xuid}`);
            if (arr == null) {
                arr = [];
            }
            arr.push(r.structid);
            Config.set(Config.STRUCTURES, `public.${r.xuid}`, arr);
            Config.set(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}.isPublic`, true);
        }
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.public.s15", st.name, r.structid)));
    }

    public static private(player: Player, output: CommandOutput, playerData: PlayerData, res: { id: string; }) {
        let r = StructureOperation.findId(res.id, player);
        if (r.xuid != player.xuid) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.public.s14"));
        }
        let st = Config.get(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}`);
        if (st.isPublic) {
            let arr = Config.get(Config.STRUCTURES, `public.${r.xuid}`);
            arr.splice(arr.indexOf(r.structid), 1);
            if (arr.length == 0) {
                Config.del(Config.STRUCTURES, `public.${r.xuid}`);
            }
            else {
                Config.set(Config.STRUCTURES, `public.${r.xuid}`, arr);
            }
            Config.set(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}.isPublic`, false);
        }
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.private.s17", st.name, r.structid)));
    }

    public static undo(player: Player, output: CommandOutput, playerData: PlayerData) {
        let undoList = StructureManager.getData(player.xuid).undoList;
        if (undoList.length <= 0) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.undo.s18"));
        }
        let complex = undoList.pop();
        let structArr: Array<Structure> = [];
        Object.keys(complex).forEach((sid) => {
            let area = Area3D.fromArea3D(complex[sid].area);
            structArr.push(new Structure(area, "system_save"));
        });
        StructureManager.savePos(player, playerData);
        StructureManager.redoPush(player, playerData, structArr, () => {
            StructureManager.undoPop(player, playerData, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.redo.s23")));
            });
        });
    }

    public static redo(player: Player, output: CommandOutput, playerData: PlayerData) {
        let redoList = StructureManager.getData(player.xuid).redoList;
        if (redoList.length <= 0) {
            throw new Error(Tr._(player.langCode, "dynamic.StructureOperation.redo.s19"));
        }
        let complex = redoList.pop();
        let structArr: Array<Structure> = [];
        Object.keys(complex).forEach((sid) => {
            let area = Area3D.fromArea3D(complex[sid].area);
            structArr.push(new Structure(area, "system_save"));
        });
        StructureManager.savePos(player, playerData);
        StructureManager.undoPush(player, playerData, structArr, () => {
            StructureManager.redoPop(player, playerData, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.redo.s24")));
            });
        });

    }

    public static copy(player: Player, output: CommandOutput, playerData: PlayerData) {
        AreaOperation.hasArea(playerData);//throw
        let data = StructureManager.getData(player.xuid);
        let lastComplex = data.copy;
        let dellast = false;
        //删除上个存储记录
        if (Object.keys(lastComplex).length > 0) {
            dellast = true;
        }
        let area = Area3D.fromArea3D(playerData.settings.area);
        let st = new Structure(area);
        //copy
        StructureManager.copy(player, playerData, [st], dellast, lastComplex, (complex: Complex) => {
            //存储记录
            Config.set(Config.STRUCTURES, `private.${player.xuid}.copy`, complex);
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.copy.s20", area)));
        });
    }

    public static paste(player: Player, output: CommandOutput, playerData: PlayerData, res: { IntPos: Pos; }) {
        let data = StructureManager.getData(player.xuid);
        let keys = Object.keys(data.copy);
        if (keys.length == 0) {
            output.error(Tr._(player.langCode, "dynamic.StructureOperation.paste.s21"));
            return;
        }
        let pos: Pos3D;
        if (res.IntPos != null) {
            pos = Pos3D.fromPos(res.IntPos);
        }
        else {
            pos = Pos3D.fromPos(player.pos).calibration().floor();
        }
        keys.forEach((sid) => {
            StructureOperation.checkTargetStruct(data.copy[sid].area, pos, player);
        })
        StructureManager.savePos(player, playerData);
        StructureManager.undoSave(player, playerData, StructureManager.getTargetStructs(data.copy, pos), () => {
            StructureManager.paste(player, playerData, pos, data, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.StructureOperation.paste.s22", pos.floor())));
            });
        });
    }

    public static getUndoSize(xuid: string) {
        return StructureManager.getData(xuid).undoList.length;
    }

    public static getRedoSize(xuid: string) {
        return StructureManager.getData(xuid).redoList.length;
    }

    public static getSaveList(mod: number, player: Player): [] {
        if (mod == 0) {
            return StructureManager.getPrivateArr(player);
        }
        else {
            return StructureManager.getPublicArr();
        }
    }

    public static canPaste(xuid: string) {
        return Object.keys(StructureManager.getData(xuid).copy).length > 0;
    }
}