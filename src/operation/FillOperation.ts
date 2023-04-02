import Config from "../common/Config";
import FillManager from "../manager/FillManager";
import StructureManager from "../manager/StructureManager";
import Area3D from "../model/Area3D";
import BlockType from "../model/BlockType";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";
import AreaOperation from "./AreaOperation";


export default class FillOperation {
    public static fill(player: Player, output: CommandOutput, playerData: PlayerData, res: { block: LLSE_Block; States: string; FillMode: string; }) {
        //检查参数
        AreaOperation.hasArea(playerData);
        let blockType = new BlockType(res.block.type, res.States);
        switch (res.FillMode) {
            case undefined:
            case "null":
            case "nu":
                StructureManager.savePos(player, playerData);
                FillManager.soildFill(player, playerData, playerData.settings.area, blockType, new BlockType("", ""), "", () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已填充区域: ${Area3D.fromArea3D(playerData.settings.area)}`));
                });
                break;
            case "hollow":
            case "ho":
                //空心-清空
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockType, true, () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已区域: ${Area3D.fromArea3D(playerData.settings.area)} 为空心(清空内部)`));
                });
                break;
            case "outline":
            case "ou":
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockType, false, () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已区域: ${Area3D.fromArea3D(playerData.settings.area)} 为空心(保留内部)`));
                });
                break;
        }
    }

    public static clear(player: Player, output: CommandOutput, playerData: PlayerData) {
        AreaOperation.hasArea(playerData);
        StructureManager.savePos(player, playerData);
        FillManager.soildFill(player, playerData, playerData.settings.area, new BlockType("air", ""), new BlockType("", ""), "", () => {
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已清空区域: ${Area3D.fromArea3D(playerData.settings.area)}`));
        });
    }

    public static replace(player: Player, output: CommandOutput, playerData: PlayerData, res: { states2: string; block: LLSE_Block; block2: LLSE_Block; states: string; }) {
        let blockType1 = new BlockType(res.block.type, res.states);
        let blockType2 = new BlockType(res.block2.type, res.states2);
        AreaOperation.hasArea(playerData);
        StructureManager.savePos(player, playerData);
        FillManager.soildFill(player, playerData, playerData.settings.area, blockType1, blockType2, "replace", () => {
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已填充区域: ${Area3D.fromArea3D(playerData.settings.area)}`));
        });
    }
}