import Config from "../common/Config";
import Constant from "../temp/Constant";
import StructureService from "./StructureService";
import Area3 from "../common/Area3";
import CAPlayer from "../user/CAPlayer";
import { Pos3 } from "../common/Pos3";
import { Complex, Data, Structure } from "../common/Structure";
import StrFactory from "../util/StrFactory";
import AreaOperation from "./AreaOperation";
import { Pos } from "../temp/Pos";
import Tr from "../util/Translator";

export default class StructureOperation {
    private static setDimid(complex: any, distDimid: number): void {
        Object.keys(complex).forEach((sid, i) => {
            complex[sid].area.start.dimid = distDimid;
            complex[sid].area.end.dimid = distDimid;
        });
    }

    public static findId(input: string, caPlayer: CAPlayer) {
        let xuid = caPlayer.$.xuid;
        let data = StructureService.getData(xuid);
        let saveList = data.saveList;
        let structid;
        if (saveList[input] != null) {
            structid = input;
        }
        if (structid == null) {
            //从public寻找id
            StructureService.publicForEach((id: string, key: string) => {
                if (id === input) {
                    structid = id;
                    xuid = key;
                }
            });
        }

        if (structid == null) {
            throw new Error(
                Tr._(
                    caPlayer.$.langCode,
                    "dynamic.StructureOperation.findId.s0"
                )
            );
        } else {
            return { xuid, structid };
        }
    }

    public static checkTargetStruct(
        area: Area3,
        pos: Pos3,
        caPlayer: CAPlayer
    ) {
        area = Area3.fromArea3D(area);
        let lens = area.getLens();
        if (pos.y < Constant.SPACE.MIN_HIGHT) {
            throw new Error(
                Tr._(
                    caPlayer.$.langCode,
                    "dynamic.StructureOperation.checkTargetStruct.s1"
                ) + Constant.SPACE.MIN_HIGHT
            );
        } else if (pos.y + lens[1] > Constant.SPACE.MAX_HIGHT) {
            throw new Error(
                Tr._(
                    caPlayer.$.langCode,
                    "dynamic.StructureOperation.checkTargetStruct.s2",
                    lens[1],
                    pos.y,
                    pos.y + lens[1],
                    Constant.SPACE.MAX_HIGHT
                )
            );
        }
    }

    public static save(
        output: CommandOutput,
        caPlayer: CAPlayer,
        res: { Name: any }
    ) {
        const player = caPlayer.$;
        let name = res.Name;
        let data = StructureService.getData(player.xuid);
        if (StrFactory.isLegalName(name)) {
            name = `save_${system.getTimeStr()}`;
        }
        AreaOperation.hasArea(caPlayer); //throw
        let maxNum = Config.get(Config.GLOBAL, "maxSaveStructure");
        if (Object.keys(data.saveList).length >= maxNum) {
            throw new Error(
                Tr._(
                    player.langCode,
                    "dynamic.StructureOperation.save.s3",
                    maxNum
                )
            );
        }
        let st = new Structure(caPlayer.settings.area, name);
        StructureService.savePos(caPlayer);
        StructureService.save(
            caPlayer,
            st,
            0,
            1,
            (structid: string, data: Data) => {
                data.saveList[`${structid}`] = st;
                Config.set(Config.STRUCTURES, `private.${player.xuid}`, data);
                StructureService.tp(caPlayer);
                player.sendText(
                    StrFactory.cmdSuccess(
                        Tr._(
                            player.langCode,
                            "dynamic.StructureOperation.save.s4",
                            Area3.fromArea3D(data.saveList[structid].area),
                            structid,
                            name
                        )
                    )
                );
            }
        );
    }

    public static load(
        output: CommandOutput,
        caPlayer: CAPlayer,
        res: {
            id: string;
            IntPos: IntPos;
            Mirror: string;
            Degrees: string;
            IncludeEntities: boolean;
            IncludeBlocks: boolean;
            Waterlogged: boolean;
            Integrity: number;
            Seed: string;
        }
    ) {
        const player = caPlayer.$;
        let r = StructureOperation.findId(res.id, caPlayer);
        let st = Config.get(
            Config.STRUCTURES,
            `private.${r.xuid}.saveList.${r.structid}`
        );
        let structure = new Structure(st.area, st.name, st.isPublic);
        let pos: Pos3;
        if (res.IntPos == null) {
            pos = Pos3.fromPos(player.pos).calibration().floor();
        } else {
            pos = Pos3.fromPos(res.IntPos);
        }
        StructureOperation.checkTargetStruct(st.area, pos, caPlayer);
        let targetArea = Area3.fromArea3D(st.area)
            .relative()
            .addBoth(pos.x, pos.y, pos.z);
        StructureService.savePos(caPlayer);
        StructureOperation.setDimid({ st: structure }, pos.dimid); // set dimid to structure
        //save dist area
        StructureService.undoSave(caPlayer, [new Structure(targetArea)], () => {
            StructureService.load(
                caPlayer,
                structure,
                r.structid,
                pos,
                0,
                1,
                res.Mirror,
                res.Degrees,
                res.IncludeEntities,
                res.IncludeBlocks,
                res.Waterlogged,
                res.Integrity,
                res.Seed,
                () => {
                    StructureService.tp(caPlayer);
                    player.sendText(
                        StrFactory.cmdSuccess(
                            Tr._(
                                player.langCode,
                                "dynamic.StructureOperation.load.s5",
                                st.name,
                                pos,
                                r.structid,
                                targetArea
                            )
                        )
                    );
                }
            );
        });
    }

