import Version from "../util/Version";

export interface BlockData {
    x: number;
    y: number;
    z: number;
    block_palette: string;
    block_position_data: string;
}

export type Blocks = Array<BlockData>

export interface BasicInfo  {
    shapeNum: number;
    version: Version;
    author: string;
    icon: string;
}

export interface TransledInfo {
    name: string;
    description: string;
}

export interface PKGs {
    [x: string]: BasicInfo;
}