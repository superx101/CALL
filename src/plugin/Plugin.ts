import ShapeForm from "../view/ShapeForm";
import Players from "../user/Players";
import { Pos3 } from "../common/Pos3";
import StructureNBT from "../io/StructureNBT";
import { Euler, Matrix4 } from "../lib/three-math";

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
    private plugin: IPlugin;

    public setPlugin(plugin: IPlugin) {
        this.plugin = plugin;
    }

    public warn(player: LLSE_Player, str: string, mode?: number): void {
        player.sendText(
            Format.Gold + `[${this.plugin.getId()}][warn] ` + str,
            mode
        );
    }

    public error(player: LLSE_Player, str: string, mode?: number): void {
        player.sendText(
            Format.Red + `[${this.plugin.getId()}][warn] ` + str,
            mode
        );
    }

    public info(player: LLSE_Player, str: string, mode?: number): void {
        player.sendText(Format.White + `[${this.plugin.getId()}] ` + str, mode);
    }

    public success(player: LLSE_Player, str: string, mode?: number): void {
        player.sendText(Format.Gold + `[${this.plugin.getId()}] ` + str, mode);
    }

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
        const caPlayer = Players.fetchCAPlayer(player.xuid)

        const ia = caPlayer.settings.area.start;
        const ib = caPlayer.settings.area.end;

        const comp = player.getInventory();
        const itemA = comp.getItem(ia);
        const itemB = comp.getItem(ib);

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
    ): Matrix4 {
        return new Matrix4().makeRotationFromEuler(
            new Euler(
                (x * Math.PI) / 180,
                (y * Math.PI) / 180,
                (z * Math.PI) / 180,
                order
            )
        );
    }
}
