import Config from "../common/Config";
import Constant from "../type/Constant";
import Players from "../common/Players";
import Area3D from "../model/Area3D";
import Pos3D from "../model/Pos3D";
import Structure from "../model/Structure";
import ShapeLoader from "../plugin/ShapeLoader";
import { Blocks, BasicInfo, PKGs, TransledInfo } from "../type/Shape";
import StrFactory from "../util/StrFactory";
import StructureManager from "./StructureManager";
import { Pos } from "../type/Pos";
import PlayerData from "../model/PlayerData";
import Version from "../util/Version";
import Tr from "../util/Translator";
import ShapeForm from "../views/ShapeForm";

export default class ShapeManager {
    public static pkgs: PKGs = {};
    public static debugMod = Config.get(Config.GLOBAL, "debugMod");

    /*** export */
    public static registerPackage(version: number[], pkgId: string, shapeNum: number, icon: string = "") {
        if (ShapeManager.pkgs[pkgId] == null || Config.get(Config.GLOBAL, "debugMod")) {
            let data: BasicInfo = {
                shapeNum: shapeNum,
                version: Version.fromArr(version),
                author: pkgId.split(".")[1],
                icon: icon
            }
            ShapeManager.pkgs[pkgId] = data;
        }
    }

    /*** export */
    public static getData(xuid: string) {
        let playerData = Players.getData(xuid);
        if (playerData == null) return null;

        return {
            posA: playerData.settings.area.start,
            posB: playerData.settings.area.end,
            itemAIndex: playerData.settings.barReplace,
            itemBIndex: playerData.settings.barReplaced,
        }
    }

    /*** export */
    public static listForm(player: Player) {
        let playerData = Players.getData(player.xuid);
        new ShapeForm(player, playerData).sendForm([]);
    }

    /** import */
    public static getInfo(pkgId: string, player: Player): TransledInfo {
        //@ts-ignore
        let f = ll.import(ShapeLoader.EXPORTSAPCE, pkgId + ShapeLoader.INFO);
        return f(player.langCode);
    }

    /** import */
    public static form(player: Player, pkgId: string) {
        //@ts-ignore
        let f = ll.import(ShapeLoader.EXPORTSAPCE, pkgId + ShapeLoader.FORM);
        let pos = Pos3D.fromPos(player.pos).calibration().floor();
        let posInt = mc.newIntPos(pos.x, pos.y, pos.z, pos.dimid);
        return f(player, posInt);
    }

