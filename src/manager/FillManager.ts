import { Areas } from "../type/Data";
import PlayerData from "../model/PlayerData";
import StructureManager from "./StructureManager";
import Constant from "../common/Constant";
import Config from "../common/Config";
import Area3D from "../model/Area3D";
import Structure from "../model/Structure";
import Players from "../common/Players";
import Pos3D from "../model/Pos3D";

export default class FillManager {
    public static ergod(player: Player, playerData: PlayerData, areas: Areas, cmdCallback: (yBottom: number, yTop: number, area: Area3D) => void, overCallback: () => void) {
        const ySize = Math.ceil(areas[0][0].getLens()[1] / Constant.FILL.MAX_HIGHT);
        const waitTime = Config.get(Config.GLOBAL, "fillWaitTime") * ySize;

        StructureManager.traversal(player, playerData, areas, "填充中", 11, (x: number, z: number) => {
            const area = areas[x][z];
            let yTop: number, yBottom: number = area.start.y;

            //传送
            player.teleport((area.start.x + area.end.x) / 2, yBottom, (area.start.z + area.end.z) / 2, area.start.dimid);
            //执行cmd
            setTimeout(() => {
                for (let i = 0; i < ySize - 1; i++) {
                    yTop = yBottom + Constant.FILL.MAX_HIGHT - 1;
                    cmdCallback(yBottom, yTop, area);
                    yBottom += Constant.FILL.MAX_HIGHT;
                }
                yBottom = area.start.y + (ySize - 1) * Constant.FILL.MAX_HIGHT;
                yTop = area.end.y;
                cmdCallback(yBottom, yTop, area);
            }, waitTime);
            return Promise.resolve(true);
        }, () => {
            overCallback();
        }, () => {});
    }

    public static soildFill(player: Player, playerData: PlayerData, targetArea: Area3D, blockName1: string, tileData1: number, blockName2: string, tileData2: number | "", mod: string, overCallback: () => void) {
        let st = new Structure(Area3D.fromArea3D(targetArea));
        StructureManager.undoSave(player, playerData, [st], () => {
            FillManager.ergod(player, playerData, st.getAreas(), (yBottom: number, yTop: number, area: Area3D) => {
                Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} ${blockName1} ${tileData1} ${mod} ${blockName2} ${tileData2}`, false);
            },
                overCallback
            );
        });
    }

    public static fillOutside(player: Player, playerData: PlayerData, tArea: Area3D, blockName1: string, tileData1: number, isHollow: boolean, overCallback: Function) {
        let sts: Array<Structure> = [];
        let a = Area3D.fromArea3D(tArea);
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.start.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.start.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.start.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.end.x, a.start.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.end.y, a.start.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3D(new Pos3D(a.start.x, a.start.y, a.end.z, a.start.dimid), new Pos3D(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        if (isHollow) {
            let ar = Area3D.fromArea3D(tArea);
            let lens = a.getLens();
            if (lens[0] > 2 && lens[1] > 2 && lens[2] > 2) {
                ar.start.add(1, 1, 1);
                ar.end.add(-1, -1, -1);
                sts.push(new Structure(ar));
            }
        }
        StructureManager.undoSave(player, playerData, sts, () => {
            sts.forEach((st, i) => {
                FillManager.ergod(player, playerData, st.getAreas(), (yBottom: number, yTop: number, area: Area3D) => {
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