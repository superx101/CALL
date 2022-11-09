// const Constant = require("../global/Constant")
// const Config = require("../global/Config")
// const Pos3D = require("../tool/Pos3D")
// const Area3D = require("../tool/Area3D")
// const Structure = require("../tool/Structure")
// const StrFactory = require("../tool/StrFactory")
// const StructureManager = require("../basicfun/StructureManager")
// const AreaOperation = require("./AreaOperation")

class StructureOperation {
    static findId(input, xuid) {
        let data = StructureManager.getData(xuid);
        let saveList = data.saveList;
        let structid;
        if (saveList[input] != null) {
            structid = input;
        }
        if (structid == null) {
            //从public寻找id
            StructureManager.publicForEach((id, key) => {
                if (id === input) {
                    structid = id;
                    return { xuid: key, structid: structid };
                }
            });
        }
        else {
            return { xuid: xuid, structid: structid };
        }
        if (structid == null) {
            throw new Error("无法找到结构, 请输入正确的结构id");
        }
    }

    /*** private */
    static checkTargetStruct(area, pos) {
        area = new Area3D(area);
        let lens = area.getLens();
        if (pos.y < Constant.SPACE.MIN_HIGHT) {
            throw new Error("目标点y坐标不能小于" + Constant.SPACE.MIN_HIGHT);
        }
        else if (pos.y + lens[1] > Constant.SPACE.MAX_HIGHT) {
            throw new Error(`结构高度(${lens[1]})+目标点y坐标 超过最大可放置范围 ${Constant.SPACE.MAX_HIGHT}`)
        }
    }

    static save(player, output, playerData, res) {
        let name = res.Name;
        let data = StructureManager.getData(player.xuid);
        if (StrFactory.isLegalName(name)) {
            name = `save_${system.getTimeStr()}`;
        }
        AreaOperation.hasArea(playerData);//throw
        let maxNum = Config.get(Config.GLOBAL, "maxSaveStructure")
        if (Object.keys(data.saveList).length >= maxNum) {
            throw new Error(`当前保存的结构数已超过管理员设置的最大数量(${maxNum})`);
        }
        let st = new Structure(playerData.settings.area, name);
        StructureManager.savePos(player, playerData);
        StructureManager.save(player, playerData, st, (structid, data) => {
            data.saveList[`${structid}`] = st;
            Config.set(Config.STRUCTURES, `private.${player.xuid}`, data);
            StructureManager.tp(player, playerData);
            player.sendText(StrFactory.cmdSuccess(`已保存区域 ${new Area3D(data.saveList[structid].area)}\n    -id: ${structid}\n    -名称: ${name}`));
        });
    }

