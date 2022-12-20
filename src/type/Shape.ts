export interface BlockData {
    x: number;
    y: number;
    z: number;
    block_palette: string;
    block_position_data: string;
}

export type Blocks = Array<BlockData>

export interface data  {
    name: string;
    shapeNames: string[];
    author: string;
    introduction: string;
    icon: string;
}

export interface pkgs {
    [x: string]: data;
}