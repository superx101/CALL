// const Area3D = require("../tool/Area3D")
// const StrFactory = require("../tool/StrFactory")
const FillManager = require("../basicfun/FillManager")
// const StructureManager = require("../basicfun/StructureManager")
// const AreaOperation = require("./AreaOperation")

class FillOperation {
    static fill(player, output, playerData, res) {
        //检查参数
        AreaOperation.hasArea(playerData);
        let blockType = FillOperation.getTypeFromBlock(res.block);
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
                    player.sendText(StrFactory.cmdSuccess(`已填充区域: ${new Area3D(playerData.settings.area)}`));
                });
                break;
            case "hollow":
            case "ho":
                //空心-清空
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockType, tileData, true, () => {
                    StructureManager.tp(player, playerData);
                    player.sendText(StrFactory.cmdSuccess(`已区域: ${new Area3D(playerData.settings.area)} 为空心(清空内部)`));
                });
                break;
            case "outline":
            case "ou":
                StructureManager.savePos(player, playerData);
                FillManager.fillOutside(player, playerData, playerData.settings.area, blockType, tileData, false, () => {
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
        let blockType1 = FillOperation.getTypeFromBlock(res.block);
        let blockType2 = FillOperation.getTypeFromBlock(res.block2);
        if (tileData2 == null) {
            tileData2 = 0;
        }
        AreaOperation.hasArea(playerData);
        StructureManager.savePos(player, playerData);
        FillManager.soildFill(player, playerData, playerData.settings.area, blockType1, res.tileData, blockType2, tileData2, "replace", () => {
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已填充区域: ${new Area3D(playerData.settings.area)}`));
        });
    }

    static getTypeFromBlock(block) {
        if (block.id == 0) return "air";
        if (!block.isBlock) {
            throw new Error(`当前名称不能被识别为方块, 请重试`);
        }
        else {
            return block.type
        }
    }
}

module.exports = FillOperation;
