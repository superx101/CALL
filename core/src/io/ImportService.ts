import * as path from "path";
import Config from "../common/Config";
import { Structure, Data, NBT, Type } from "../common/Structure";
import StructureNBT from "./StructureNBT";
import StructureService from "../structure/StructureService";
import { FileMode } from "../temp/Common";
import Area3 from "../common/Area3";
import Constant from "../temp/Constant";
import ExportService from "./ExportService";
import { Pos3, Vec3Tuple } from "../common/Pos3";
import NBTService from "../structure/NBTService";
import Tr from "../util/Translator";

export default class ImportService {
    public static findXuidByName(name: string): string {
        const xuid = data.name2xuid(name);
        if (xuid == null)
            throw new Error(
                Tr._c("console.ImportManager.findXuidByName.error", name)
            );
        if (Object.keys(StructureService.getPrivate()).indexOf(xuid) <= -1)
            throw new Error(
                Tr._c("console.ImportManager.findXuidByName.error", name)
            );
        return xuid;
    }

    public static readFile(name: string): { type: Type; data: any } {
        const fileName = path.parse(name);
        let type;
        let data;

        //@ts-ignore
        if (!File.exists(`${Config.IMPORT_PATH}/${fileName.base}`))
            throw new Error(
                Tr._c(
                    "console.ImportManager.readFile.notFind",
                    `${path.join(process.cwd(), Config.IMPORT_PATH)}/${fileName.base}`
                )
            );

        switch (fileName.ext.substring(1)) {
            case Type.MCSTRUCTURE:
                type = Type.MCSTRUCTURE;
                //@ts-ignore
                let f = new File(
                    //@ts-ignore
                    `${Config.IMPORT_PATH}/${fileName.base}`,
                    FileMode.ReadMode,
                    true
                );
                //@ts-ignore
                data = f.readAllSync();
                //@ts-ignore
                f.close();
                break;
            case "":
                throw new Error(
                    Tr._c("console.ImportManager.readFile.formatError")
                );
            default:
                throw new Error(
                    Tr._c(
                        "console.ImportManager.readFile.notSupport",
                        `${fileName.ext}`
                    )
                );
        }

        return { type, data };
    }

