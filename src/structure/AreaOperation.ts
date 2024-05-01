import Config from "../common/Config";
import Constant from "../temp/Constant";
import Enums from "../temp/Enums";
import AreaDisplayerService from "./AreaDisplayerService";
import Area3 from "../common/Area3";
import CAPlayer from "../user/CAPlayer";
import { Pos3 } from "../common/Pos3";
import StrFactory from "../util/StrFactory";
import Players from "../user/Players";
import Tr from "../util/Translator";

export default class AreaOperation {
    public static start(output: CommandOutput, caPlayer: CAPlayer, res: any) {
        const player = caPlayer.$;
        let pos: IntPos = res.IntPos;
        let enum_1 = res.enum_1;
        let enum_2 = res.enum_2;
        switch (enum_1) {
            case "start":
            case "st":
            case "a":
                if (pos != null) {
                    AreaOperation.setPosA(caPlayer, Pos3.fromPos(pos));
                }
                else if (enum_2 == "view" || enum_2 == "vi") {
                    let max = Config.get(Config.GLOBAL, "viewMaxDistance");
                    let block = player.getBlockFromViewVector(false, false, max, false);
                    if (block != null) {
                        AreaOperation.setPosA(caPlayer, Pos3.fromPos(block.pos));
                    }
                    else {
                        throw new Error(Tr._(player.langCode, "dynamic.AreaOperation.start.viewError", `${max}`));
                    }
                }
                else {
                    AreaOperation.setPosA(caPlayer, Pos3.fromPos(player.pos).calibration());
                }
                break;
            case "end":
            case "en":
            case "b":
                if (pos != null) {
                    AreaOperation.setPosB(caPlayer, Pos3.fromPos(pos));
                }
                else if (enum_2 == "view" || enum_2 == "vi") {
                    let max = Config.get(Config.GLOBAL, "viewMaxDistance");
                    let block = player.getBlockFromViewVector(false, false, max, false);
                    if (block != null) {
                        AreaOperation.setPosB(caPlayer, Pos3.fromPos(block.pos));
                    }
                    else {
                        throw new Error(Tr._(player.langCode, "dynamic.AreaOperation.start.viewError", `${max}`));
                    }
                }
                else {
                    AreaOperation.setPosB(caPlayer, Pos3.fromPos(player.pos).calibration());
                }
                break;
            case "clear":
            case "cl":
                AreaOperation.clearArea(caPlayer);
                output.success(StrFactory.cmdMsg(Tr._(player.langCode, "dynamic.AreaOperation.start.clear")));
                break;
            case "show":
            case "sh":
                if (enum_2 == null || enum_2 == "on") {
                    caPlayer.settings.displayArea = true;
                    output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.AreaOperation.start.showOn")));
                }
                else if (enum_2 == "off" || enum_2 == "of") {
                    caPlayer.settings.displayArea = false;
                    AreaOperation.hideArea(caPlayer);
                    output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.AreaOperation.start.showOff")));
                }
                break;
            case "se":
                let pos3d = (pos == null ? Pos3.fromPos(player.pos).floor().calibration() : Pos3.fromPos(pos));
                if (caPlayer.isSetPosA) {
                    Players.silenceCmd(caPlayer, `ca ar cl`);
                    Players.silenceCmd(caPlayer, `ca ar a ${pos3d.formatStr()}`);
                    caPlayer.isSetPosA = false;
                }
                else {
                    Players.silenceCmd(caPlayer, `ca ar b ${pos3d.formatStr()}`);
                    caPlayer.isSetPosA = true;
                }
                break;
        }
    };

    /**private*/
    private static hasSetArea(caPlayer: CAPlayer) {
        if (caPlayer.settings.area.start.dimid != null && caPlayer.settings.area.end.dimid != null) {
            if (caPlayer.settings.area.start.dimid == caPlayer.settings.area.end.dimid) {
                let area = Area3.fromArea3D(caPlayer.settings.area);
                let lens = area.getLens();
                // if (lens[0] > Constant.AREA.MAX_LENGTH || lens[1] > Constant.AREA.MAX_HIGHT || lens[2] > Constant.AREA.MAX_LENGTH) {
                //     throw new Error(Tr._(caPlayer.$.langCode, "dynamic.AreaOperation.hasSetArea.overRange", `${Constant.AREA.MAX_LENGTH} ${Constant.AREA.MAX_HIGHT} ${Constant.AREA.MAX_LENGTH}`));
                // }
                caPlayer.hasSetArea = true;
                return true;
            }
            else {
                caPlayer.hasSetArea = false;
                throw new Error(Tr._(caPlayer.$.langCode, "dynamic.AreaOperation.hasSetArea.notsame"));
            }
        }
        return false;
    }

