import Area3D from "../model/Area3D"

export interface Settings {
    enable: boolean,
    barReplace: number,
    barReplaced: number,
    saveArea: boolean,
    saveUndo: boolean,
    saveCopy: boolean,
    areaTextShow: boolean,
    displayArea: boolean,
    displayPos: any,
    loadChuckTip: boolean,
    items: {
        onUseItemOn: any,
        onStartDestroyBlock: any
    },
    area: any,
    [x: string]: any
}

export type Areas = Array<Array<Area3D>>