import Config from "../common/Config";
import FillManager from "../manager/FillManager";
import StructureManager from "../manager/StructureManager";
import Area3D from "../model/Area3D";
import BlockType from "../model/BlockType";
import CAPlayer from "../model/CAPlayer";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
import AreaOperation from "./AreaOperation";


export default class FillOperation {
    public static fill(output: CommandOutput, caPlayer: CAPlayer, res: { block: LLSE_Block; States: string; FillMode: string; }) {
        const player = caPlayer.$;
        //检查参数
        AreaOperation.hasArea(caPlayer);
        let blockType = new BlockType(res.block.type, res.States);
        switch (res.FillMode) {
            case undefined:
            case "null":
            case "nu":
                StructureManager.savePos(caPlayer);
                FillManager.soildFill(caPlayer, caPlayer.settings.area, blockType, new BlockType("", ""), "", () => {
                    StructureManager.tp(caPlayer);
                    player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.fill", `${Area3D.fromArea3D(caPlayer.settings.area)}`)));
                });
                break;
            case "hollow":
            case "ho":
                //空心-清空
                StructureManager.savePos(caPlayer);
                FillManager.fillOutside(caPlayer, caPlayer.settings.area, blockType, true, () => {
                    StructureManager.tp(caPlayer);
                    player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.hollow", `${Area3D.fromArea3D(caPlayer.settings.area)}`)));
                });
                break;
            case "outline":
            case "ou":
                StructureManager.savePos(caPlayer);
                FillManager.fillOutside(caPlayer, caPlayer.settings.area, blockType, false, () => {
                    StructureManager.tp(caPlayer);
                    player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.outline", `${Area3D.fromArea3D(caPlayer.settings.area)}`)));
                });
                break;
        }
    }

    public static clear(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        AreaOperation.hasArea(caPlayer);
        StructureManager.savePos(caPlayer);
        FillManager.soildFill(caPlayer, caPlayer.settings.area, new BlockType("air", ""), new BlockType("", ""), "", () => {
            StructureManager.tp(caPlayer);
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.clear", `${Area3D.fromArea3D(caPlayer.settings.area)}`)));
        });
    }

    public static replace(output: CommandOutput, caPlayer: CAPlayer, res: { states2: string; block: LLSE_Block; block2: LLSE_Block; states: string; }) {
        const player = caPlayer.$;
        let blockType1 = new BlockType(res.block.type, res.states);
        let blockType2 = new BlockType(res.block2.type, res.states2);
        AreaOperation.hasArea(caPlayer);
        StructureManager.savePos(caPlayer);
        FillManager.soildFill(caPlayer, caPlayer.settings.area, blockType1, blockType2, "replace", () => {
            StructureManager.tp(caPlayer);
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.replace", `${Area3D.fromArea3D(caPlayer.settings.area)}`)));
        });
    }
}