    public static async separate(
        st: Structure,
        preComp: NbtCompound,
        updateProgresCallback: (current: number) => void
    ): Promise<StructureNBT[][]> {
        const areas = st.getAreas(); //获取分割后区域组
        const mx = areas.length;
        const mz = areas[0].length;
        const preObj = preComp.toObject() as NBT;
        const size = preObj.size;
        const pre = {
            block_indices: preObj.structure.block_indices,
            block_palette: preComp
                .getData("structure")
                .getData("palette")
                .getData("default")
                .getData("block_palette") as NbtList,
            block_position_data: preComp
                .getData("structure")
                .getData("palette")
                .getData("default")
                .getData("block_position_data") as NbtCompound,
            entities: preComp
                .getData("structure")
                .getData("entities") as NbtList,
            structure_world_origin: preObj.structure_world_origin,
        };
        let arr: StructureNBT[][] = new Array(mx);
        for (let x = 0; x < mx; x++) {
            arr[x] = new Array<StructureNBT>(mz);
        }

        //遍历区域组
        let current = 0;
        let block_indices: NbtInt[][];
        let area: Area3;
        let lens: number[];
        let entities: NbtList;
        let block_palette: NbtList;
        let block_position_data: NbtCompound;
        let blockEntityData: NbtCompound;
        let ig: number;
        let preTypeId: number;
        let maxTypeId: number;
        let typeIdMap: Map<number, number>;
        const c = {
            //常量
            h: size[1],
            lz: size[2],
            hlz: size[1] * size[2], //h * size_z
            wh: 0, //w * h
            iznz: 0, //iz * nz
            ixnx: 0, //ix * nx
        };
        for (let x = 0; x < mx; x++) {
            for (let z = 0; z < mz; z++) {
                //初始化数据
                area = areas[x][z].addBoth(
                    pre.structure_world_origin[0],
                    pre.structure_world_origin[1],
                    pre.structure_world_origin[2]
                );
                lens = area.getLens();
                block_indices = [
                    new Array(lens[0] * lens[1] * lens[2]).fill(new NbtInt(-1)),
                    new Array(lens[0] * lens[1] * lens[2]).fill(new NbtInt(-1)),
                ];
                entities = new NbtList();
                block_palette = new NbtList();
                block_position_data = new NbtCompound();
                typeIdMap = new Map<number, number>();
                maxTypeId = 0;
                c.wh = lens[2] * c.h;
                c.iznz = z * Constant.STRUCTURE.MAX_LENGTH;
                c.ixnx = x * Constant.STRUCTURE.MAX_LENGTH;

                block_indices[0].forEach((v, i) => {
                    //材质复制 并 去除多余材质
                    ig = ExportService.transform(i, lens[2], c);
                    preTypeId = pre.block_indices[0][ig];
                    if (preTypeId != -1) {
                        if (typeIdMap.has(preTypeId)) {
                            block_indices[0][i] = new NbtInt(
                                typeIdMap.get(preTypeId)
                            );
                        } else {
                            block_indices[0][i] = new NbtInt(maxTypeId);
                            typeIdMap.set(preTypeId, maxTypeId);
                            block_palette.addTag(
                                pre.block_palette.getData(preTypeId)
                            );
                            ++maxTypeId;
                        }

                        //复制方块实体数据
                        blockEntityData = pre.block_position_data.getData(
                            ig.toString()
                        );
                        if (blockEntityData != null) {
                            block_position_data.setTag(
                                i.toString(),
                                blockEntityData
                            );
                        }
                    }

                    //更新进度
                    updateProgresCallback(++current);
                });

                //复制实体
                let posArr;
                let len = pre.entities.getSize();
                let entity;
                let delArr: number[] = [];
                for (let i = 0; i < len; i++) {
                    entity = pre.entities.getData(i) as NbtCompound;
                    if (entity instanceof NbtCompound) {
                        //实体坐标在区域内则加入
                        posArr = (entity.getTag("Pos") as NbtList).toArray();
                        if (
                            area.inArea(
                                new Pos3(posArr[0], posArr[1], posArr[2], 0)
                            )
                        ) {
                            entities.addTag(entity);
                            delArr.push(i);
                        }
                    }
                }
                delArr.forEach((v) => {
                    pre.entities.removeTag(v);
                });

                arr[x][z] = new StructureNBT(
                    preObj.format_version,
                    area.getLens() as Vec3Tuple,
                    block_indices,
                    entities,
                    block_palette,
                    block_position_data,
                    area.start.toArray().splice(0, 3) as Vec3Tuple
                );
            }
        }

        return arr;
    }

    public static save(
        st: Structure,
        xuid: string,
        sid: string,
        comps: StructureNBT[][]
    ): boolean {
        const mx = comps.length;
        const mz = comps[0].length;
        let res = true;
        let x, z;

        loop0: for (x = 0; x < mx; x++) {
            for (z = 0; z < mz; z++) {
                if (
                    !NBTService.saveFromNBT(
                        sid + "_" + x + "_" + z,
                        comps[x][z]
                    )
                ) {
                    res = false;
                    break loop0;
                }
            }
        }

        if (res) {
            //写入记录
            let data: Data = StructureService.getData(xuid);
            data.saveList[sid] = st;
            StructureService.setData(xuid, data);
        } else {
            //失败 删除所有写入
            loop1: for (let i = 0; i < mx; i++) {
                for (let j = 0; j < mz; j++) {
                    if (i == x && j == z) break loop1;
                    file.delete(`${NBTService.PATH}/${sid}_${x}_${z}`);
                }
            }
        }

        return res;
    }
}
