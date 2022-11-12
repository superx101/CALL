const Config = require("../global/Config")
// const Players = require("../global/Players")
const Pos3D = require("../tool/Pos3D")
const NBTManager = require("./NBTManager")

class StructureManager {
    static STRUCT_OPN_MOD = {
        FAST: 0,
        STABLE: 1
    }

    static deleteBuffer = [];

    /*** private */
    static loadCheck(player, area) {
        let tx = (area.start.x + area.end.x) / 2;
        let ty = (area.start.y + area.end.y) / 2;
        let tz = (area.start.z + area.end.z) / 2;
        let dimid = area.start.dimid;
        player.teleport(tx, ty, tz, dimid);
        if (mc.getBlock(tx, ty, tz, dimid) != null) {
            return true;
        }
        return false;
    }

    static register(xuid) {
        let pr = Config.get(Config.STRUCTURES, "private");
        let data = pr.default;
        data.pid = ("0000" + Object.keys(pr).length).slice(-4);
        Config.set(Config.STRUCTURES, `private.${xuid}`, data);
        return data;
    }

    static getData(xuid) {
        let data = Config.get(Config.STRUCTURES, `private.${xuid}`);
        if (data == null) {
            data = StructureManager.register(xuid);
        }
        return data;
    }

    static publicForEach(callback) {
        let pu = Config.get(Config.STRUCTURES, "public")
        let keys = Object.keys(pu);
        let structids;
        for (let key of keys) {
            structids = pu[`${key}`];
            for (let id of structids) {
                callback(id, key);
            }
        }
    }

    static savePos(player, playerData) {
        playerData.prePos = new Pos3D(player.pos).calibration();
        playerData.direction = player.direction;
    }

    static tp(player, playerData) {
        let pos = playerData.prePos;
        let diArr = Pos3D.directionToPosArr(playerData.direction);
        let res = Players.cmd(player, `/tp "${player.realName}" ${pos.x.toFixed(2)} ${(pos.y - 0.5).toFixed(2)} ${pos.z.toFixed(2)} facing ${parseFloat(pos.x.toFixed(2)) + diArr[0]} ${parseFloat(pos.y.toFixed(2)) + diArr[1]} ${parseFloat(pos.z.toFixed(2)) + diArr[2]}`);
        if (res.success) {
            player.refreshChunks();
        }
    }

    static traversal(player, playerData, areas, x, z, successCallback, overCallback, failCallback) {
        function suc() {
            //成功
            successCallback(x, z);
            //继续执行下一区域
            x++;
            if (x >= areas.length) {
                x = 0;
                z++;
            }
            if (z < areas[0].length) {
                StructureManager.traversal(player, playerData, areas, x, z, successCallback, overCallback, failCallback);
            }
            else {
                //结束
                playerData.forbidCmd = false;
                overCallback(x, z);
            }
        }
        let pos = areas[x][z].start;
        if (x == 0 && z == 0) {
            playerData.forbidCmd = true;//禁止执行指令
        }
        if (mc.getBlock(pos.x, pos.y, pos.z, pos.dimid) == null) {
            //建立新线程
            if (playerData.settings.loadChuckTip) {
                player.sendText(StrFactory.cmdMsg(`${areas[x][z]} 超出加载范围\n正在新线程中尝试加载...`));
            }
            let n = Config.get(Config.GLOBAL, "maxLoadCheckNum");
            let ns = n;
            let success = false;
            let threaID = setInterval(() => {
                if (StructureManager.loadCheck(player, areas[x][z])) {
                    success = true;
                    n = 0;
                }
                if (n <= 0) {
                    if (success) {
                        if (playerData.settings.loadChuckTip) {
                            player.sendText(StrFactory.cmdTip(`${areas[x][z]} 加载成功`));
                        }
                        suc();
                    }
                    else {
                        //失败
                        failCallback(x, z);
                        tp();
                        playerData.forbidCmd = false;
                        if (playerData.settings.loadChuckTip) {
                            player.sendText(StrFactory.cmdErr(`${areas[x][z]} 尝试加载区块${ns}次均失败, 已取消操作`));
                        }
                    }
                    clearInterval(threaID);
                }
                n--;
            }, 1000);
        }
        else {
            suc();
        }
    }