    public static delete(
        output: CommandOutput,
        caPlayer: CAPlayer,
        res: { id: any }
    ) {
        const player = caPlayer.$;
        let data = StructureService.getData(player.xuid);
        let saveList = data.saveList;
        let sid = res.id;
        let st = saveList[sid];
        if (st == null) {
            throw new Error(
                Tr._(player.langCode, "dynamic.StructureOperation.delete.s6")
            );
        }
        //删除 public
        if (st.isPublic) {
            let puArr = Config.get(Config.STRUCTURES, `public.${player.xuid}`);
            delete puArr[puArr.indexOf(sid)];
            Config.set(Config.STRUCTURES, `public.${player.xuid}`, puArr);
        }
        StructureService.delete(caPlayer, sid, st);
        let tempSt = saveList[sid];
        //删除 savelist
        delete saveList[sid];
        Config.set(
            Config.STRUCTURES,
            `private.${player.xuid}.saveList`,
            saveList
        );
        output.success(
            StrFactory.cmdSuccess(
                Tr._(
                    player.langCode,
                    "dynamic.StructureOperation.delete.s7",
                    sid,
                    tempSt.name
                )
            )
        );
    }

    public static list(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        let prArr = StructureService.getPrivateArr(caPlayer);
        let puArr = StructureService.getPublicArr();
        let arr: Array<any> = [
            Format.White +
                Format.Bold +
                Tr._(player.langCode, "dynamic.StructureOperation.list.s8"),
            new Array(),
            Format.White +
                Format.Bold +
                Tr._(player.langCode, "dynamic.StructureOperation.list.s9"),
            new Array(),
        ];
        puArr.forEach((v: any) => {
            arr[1].push(
                Format.Bold + Format.MinecoinGold + v.id + Format.Clear,
                [
                    Format.Gray +
                        Tr._(
                            player.langCode,
                            "dynamic.StructureOperation.list.s10",
                            v.name
                        ),
                    Format.Gray +
                        Tr._(
                            player.langCode,
                            "dynamic.StructureOperation.list.s11",
                            data.xuid2name(v.author)
                        ),
                ]
            );
        });
        prArr.forEach((v: any) => {
            arr[3].push(
                Format.Bold + Format.MinecoinGold + v.id + Format.Clear,
                [
                    Format.Gray +
                        Tr._(
                            player.langCode,
                            "dynamic.StructureOperation.list.s10",
                            v.name
                        ),
                ]
            );
        });
        player.sendText(
            StrFactory.cmdMsg(
                Tr._(player.langCode, "dynamic.StructureOperation.list.s13")
            ) + StrFactory.catalog(arr)
        );
    }

    public static public(
        output: CommandOutput,
        caPlayer: CAPlayer,
        res: { id: string }
    ) {
        const player = caPlayer.$;
        let r = StructureOperation.findId(res.id, caPlayer);
        if (r.xuid != player.xuid) {
            throw new Error(
                Tr._(player.langCode, "dynamic.StructureOperation.public.s14")
            );
        }
        let st: Structure = Config.get(
            Config.STRUCTURES,
            `private.${r.xuid}.saveList.${r.structid}`
        );
        if (!st.isPublic) {
            let arr = Config.get(Config.STRUCTURES, `public.${r.xuid}`);
            if (arr == null) {
                arr = [];
            }
            arr.push(r.structid);
            Config.set(Config.STRUCTURES, `public.${r.xuid}`, arr);
            Config.set(
                Config.STRUCTURES,
                `private.${r.xuid}.saveList.${r.structid}.isPublic`,
                true
            );
        }
        output.success(
            StrFactory.cmdSuccess(
                Tr._(
                    player.langCode,
                    "dynamic.StructureOperation.public.s15",
                    st.name,
                    r.structid
                )
            )
        );
    }

    public static private(
        output: CommandOutput,
        caPlayer: CAPlayer,
        res: { id: string }
    ) {
        const player = caPlayer.$;
        let r = StructureOperation.findId(res.id, caPlayer);
        if (r.xuid != player.xuid) {
            throw new Error(
                Tr._(player.langCode, "dynamic.StructureOperation.public.s14")
            );
        }
        let st = Config.get(
            Config.STRUCTURES,
            `private.${r.xuid}.saveList.${r.structid}`
        ); // get structure
        if (st.isPublic) {
            let arr: string[] = Config.get(
                Config.STRUCTURES,
                `public.${r.xuid}`
            );
            arr.splice(arr.indexOf(r.structid), 1);
            arr = arr.filter((e) => e != null);
            if (arr.length == 0) {
                Config.del(Config.STRUCTURES, `public.${r.xuid}`);
            } else {
                Config.set(Config.STRUCTURES, `public.${r.xuid}`, arr);
            }
            Config.set(
                Config.STRUCTURES,
                `private.${r.xuid}.saveList.${r.structid}.isPublic`,
                false
            );
        }
        output.success(
            StrFactory.cmdSuccess(
                Tr._(
                    player.langCode,
                    "dynamic.StructureOperation.private.s17",
                    st.name,
                    r.structid
                )
            )
        );
    }

