// const Constant = require("../global/Constant")
// const Pos3D = require("../tool/Pos3D")
// const Area3D = require("../tool/Area3D")
// const Structure = require("../tool/Structure");
// const StrFactory = require("../tool/StrFactory")
// const StructureManager = require("../basicfun/StructureManager")
// const AreaOperation = require("./AreaOperation")
// const Transform3 = require("../math/simplematrix/Transform3")
// const Vector3D = require("../math/simplematrix/Vector3D")


class BasicTranslOperation {
    /*** private */
    static sl(player, playerData, st1, st2, mirror, degrees, overCallback) {
        StructureManager.savePos(player, playerData);
        //保存complex
        StructureManager.undoSave(player, playerData, [st1, st2], (complex) => {
            let st1id;
            Object.keys(complex).forEach(sid => {
                if (complex[sid].area.equals(st1.area)) {
                    st1id = sid;
                }
            });
            //清空原位置
            FillManager.ergod(player, playerData, st1.getAreas(), (yBottom, yTop, area) => {
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

    static move(player, output, playerData, res) {
        AreaOperation.hasArea(playerData);
        let pos;
        if (res.PosInt == null) {
            pos = new Pos3D(player.pos).floor().calibration();
        }
        else {
            pos = new Pos3D(res.PosInt).floor();
        }
        let st1 = new Structure(playerData.settings.area);
        let st2 = StructureManager.getTargetStruct(st1, pos);
        BasicTranslOperation.sl(player, playerData, st1, st2, "none", "0_degrees", () => {
            player.sendText(StrFactory.cmdSuccess(`已将选区平移至 ${pos}`));
        });
    }

    static rote(player, output, playerData, res) {
        AreaOperation.hasArea(playerData);
        let axisPos;
        if (res.AxisPos == null) {
            axisPos = new Pos3D(player.pos).floor().calibration();
        }
        else {
            axisPos = new Pos3D(res.AxisPos).floor();
        }
        let st1 = new Structure(playerData.settings.area);
        let st2;
        //计算complex
        let area = st1.area;
        let trans = Transform3.getMove(axisPos.x, axisPos.z)
            .mul(Transform3.getBasicRota(parseInt(res.degrees)))
            .mul(Transform3.getMove(-axisPos.x, -axisPos.z));
        let va = trans.mul(new Vector3D(area.start.x, area.start.z, 1));
        let vb = trans.mul(new Vector3D(area.end.x, area.end.z, 1));
        st2 = new Structure(new Area3D(new Pos3D(va.arr[0], area.start.y, va.arr[1], area.start.dimid), new Pos3D(vb.arr[0], area.end.y, vb.arr[1], area.end.dimid)));
        BasicTranslOperation.sl(player, playerData, st1, st2, "none", res.degrees, () => {
            player.sendText(StrFactory.cmdSuccess(`已将选区绕点: ${axisPos} 顺时针旋转 ${parseFloat(res.degrees)} 度`));
        });
    }

    static mirror(player, output, playerData, res) {
        AreaOperation.hasArea(playerData);
        let axisPos;
        if (res.AxisPos == null) {
            axisPos = new Pos3D(player.pos).floor().calibration();
        }
        else {
            axisPos = new Pos3D(res.AxisPos).floor();
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
            .mul(mir2)
            .mul(Transform3.getMove(-axisPos.x, -axisPos.z));
        let va = trans.mul(new Vector3D(area.start.x, area.start.z, 1));
        let vb = trans.mul(new Vector3D(area.end.x, area.end.z, 1));
        st2 = new Structure(new Area3D(new Pos3D(va.arr[0], area.start.y, va.arr[1], area.start.dimid), new Pos3D(vb.arr[0], area.end.y, vb.arr[1], area.end.dimid)));
        BasicTranslOperation.sl(player, playerData, st1, st2, res.mirror, "0_degrees", () => {
            player.sendText(StrFactory.cmdSuccess(`已将选区关于点 ${axisPos} 进行${res.mirror}轴对称`));
        });
    }

    static sErgod(player, playerData, st, sid, arr, n, overCallback) {
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

    static stack(player, output, playerData, res) {
        AreaOperation.hasArea(playerData);
        let nx = res.xMultiple;
        let ny = res.yMultiple;
        let nz = res.zMultiple;
        let area = new Area3D(playerData.settings.area);
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
        let p1 = new Pos3D(area.start).add(nx < 0 ? nx * lens[0] : 0, ny < 0 ? ny * lens[1] : 0, nz < 0 ? nz * lens[2] : 0, area.start.dimid);
        let p2 = new Pos3D(area.end).add(nx > 0 ? nx * lens[0] : 0, ny > 0 ? ny * lens[1] : 0, nz > 0 ? nz * lens[2] : 0, area.end.dimid);
        let allst = new Structure(new Area3D(p1, p2));
        StructureManager.savePos(player, playerData);
        //save st
        StructureManager.save(player, playerData, st, (stSid, data) => {
            //undoSave
            StructureManager.undoSave(player, playerData, [allst], (complex) => {
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

module.exports = BasicTranslOperation
