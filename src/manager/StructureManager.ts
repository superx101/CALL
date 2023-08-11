import Config from "../common/Config";
import Players from "../common/Players";
import Area3D from "../model/Area3D";
import CAPlayer from "../model/CAPlayer";
import Pos3D from "../model/Pos3D";
import Structure from "../model/Structure";
import { Areas } from "../type/Data";
import StrFactory from "../util/StrFactory";
import NBTManager from "./NBTManager";
import { Complex, Data } from "../type/Structure";
import { Matrix3D, Transform3 } from "../util/SimpleMatrix";
import { FileMode } from "../type/Common";
import Tr from "../util/Translator";

export default class StructureManager {
    public static STRUCT_OPN_MOD = {
        FAST: 0,
        STABLE: 1
    }
    public static uid = 0;

    /*** private */
    private static canGetBlock(area: Area3D): boolean {
        if (mc.getBlock(area.start.x, area.start.y, area.start.z, area.start.dimid) != null
            && mc.getBlock(area.end.x, area.end.y, area.end.z, area.start.dimid) != null) {
            return true;
        }
        return false;
    }

    private static async loadChunk(caPlayer: CAPlayer, area: Area3D): Promise<boolean> {
        const player = caPlayer.$;
        const max = Config.get(Config.GLOBAL, "maxLoadCheckNum");
        let n = max;
        return new Promise(resolve => {
            if (StructureManager.canGetBlock(area)) {
                resolve(true);
                return;
            }
            else {
                if (caPlayer.settings.loadChuckTip) {
                    player.sendText(StrFactory.cmdMsg(Tr._(player.langCode, "dynamic.StructureManager.loadChunk.overRange", `${area}`)));
                }
                const id = setInterval(() => {
                    if (StructureManager.canGetBlock(area)) {
                        if (caPlayer.settings.loadChuckTip) {
                            player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.StructureManager.loadChunk.success", `${area}`)));
                        }
                        clearInterval(id);
                        resolve(true);
                        return;
                    }
                    else if (n <= 0) {
                        //失败
                        if (caPlayer.settings.loadChuckTip) {
                            player.sendText(StrFactory.cmdErr(Tr._(player.langCode, "dynamic.StructureManager.loadChunk.cancel", `${area}`, max)));
                        }
                        clearInterval(id);
                        resolve(false);
                        return;
                    }
                    player.teleport((area.start.x + area.end.x) / 2, (area.start.y + area.end.y) / 2, (area.start.z + area.end.z) / 2, area.start.dimid);
                    n--;
                }, 400);
            }
        });
    }

    public static register(xuid: string) {
        let pr = Config.get(Config.STRUCTURES, "private");
        let data = pr.default;
        data.pid = ("0000" + Object.keys(pr).length).slice(-4);
        Config.set(Config.STRUCTURES, `private.${xuid}`, data);
        return data;
    }

    public static getData(xuid: string) {
        let data = Config.get(Config.STRUCTURES, `private.${xuid}`);
        if (data == null) {
            data = StructureManager.register(xuid);
        }
        return data;
    }

    public static setData(xuid: string, data: Data) {
        return Config.set(Config.STRUCTURES, `private.${xuid}`, data);
    }

    public static publicForEach(callback: Function) {
        let pu = Config.get(Config.STRUCTURES, "public")
        let keys = Object.keys(pu);
        let structids;
        for (let key of keys) {
            structids = pu[`${key}`];
            for (let i = 0; i < structids.length; i++) {
                let id = structids[i];
                if(id == null) continue;
                callback(id, key);
            }
        }
    }

    public static savePos(caPlayer: CAPlayer) {
        caPlayer.prePos = Pos3D.fromPos(caPlayer.$.pos).calibration();
        caPlayer.direction = caPlayer.$.direction;
    }

    public static tp(caPlayer: CAPlayer) {
        let pos = caPlayer.prePos;
        const player = caPlayer.$;
        let diArr = Pos3D.directionToPosArr(caPlayer.direction);
        let res: { success: boolean; output: string; } = Players.cmd(caPlayer, `/tp "${player.realName}" ${pos.x.toFixed(2)} ${(pos.y - 0.5).toFixed(2)} ${pos.z.toFixed(2)} facing ${parseFloat(pos.x.toFixed(2)) + diArr[0]} ${parseFloat(pos.y.toFixed(2)) + diArr[1]} ${parseFloat(pos.z.toFixed(2)) + diArr[2]}`, false);
        if (res.success) {
            caPlayer.refreshAllChunks();
        }
    }

