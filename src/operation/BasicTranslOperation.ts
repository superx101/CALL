import Constant from "../common/Constant";
import Players from "../common/Players";
import FillManager from "../manager/FillManager";
import StructureManager from "../manager/StructureManager";
import Area3D from "../model/Area3D";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import Structure from "../model/Structure";
import { Pos } from "../type/Pos";
import { Complex } from "../type/Structure";
import { Transform3, Vector3D } from "../util/SimpleMatrix";
import StrFactory from "../util/StrFactory";
import AreaOperation from "./AreaOperation";
import StructureOperation from "./StructureOperation";

export default class BasicTranslOperation {
    /*** private */
    private static sl(player: any, playerData: any, st1: Structure, st2: Structure, mirror: string, degrees: string, overCallback: Function) {
        StructureManager.savePos(player, playerData);
        //保存complex
        StructureManager.undoSave(player, playerData, [st1, st2], (complex: Complex) => {
            let st1id: string;
            Object.keys(complex).forEach(sid => {
                if (complex[sid].area.equals(st1.area)) {
                    st1id = sid;
                }
            });
            //清空原位置
            FillManager.ergod(player, playerData, st1.getAreas(), (yBottom: number, yTop: number, area: Area3D) => {
                Players.cmd(player, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} air 0`);
            }, () => {
                //粘贴
                setTimeout(() => {
                    StructureManager.load(player, playerData, st1, st1id, st2.area.start, mirror, degrees, true, true, false, 100, "", () => {
                        overCallback();
                        StructureManager.tp(player, playerData);
                    });
                }, 100);
            });
        });
    }

    public static move(player: Player, output: CommandOutput, playerData: PlayerData, res: { PosInt: IntPos; }) {
        AreaOperation.hasArea(playerData);
        let pos: Pos3D;
        if (res.PosInt == null) {
            pos = Pos3D.fromPos(player.pos).floor().calibration();
        }
        else {
            pos = Pos3D.fromPos(res.PosInt).floor();
        }
        let st1 = new Structure(playerData.settings.area);
        let st2 = StructureManager.getTargetStruct(st1, pos);
        StructureOperation.checkTargetStruct(st1.area, pos);//检查移动后的区域是否超过限制
        BasicTranslOperation.sl(player, playerData, st1, st2, "none", "0_degrees", () => {
            player.sendText(StrFactory.cmdSuccess(`已将选区平移至 ${pos}`));
        });
    }

    public static rote(player:Player, output:CommandOutput, playerData:PlayerData, res: { AxisPos: Pos; degrees: string; }) {
        AreaOperation.hasArea(playerData);
        let axisPos: Pos3D;
        if (res.AxisPos == null) {
            axisPos = Pos3D.fromPos(player.pos).floor().calibration();
        }
        else {
            axisPos = Pos3D.fromPos(res.AxisPos).floor();
        }
        let st1 = new Structure(playerData.settings.area);
        let st2;
        //计算complex
        let area = st1.area;
        let trans = Transform3.getMove(axisPos.x, axisPos.z)
            .mul(Transform3.getBasicRota(parseInt(res.degrees)))
            //@ts-ignore
            .mul(Transform3.getMove(-axisPos.x, -axisPos.z));
        let va = trans.mul(new Vector3D(area.start.x, area.start.z, 1));
        let vb = trans.mul(new Vector3D(area.end.x, area.end.z, 1));
        st2 = new Structure(new Area3D(new Pos3D(va.arr[0], area.start.y, va.arr[1], area.start.dimid), new Pos3D(vb.arr[0], area.end.y, vb.arr[1], area.end.dimid)));
        BasicTranslOperation.sl(player, playerData, st1, st2, "none", res.degrees, () => {
            player.sendText(StrFactory.cmdSuccess(`已将选区绕点: ${axisPos} 顺时针旋转 ${parseFloat(res.degrees)} 度`));
        });
    }

    public static mirror(player: Player, output: CommandOutput, playerData: PlayerData, res: { AxisPos: Pos; mirror: string; }) {
        AreaOperation.hasArea(playerData);
        let axisPos: Pos3D;
        if (res.AxisPos == null) {
            axisPos = Pos3D.fromPos(player.pos).floor().calibration();
        }
        else {
            axisPos = Pos3D.fromPos(res.AxisPos).floor();
        }
        let st1 = new Structure(playerData.settings.area);
        let st2;
        //计算complex
        let area = st1.area;
        let mir1, mir2;
        switch (res.mirror) {
            case "x":
                mir1 = Transform3.getBasicMirrorX();
                mir2 = Transform3.getUnit();
                break;
            case "z":
                mir1 = Transform3.getBasicMirrorZ();
                mir2 = Transform3.getUnit();
                break;
            case "xz":
                mir1 = Transform3.getBasicMirrorX();
                mir2 = Transform3.getBasicMirrorZ();
                break;
        }
        let trans = Transform3.getMove(axisPos.x, axisPos.z)
            .mul(mir1)
            //@ts-ignore
            .mul(mir2)
            .mul(Transform3.getMove(-axisPos.x, -axisPos.z));
        let va = trans.mul(new Vector3D(area.start.x, area.start.z, 1));
        let vb = trans.mul(new Vector3D(area.end.x, area.end.z, 1));
        st2 = new Structure(new Area3D(new Pos3D(va.arr[0], area.start.y, va.arr[1], area.start.dimid), new Pos3D(vb.arr[0], area.end.y, vb.arr[1], area.end.dimid)));
        BasicTranslOperation.sl(player, playerData, st1, st2, res.mirror, "0_degrees", () => {
            player.sendText(StrFactory.cmdSuccess(`已将选区关于点 ${axisPos} 进行${res.mirror}轴对称`));
        });
    }

    public static sErgod(player: Player, playerData: PlayerData, st: Structure, sid: string, arr: any[], n: number, overCallback: Function) {
        if (n < arr.length) {
            let is = arr[n];
            let area = st.area;
            let lens = area.getLens();
            let pos = new Pos3D(area.start.x + is[0] * lens[0], area.start.y + is[1] * lens[1], area.start.z + is[2] * lens[2], area.start.dimid);
            setTimeout(() => {
                StructureManager.load(player, playerData, st, sid, pos, "none", "0_degrees", true, true, false, 100, "", () => {
                    BasicTranslOperation.sErgod(player, playerData, st, sid, arr, ++n, overCallback);
                });
            }, 80);
        } else {
            overCallback();
        }
    }

    public static stack(player: Player, output: CommandOutput, playerData: PlayerData, res: { xMultiple: number; yMultiple: number; zMultiple: number; }) {
        AreaOperation.hasArea(playerData);
        let nx = res.xMultiple;
        let ny = res.yMultiple;
        let nz = res.zMultiple;
        let area = Area3D.fromArea3D(playerData.settings.area);
        let lens = area.getLens();
        if (ny >= 0) {
            let top = area.end.y + ny * lens[1];
            if (top > Constant.SPACE.MAX_HIGHT) {
                throw new Error(`堆叠后最大高度${top} 不在世界范围内(${Constant.SPACE.MIN_HIGHT}-${Constant.SPACE.MIN_HIGHT}), 无法操作`);
            }
        }
        else {
            let bottom = area.start.y - ny * lens[1];
            if (bottom < Constant.SPACE.MIN_HIGHT) {
                throw new Error(`堆叠后最小高度${bottom} 不在世界范围内(${Constant.SPACE.MIN_HIGHT}-${Constant.SPACE.MIN_HIGHT}), 无法操作`);
            }
        }
        let st = new Structure(area);
        let p1 = Pos3D.fromPos3D(area.start).add(nx < 0 ? nx * lens[0] : 0, ny < 0 ? ny * lens[1] : 0, nz < 0 ? nz * lens[2] : 0);
        let p2 = Pos3D.fromPos3D(area.end).add(nx > 0 ? nx * lens[0] : 0, ny > 0 ? ny * lens[1] : 0, nz > 0 ? nz * lens[2] : 0);
        let allst = new Structure(new Area3D(p1, p2));
        StructureManager.savePos(player, playerData);
        //save st
        StructureManager.save(player, playerData, st, (stSid: string, data: any) => {
            //undoSave
            StructureManager.undoSave(player, playerData, [allst], (complex: any) => {
                //load ALL
                let arr = [];
                let ax = Math.abs(nx);
                let ay = Math.abs(ny);
                let az = Math.abs(nz);
                let sx = nx >= 0 ? 1 : -1;
                let sy = ny >= 0 ? 1 : -1;
                let sz = nz >= 0 ? 1 : -1;
                for (let z = 0; z <= az; z++) {
                    for (let x = 0; x <= ax; x++) {
                        for (let y = 0; y <= ay; y++) {
                            arr.push([sx * x, sy * y, sz * z]);
                        }
                    }
                }
                arr.shift();
                BasicTranslOperation.sErgod(player, playerData, st, stSid, arr, 0, () => {
                    //delete st
                    setTimeout(() => {
                        StructureManager.delete(player, stSid, st);
                    }, 100)
                    StructureManager.tp(player, playerData);
                    let d = (nx == 0 ? 0 : 1) + (ny == 0 ? 0 : 1) + (nz == 0 ? 0 : 1);
                    let nStr = StrFactory.replaceAll(`${ax != 0 ? ax : ""} ${ay != 0 ? ay : ""} ${az != 0 ? az : ""}`.trim(), " +", ",");
                    player.sendText(StrFactory.cmdSuccess(`已将选区在${nx != 0 ? (nx >= 0 ? "+" : "-") + "x" : ""}${ny != 0 ? (ny >= 0 ? "+" : "-") + "y" : ""}${nz != 0 ? (nz >= 0 ? "+" : "-") + "z" : ""}方向上${d}维堆叠${nStr}次`));
                });
            });
        });
    }
}