    public static arrayToNBTs(arr: Blocks, pos: Pos, player: Player) {
        let xSize: number, ySize: number, zSize: number;
        let xMin: number, yMin: number, zMin: number;
        //size表示最大坐标
        try {
            xSize = arr[0].x;
            ySize = arr[0].y;
            zSize = arr[0].z;
            xMin = arr[0].x;
            yMin = arr[0].y;
            zMin = arr[0].z;
        }
        catch (e) {
            throw new Error(Tr._(player.langCode, "dynamic.ShapeManager.arrayToNBTs.moreData", `${e}`));
        }
        let map = new Map();

        arr.forEach(v => {
            //标准化
            const x = Math.round(v.x);
            const y = Math.round(v.y);
            const z = Math.round(v.z);
            const dx = Math.abs(x - v.x);
            const dy = Math.abs(y - v.y);
            const dz = Math.abs(z - v.z);
            const d = dx * dx + dy * dy + dz * dz;

            //防重复
            let key = `${v.x} ${v.y} ${v.z}`;
            let hasKey = map.has(key);
            if (!hasKey || d < map.get(key).d) {
                map.set(key, {
                    x,
                    y,
                    z,
                    d,
                    nbt1: v.block_palette,
                    nbt2: v.block_position_data
                });
            }

            //求包围盒
            if (x < xMin) xMin = x;
            if (y < yMin) yMin = y;
            if (z < zMin) zMin = z;

            if (x > xSize) xSize = x;
            if (y > ySize) ySize = y;
            if (z > zSize) zSize = z;
        });
        //size转换为表示长度
        xSize = xSize - xMin + 1;
        ySize = ySize - yMin + 1;
        zSize = zSize - zMin + 1;

        //拆分
        let t1pos = Pos3D.fromPos(pos).add(xMin, yMin, zMin);
        let t2pos = Pos3D.fromPos3D(t1pos).add(xSize - 1, ySize - 1, zSize - 1);
        let st = new Structure(new Area3D(t1pos, t2pos));
        let areas = st.getAreas();

        let xlen = areas.length, zlen = areas[0].length;
        let datas = new Array(xlen);
        let n;
        let lens;
        let nbts = new Array(xlen);
        for (let i = 0; i < nbts.length; i++) {
            nbts[i] = new Array(zlen);
        }
        for (let ix = 0; ix < xlen; ix++) {
            datas[ix] = new Array(zlen);
            for (let iz = 0; iz < zlen; iz++) {
                lens = areas[ix][iz].getLens();
                n = lens[0] * lens[1] * lens[2];
                datas[ix][iz] = {
                    id: 0,
                    textureId: 0,
                    size: lens,
                    block_indices: [Array(n).fill(-1), Array(n).fill(-1)],
                    paletteMap: new Map(),
                    block_position_data: {}
                };
            }
        }
        //统计材质
        arr.forEach(v => {
            const rx = v.x - xMin;//分割前相对坐标
            const ry = v.y - yMin;
            const rz = v.z - zMin;
            const ax = Math.floor(rx / Constant.STRUCTURE.MAX_LENGTH);
            const az = Math.floor(rz / Constant.STRUCTURE.MAX_LENGTH);
            const x = rx % Constant.STRUCTURE.MAX_LENGTH;//分割后相对坐标
            const z = rz % Constant.STRUCTURE.MAX_LENGTH;
            let data = datas[ax][az];
            if (data.paletteMap.has(v.block_palette)) {
                data.block_indices[0][x * data.size[1] * data.size[2] + ry * data.size[2] + z] = data.paletteMap.get(v.block_palette);
            }
            else {
                data.paletteMap.set(v.block_palette, data.textureId);
                data.block_indices[0][x * data.size[1] * data.size[2] + ry * data.size[2] + z] = data.textureId;
                data.textureId++;
            }
            if (v.block_position_data != null) {
                data.block_position_data[`${data.id}`] = JSON.parse(v.block_position_data)
            }
            data.id++;
        });

        //组装nbt
        let nbtObj;
        let block_palette: string[];
        for (let ix = 0; ix < xlen; ix++) {
            for (let iz = 0; iz < zlen; iz++) {
                if (datas[ix][iz].paletteMap.size != 0) {
                    block_palette = [];
                    datas[ix][iz].paletteMap.forEach((v: any, k: string) => {
                        block_palette.push(JSON.parse(k));
                    });
                    nbtObj = {
                        format_version: 1,
                        size: datas[ix][iz].size,
                        structure: {
                            block_indices: datas[ix][iz].block_indices,
                            entities: [],
                            palette: {
                                default: {
                                    block_palette,
                                    block_position_data: datas[ix][iz].block_position_data
                                }
                            }
                        },
                        structure_world_origin: [0, 0, 0]
                    }
                    //@ts-ignore
                    nbts[ix][iz] = NBT.parseSNBT(JSON.stringify(nbtObj));
                }
            }
        }

        return {
            nbts,
            st,
            areas
        }
    }

    public static getList() {
        return Object.keys(ShapeManager.pkgs);
    }

    public static run(player: Player, playerData: PlayerData, pkgId: string, index: number, posInt: Pos3D, jsonStr: string) {
        if (ShapeManager.pkgs[pkgId] == null) {
            throw new Error(Tr._(player.langCode, "dynamic.ShapeManager.run.cantFind", `${pkgId}`));
        }
        let len = ShapeManager.pkgs[pkgId].shapeNum;
        if (index >= len) {
            throw new Error(Tr._(player.langCode, "dynamic.ShapeManager.run.wrongIndex", `${len-1}`));
        }
        try {
            //@ts-ignore
            let fuc = ll.import(ShapeLoader.EXPORTSAPCE, pkgId + ShapeLoader.CMD);
            let shape = fuc(player, index, posInt, JSON.parse(jsonStr));
            player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.ShapeManager.run.creating")));

            //生成nbt对象数组
            if (shape == null) {
                throw new Error(Tr._(player.langCode, "dynamic.ShapeManager.run.empty"));
            }
            if (shape instanceof Object) {
                let res = ShapeManager.arrayToNBTs(shape.arr, shape.pos, player);
                //undo保存
                StructureManager.undoSave(player, playerData, [res.st], () => {
                    //生成
                    StructureManager.traversal(player, playerData, res.areas, Tr._(player.langCode, "dynamic.ShapeManager.run.creating1"), 15, (x: number, z: number) => {
                        if (res.nbts != null) {
                            mc.setStructure(res.nbts[x][z], mc.newIntPos(res.areas[x][z].start.x, res.areas[x][z].start.y, res.areas[x][z].start.z, res.areas[x][z].start.dimid));
                        }
                        return Promise.resolve(true);
                    }, () => {
                        player.refreshChunks();
                        player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.ShapeManager.run.success")));
                    }, () => {
                        player.sendText(StrFactory.cmdErr(Tr._(player.langCode, "dynamic.ShapeManager.run.fail")));
                    })
                });
            }
            else {
                throw new Error(Tr._(player.langCode, "dynamic.ShapeManager.run.error"));
            }
        }
        catch (e) {
            if (ShapeManager.debugMod) {
                throw new Error(`[${pkgId}][error] ${e.message}\n${e.stack}`);
            }
        }
    }
}