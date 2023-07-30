import Config from "../common/Config";
import Constant from "../type/Constant";
import Enums from "../type/Enums";
import AreaDisplayerManager from "../manager/AreaDisplayerManager";
import Area3D from "../model/Area3D";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import StrFactory from "../util/StrFactory";
import Players from "../common/Players";
import Tr from "../util/Translator";

export default class AreaOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData, res: any) {
        let pos: IntPos = res.IntPos;
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
                        throw new Error(Tr._(player.langCode, "dynamic.AreaOperation.start.viewError", `${max}`));
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
                        throw new Error(Tr._(player.langCode, "dynamic.AreaOperation.start.viewError", `${max}`));
                    }
                }
                else {
                    AreaOperation.setPosB(player, playerData, Pos3D.fromPos(player.pos).calibration());
                }
                break;
            case "clear":
            case "cl":
                AreaOperation.clearArea(playerData);
                output.success(StrFactory.cmdMsg(Tr._(player.langCode, "dynamic.AreaOperation.start.clear")));
                break;
            case "show":
            case "sh":
                if (enum_2 == null || enum_2 == "on") {
                    playerData.settings.displayArea = true;
                    output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.AreaOperation.start.showOn")));
                }
                else if (enum_2 == "off" || enum_2 == "of") {
                    playerData.settings.displayArea = false;
                    AreaOperation.hideArea(playerData);
                    output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.AreaOperation.start.showOff")));
                }
                break;
            case "se":
                let pos3d = (pos == null ? Pos3D.fromPos(player.pos).floor().calibration() : Pos3D.fromPos(pos));
                if (playerData.isSetPosA) {
                    Players.silenceCmd(player, `ca ar cl`);
                    Players.silenceCmd(player, `ca ar a ${pos3d.formatStr()}`);
                    playerData.isSetPosA = false;
                }
                else {
                    Players.silenceCmd(player, `ca ar b ${pos3d.formatStr()}`);
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
                    throw new Error(Tr._(playerData.player.langCode, "dynamic.AreaOperation.hasSetArea.overRange", `${Constant.AREA.MAX_LENGTH} ${Constant.AREA.MAX_HIGHT} ${Constant.AREA.MAX_LENGTH}`));
                }
                playerData.hasSetArea = true;
                return true;
            }
            else {
                playerData.hasSetArea = false;
                throw new Error(Tr._(playerData.player.langCode, "dynamic.AreaOperation.hasSetArea.notsame"));
            }
        }
        return false;
    }

    /***private */
    private static checkPos(pos: Pos3D, player: Player) {
        if (pos.y < Constant.SPACE.MIN_HIGHT || pos.y > Constant.SPACE.MAX_HIGHT) {
            throw new Error(Tr._(player.langCode, "dynamic.AreaOperation.checkPos.y", `${Constant.SPACE.MIN_HIGHT}`, `${Constant.SPACE.MAX_HIGHT}`))
        }
    }

    /*** private */
    private static setPos(player: Player, playerData: PlayerData, num: number) {
        if (AreaOperation.hasSetArea(playerData)) {
            let area = Area3D.fromArea3D(playerData.settings.area);
            //检查area
            let lens = area.getLens();
            if (lens[0] > Constant.AREA.MAX_LENGTH || lens[2] > Constant.AREA.MAX_LENGTH) {
                throw new Error(Tr._(player.langCode, "dynamic.AreaOperation.setPos.max", `${Constant.AREA.MAX_LENGTH} ${Constant.AREA.MAX_HIGHT} ${Constant.AREA.MAX_LENGTH}`));
            }
            player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.AreaOperation.setPos.setArea", `${playerData.settings.area.start}->${playerData.settings.area.end}`, area.getLensStr())), Enums.msg.RAW);
            AreaOperation.hideArea(playerData);
            AreaOperation.showArea(playerData);
        }
        else {
            if (num == 1) {
                player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.AreaOperation.setPos.a", `${playerData.settings.area.start}`)), Enums.msg.RAW);
            }
            else {
                player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.AreaOperation.setPos.b",`${playerData.settings.area.end}`)), Enums.msg.RAW);
            }

        }
    }

    public static setPosA(player: Player, playerData: PlayerData, pos: Pos3D) {
        AreaOperation.checkPos(pos, player);
        playerData.settings.area.start = Pos3D.fromPos3D(pos).floor();
        AreaOperation.setPos(player, playerData, 1);
    }

    public static setPosB(player: Player, playerData: PlayerData, pos: Pos3D) {
        AreaOperation.checkPos(pos, player);
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
            throw new Error(Tr._(playerData.player.langCode, "dynamic.AreaOperation.hasArea.error"));
        }
    }

    public static showArea(playerData: PlayerData) {
        if (!playerData.settings.displayArea || playerData.displayPos != null) {
            return false;
        }
        if (AreaOperation.hasSetArea(playerData)) {
            //结构方块显示
            playerData.displayPos = AreaDisplayerManager.set(playerData.settings.area, playerData.player);
            return true;
        }
        else {
            throw new Error(Tr._(playerData.player.langCode, "dynamic.AreaOperation.showArea.noArea"));
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

