import { Areas } from "../temp/Data";
import CAPlayer from "../user/CAPlayer";
import StructureService from "./StructureService";
import Constant from "../temp/Constant";
import Config from "../common/Config";
import Area3 from "../common/Area3";
import { Structure } from "../common/Structure";
import Players from "../user/Players";
import { Pos3 } from "../common/Pos3";
import StrFactory from "../util/StrFactory";
import { resolve } from "path";
import BlockType from "../common/BlockType";
import Tr from "../util/Translator";

export default class FillService {
    public static async ergod(caPlayer: CAPlayer, areas: Areas, index: number, total: number, cmdCallback: (yBottom: number, yTop: number, area: Area3) => boolean, overCallback: (warn: number) => void) {
        const yNum = Math.ceil(areas[0][0].getLens()[1] / Constant.FILL.MAX_HIGHT);//y轴填充个数
        const fillWaitTime = Config.get(Config.GLOBAL, "fillWaitTime");
        const tpWaitTime = fillWaitTime * 10;
        let warn = 0;

        await StructureService.traversal(caPlayer, areas, Tr._(caPlayer.$.langCode, "dynamic.FillManager.ergod.fill", `${index + 1}/${total}`), 11, async (x: number, z: number) => {
            async function cmd(yBottom: number, yTop: number, area: Area3) {
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
            if (!await Players.tpAsync(caPlayer, (area.start.x + area.end.x) / 2, yBottom, (area.start.z + area.end.z) / 2, area.start.dimid)) {
                return Promise.resolve(false);
            }
            //等待
            await new Promise(resolve => {
                setTimeout(() => {
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

    public static soildFill(caPlayer: CAPlayer, targetArea: Area3, blockTypeA: BlockType, blockTypeB: BlockType, mod: string, overCallback: () => void) {
        let st = new Structure(Area3.fromArea3D(targetArea));
        console.warn("st", st)
        StructureService.undoSave(caPlayer, [st], () => {
            FillService.ergod(caPlayer, st.getAreas(), 0, 1,
                (yBottom: number, yTop: number, area: Area3) => {
                    return Players.cmd(caPlayer, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} ${blockTypeA.toString()} ${mod} ${blockTypeB.toString()}`, false).success;
                },
                (warn: number) => {
                    if (warn != 0) caPlayer.$.sendText(StrFactory.cmdWarn(Tr._(caPlayer.$.langCode, "dynamic.FillManager.soildFill.warn", warn)))

                    overCallback();
                }
            );
        });
    }

    public static fillOutside(caPlayer: CAPlayer, tArea: Area3, blockTypeA: BlockType, isHollow: boolean, overCallback: Function) {
        let sts: Array<Structure> = [];
        let a = Area3.fromArea3D(tArea);
        sts.push(new Structure(new Area3(new Pos3(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3(a.start.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3(new Pos3(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3(a.end.x, a.start.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3(new Pos3(a.start.x, a.start.y, a.start.z, a.start.dimid), new Pos3(a.end.x, a.end.y, a.start.z, a.start.dimid))));
        sts.push(new Structure(new Area3(new Pos3(a.end.x, a.start.y, a.start.z, a.start.dimid), new Pos3(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3(new Pos3(a.start.x, a.end.y, a.start.z, a.start.dimid), new Pos3(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        sts.push(new Structure(new Area3(new Pos3(a.start.x, a.start.y, a.end.z, a.start.dimid), new Pos3(a.end.x, a.end.y, a.end.z, a.start.dimid))));
        if (isHollow) {
            let ar = Area3.fromArea3D(tArea);
            let lens = a.getLens();
            if (lens[0] > 2 && lens[1] > 2 && lens[2] > 2) {
                ar.start.add(1, 1, 1);
                ar.end.add(-1, -1, -1);
                sts.push(new Structure(ar));
            }
        }
        StructureService.undoSave(caPlayer, sts, async () => {
            let warn = 0;
            for (let i = 0; i < sts.length; i++) {
                await FillService.ergod(caPlayer, sts[i].getAreas(), i, sts.length, (yBottom: number, yTop: number, area: Area3) => {
                    if (i == 6) {
                        return Players.cmd(caPlayer, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} air`, false).success;
                    }
                    else {
                        return Players.cmd(caPlayer, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} ${blockTypeA.toString()}`, false).success;
                    }
                }, (w: number) => {
                    warn += w;
                    if (i == sts.length - 1) {
                        overCallback();
                    }
                });
            }
            if (warn != 0) caPlayer.$.sendText(StrFactory.cmdWarn(Tr._(caPlayer.$.langCode, "dynamic.FillManager.soildFill.warn", warn)))

        });
    }
}