    static save(player, playerData, structure, overCallback) {
        let data = StructureManager.getData(player.xuid);
        let areas = structure.getAreas();
        let structid = "c" + data.pid
            + system.getTimeStr()
                .replaceAll(" ", "")
                .replaceAll("-", "")
                .replaceAll(":", "")
                .substring(2)
            + ("000" + Config.getId().toString(16)).slice(-3);
        //保存所有分结构
        StructureManager.traversal(player, playerData, areas, 0, 0, (x, z) => {
            let saveid;
            saveid = structid + "_" + x + "_" + z;
            // Players.cmd(player, `/structure save "${saveid}" ${start.formatStr()} ${end.formatStr()} disk`);
            NBTManager.save(saveid, areas[x][z]);
            // log(`/structure save "${saveid}" ${start.formatStr()} ${end.formatStr()} disk`);
        }, (x, z) => {
            //结束
            overCallback(structid, data);
        }, (x, z) => {
            //删除所有保存
            for (let tz = 0; tz <= z; tz++) {
                for (let tx = 0; tx <= x; tx++) {
                    let saveid = structid + "_" + x + "_" + z;
                    // Players.cmd(player, `/structure delete "${saveid}"`);
                    NBTManager.del(saveid);
                    // log(`/structure delete "${saveid}"`);
                }
            }
        });
    }


    static load(player, playerData, preStructure, structid, posInt, mirror = "none", degrees = "0_degrees", includeEntities = false, includeBlocks = true, waterlogged = false, integrity = 100, seed = "", overCallback) {
        let area = new Area3D(preStructure.area).relative();
        let areas = new Structure(area).getAreas();
        //area变换矩阵
        let trans = Transform3.getBasicRota(parseFloat(degrees))
            .mul(Transform3.getMirror(mirror));
        let sta2 = area.start.transform2D(trans);
        let end2 = area.end.transform2D(trans);
        let lens2 = [end2.x - sta2.x, end2.z - sta2.z];
        //areas中所有area变换
        for (let iz = 0; iz < preStructure.zSize; iz++) {
            for (let ix = 0; ix < preStructure.xSize; ix++) {
                let a = areas[ix][iz];
                a = a.transform2D(trans);
                a.start.add(posInt.x, posInt.y, posInt.z);
                a.end.add(posInt.x, posInt.y, posInt.z);
                areas[ix][iz] = a;
            }
        }
        //坐标修复
        let tx = 0;
        let tz = 0;
        if (lens2[0] < 0) {
            tx = -lens2[0];
        }
        if (lens2[1] < 0) {
            tz = -lens2[1];
        }
        let saveid;
        let start;
        StructureManager.traversal(player, playerData, areas, 0, 0, (x, z) => {
            //index变换
            saveid = structid + "_" + x + "_" + z;
            // Players.cmd(player, `/structure load "${saveid}" ${areas[x][z].start.formatStr()} ${degrees} ${mirror} ${String(includeEntities)} ${String(includeBlocks)} ${integrity} ${seed}`);
            start = areas[x][z].start;
            NBTManager.load(saveid, new Pos3D(start.x + tx, start.y, start.z + tz, start.dimid), mirror, degrees);
        }, (x, z) => {
            overCallback();
        }, (x, z) => { });
    }

    static delete(player, sid, st) {
        //cmd delete
        for (let z = 0; z < st.zSize; z++) {
            for (let x = 0; x < st.xSize; x++) {
                let saveid = sid + "_" + x + "_" + z;
                NBTManager.del(saveid);
            }
        }
        if(st.isPublic) {
            let pu = Config.get(Config.STRUCTURES, `public`);
            let data = pu[player.xuid];
            delete data[data.indexOf(sid)];
            if(data.length == 0) {
                delete pu[player.xuid];
            }
            Config.set(Config.STRUCTURES, `public`, pu);
        }
    }

    static getPrivateArr(player) {
        let arr = [];
        let saveList = Config.get(Config.STRUCTURES, `private.${player.xuid}.saveList`);
        Object.keys(saveList).forEach((structid) => {
            arr.push({ id: structid, name: saveList[structid].name, author: player.xuid,  isPublic: saveList[structid].isPublic});
        });
        return arr;
    }

    static getPublicArr() {
        let arr = [];
        StructureManager.publicForEach((id, key) => {
            let st = Config.get(Config.STRUCTURES, `private.${key}.saveList.${id}`);
            arr.push({ id: id, name: st.name, author: key, isPublic: st.isPublic});
        });
        return arr;
    }

    static getTargetStruct(st, pos) {
        let area = new Area3D(st.area);
        area = area.relative();
        area.start.add(pos.x, pos.y, pos.z);
        area.end.add(pos.x, pos.y, pos.z);
        return new Structure(area);
    }

