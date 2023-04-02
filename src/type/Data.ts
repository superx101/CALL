import Area3D from "../model/Area3D"

export interface Settings {
    enable: boolean,
    barReplace: number,
    barReplaced: number,
    saveArea: boolean,
    saveUndo: boolean,
    saveCopy: boolean,
    saveEntity: boolean,
    areaTextShow: boolean,
    displayArea: boolean,
    displayProgressBar: boolean;
    loadChuckTip: boolean,
    textureSelectorMode: boolean,
    displayPos: any,
    texture: {
        a: {
            type: string,
            states: string,
        },
        b: {
            type: string,
            states: string,
        },
    },
    items: {
        onUseItemOn: any,
        onStartDestroyBlock: any
    },
    area: any,
    [x: string]: any
}

export type Areas = Array<Array<Area3D>>