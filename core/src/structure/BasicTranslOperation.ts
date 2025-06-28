import Constant from "../temp/Constant";
import Players from "../user/Players";
import FillService from "./FillService";
import StructureService from "./StructureService";
import Area3 from "../common/Area3";
import CAPlayer from "../user/CAPlayer";
import { Pos3 } from "../common/Pos3";
import { Structure, Complex } from "../common/Structure";
import { Pos } from "../temp/Pos";
import { Transform3, Vector3D } from "../util/SimpleMatrix";
import StrFactory from "../util/StrFactory";
import AreaOperation from "./AreaOperation";
import StructureOperation from "./StructureOperation";
import Tr from "../util/Translator";

export default class BasicTranslOperation {
    /*** private */
    private static sl(caPlayer: CAPlayer, st1: Structure, st2: Structure, mirror: string, degrees: string, overCallback: Function) {
        StructureService.savePos(caPlayer);
        //保存complex
        StructureService.undoSave(caPlayer, [st1, st2], (complex: Complex) => {
            let st1id: string;
            Object.keys(complex).forEach(sid => {
                if (complex[sid].area.equals(st1.area)) {
                    st1id = sid;
                }
            });
            //清空原位置
            FillService.ergod(caPlayer, st1.getAreas(), 0, 1, (yBottom: number, yTop: number, area: Area3) => {
                return Players.cmd(caPlayer, `fill ${area.start.x} ${yBottom} ${area.start.z} ${area.end.x} ${yTop} ${area.end.z} air`, false).success;
            }, (warn: number) => {
                if (warn != 0) caPlayer.$.sendText(StrFactory.cmdWarn(Tr._(caPlayer.$.langCode, "dynamic.FillManager.soildFill.warn")));

                //粘贴
                StructureService.load(caPlayer, st1, st1id, st2.area.start, 0, 1, mirror, degrees, true, true, false, 100, "", () => {
                    overCallback();
                    StructureService.tp(caPlayer);
                });
            });
        });
    }

    public static move( output: CommandOutput, caPlayer: CAPlayer, res: { IntPos: IntPos; }) {
        const player = caPlayer.$;
        AreaOperation.hasArea(caPlayer);
        let pos: Pos3;
        if (res.IntPos == null) {
            pos = Pos3.fromPos(player.pos).floor().calibration();
        }
        else {
            pos = Pos3.fromPos(res.IntPos).floor();
        }
        let st1 = new Structure(caPlayer.settings.area);
        let st2 = StructureService.getTargetStruct(st1, pos);
        StructureOperation.checkTargetStruct(st1.area, pos, caPlayer);//检查移动后的区域是否超过限制
        BasicTranslOperation.sl(caPlayer, st1, st2, "none", "0_degrees", () => {
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.BasicTranslOperation.move.success",`${pos}`)));
        });
    }

    public static rote(output: CommandOutput, caPlayer: CAPlayer, res: { AxisPos: Pos; degrees: string; }) {
        const player = caPlayer.$;
        AreaOperation.hasArea(caPlayer);
        let axisPos: Pos3;
        if (res.AxisPos == null) {
            axisPos = Pos3.fromPos(player.pos).floor().calibration();
        }
        else {
            axisPos = Pos3.fromPos(res.AxisPos).floor();
        }
        let st1 = new Structure(caPlayer.settings.area);
        let st2;
        //计算complex
        let area = st1.area;
        let trans = Transform3.getMove(axisPos.x, axisPos.z)
            .mul(Transform3.getBasicRota(parseInt(res.degrees)))
            //@ts-ignore
            .mul(Transform3.getMove(-axisPos.x, -axisPos.z));
        let va = trans.mul(new Vector3D(area.start.x, area.start.z, 1));
        let vb = trans.mul(new Vector3D(area.end.x, area.end.z, 1));
        st2 = new Structure(new Area3(new Pos3(va.arr[0], area.start.y, va.arr[1], area.start.dimid), new Pos3(vb.arr[0], area.end.y, vb.arr[1], area.end.dimid)));
        BasicTranslOperation.sl(caPlayer, st1, st2, "none", res.degrees, () => {
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.BasicTranslOperation.rote.success", `${axisPos}`, `${parseFloat(res.degrees)}`)));
        });
    }

