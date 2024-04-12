import Config from "../common/Config";
import Constant from "../temp/Constant";
import Players from "../user/Players";
import Area3 from "../common/Area3D";
import Pos3 from "../common/Pos3D";
import { Structure } from "../common/Structure";
import { PluginLoader } from "./PluginLoader";
import StrFactory from "../util/StrFactory";
import StructureService from "../structure/StructureService";
import { Pos } from "../temp/Pos";
import CAPlayer from "../user/CAPlayer";
import Version from "../util/Version";
import Tr from "../util/Translator";
import ShapeForm from "../view/ShapeForm";
import StructureNBT from "../io/StructureNBT";

export interface BlockData {
    x: number;
    y: number;
    z: number;
    block_palette: string;
    block_position_data: string;
}

export type Blocks = Array<BlockData>;

export interface TransledInfo {
    name: string;
    description: string;
}

export class ShapeService {
    public static debugMod = Config.get(Config.GLOBAL, "debugMod");

    public static getIdList() {
        return PluginLoader.idList;
    }

    public static run(
        caPlayer: CAPlayer,
        pluginId: string,
        index: number,
        pos: Pos3,
        jsonStr: string
    ) {
        const player = caPlayer.$;
        try {
            const plugin = PluginLoader.pluginsMap.get(pluginId)!;
            const nbt: StructureNBT = plugin.onCmd(
                caPlayer.$,
                index,
                pos,
                JSON.parse(jsonStr)
            );
            player.sendText(
                StrFactory.cmdTip(
                    Tr._(player.langCode, "dynamic.ShapeManager.run.creating")
                )
            );

            const pos1 = pos.clone();
            const pos2 = pos.clone().add(nbt.size[0], nbt.size[1], nbt.size[2]);
            const structure = new Structure(new Area3(pos1, pos2));

            StructureService.undoSave(caPlayer, [structure], () => {
                mc.setStructure(
                    nbt,
                    new IntPos(pos.x, pos.y, pos.z, pos.dimid)
                );
            });
        } catch (e) {
            if (ShapeService.debugMod) {
                throw new Error(
                    `[${pluginId}][error] ${e.message}\n${e.stack}`
                );
            }
        }
    }
}
