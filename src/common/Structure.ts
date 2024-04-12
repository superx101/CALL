import Constant from "../temp/Constant";
import Area3 from "./Area3D";
import Pos3 from "./Pos3D";

export interface Complex {
    [x: string]: Structure
}

export interface Data {
    pid: number,
    copy: Complex,
    undoList: Array<Complex>,
    redoList: Array<Complex>,
    saveList: Complex
}

export enum Type {
    MCSTRUCTURE = "mcstructure"
}

type block_palette = {
    name: string;
    states: any;
    version: number;
}

export type NBT = {
    format_version: number;
    size: number[];
    structure: {
        block_indices: number[][];
    }
    entities: any[];
    palette: {
        default: {
            block_palette: block_palette[];
            block_position_data: any;
        }
    }
    structure_world_origin: number[];
}

export class Structure {
    public area: Area3;
    public name: string;
    public isPublic: boolean;
    public xSize: number;
    public zSize: number;

    constructor(area: Area3, name = system.getTimeStr(), isPublic = false) {
        this.area = Area3.fromArea3D(area);
        this.name = name;
        this.isPublic = isPublic;
        let lens = this.area.getLens();
        this.xSize = Math.ceil(lens[0] / Constant.STRUCTURE.MAX_LENGTH);
        this.zSize = Math.ceil(lens[2] / Constant.STRUCTURE.MAX_LENGTH);
    }

    public static fromStructure(st: Structure): Structure {
        return new Structure(st.area, st.name, st.isPublic);
    }

    public getAreas(): Array<Array<Area3>> {
        let areas = new Array();
        for (let i = 0; i < this.xSize; i++) {
            areas[i] = new Array(this.zSize);
        }
        let start = new Pos3();
        let end = new Pos3();
        let iz, ix;
        for (iz = 0; iz < this.zSize - 1; iz++) {
            start.z = this.area.start.z + iz * Constant.STRUCTURE.MAX_LENGTH;
            end.z = this.area.start.z + (iz + 1) * Constant.STRUCTURE.MAX_LENGTH - 1;
            for (ix = 0; ix < this.xSize - 1; ix++) {
                start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
                end.x = this.area.start.x + (ix + 1) * Constant.STRUCTURE.MAX_LENGTH - 1;
                areas[ix][iz] = new Area3(new Pos3(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3(end.x, this.area.end.y, end.z, this.area.start.dimid));
            }
            start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
            end.x = this.area.end.x;
            areas[ix][iz] = new Area3(new Pos3(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3(end.x, this.area.end.y, end.z, this.area.start.dimid));
        }
        //iz == this.zSize - 1
        start.z = this.area.start.z + iz * Constant.STRUCTURE.MAX_LENGTH;
        end.z = this.area.end.z;
        for (ix = 0; ix < this.xSize - 1; ix++) {
            start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
            end.x = this.area.start.x + (ix + 1) * Constant.STRUCTURE.MAX_LENGTH - 1;
            areas[ix][iz] = new Area3(new Pos3(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3(end.x, this.area.end.y, end.z, this.area.start.dimid));
        }
        //last
        start.x = this.area.start.x + ix * Constant.STRUCTURE.MAX_LENGTH;
        end.x = this.area.end.x;
        end.z = this.area.end.z;
        areas[this.xSize - 1][this.zSize - 1] = areas[ix][iz] = new Area3(new Pos3(start.x, this.area.start.y, start.z, this.area.start.dimid), new Pos3(end.x, this.area.end.y, end.z, this.area.start.dimid));

        return areas;
    }
};