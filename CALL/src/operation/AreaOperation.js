// const StrFactory = require("../tool/StrFactory")
// const Constant = require("../global/Constant")
// const Area3D = require("../tool/Area3D")
// const AreaDisplayer = require("../basicfun/AreaDisplayer")

class AreaOperation {
    static start(player, output, playerData, res) {
        let pos = res.PosInt;
        let enum_1 = res.enum_1;
        let enum_2 = res.enum_2;
        switch (enum_1) {
            case "start":
            case "st":
            case "a":
                if (pos != null) {
                    AreaOperation.setPosA(player, playerData, pos);
                }
                else if (enum_2 == "view" || enum_2 == "vi") {
                    let max = Config.get(Config.GLOBAL, "viewMaxDistance");
                    let block = player.getBlockFromViewVector(false, false, max, false);
                    if (block != null) {
                        AreaOperation.setPosA(player, playerData, block.pos);
                    }
                    else {
                        throw new Error(`未能获取视线方块, 无法选点, 最大选择范围:${max}`);
                    }
                }
                else {
                    AreaOperation.setPosA(player, playerData, new Pos3D(player.pos).calibration());
                }
                break;
            case "end":
            case "en":
            case "b":
                if (pos != null) {
                    AreaOperation.setPosB(player, playerData, pos);
                }
                else if (enum_2 == "view" || enum_2 == "vi") {
                    let max = Config.get(Config.GLOBAL, "viewMaxDistance");
                    let block = player.getBlockFromViewVector(false, false, max, false);
                    if (block != null) {
                        AreaOperation.setPosB(player, playerData, block.pos);
                    }
                    else {
                        throw new Error(`未能获取视线方块, 无法选点, 最大选择范围:${max}`);
                    }
                }
                else {
                    AreaOperation.setPosB(player, playerData, new Pos3D(player.pos).calibration());
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
                pos = (pos == null ? new Pos3D(player.pos).floor().calibration() : new Pos3D(pos));
                if (playerData.isSetPosA) {
                    player.runcmd(`call area clear`);
                    player.runcmd(`call area start ${pos.formatStr()}`);
                    playerData.isSetPosA = false;
                }
                else {
                    player.runcmd(`call area end ${pos.formatStr()}`);
                    playerData.isSetPosA = true;
                }
                break;
        }
    };

    /**private*/
    static hasSetArea(playerData) {
        if (playerData.settings.area.start.dimid != null && playerData.settings.area.end.dimid != null) {
            if (playerData.settings.area.start.dimid == playerData.settings.area.end.dimid) {
                let area = new Area3D(playerData.settings.area);
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
    static checkPos(pos) {
        if (pos.y < Constant.SPACE.MIN_HIGHT || pos.y > Constant.SPACE.MAX_HIGHT) {
            throw new Error(`选点y坐标必须在 ${Constant.SPACE.MIN_HIGHT} 到 ${Constant.SPACE.MAX_HIGHT} 内`)
        }
    }

    /*** private */
    static setPos(player, playerData, num) {
        if (AreaOperation.hasSetArea(playerData)) {
            let area = new Area3D(playerData.settings.area);
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

    static setPosA(player, playerData, pos) {
        AreaOperation.checkPos(pos);
        playerData.settings.area.start = new Pos3D(pos).floor();
        AreaOperation.setPos(player, playerData, 1);
    }

    static setPosB(player, playerData, pos) {
        AreaOperation.checkPos(pos);
        playerData.settings.area.end = new Pos3D(pos).floor();
        AreaOperation.setPos(player, playerData, 2);
    }

    static clearArea(playerData) {
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
    static hasArea(playerData) {
        if (playerData.hasSetArea == null || !playerData.hasSetArea) {
            throw new Error("未选择选区,无法操作");
        }
    }

    static showArea(playerData) {
        if (!playerData.settings.displayArea || playerData.displayPos != null) {
            return false;
        }
        if (AreaOperation.hasSetArea(playerData)) {
            // 粒子显示
            // let ps = mc.newParticleSpawner(1000, true, true);
            // let area = new Area3D(playerData.settings.area);
            // let lens = area.getLens();
            // for (let i = 0; i <= 3; i++) {
            //     lens[i] *= 0.1;
            // }
            // let arr = [
            //     [area.start.x, area.end.x],
            //     [area.start.y, area.end.y],
            //     [area.start.z, area.end.z]
            // ];
            // for (let x = 0; x <= 1; x++) {
            //     for (let y = 0; y <= 1; y++) {
            //         for (let z = 0; z <= 1; z++) {
            //             ps.drawAxialLine(new Pos3D(arr[0][x] - 0.5 + x, arr[1][y] - 0.5 + y, arr[2][z] - 0.5 + z, area.dimid), Enums.DIRECTION.POS_X - x, lens[0], ParticleColor.Red)
            //             ps.drawAxialLine(new Pos3D(arr[0][x] - 0.5 + x, arr[1][y] - 0.5 + y, arr[2][z] - 0.5 + z, area.dimid), Enums.DIRECTION.POS_X - y, lens[1], ParticleColor.Red)
            //             ps.drawAxialLine(new Pos3D(arr[0][x] - 0.5 + x, arr[1][y] - 0.5 + y, arr[2][z] - 0.5 + z, area.dimid), Enums.DIRECTION.POS_X - z, lens[2], ParticleColor.Red)
            //         }
            //     }
            // }

            //结构方块显示
            playerData.displayPos = AreaDisplayer.set(playerData.settings.area);
            if (playerData.displayPos == null) {
                throw new Error("可用显示位置已满,无法显示");
            }
            return true;
        }
        else {
            throw new Error("暂无选区无法显示");
        }
    }

    static hideArea(playerData) {
        if (AreaOperation.hasSetArea(playerData)) {
            if (playerData.displayPos != null) {
                AreaDisplayer.remove(playerData.displayPos);
                playerData.displayPos = null;
            }
        }
    }

    static onStart(playerData) {
        try {
            AreaOperation.showArea(playerData);
        }
        catch (e) { };
    }

    static onStop(playerData) {
        try {
            AreaOperation.hideArea(playerData);
        }
        catch (e) { };
    };
}

module.exports = AreaOperation;
