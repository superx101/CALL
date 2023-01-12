import { Areas } from "../type/Data";
import PlayerData from "../model/PlayerData";
import StructureManager from "./StructureManager";
import Constant from "../type/Constant";
import Config from "../common/Config";
import Area3D from "../model/Area3D";
import Structure from "../model/Structure";
import Players from "../common/Players";
import Pos3D from "../model/Pos3D";
import StrFactory from "../util/StrFactory";
import { resolve } from "path";

export default class FillManager {
    public static async ergod(player: Player, playerData: PlayerData, areas: Areas, index: number, total: number, cmdCallback: (yBottom: number, yTop: number, area: Area3D) => boolean, overCallback: (warn: number) => void) {
        const yNum = Math.ceil(areas[0][0].getLens()[1] / Constant.FILL.MAX_HIGHT);//y轴填充个数
        const fillWaitTime = Config.get(Config.GLOBAL, "fillWaitTime");
        const tpWaitTime = fillWaitTime * 10;
        let warn = 0;

        await StructureManager.traversal(player, playerData, areas, `填充中 ${index + 1}/${total}`, 11, async (x: number, z: number) => {
            async function cmd(yBottom: number, yTop: number, area: Area3D) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        if (!cmdCallback(yBottom, yTop, area)) {
                            ++warn;
                        }
                        resolve(null);
                    }, fillWaitTime);
                })
            }

            const area = areas[x][z];
            let yTop: number, yBottom: number = area.start.y;

            //传送
            if(!await Players.tpAsync(player, (area.start.x + area.end.x) / 2, yBottom, (area.start.z + area.end.z) / 2, area.start.dimid)) {
                return Promise.resolve(false);
            }
            //等待
            await new Promise(resolve=>{
                setTimeout(()=>{
                    resolve(null);
                }, tpWaitTime)
            })
            
            //执行cmd
            for (let i = 0; i < yNum - 1; i++) {
                yTop = yBottom + Constant.FILL.MAX_HIGHT - 1;
                await cmd(yBottom, yTop, area);
                yBottom += Constant.FILL.MAX_HIGHT;
            }
            yBottom = area.start.y + (yNum - 1) * Constant.FILL.MAX_HIGHT;
            yTop = area.end.y;
            await cmd(yBottom, yTop, area);

            return Promise.resolve(true);
        }, () => {
            overCallback(warn);
        }, () => { });

        return;
    }

    public static soildFill(player: Player, playerData: PlayerData, targetArea: Area3D, blockName1: string, tileData1: number, blockName2: string, tileData2: number | "", mod: string, overCallback: () => void) {
        let st = new Structure(Area3D.fromArea3D(targetArea));
        StructureManager.undoSave(player, playerData, [st], () => {
            FillManager.ergod(player, playerData, st.getAreas(), 0, 1,
                (yBottom: number, yTop: number, area: Area3D) => {
                    return Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} ${blockName1} ${tileData1} ${mod} ${blockName2} ${tileData2}`, false).success;
                },
                (warn: number) => {
                    if (warn != 0) player.sendText(StrFactory.cmdWarn(`警告: 检测到 ${warn} 次填充失败\n原因: 填充区域与被填充区域相同, 或填充执行失败\n前者可忽略。若为后者, 可在配置文件中增加等待时间(fillWaitTime)来避免错误`))

                    overCallback();
                }
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
        StructureManager.undoSave(player, playerData, sts, async () => {
            let warn = 0;
            for (let i = 0; i < sts.length; i++) {
                await FillManager.ergod(player, playerData, sts[i].getAreas(), i, sts.length, (yBottom: number, yTop: number, area: Area3D) => {
                    if (i == 6) {
                        return Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} air 0`, false).success;
                    }
                    else {
                        return Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} ${blockName1} ${tileData1}`, false).success;
                    }
                }, (w: number) => {
                    warn += w;
                    if (i == sts.length - 1) {
                        overCallback();
                    }
                });
            }
            if (warn != 0) player.sendText(StrFactory.cmdWarn(`警告: 检测到 ${warn} 次填充失败\n原因: 填充区域与被填充区域相同, 或填充执行失败\n前者可忽略。若为后者, 可在配置文件中增加等待时间(fillWaitTime)来避免错误`))
            
        });
    }
}