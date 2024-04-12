import Config from "../common/Config";
import FillService from "./FillService";
import StructureService from "./StructureService";
import Area3 from "../common/Area3";
import BlockType from "../common/BlockType";
import CAPlayer from "../user/CAPlayer";
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
                StructureService.savePos(caPlayer);
                FillService.soildFill(caPlayer, caPlayer.settings.area, blockType, new BlockType("", ""), "", () => {
                    StructureService.tp(caPlayer);
                    player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.fill", `${Area3.fromArea3D(caPlayer.settings.area)}`)));
                });
                break;
            case "hollow":
            case "ho":
                //空心-清空
                StructureService.savePos(caPlayer);
                FillService.fillOutside(caPlayer, caPlayer.settings.area, blockType, true, () => {
                    StructureService.tp(caPlayer);
                    player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.hollow", `${Area3.fromArea3D(caPlayer.settings.area)}`)));
                });
                break;
            case "outline":
            case "ou":
                StructureService.savePos(caPlayer);
                FillService.fillOutside(caPlayer, caPlayer.settings.area, blockType, false, () => {
                    StructureService.tp(caPlayer);
                    player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.outline", `${Area3.fromArea3D(caPlayer.settings.area)}`)));
                });
                break;
        }
    }

    public static clear(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        AreaOperation.hasArea(caPlayer);
        StructureService.savePos(caPlayer);
        FillService.soildFill(caPlayer, caPlayer.settings.area, new BlockType("air", ""), new BlockType("", ""), "", () => {
            StructureService.tp(caPlayer);
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.clear", `${Area3.fromArea3D(caPlayer.settings.area)}`)));
        });
    }

    public static replace(output: CommandOutput, caPlayer: CAPlayer, res: { states2: string; block: LLSE_Block; block2: LLSE_Block; states: string; }) {
        const player = caPlayer.$;
        let blockType1 = new BlockType(res.block.type, res.states);
        let blockType2 = new BlockType(res.block2.type, res.states2);
        AreaOperation.hasArea(caPlayer);
        StructureService.savePos(caPlayer);
        FillService.soildFill(caPlayer, caPlayer.settings.area, blockType1, blockType2, "replace", () => {
            StructureService.tp(caPlayer);
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.FillOperation.fill.replace", `${Area3.fromArea3D(caPlayer.settings.area)}`)));
        });
    }
}