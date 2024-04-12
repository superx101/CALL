import * as THREE from "three";
import ShapeForm from "../view/ShapeForm";
import Players from "../user/Players";
import { Pos3 } from "../common/Pos3";
import StructureNBT from "../io/StructureNBT";

export interface PluginInfo {
    name: string;
    introduction: string;
    version: string;
    author: string;
    shapes: number;
    icon: string;
}

export interface IPlugin {
    getId(): string;
    getInfo(langCode: string): PluginInfo;
    onCmd(
        player: LLSE_Player,
        index: number,
        intPos: Pos3,
        param: any
    ): StructureNBT;  
    onMenu(player: LLSE_Player): void;
}

export class ShapePlugin {
    constructor(protected tool: PluginTool) {}
}

export class PluginTool {
    message: {
        warn(player: LLSE_Player, str: string, mode?: number): void;
        error(player: LLSE_Player, str: string, mode?: number): void;
        info(player: LLSE_Player, str: string, mode?: number): void;
        success(player: LLSE_Player, str: string, mode?: number): void;
    };

    public toListForm(player: LLSE_Player): void {
        const caPlayer = Players.getCAPlayer(player.xuid);
        new ShapeForm(caPlayer).sendForm([]);
    }

    public getData(player: LLSE_Player): {
        posA: IntPos;
        posB: IntPos;
        itemAIndex: number;
        itemBIndex: number;
        itemA: Item;
        itemB: Item;
    } {
        let caPlayer = Players.getCAPlayer(player.xuid);
        if (caPlayer == null) return null;

        const ia = caPlayer.settings.area.start;
        const ib = caPlayer.settings.area.end;

        let comp = player.getInventory();
        let itemA = comp.getItem(ia);
        let itemB = comp.getItem(ib);

        return {
            posA: caPlayer.settings.area.start,
            posB: caPlayer.settings.area.end,
            itemAIndex: ia,
            itemBIndex: ib,
            itemA,
            itemB,
        };
    }

    public getRoteMAT4(
        x: number,
        y: number,
        z: number,
        order: "XYZ" | "XZY" | "YXZ" | "YZX" | "ZXY" | "ZYX"
    ): THREE.Matrix4 {
        return new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(
                (x * Math.PI) / 180,
                (y * Math.PI) / 180,
                (z * Math.PI) / 180,
                order
            )
        );
    }
}
