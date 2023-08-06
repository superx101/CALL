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
    refreshChunk: boolean,
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

export const defaultSettings: Settings = {
    enable: true,
    barReplace: 0,
    barReplaced: 1,
    saveArea: true,
    saveUndo: true,
    saveCopy: true,
    saveEntity: true,
    areaTextShow: true,
    displayArea: true,
    displayProgressBar: true,
    loadChuckTip: true,
    textureSelectorMode: false,
    refreshChunk: false,
    displayPos: null,
    texture: {
        a: null,
        b: null
    },
    items: {
        onUseItemOn: {},
        onStartDestroyBlock: {}
    },
    area: null
}

export type Areas = Array<Array<Area3D>>