    public static undo(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        let undoList = StructureService.getData(player.xuid).undoList;
        if (undoList.length <= 0) {
            throw new Error(
                Tr._(player.langCode, "dynamic.StructureOperation.undo.s18")
            );
        }
        let complex = undoList.pop();
        let structArr: Array<Structure> = [];
        Object.keys(complex).forEach((sid) => {
            let area = Area3.fromArea3D(complex[sid].area);
            structArr.push(new Structure(area, "system_save"));
        });
        StructureService.savePos(caPlayer);
        StructureService.redoPush(caPlayer, structArr, () => {
            StructureService.undoPop(caPlayer, () => {
                StructureService.tp(caPlayer);
                player.sendText(
                    StrFactory.cmdSuccess(
                        Tr._(
                            player.langCode,
                            "dynamic.StructureOperation.undo.s23"
                        )
                    )
                );
            });
        });
    }

    public static redo(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        let redoList = StructureService.getData(player.xuid).redoList;
        if (redoList.length <= 0) {
            throw new Error(
                Tr._(player.langCode, "dynamic.StructureOperation.redo.s19")
            );
        }
        let complex = redoList.pop();
        let structArr: Array<Structure> = [];
        Object.keys(complex).forEach((sid) => {
            let area = Area3.fromArea3D(complex[sid].area);
            structArr.push(new Structure(area, "system_save"));
        });
        StructureService.savePos(caPlayer);
        StructureService.undoPush(caPlayer, structArr, () => {
            StructureService.redoPop(caPlayer, () => {
                StructureService.tp(caPlayer);
                player.sendText(
                    StrFactory.cmdSuccess(
                        Tr._(
                            player.langCode,
                            "dynamic.StructureOperation.redo.s24"
                        )
                    )
                );
            });
        });
    }

    public static copy(output: CommandOutput, caPlayer: CAPlayer) {
        const player = caPlayer.$;
        AreaOperation.hasArea(caPlayer); //throw
        const data = StructureService.getData(player.xuid);
        const lastComplex = data.copy;

        //delete last record
        let dellast = false;
        if (Object.keys(lastComplex).length > 0) {
            dellast = true;
        }

        const area = Area3.fromArea3D(caPlayer.settings.area);
        const structure = new Structure(area);
        
        //copy
        StructureService.copy(
            caPlayer,
            [structure],
            dellast,
            lastComplex,
            (complex: Complex) => {
                //save record
                Config.set(
                    Config.STRUCTURES,
                    `private.${player.xuid}.copy`,
                    complex
                );
                player.sendText(
                    StrFactory.cmdSuccess(
                        Tr._(
                            player.langCode,
                            "dynamic.StructureOperation.copy.s20",
                            area
                        )
                    )
                );
            }
        );
    }

    public static paste(
        output: CommandOutput,
        caPlayer: CAPlayer,
        res: { IntPos: Pos }
    ) {
        const player = caPlayer.$;
        // data's type is any, not Complex. it not has functions
        let data = StructureService.getData(player.xuid) as Data;
        let keys = Object.keys(data.copy);
        if (keys.length == 0) {
            output.error(
                Tr._(player.langCode, "dynamic.StructureOperation.paste.s21")
            );
            return;
        }
        let pos: Pos3;
        if (res.IntPos != null) {
            pos = Pos3.fromPos(res.IntPos);
        } else {
            pos = Pos3.fromPos(player.pos).calibration().floor();
        }

        keys.forEach((sid) => {
            StructureOperation.checkTargetStruct(
                data.copy[sid].area,
                pos,
                caPlayer
            );
        });
        StructureService.savePos(caPlayer);
        StructureOperation.setDimid(data.copy, pos.dimid); // set dimid to data.copy
        StructureService.undoSave(
            caPlayer,
            StructureService.getTargetStructs(data.copy, pos),
            () => {
                StructureService.paste(caPlayer, pos, data, () => {
                    StructureService.tp(caPlayer);
                    player.sendText(
                        StrFactory.cmdSuccess(
                            Tr._(
                                player.langCode,
                                "dynamic.StructureOperation.paste.s22",
                                pos.floor()
                            )
                        )
                    );
                });
            }
        );
    }

    public static getUndoSize(xuid: string) {
        return StructureService.getData(xuid).undoList.length;
    }

    public static getRedoSize(xuid: string) {
        return StructureService.getData(xuid).redoList.length;
    }

    public static getSaveList(mod: number, caPlayer: CAPlayer): [] {
        if (mod == 0) {
            return StructureService.getPrivateArr(caPlayer);
        } else {
            return StructureService.getPublicArr();
        }
    }

    public static canPaste(xuid: string) {
        return Object.keys(StructureService.getData(xuid).copy).length > 0;
    }
}
