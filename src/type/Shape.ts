import Version from "../util/Version";

export interface BlockData {
    x: number;
    y: number;
    z: number;
    block_palette: string;
    block_position_data: string;
}

export type Blocks = Array<BlockData>

export interface data  {
    version: Version;
    name: string;
    shapeNames: string[];
    shapeImages: string[];
    author: string;
    introduction: string;
    icon: string;
}

export interface pkgs {
    [x: string]: data;
}