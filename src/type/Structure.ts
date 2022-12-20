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