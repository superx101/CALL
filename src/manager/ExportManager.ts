import Config from "../common/Config";
import Area3D from "../model/Area3D";
import Structure from "../model/Structure";
import StructureNBT from "../model/StructureNBT";
import { FileMode } from "../type/Common";
import Constant from "../type/Constant";
import { NBT } from "../type/Structure";
import StructureManager from "./StructureManager";

export default class ExportManager {
    public static checkStructure(sid: string): Structure {
        const obj = StructureManager.getPrivate();
        let isFind = false;
        let st;

        loop:
        for (const xuidT of Object.keys(obj)) {
            for (const sidT of Object.keys(obj[xuidT].saveList)) {
                if (sidT == sid) {
                    st = obj[xuidT].saveList[sidT];
                    isFind = true;
                    break loop;
                }
            }
        }

        if (isFind)
            return Structure.fromStructure(st);
        else
            throw new Error(`dynamic.ExportManager.checkStructure.notFind&&${sid}`);
    }

    /**
     * 
     * @param i 序号
     * @param ix 
     * @param iz 
     * @param w 区域z长
     * @param h 区域y长
     * @param lz 全局区域z长
     * @param c 常量
     * @returns 
     */
    public static transform(i: number, w: number, c: {h:number, lz: number, hlz: number, wh: number, iznz: number, ixnx: number}): number {
        return i % w + c.iznz
        + Math.floor(i / w) % c.h * c.lz
        + Math.floor((i / c.wh) + c.ixnx) * c.hlz
    }

    public static toMcstructure(st: Structure, sid: string, includeEntity: boolean = false, initProgressCallback: (max: number) => void, updateProgresCallback: (current: number) => void): ByteBuffer {
        const arr = StructureManager.getAllNBT(st, sid);
        const obj0: NBT = arr[0][0].toObject() as NBT;
        const size = Area3D.fromArea3D(st.area).getLens();
        const indicesMap = new Map<string, number>();
        const block_indices: NbtInt[][] = [new Array(size[0] * size[1] * size[2]).fill(new NbtInt(-1)), new Array(size[0] * size[1] * size[2]).fill(new NbtInt(-1))];
        const block_palette: NbtList = new NbtList();
        const block_position_data: NbtCompound = new NbtCompound();
        const entities: NbtList = new NbtList();
        const mx = arr.length;
        const mz = arr[0].length;
        const c = {//变换常量
            h: size[1],
            lz: size[2],
            hlz: size[1] * size[2], //h * size_z
            wh: 0, //w * h
            iznz: 0, //iz * nz
            ixnx: 0 //ix * nx
        }

        //初始化进度
        let total = 0;
        let current = 0;
        for (let ix = 0; ix < mx; ix++) {
            for (let iz = 0; iz < mz; iz++) {
                total += (arr[ix][iz].toObject() as NBT).structure.block_indices[0].length;
            }
        }
        initProgressCallback(total);

        let maxTypeId = 0;
        let ig: number;
        let typeId: number;
        let key: string;
        let comp: NbtCompound;
        let obj: NBT;
        let block_paletteT: NbtList;
        let paletteData: NbtCompound;
        let block_position_dataT: NbtCompound;
        let entitiesT;
        for (let ix = 0; ix < mx; ix++) {
            for (let iz = 0; iz < mz; iz++) {
                comp = arr[ix][iz];
                obj = arr[ix][iz].toObject() as NBT;
                block_paletteT = comp.getData("structure")
                    .getData("palette")
                    .getData("default")
                    .getData("block_palette") as NbtList;

                //初始化常量c
                c.wh = obj.size[2] * size[1];
                c.iznz = iz * Constant.STRUCTURE.MAX_LENGTH;
                c.ixnx = ix * Constant.STRUCTURE.MAX_LENGTH;

                //遍历block_indices
                obj.structure.block_indices[0].forEach((t, i) => {
                    updateProgresCallback(++current);//推动进度条进度
                    if (t != -1) {
                        //单个区域中方块序号转换为全局方块序号
                        ig = ExportManager.transform(i, obj.size[2], c);
                        //方块种类判断去重
                        paletteData = block_paletteT.getData(t);
                        key = paletteData.toSNBT();
                        if (indicesMap.has(key)) {
                            typeId = indicesMap.get(key);
                        }
                        else {
                            typeId = maxTypeId;
                            block_palette.addTag(paletteData);
                            indicesMap.set(key, typeId);
                            ++maxTypeId;
                        }
                        //复制
                        block_indices[0][ig] = new NbtInt(typeId);
                    }
                });

                block_position_dataT = comp.getData("structure")
                    .getData("palette")
                    .getData("default")
                    .getData("block_position_data") as NbtCompound;
                //遍历block_palette_data
                for (let key of block_position_dataT.getKeys()) {
                    ig = ExportManager.transform(parseInt(key), obj.size[2], c);//单个区域中序号转换为全局序号
                    block_position_data.setTag(ig.toString(), block_position_dataT.getData(key))//复制
                }

                if (includeEntity) {
                    //复制所有entities
                    entitiesT = comp.getData("structure")
                        .getData("entities") as NbtList;
                    const len = entitiesT.getSize();
                    for (let i = 0; i < len; i++) {
                        entities.addTag(entitiesT.getTag(i));
                    }
                }
            }
        }

        return new StructureNBT(obj0.format_version, size, block_indices, entities, block_palette, block_position_data, obj0.structure_world_origin)
            .toBinaryNBT()
    }

    public static writeFile(text: string | ByteBuffer, name: string, type: string, isBinary: boolean): boolean {
        // @ts-ignore
        let file = new File(`${Config.EXPORT}/${name}.${type}`, FileMode.WriteMode, isBinary);
        let res = file.writeSync(text);
        file.close();
        return res;
    }
}