    public static mirror(output: CommandOutput, caPlayer: CAPlayer, res: { AxisPos: Pos; mirror: string; }) {
        const player = caPlayer.$;
        AreaOperation.hasArea(caPlayer);
        let axisPos: Pos3;
        if (res.AxisPos == null) {
            axisPos = Pos3.fromPos(player.pos).floor().calibration();
        }
        else {
            axisPos = Pos3.fromPos(res.AxisPos).floor();
        }
        let st1 = new Structure(caPlayer.settings.area);
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
        st2 = new Structure(new Area3(new Pos3(va.arr[0], area.start.y, va.arr[1], area.start.dimid), new Pos3(vb.arr[0], area.end.y, vb.arr[1], area.end.dimid)));
        BasicTranslOperation.sl(caPlayer, st1, st2, res.mirror, "0_degrees", () => {
            player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.BasicTranslOperation.mirror.success", `${axisPos}`, `${res.mirror}`)));
        });
    }

    public static sErgod(caPlayer: CAPlayer, st: Structure, sid: string, arr: any[], n: number, overCallback: Function) {
        if (n < arr.length) {
            let is = arr[n];
            let area = st.area;
            let lens = area.getLens();
            let pos = new Pos3(area.start.x + is[0] * lens[0], area.start.y + is[1] * lens[1], area.start.z + is[2] * lens[2], area.start.dimid);
            StructureService.load(caPlayer, st, sid, pos, 0, 1, "none", "0_degrees", true, true, false, 100, "", () => {
                BasicTranslOperation.sErgod(caPlayer, st, sid, arr, ++n, overCallback);
            });
        } else {
            overCallback();
        }
    }

    public static stack(output: CommandOutput, caPlayer: CAPlayer, res: { xMultiple: number; yMultiple: number; zMultiple: number; }) {
        const player = caPlayer.$;
        AreaOperation.hasArea(caPlayer);
        let nx = res.xMultiple;
        let ny = res.yMultiple;
        let nz = res.zMultiple;
        let area = Area3.fromArea3D(caPlayer.settings.area);
        let lens = area.getLens();
        if (ny >= 0) {
            let top = area.end.y + ny * lens[1];
            if (top > Constant.SPACE.MAX_HIGHT) {
                throw new Error(Tr._(player.langCode, "dynamic.BasicTranslOperation.stack.max", `${top}`, `${Constant.SPACE.MIN_HIGHT}-${Constant.SPACE.MIN_HIGHT}`));
            }
        }
        else {
            let bottom = area.start.y - ny * lens[1];
            if (bottom < Constant.SPACE.MIN_HIGHT) {
                throw new Error(Tr._(player.langCode, "dynamic.BasicTranslOperation.stack.min", `${bottom}`, `${Constant.SPACE.MIN_HIGHT}-${Constant.SPACE.MIN_HIGHT}`));
            }
        }
        let st = new Structure(area);
        let p1 = Pos3.fromPos3(area.start).add(nx < 0 ? nx * lens[0] : 0, ny < 0 ? ny * lens[1] : 0, nz < 0 ? nz * lens[2] : 0);
        let p2 = Pos3.fromPos3(area.end).add(nx > 0 ? nx * lens[0] : 0, ny > 0 ? ny * lens[1] : 0, nz > 0 ? nz * lens[2] : 0);
        let allst = new Structure(new Area3(p1, p2));
        StructureService.savePos(caPlayer);
        //save st
        StructureService.save(caPlayer, st, 0, 1, (stSid: string, data: any) => {
            //undoSave
            StructureService.undoSave(caPlayer, [allst], (complex: any) => {
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
                BasicTranslOperation.sErgod(caPlayer, st, stSid, arr, 0, () => {
                    //delete st
                    setTimeout(() => {
                        StructureService.delete(caPlayer, stSid, st);
                    }, 100)
                    StructureService.tp(caPlayer);
                    let d = (nx == 0 ? 0 : 1) + (ny == 0 ? 0 : 1) + (nz == 0 ? 0 : 1);
                    let nStr = StrFactory.replaceAll(`${ax != 0 ? ax : ""} ${ay != 0 ? ay : ""} ${az != 0 ? az : ""}`.trim(), " +", ",");
                    player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.BasicTranslOperation.stack.success" ,`${nx != 0 ? (nx >= 0 ? "+" : "-") + "x" : ""}${ny != 0 ? (ny >= 0 ? "+" : "-") + "y" : ""}${nz != 0 ? (nz >= 0 ? "+" : "-") + "z" : ""}`,`${d}`,`${nStr}`)));
                });
            });
        });
    }
}