    static getTargetStructs(complex, targetPos) {
        let res = [];
        let area;
        let st;
        Object.keys(complex).forEach((sid, i) => {
            area = new Area3D(complex[sid].area).relative();
            area.start.add(targetPos.x, targetPos.y, targetPos.z);
            area.end.add(targetPos.x, targetPos.y, targetPos.z);
            res.push(new Structure(area));
        });
        return res;
    }

    /*** private */
    static otherSave(player, playerData, structArr, overCallback) {
        //保存结构
        let complex = {};
        structArr.forEach((st, i, arr) => {
            st.name = "system_save";
            StructureManager.save(player, playerData, st, (structid, data) => {
                //成功结束
                //保存文件
                complex[structid] = st;
                if (i >= arr.length - 1) {
                    overCallback(complex);
                }
            });
        });
    }

    /*** private */
    static pop(player, playerData, overCallback, mod) {
        let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.${mod}List`);
        let complex = list.pop();
        Object.keys(complex).forEach((sid, i, arr) => {
            let st = complex[sid];
            StructureManager.load(player, playerData, st, sid, st.area.start, "none", "0_degrees", false, true, false, 100, "", () => {
                if (i == arr.length - 1) {
                    StructureManager.delete(player, sid, st);
                    Config.set(Config.STRUCTURES, `private.${player.xuid}.${mod}List`, list);
                    overCallback();
                }
            });
        });
    }

    static clearCopy(player) {
        let complex = Config.get(Config.STRUCTURES, `private.${player.xuid}.copy`);
        Object.keys(complex).forEach((sid) => {
            StructureManager.delete(player, sid, complex[sid]);
        });
        Config.set(Config.STRUCTURES, `private.${player.xuid}.copy`, {});
    }

    static clearUndoList(player) {
        let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.undoList`);
        list.forEach((complex, i, a) => {
            Object.keys(complex).forEach((sid) => {
                StructureManager.delete(player, sid, complex[sid]);
            });
        });
        Config.set(Config.STRUCTURES, `private.${player.xuid}.undoList`, []);
    }

    static clearRedoList(player) {
        let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.redoList`);
        list.forEach((complex, i, a) => {
            Object.keys(complex).forEach((sid) => {
                StructureManager.delete(player, sid, complex[sid]);
            });
        });
        Config.set(Config.STRUCTURES, `private.${player.xuid}.redoList`, []);
    }

    /**普通操作调用入口*/
    static undoSave(player, playerData, structArr, overCallback) {
        function overCallback2(complex) {
            StructureManager.clearRedoList(player);//清空redoList
            overCallback(complex);
        }
        StructureManager.undoPush(player, playerData, structArr, overCallback2);
    }

    /**undo调用入口*/
    static undoPush(player, playerData, structArr, overCallback) {
        let data = StructureManager.getData(player.xuid);
        let undoList = data.undoList;
        StructureManager.otherSave(player, playerData, structArr, (complex) => {
            undoList.push(complex);
            if (undoList.length > Config.get(Config.GLOBAL, "maxUndoStep")) {
                //删除0号,栈所有元素前移
                let complex1 = undoList.shift();
                Object.keys(complex1).forEach((sid) => {
                    StructureManager.delete(player, sid, complex1[sid]);
                });
            }
            Config.set(Config.STRUCTURES, `private.${player.xuid}`, data);
            overCallback(complex);
        });
    }

    static redoPush(player, playerData, structArr, overCallback) {
        StructureManager.otherSave(player, playerData, structArr, (complex) => {
            let list = Config.get(Config.STRUCTURES, `private.${player.xuid}.redoList`);
            list.push(complex);
            Config.set(Config.STRUCTURES, `private.${player.xuid}.redoList`, list);
            overCallback();
        });
    }

    static undoPop(player, playerData, overCallback) {
        StructureManager.pop(player, playerData, overCallback, "undo");
    }

    static redoPop(player, playerData, overCallback) {
        StructureManager.pop(player, playerData, overCallback, "redo");
    }

    static copy(player, playerData, structArr, delLast, lastComplex, overCallback) {
        //删除上个存储结构
        if (delLast) {
            Object.keys(lastComplex).forEach((sid, i, a) => {
                StructureManager.delete(player, sid, lastComplex[sid]);
            });
        }
        //存储
        StructureManager.otherSave(player, playerData, structArr, (complex) => {
            overCallback(complex);
        });
    }

    static paste(player, playerData, pos, data, overCallback) {
        let complex = data.copy;
        Object.keys(complex).forEach((sid, i, arr) => {
            StructureManager.load(player, playerData, complex[sid], sid, pos, "none", "0_degrees", false, true, false, 100, "", () => {
                if (i == arr.length - 1) {
                    overCallback();
                }
            });
        });
    }
}

module.exports = StructureManager;