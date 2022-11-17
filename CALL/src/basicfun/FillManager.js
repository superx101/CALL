// const Structure = require("../tool/Structure")
// const Area3D = require("../tool/Area3D")
// const Pos3D = require("../tool/Pos3D")
const Config = require("../global/Config")
const StructureManager = require("./StructureManager")

class FillManager {
    /*** private */
    static ergod(player, playerData, areas, cmdCallback, overCallback) {
        StructureManager.traversal(player, playerData, areas, 0, 0, (x, z) => {
            let area = areas[x][z];
            let lens = area.getLens();
            let ySize = Math.ceil(parseFloat(lens[1]) / parseFloat(Constant.FILL.MAX_HIGHT));
            let dimid;
            let yTop, yBottom;
            dimid = area.start.dimid;
            yBottom = area.start.y;
            player.teleport((area.start.x + area.end.x) / 2, yBottom, (area.start.z + area.end.z) / 2, dimid);
            setTimeout(()=>{
                for (let i = 0; i < ySize - 1; i++) {
                yTop = yBottom + Constant.FILL.MAX_HIGHT - 1;
                cmdCallback(yBottom, yTop, area);
                yBottom += Constant.FILL.MAX_HIGHT;
            }
            yBottom = area.start.y + (ySize - 1) * Constant.FILL.MAX_HIGHT;
            yTop = area.end.y;
            cmdCallback(yBottom, yTop, area);
            }, 500);
            return true;
        }, (x, z) => {
            overCallback();
        }, () => {

        }, 300 + Config.get(Config.GLOBAL, "maxLoadCheckNum") * 100);
    }

    static soildFill(player, playerData, targetArea, blockName1, tileData1, blockName2, tileData2, mod, overCallback) {
        let st = new Structure(new Area3D(targetArea));
        StructureManager.undoSave(player, playerData, [st], () => {
            FillManager.ergod(player, playerData, st.getAreas(), (yBottom, yTop, area) => {
                Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} ${blockName1} ${tileData1} ${mod} ${blockName2} ${tileData2}`, false);
            }, () => {
                overCallback();
            });
        });
    }

    static fillOutside(player, playerData, tArea, blockName1, tileData1, isHollow, overCallback) {
        let sts = [];
        let a = new Area3D(tArea);
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.start.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.start.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.start.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.end.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.end.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.end.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        if (isHollow) {
            let ar = new Area3D(tArea);
            let lens = a.getLens();
            if (lens[0] > 2 && lens[1] > 2 && lens[2] > 2) {
                ar.start.add(1, 1, 1);
                ar.end.add(-1, -1, -1);
                sts.push(new Structure(ar));
            }
        }
        StructureManager.undoSave(player, playerData, sts, () => {
            sts.forEach((st, i) => {
                FillManager.ergod(player, playerData, st.getAreas(), (yBottom, yTop, area) => {
                    Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} ${blockName1} ${tileData1}`, false);
                    if (i == 6) {
                        Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} air 0`, false);
                    }
                }, () => {
                    if (i == sts.length - 1) {
                        overCallback();
                    }
                });
            })
        });
    }
}

module.exports = FillManager;