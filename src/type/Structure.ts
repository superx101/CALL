import Structure from "../model/Structure";

export interface Complex {
    [x: string]: Structure
}

export interface Data {
    pid: number,
    copy: any,
    undoList: [],
    redoList: [],
    saveList: any
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