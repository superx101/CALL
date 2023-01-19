import Config from "../common/Config";
import FillManager from "../manager/FillManager";
import StructureManager from "../manager/StructureManager";
import Area3D from "../model/Area3D";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";
import AreaOperation from "./AreaOperation";


export default class FillOperation {
    public static fill(player: Player, output: CommandOutput, playerData: PlayerData, res: { block: LLSE_Block; TileData: number; FillMode: string; }) {
        //检查参数
        AreaOperation.hasArea(playerData);
        let blockType = res.block.type;
        let tileData = res.TileData;
        if (tileData == null) {
            tileData = 0;
        }
        switch (res.FillMode) {
            case undefined:
            case "null":
            case "nu":
                StructureManager.savePos(player, playerData);
                FillManager.soildFill(player, playerData, playerData.settings.area, blockType, tileData, "", "", "", () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已填充区域: ${Area3D.fromArea3D(playerData.settings.area)}`));
                });
                break;
            case "hollow":
            case "ho":
                //空心-清空
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockType, tileData, true, () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已区域: ${Area3D.fromArea3D(playerData.settings.area)} 为空心(清空内部)`));
                });
                break;
            case "outline":
            case "ou":
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockType, tileData, false, () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已区域: ${Area3D.fromArea3D(playerData.settings.area)} 为空心(保留内部)`));
                });
                break;
        }
    }

    public static clear(player: Player, output: CommandOutput, playerData: PlayerData) {
        AreaOperation.hasArea(playerData);
        StructureManager.savePos(player, playerData);
        FillManager.soildFill(player, playerData, playerData.settings.area, "air", 0, "", "", "", () => {
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已清空区域: ${Area3D.fromArea3D(playerData.settings.area)}`));
        });
    }

    public static replace(player: Player, output: CommandOutput, playerData: PlayerData, res: { tileData2: number; block: LLSE_Block; block2: LLSE_Block; tileData: number; }) {
        let tileData2 = res.tileData2;
        let blockType1 = res.block.type;
        let blockType2 = res.block2.type;
        if (tileData2 == null) {
            tileData2 = 0;
        }
        AreaOperation.hasArea(playerData);
        StructureManager.savePos(player, playerData);
        FillManager.soildFill(player, playerData, playerData.settings.area, blockType1, res.tileData, blockType2, tileData2, "replace", () => {
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已填充区域: ${Area3D.fromArea3D(playerData.settings.area)}`));
        });
    }
}