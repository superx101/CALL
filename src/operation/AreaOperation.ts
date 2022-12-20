import Config from "../common/Config";
import Constant from "../common/Constant";
import Enums from "../type/Enums";
import AreaDisplayerManager from "../manager/AreaDisplayerManager";
import Area3D from "../model/Area3D";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import StrFactory from "../util/StrFactory";

export default class AreaOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData, res: any) {
        let pos: IntPos = res.PosInt;
        let enum_1 = res.enum_1;
        let enum_2 = res.enum_2;
        switch (enum_1) {
            case "start":
            case "st":
            case "a":
                if (pos != null) {
                    AreaOperation.setPosA(player, playerData, Pos3D.fromPos(pos));
                }
                else if (enum_2 == "view" || enum_2 == "vi") {
                    let max = Config.get(Config.GLOBAL, "viewMaxDistance");
                    let block = player.getBlockFromViewVector(false, false, max, false);
                    if (block != null) {
                        AreaOperation.setPosA(player, playerData, Pos3D.fromPos(block.pos));
                    }
                    else {
                        throw new Error(`未能获取视线方块, 无法选点, 最大选择范围:${max}`);
                    }
                }
                else {
                    AreaOperation.setPosA(player, playerData, Pos3D.fromPos(player.pos).calibration());
                }
                break;
            case "end":
            case "en":
            case "b":
                if (pos != null) {
                    AreaOperation.setPosB(player, playerData, Pos3D.fromPos(pos));
                }
                else if (enum_2 == "view" || enum_2 == "vi") {
                    let max = Config.get(Config.GLOBAL, "viewMaxDistance");
                    let block = player.getBlockFromViewVector(false, false, max, false);
                    if (block != null) {
                        AreaOperation.setPosB(player, playerData, Pos3D.fromPos(block.pos));
                    }
                    else {
                        throw new Error(`未能获取视线方块, 无法选点, 最大选择范围:${max}`);
                    }
                }
                else {
                    AreaOperation.setPosB(player, playerData, Pos3D.fromPos(player.pos).calibration());
                }
                break;
            case "clear":
            case "cl":
                AreaOperation.clearArea(playerData);
                output.success(StrFactory.cmdMsg("已清除选区"));
                break;
            case "show":
            case "sh":
                if (enum_2 == null || enum_2 == "on") {
                    playerData.settings.displayArea = true;
                    output.success(StrFactory.cmdSuccess("已开启选区显示"));
                }
                else if (enum_2 == "off" || enum_2 == "of") {
                    playerData.settings.displayArea = false;
                    AreaOperation.hideArea(playerData);
                    output.success(StrFactory.cmdSuccess("已关闭选区显示"));
                }
                break;
            case "se":
                let pos3d = (pos == null ? Pos3D.fromPos(player.pos).floor().calibration() : Pos3D.fromPos(pos));
                if (playerData.isSetPosA) {
                    player.runcmd(`call area clear`);
                    player.runcmd(`call area start ${pos3d.formatStr()}`);
                    playerData.isSetPosA = false;
                }
                else {
                    player.runcmd(`call area end ${pos3d.formatStr()}`);
                    playerData.isSetPosA = true;
                }
                break;
        }
    };

    /**private*/
    private static hasSetArea(playerData: PlayerData) {
        if (playerData.settings.area.start.dimid != null && playerData.settings.area.end.dimid != null) {
            if (playerData.settings.area.start.dimid == playerData.settings.area.end.dimid) {
                let area = Area3D.fromArea3D(playerData.settings.area);
                let lens = area.getLens();
                if (lens[0] > Constant.AREA.MAX_LENGTH || lens[1] > Constant.AREA.MAX_HIGHT || lens[2] > Constant.AREA.MAX_LENGTH) {
                    throw new Error(`区域超过上限: ${Constant.AREA.MAX_LENGTH} ${Constant.AREA.MAX_HIGHT} ${Constant.AREA.MAX_LENGTH}`);
                }
                playerData.hasSetArea = true;
                return true;
            }
            else {
                playerData.hasSetArea = false;
                throw new Error("两点不在同一维度内");
            }
        }
        return false;
    }

    /***private */
    private static checkPos(pos: Pos3D) {
        if (pos.y < Constant.SPACE.MIN_HIGHT || pos.y > Constant.SPACE.MAX_HIGHT) {
            throw new Error(`选点y坐标必须在 ${Constant.SPACE.MIN_HIGHT} 到 ${Constant.SPACE.MAX_HIGHT} 内`)
        }
    }

    /*** private */
    private static setPos(player: Player, playerData: PlayerData, num: number) {
        if (AreaOperation.hasSetArea(playerData)) {
            let area = Area3D.fromArea3D(playerData.settings.area);
            //检查area
            let lens = area.getLens();
            if (lens[0] > Constant.AREA.MAX_LENGTH || lens[2] > Constant.AREA.MAX_LENGTH) {
                throw new Error(`选区不能大于 ${Constant.AREA.MAX_LENGTH} ${Constant.AREA.MAX_HIGHT} ${Constant.AREA.MAX_LENGTH}`);
            }
            player.sendText(StrFactory.cmdTip(`已设置区域: ${playerData.settings.area.start}->${playerData.settings.area.end}\n长度: ${area.getLensStr()}`), Enums.msg.RAW);
            AreaOperation.hideArea(playerData);
            AreaOperation.showArea(playerData);
        }
        else {
            if (num == 1) {
                player.sendText(StrFactory.cmdTip(`已设置第1点: ${playerData.settings.area.start}`), Enums.msg.RAW);
            }
            else {
                player.sendText(StrFactory.cmdTip(`已设置第2点: ${playerData.settings.area.end}`), Enums.msg.RAW);
            }

        }
    }

    public static setPosA(player: Player, playerData: PlayerData, pos: Pos3D) {
        AreaOperation.checkPos(pos);
        playerData.settings.area.start = Pos3D.fromPos3D(pos).floor();
        AreaOperation.setPos(player, playerData, 1);
    }

    public static setPosB(player: Player, playerData: PlayerData, pos: Pos3D) {
        AreaOperation.checkPos(pos);
        playerData.settings.area.end = Pos3D.fromPos3D(pos).floor();
        AreaOperation.setPos(player, playerData, 2);
    }

    public static clearArea(playerData: PlayerData) {
        AreaOperation.hideArea(playerData);
        playerData.hasSetArea = false;
        playerData.settings.area = {
            start: {
                x: null,
                y: null,
                z: null,
                dimid: null
            },
            end: {
                x: null,
                y: null,
                z: null,
                dimid: null
            }
        }
    }

    /**throw Error */
    public static hasArea(playerData: PlayerData) {
        if (playerData.hasSetArea == null || !playerData.hasSetArea) {
            throw new Error("未选择选区,无法操作");
        }
    }

    public static showArea(playerData: PlayerData) {
        if (!playerData.settings.displayArea || playerData.displayPos != null) {
            return false;
        }
        if (AreaOperation.hasSetArea(playerData)) {
            //结构方块显示
            playerData.displayPos = AreaDisplayerManager.set(playerData.settings.area);
            if (playerData.displayPos == null) {
                throw new Error("可用显示位置已满,无法显示");
            }
            return true;
        }
        else {
            throw new Error("暂无选区无法显示");
        }
    }

    public static hideArea(playerData: PlayerData) {
        if (AreaOperation.hasSetArea(playerData)) {
            if (playerData.displayPos != null) {
                AreaDisplayerManager.remove(playerData);
                playerData.displayPos = null;
            }
        }
    }

    public static onStart(playerData: PlayerData) {
        try {
            AreaOperation.showArea(playerData);
        }
        catch (e) { };
    }

    public static onStop(playerData: PlayerData) {
        try {
            AreaOperation.hideArea(playerData);
        }
        catch (e) { };
    };
}

