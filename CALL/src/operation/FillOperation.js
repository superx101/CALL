// const Area3D = require("../tool/Area3D")
// const StrFactory = require("../tool/StrFactory")
const FillManager = require("../basicfun/FillManager")
// const StructureManager = require("../basicfun/StructureManager")
// const AreaOperation = require("./AreaOperation")

class FillOperation {
    static fill(player, output, playerData, res) {
        //检查参数
        AreaOperation.hasArea(playerData);
        let blockName = res.block.name;
        let tileData = res.TileData;
        if (tileData == null) {
            tileData = 0;
        }
        switch (res.FillMode) {
            case undefined:
            case "null":
            case "nu":
                StructureManager.savePos(player, playerData);
                FillManager.soildFill(player, playerData, playerData.settings.area, blockName, tileData, "", "", "", () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已填充区域: ${new Area3D(playerData.settings.area)}`));
                });
                break;
            case "hollow":
            case "ho":
                //空心-清空
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockName, tileData, true, () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已区域: ${new Area3D(playerData.settings.area)} 为空心(清空内部)`));
                });
                break;
            case "outline":
            case "ou":
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockName, tileData, false, () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已区域: ${new Area3D(playerData.settings.area)} 为空心(保留内部)`));
                });
                break;
        }
    }

    static clear(player, output, playerData) {
        AreaOperation.hasArea(playerData);
        StructureManager.savePos(player, playerData);
        FillManager.soildFill(player, playerData, playerData.settings.area, "air", 0, "", "", "", () => {
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已清空区域: ${new Area3D(playerData.settings.area)}`));
        });
    }

    static replace(player, output, playerData, res) {
        let tileData2 = res.tileData2;
        if (tileData2 == null) {
            tileData2 = 0;
        }
        AreaOperation.hasArea(playerData);
        StructureManager.savePos(player, playerData);
        FillManager.soildFill(player, playerData, playerData.settings.area, res.block.name, res.tileData, res.block2.name, tileData2, "replace", () => {
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已填充区域: ${new Area3D(playerData.settings.area)}`));
        });
    }
}

module.exports = FillOperation;