    static load(player, output, playerData, res) {
        let r = StructureOperation.findId(res.id, player.xuid);
        let st = Config.get(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}`);
        let structure = new Structure(st.area, st.name, st.isPublic);
        let pos;
        if (res.posInt == null) {
            pos = new Pos3D(player.pos).calibration().floor();
        }
        else {
            pos = new Pos3D(res.posInt);
        }
        StructureOperation.checkTargetStruct(st.area, pos);
        let targetArea = new Area3D(st.area)
            .relative()
            .addBoth(pos.x, pos.y, pos.z);
        StructureManager.savePos(player, playerData);
        //撤销保存
        StructureManager.undoSave(player, playerData, [new Structure(targetArea)], () => {
            StructureManager.load(player, playerData, structure, r.structid, pos, res.Mirror, res.Degrees, res.IncludeEntities, res.IncludeBlocks, res.Waterlogged, res.Integrity, res.Seed, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(`已加载结构 ${st.name} 到 ${pos}\n    -id: ${r.structid}\n    -加载目标: ${targetArea} `));
            });
        });

    }

    static delete(player, output, playerData, res) {
        let data = StructureManager.getData(player.xuid);
        let saveList = data.saveList;
        let sid = res.id;
        let st = saveList[sid];
        if (st == null) {
            throw new Error("无法找到结构, 请检查结构id (不能删除他人结构)");
        }
        //删除 public
        if (st.isPublic) {
            let puArr = Config.get(Config.STRUCTURES, `public.${player.xuid}`);;
            delete puArr[puArr.indexOf(sid)];
            Config.set(Config.STRUCTURES, `public.${player.xuid}`, puArr);
        }
        StructureManager.delete(player, sid, st);
        let tempSt = saveList[sid];
        //删除 savelist
        delete saveList[sid];
        Config.set(Config.STRUCTURES, `private.${player.xuid}.saveList`, saveList);
        output.success(StrFactory.cmdSuccess(`已删除结构 ${sid}\n  名称: ${tempSt.name}`));
    }

    static list(player, output, playerData) {
        let prArr = StructureManager.getPrivateArr(player);
        let puArr = StructureManager.getPublicArr();
        let arr = [Format.White + Format.Bold + "公开结构§r", new Array(), Format.White + Format.Bold + "我的结构§r", new Array()];
        puArr.forEach((v, i, a) => {
            arr[1].push(Format.Bold + Format.MinecoinGold + v.id + Format.Clear, [Format.Gray + `名称: §r§l${v.name}§r`, Format.Gray + `作者: ${data.xuid2name(v.author)}§r`]);
        });
        prArr.forEach((v, i, a) => {
            arr[3].push(Format.Bold + Format.MinecoinGold + v.id + Format.Clear, [Format.Gray + `名称: §r§l${v.name}§r`]);
        });
        player.sendText(StrFactory.cmdMsg("当前可用结构如下:\n") + StrFactory.catalog(arr));
    }

    static public(player, output, playerData, res) {
        let r = StructureOperation.findId(res.id, player.xuid);
        if (r.xuid != player.xuid) {
            throw new Error("无法修改他人结构可见范围");
        }
        let st = Config.get(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}`);
        if (!st.isPublic) {
            let arr = Config.get(Config.STRUCTURES, `public.${r.xuid}`);
            if (arr == null) {
                arr = [];
            }
            arr.push(r.structid);
            Config.set(Config.STRUCTURES, `public.${r.xuid}`, arr);
            Config.set(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}.isPublic`, true);
        }
        output.success(StrFactory.cmdSuccess(`已公开 ${st.name}\n  id: ${r.structid}`));
    }

    static private(player, output, playerData, res) {
        let r = StructureOperation.findId(res.id, player.xuid);
        if (r.xuid != player.xuid) {
            throw new Error("无法修改他人结构可见范围");
        }
        let st = Config.get(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}`);
        if (st.isPublic) {
            let arr = Config.get(Config.STRUCTURES, `public.${r.xuid}`);
            arr.splice(arr.indexOf(r.structid), 1);
            if (arr.length == 0) {
                Config.del(Config.STRUCTURES, `public.${r.xuid}`);
            }
            else {
                Config.set(Config.STRUCTURES, `public.${r.xuid}`, arr);
            }
            Config.set(Config.STRUCTURES, `private.${r.xuid}.saveList.${r.structid}.isPublic`, false);
        }
        output.success(StrFactory.cmdSuccess(`已隐藏(仅自己可见) ${st.name}\n  id: ${r.structid}`));
    }

    static undo(player, output, playerData) {
        let undoList = StructureManager.getData(player.xuid).undoList;
        if (undoList.length <= 0) {
            throw new Error("无可撤销的操作");
        }
        let complex = undoList.pop();
        let structArr = [];
        Object.keys(complex).forEach((sid) => {
            let area = new Area3D(complex[sid].area);
            structArr.push(new Structure(area, "system_save"));
        });
        StructureManager.savePos(player, playerData);
        StructureManager.redoPush(player, playerData, structArr, () => {
            StructureManager.undoPop(player, playerData, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(`已撤销到上一步`));
            });
        });
    }

    static redo(player, output, playerData) {
        let redoList = StructureManager.getData(player.xuid).redoList;
        if (redoList.length <= 0) {
            throw new Error("无可恢复的操作");
        }
        let complex = redoList.pop();
        let structArr = [];
        Object.keys(complex).forEach((sid) => {
            let area = new Area3D(complex[sid].area);
            structArr.push(new Structure(area, "system_save"));
        });
        StructureManager.savePos(player, playerData);
        StructureManager.undoPush(player, playerData, structArr, () => {
            StructureManager.redoPop(player, playerData, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(`已恢复一步撤销`));
            });
        });

    }

    static copy(player, output, playerData) {
        AreaOperation.hasArea(playerData);//throw
        let data = StructureManager.getData(player.xuid);
        let lastComplex = data.copy;
        let dellast = false;
        //删除上个存储记录
        if(Object.keys(lastComplex).length > 0) {
            dellast = true;
        }
        let area = new Area3D(playerData.settings.area);
        let st = new Structure(area);
        //copy
        StructureManager.copy(player, playerData, [st], dellast, lastComplex, (complex) => {
            //存储记录
            Config.set(Config.STRUCTURES, `private.${player.xuid}.copy`, complex);
            player.sendText(StrFactory.cmdSuccess(`已复制结构: ${area}`));
        });
    }

    static paste(player, output, playerData, res) {
        let data = StructureManager.getData(player.xuid);
        let keys = Object.keys(data.copy);
        if (keys.length == 0) {
            output.error("无复制结构, 无法粘贴");
            return;
        }
        let pos;
        if (res.PosInt != null) {
            pos = new Pos3D(res.PosInt);
        }
        else {
            pos = new Pos3D(player.pos).calibration().floor();
        }
        keys.forEach((sid) => {
            StructureOperation.checkTargetStruct(data.copy[sid].area, pos);
        })
        StructureManager.savePos(player, playerData);
        StructureManager.undoSave(player, playerData, StructureManager.getTargetStructs(data.copy, pos), () => {
            StructureManager.paste(player, playerData, pos, data, () => {
                StructureManager.tp(player, playerData);
                player.sendText(StrFactory.cmdSuccess(`已粘贴结构到: ${pos.floor()}`));
            });
        });
    }

    static getUndoSize(xuid) {
        return StructureManager.getData(xuid).undoList.length;
    }

    static getRedoSize(xuid) {
        return StructureManager.getData(xuid).redoList.length;
    }

    static getSaveList(mod, player) {
        if(mod == 0) {
            return StructureManager.getPrivateArr(player);
        }
        else {
            return StructureManager.getPublicArr();
        }
    }

    static canPaste(xuid) {
        return Object.keys(StructureManager.getData(xuid).copy).length > 0;
    }
}

module.exports = StructureOperation;