    /***private */
    private static checkPos(pos: Pos3, caPlayer: CAPlayer) {
        if (pos.y < Constant.SPACE.MIN_HIGHT || pos.y > Constant.SPACE.MAX_HIGHT) {
            throw new Error(Tr._(caPlayer.$.langCode, "dynamic.AreaOperation.checkPos.y", `${Constant.SPACE.MIN_HIGHT}`, `${Constant.SPACE.MAX_HIGHT}`))
        }
    }

    /*** private */
    private static setPos(caPlayer: CAPlayer, num: number) {
        const player = caPlayer.$;
        if (AreaOperation.hasSetArea(caPlayer)) {
            let area = Area3.fromArea3D(caPlayer.settings.area);
            //检查area
            // let lens = area.getLens();
            // if (lens[0] > Constant.AREA.MAX_LENGTH || lens[2] > Constant.AREA.MAX_LENGTH) {
            //     throw new Error(Tr._(player.langCode, "dynamic.AreaOperation.setPos.max", `${Constant.AREA.MAX_LENGTH} ${Constant.AREA.MAX_HIGHT} ${Constant.AREA.MAX_LENGTH}`));
            // }
            player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.AreaOperation.setPos.setArea", `${caPlayer.settings.area.start}->${caPlayer.settings.area.end}`, area.getLensStr())), Enums.msg.RAW);
            AreaOperation.hideArea(caPlayer);
            AreaOperation.showArea(caPlayer);
        }
        else {
            if (num == 1) {
                player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.AreaOperation.setPos.a", `${caPlayer.settings.area.start}`)), Enums.msg.RAW);
            }
            else {
                player.sendText(StrFactory.cmdTip(Tr._(player.langCode, "dynamic.AreaOperation.setPos.b",`${caPlayer.settings.area.end}`)), Enums.msg.RAW);
            }

        }
    }

    public static setPosA(caPlayer: CAPlayer, pos: Pos3) {
        AreaOperation.checkPos(pos, caPlayer);
        caPlayer.settings.area.start = Pos3.fromPos3(pos).floor();
        AreaOperation.setPos(caPlayer, 1);
    }

    public static setPosB(caPlayer: CAPlayer, pos: Pos3) {
        AreaOperation.checkPos(pos, caPlayer);
        caPlayer.settings.area.end = Pos3.fromPos3(pos).floor();
        AreaOperation.setPos(caPlayer, 2);
    }

    public static clearArea(caPlayer: CAPlayer) {
        AreaOperation.hideArea(caPlayer);
        caPlayer.hasSetArea = false;
        caPlayer.settings.area = {
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
    public static hasArea(caPlayer: CAPlayer) {
        if (caPlayer.hasSetArea == null || !caPlayer.hasSetArea) {
            throw new Error(Tr._(caPlayer.$.langCode, "dynamic.AreaOperation.hasArea.error"));
        }
    }

    public static showArea(caPlayer: CAPlayer) {
        if (!caPlayer.settings.displayArea || caPlayer.displayPos != null) {
            return false;
        }
        if (AreaOperation.hasSetArea(caPlayer)) {
            //结构方块显示
            caPlayer.displayPos = AreaDisplayerService.set(caPlayer.settings.area, caPlayer);
            return true;
        }
        else {
            throw new Error(Tr._(caPlayer.$.langCode, "dynamic.AreaOperation.showArea.noArea"));
        }
    }

    public static hideArea(caPlayer: CAPlayer) {
        if (AreaOperation.hasSetArea(caPlayer)) {
            if (caPlayer.displayPos != null) {
                AreaDisplayerService.remove(caPlayer);
                caPlayer.displayPos = null;
            }
        }
    }

    public static onStart(caPlayer: CAPlayer) {
        try {
            AreaOperation.showArea(caPlayer);
        }
        catch (e) { };
    }

    public static onStop(caPlayer: CAPlayer) {
        try {
            AreaOperation.hideArea(caPlayer);
        }
        catch (e) { };
    };
}

