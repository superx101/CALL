import Config from "../common/Config";
import CAPlayer from "./CAPlayer";
import { FileMode } from "../temp/Common";
import StrFactory from "../util/StrFactory";

export default class HelpOperation {
    public static start(output: CommandOutput, caPlayer: CAPlayer) {
        output.success(StrFactory.catalog(HelpOperation.getTreeList()));
    }

    public static readFile() {
        //@ts-ignore
        let file = new File(Config.CONFIG_PATH + "/help.json", FileMode.ReadMode, false);
        let help = JSON.parse(file.readAllSync() as string);
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