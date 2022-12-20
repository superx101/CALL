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
    items: any,
    area: any,
    [x: string]: any
}

export type Areas = Array<Array<any>>