    public static async traversal(caPlayer: CAPlayer, areas: Areas, title: string, color: number, successCallback: (x: number, z: number) => Promise<boolean>, overCallback: () => void, failCallback: (x: number, z: number) => void, waitTime: number = Config.get(Config.GLOBAL, "traversalWaitTime")): Promise<void> {
        const player = caPlayer.$;
        async function waiter() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true);
                }, waitTime)
            });
        }

        caPlayer.forbidCmd = true;//禁止执行指令
        const mx = areas.length;
        const mz = areas[0].length;
        const barUid = Math.floor(Math.random() * 1000);//进度条id
        const total = mx * mz;//进度条总数
        //进度条置0
        player.setBossBar(barUid, StrFactory.cmdMsg(title), 0, color);

        let res: boolean;
        for (let x = 0; x < mx; x++) {
            for (let z = 0; z < mz; z++) {
                res = await StructureManager.loadChunk(caPlayer, areas[x][z]);
                //加载或执行失败, 退出
                if (!res || !await successCallback(x, z)) {
                    caPlayer.forbidCmd = false;
                    if (caPlayer.settings.displayProgressBar) {
                        player.removeBossBar(barUid)//移除进度条
                    }
                    StructureManager.tp(caPlayer);
                    failCallback(x, z);
                    return;
                }
                //显示进度条
                if (caPlayer.settings.displayProgressBar) {
                    player.setBossBar(barUid, StrFactory.cmdMsg(title), (x * mz + z + 1) * 100 / total, color);
                }
                await waiter();//等待
            }
        }

        //结束
        player.removeBossBar(barUid)//移除进度条
        caPlayer.forbidCmd = false;
        overCallback();

        return;
    }

    public static getId(): number {
        return StructureManager.uid++;
    }

    public static generateSid(xuid: string): string {
        return "c" + StructureManager.getData(xuid).pid + system.getTimeStr()
            .replaceAll(" ", "")
            .replaceAll("-", "")
            .replaceAll(":", "")
            .substring(2)
            + ("000" + StructureManager.getId().toString(16)).slice(-3);
    }

    public static async save(caPlayer: CAPlayer, structure: Structure, index: number, total: number, overCallback: (structid: string, data: any) => void) {
        const player = caPlayer.$;
        let data = StructureManager.getData(player.xuid);
        let areas = structure.getAreas();

        let structid = StructureManager.generateSid(player.xuid);

        //保存所有分结构
        await StructureManager.traversal(caPlayer, areas, Tr._(player.langCode, "dynamic.StructureManager.save.saving", `${index + 1}/${total}`) , 1, (x: number, z: number) => {
            let saveid;
            saveid = structid + "_" + x + "_" + z;
            NBTManager.save(saveid, areas[x][z], false, !caPlayer.settings.saveEntity);
            return Promise.resolve(true);
        }, () => {
            //结束
            overCallback(structid, data);
        }, (x: number, z: number) => {
            //删除所有保存
            for (let tz = 0; tz <= z; tz++) {
                for (let tx = 0; tx <= x; tx++) {
                    let saveid = structid + "_" + x + "_" + z;
                    // Players.cmd(player, `/structure delete "${saveid}"`);
                    NBTManager.del(saveid);
                }
            }
        }, 20);
        return;
    }

    public static async load(caPlayer: CAPlayer, preStructure: Structure, structid: string, posInt: Pos3D, index: number, total: number, mirror = "none", degrees = "0_degrees", includeEntities = false, includeBlocks = true, waterlogged = false, integrity = 100, seed = "", overCallback: () => void) {
        const player = caPlayer.$;
        let area = Area3D.fromArea3D(preStructure.area).relative();
        let areas = new Structure(area).getAreas();
        let degreeNum = parseFloat(degrees);
        //area变换矩阵
        let trans = Transform3.getBasicRota(parseFloat(degrees))
            .mul(Transform3.getMirror(mirror));
        let sta2 = area.start.transform2D(trans as Matrix3D);
        let end2 = area.end.transform2D(trans as Matrix3D);
        let lens2 = [end2.x - sta2.x, end2.z - sta2.z];
        //areas中所有area变换
        for (let iz = 0; iz < preStructure.zSize; iz++) {
            for (let ix = 0; ix < preStructure.xSize; ix++) {
                let a = areas[ix][iz].transform2D(trans as Matrix3D);
                a.start.add(posInt.x, posInt.y, posInt.z);
                a.end.add(posInt.x, posInt.y, posInt.z);
                areas[ix][iz] = a;
            }
        }
        //坐标修复
        let tx = 0;
        let tz = 0;
        if (lens2[0] < 0) {
            tx = -lens2[0];
        }
        if (lens2[1] < 0) {
            tz = -lens2[1];
        }
        let saveid;
        let start;
        await StructureManager.traversal(caPlayer, areas, Tr._(player.langCode, "dynamic.StructureManager.load.loading", `${index + 1}/${total}`), 6, (x: number, z: number) => {
            //index变换
            saveid = structid + "_" + x + "_" + z;
            // Players.cmd(player, `/structure load "${saveid}" ${areas[x][z].start.formatStr()} ${degrees} ${mirror} ${String(includeEntities)} ${String(includeBlocks)} ${integrity} ${seed}`);
            start = areas[x][z].start;
            return Promise.resolve(NBTManager.load(caPlayer, saveid, new Pos3D(start.x + tx, start.y, start.z + tz, start.dimid), mirror, degreeNum));
        }, () => {
            overCallback();
        }, (x: number, z: number) => { }, Config.get(Config.GLOBAL, "traversalWaitTime"));

        return;
    }

    public static delete(caPlayer: CAPlayer, sid: string, st: Structure) {
        //cmd delete
        for (let z = 0; z < st.zSize; z++) {
            for (let x = 0; x < st.xSize; x++) {
                let saveid = sid + "_" + x + "_" + z;
                NBTManager.del(saveid);
            }
        }
        if (st.isPublic) {
            let pu = Config.get(Config.STRUCTURES, `public`);
            let data = pu[caPlayer.$.xuid];
            delete data[data.indexOf(sid)];
            if (data.length == 0) {
                delete pu[caPlayer.$.xuid];
            }
            Config.set(Config.STRUCTURES, `public`, pu);
        }
    }

    public static getAllNBT(st: Structure, sid: string): NbtCompound[][] {
        const arr: NbtCompound[][] = [];

        let tempArr: NbtCompound[] = [];
        let bnbt;
        for (let x = 0; x < st.xSize; x++) {
            tempArr = [];
            for (let z = 0; z < st.zSize; z++) {
                //@ts-ignore
                bnbt = new File(NBTManager.PATH + `/${sid + "_" + x + "_" + z}.mcstructure`, FileMode.ReadMode, true)
                    .readAllSync();
                //@ts-ignore
                tempArr.push(NBT.parseBinaryNBT(bnbt));
            }
            arr.push(tempArr);
        }

        return arr;
    }

    public static getPrivate(): any {
        return Config.get(Config.STRUCTURES, `private`);
    }

    public static getPrivateArr(caPlayer: CAPlayer): [] {
        let arr: any = [];
        let saveList = Config.get(Config.STRUCTURES, `private.${caPlayer.$.xuid}.saveList`);
        Object.keys(saveList).forEach((structid) => {
            arr.push({ id: structid, name: saveList[structid].name, author: caPlayer.$.xuid, isPublic: saveList[structid].isPublic });
        });
        return arr;
    }

    public static getPublicArr(): [] {
        let arr: any = [];
        StructureManager.publicForEach((id: string, key: string) => {
            let st: Structure = Config.get(Config.STRUCTURES, `private.${key}.saveList.${id}`);
            arr.push({ id: id, name: st.name, author: key, isPublic: st.isPublic });
        });
        return arr;
    }

    public static getTargetStruct(st: Structure, pos: Pos3D) {
        let area = Area3D.fromArea3D(st.area);
        area = area.relative();
        area.start.add(pos.x, pos.y, pos.z);
        area.end.add(pos.x, pos.y, pos.z);
        return new Structure(area);
    }

    public static getTargetStructs(complex: Complex, targetPos: Pos3D): Array<Structure> {
        let res: Array<Structure> = [];
        let area;
        Object.keys(complex).forEach((sid, i) => {
            area = Area3D.fromArea3D(complex[sid].area).relative();
            area.start.add(targetPos.x, targetPos.y, targetPos.z);
            area.end.add(targetPos.x, targetPos.y, targetPos.z);
            res.push(new Structure(area));
        });
        return res;
    }

    /*** private */
    private static async otherSave(caPlayer: CAPlayer, structArr: Array<Structure>, overCallback: (complex: Complex) => void) {
        //保存结构
        let complex: Complex = {};
        for (let i = 0; i < structArr.length; i++) {
            const st = structArr[i];
            st.name = "system_save";
            await StructureManager.save(caPlayer, st, i, structArr.length, (structid: string) => {
                //成功结束
                //保存文件
                complex[structid] = st;
                if (i >= structArr.length - 1) {
                    overCallback(complex);
                }
            });
        }
    }

    /*** private */
    private static async pop(caPlayer: CAPlayer, overCallback: () => void, mod: string) {
        const player = caPlayer.$;
        let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.${mod}List`);
        let complex = list.pop();
        const keys = Object.keys(complex);
        for (let i = 0; i < keys.length; i++) {
            const sid = keys[i];
            const st = complex[sid];
            await StructureManager.load(caPlayer, st, sid, st.area.start, i, keys.length, "none", "0_degrees", false, true, false, 100, "", () => {
                if (i == keys.length - 1) {
                    StructureManager.delete(caPlayer, sid, st);
                    Config.set(Config.STRUCTURES, `private.${player.xuid}.${mod}List`, list);
                    overCallback();
                }
            });
        }
    }

    public static clearCopy(caPlayer: CAPlayer) {
        const player = caPlayer.$;
        let complex = Config.get(Config.STRUCTURES, `private.${player.xuid}.copy`);
        if (complex != null) {
            Object.keys(complex).forEach((sid) => {
                StructureManager.delete(caPlayer, sid, complex[sid]);
            });
            Config.set(Config.STRUCTURES, `private.${player.xuid}.copy`, {});
        }
    }

    public static clearUndoList(caPlayer: CAPlayer) {
        const player = caPlayer.$;
        let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.undoList`);
        list.forEach((complex: Complex) => {
            Object.keys(complex).forEach((sid) => {
                StructureManager.delete(caPlayer, sid, complex[sid]);
            });
        });
        Config.set(Config.STRUCTURES, `private.${player.xuid}.undoList`, []);
    }

    public static clearRedoList(caPlayer: CAPlayer) {
        const player = caPlayer.$;
        let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.redoList`);
        list.forEach((complex: Complex) => {
            Object.keys(complex).forEach((sid) => {
                StructureManager.delete(caPlayer, sid, complex[sid]);
            });
        });
        Config.set(Config.STRUCTURES, `private.${player.xuid}.redoList`, []);
    }

    /**普通操作调用入口*/
    public static undoSave(caPlayer: CAPlayer, structArr: Array<Structure>, overCallback: (complex: Complex) => void) {
        function overCallback2(complex: Complex) {
            StructureManager.clearRedoList(caPlayer);//清空redoList
            overCallback(complex);
        }
        StructureManager.undoPush(caPlayer, structArr, overCallback2);
    }

    /**undo调用入口*/
    public static undoPush(caPlayer: CAPlayer, structArr: Array<Structure>, overCallback: (complex: Complex) => void) {
        const player = caPlayer.$;
        let data = StructureManager.getData(player.xuid);
        let undoList = data.undoList;
        StructureManager.otherSave(caPlayer, structArr, (complex: Complex) => {
            undoList.push(complex);
            if (undoList.length > Config.get(Config.GLOBAL, "maxUndoStep")) {
                //删除0号,栈所有元素前移
                let complex1 = undoList.shift();
                Object.keys(complex1).forEach((sid) => {
                    StructureManager.delete(caPlayer, sid, complex1[sid]);
                });
            }
            Config.set(Config.STRUCTURES, `private.${player.xuid}`, data);
            overCallback(complex);
        });
    }

    public static redoPush(caPlayer: CAPlayer, structArr: Array<Structure>, overCallback: () => void) {
        const player = caPlayer.$;
        StructureManager.otherSave(caPlayer, structArr, (complex: Complex) => {
            let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.redoList`);
            list.push(complex);
            Config.set(Config.STRUCTURES, `private.${player.xuid}.redoList`, list);
            overCallback();
        });
    }

    public static undoPop(caPlayer: CAPlayer, overCallback: () => void) {
        StructureManager.pop(caPlayer, overCallback, "undo");
    }

    public static redoPop(caPlayer: CAPlayer, overCallback: () => void) {
        StructureManager.pop(caPlayer, overCallback, "redo");
    }

    public static copy(caPlayer: CAPlayer, structArr: Array<Structure>, delLast: any, lastComplex: Complex, overCallback: (complex: Complex) => void) {
        //删除上个存储结构
        if (delLast) {
            Object.keys(lastComplex).forEach((sid, i, a) => {
                StructureManager.delete(caPlayer, sid, lastComplex[sid]);
            });
        }
        //存储
        StructureManager.otherSave(caPlayer, structArr, (complex: Complex) => {
            overCallback(complex);
        });
    }

    public static async paste(caPlayer: CAPlayer, pos: Pos3D, data: any, overCallback: () => void) {
        let complex = data.copy;
        const keys = Object.keys(complex);
        for (let i = 0; i < keys.length; i++) {
            const sid = keys[i];
            await StructureManager.load(caPlayer, complex[sid], sid, pos, i, keys.length, "none", "0_degrees", false, true, false, 100, "", () => {
                if (i == keys.length - 1) {
                    overCallback();
                }
            });
        }
    }
}