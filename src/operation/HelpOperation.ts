import Config from "../common/Config";
import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";
import ShapeOperation from "./ShapeOperation";

export default class HelpOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData) {
        output.success(StrFactory.catalog(HelpOperation.getTreeList()));
    }

    public static readFile() {
        let file = new File(Config.CONFIG + "/help.json", 0, false);
        let help = JSON.parse(file.readAllSync() as string);
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
    private static dfs(obj: any) {
        if (typeof (obj) === "object") {
            let arr: any = [];
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