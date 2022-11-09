// const Pos3D = require("../tool/Pos3D")

const ShapeManager = require("../basicfun/ShapeManager");
const ShapeLoader = require("../plugin/ShapeLoader");

// const ShapeManager = require("../basicfun/ShapeManager");

class ShapeOperation {
    static consoleStart(output) {
        ShapeOperation.list(output);
    }

    static start(player, output, playerData, res) {
        switch (res.enum_1) {
            case "list":
            case "li":
                ShapeOperation.list(output);
                break;
            case "load":
            case "lo":
                ShapeOperation.load(player, output, playerData, res.package, res.index, res.PosInt, res.Json);
                break;
            default:
                break;
        }
    }

    static load(player, output, playerData, pack, index, PosInt, Json) {
        let pos = (PosInt == null ? new Pos3D(player.pos).calibration() : PosInt);
        let result = ShapeManager.run(player, playerData, pack, index, pos, Json);
    }

    static sendForm(player, playerData, pkgName, index) {
        try {
            let pos = new Pos3D(player.pos).calibration().floor();
            let posInt = mc.newIntPos(pos.x, pos.y, pos.z, pos.dimid);
            let fuc = ll.import(ShapeLoader.EXPORTSAPCE, pkgName + ShapeLoader.FORM);
            fuc(player, index, posInt);
        }
        catch (e) {
            if(ShapeManager.debugMod) {
                colorLog("Red", `形状包:${pkgName}异常, 原因: ${e}`);
            }
        }
    }

    static getTutorial(pkgName) {
        try {
            let get = ll.import(ShapeLoader.EXPORTSAPCE, pkgName + ShapeLoader.TUTORAIL);
            let obj = get();
            if(Object.keys(obj).length == 0) {
                throw new Error("export_tutorial返回对象为空");
            }
            return obj;
        }
        catch (e) {
            if(ShapeManager.debugMod) {
                colorLog("red", `形状包:${pkgName}异常, 原因: ${e}`);
            }
            return null;
        }
    }

    static getList() {
        return ShapeManager.getList();
    }

    static getPkgs() {
        return ShapeManager.pkgs;
    }

    static list(output) {
        let str = "";
        ShapeManager.getList().forEach(pkg => {
            str += pkg + '\n';
        });
        output.success("成功加载的形状包:\n" + str);
    }
}

module.exports = ShapeOperation
