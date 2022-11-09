const Config = require("../global/Config");
const ShapeOperation = require("./ShapeOperation");

class HelpOperation {
    static start(player, output, playerData) {
        output.success(StrFactory.catalog(HelpOperation.getTreeList()));
    }

    static readFile() {
        let file = new File(Config.DATAPATH + "/help.json", 0);
        let help = JSON.parse(file.readAllSync());
        let pkgs = ShapeOperation.getPkgs();
        Object.keys(pkgs).forEach(pkgName => {
            let obj = ShapeOperation.getTutorial(pkgName);
            if (obj != null) {
                help["进阶功能介绍"][pkgName] = obj;
            }
        });
        return help;
    }

    /*** private */
    static dfs(obj) {
        if (typeof (obj) === "object") {
            let arr = [];
            Object.keys(obj).forEach((key, i) => {
                arr.push(key);
                arr.push(HelpOperation.dfs(obj[key]))
            });
            return arr;
        }
        else if (typeof (obj) === "string") {
            return [obj];
        }
    }

    static getTreeList() {
        return HelpOperation.dfs(HelpOperation.readFile());
    }
}

module.exports = HelpOperation;