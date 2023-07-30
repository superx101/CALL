import Activity from "../activity/Activity";
import Config from "../common/Config";
import { PermissionsType } from "../type/Config";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class PermissionOperation {
    /*** private */
    private static check(name: string) {
        if (Config.get(Config.GLOBAL, "permission") != PermissionsType.CUSTOMIZE) {
            throw new Error(Tr._c("console.PermissionOperation.check.error"));
        }
        if (name == null) {
            throw new Error(Tr._c("console.PermissionOperation.check.error1"));
        }
        name = name.trim();
        if (name === "") {
            throw new Error(Tr._c("console.PermissionOperation.check.error2"));
        }
    }

    public static find(name: string) {
        let list = Config.get(Config.PERMISSIONS, "list");
        if (list.indexOf(name) != -1) {
            return true;
        }
        return false;
    }

    public static list(output: CommandOutput) {
        output.success(Tr._c("console.PermissionOperation.list.success", Config.get(Config.PERMISSIONS, "list")));
    }

    public static add(name: string, output: CommandOutput) {
        PermissionOperation.check(name);
        if (!PermissionOperation.find(name)) {
            let list = Config.get(Config.PERMISSIONS, "list");
            let player = mc.getPlayer(name);
            list.push(name);
            Config.set(Config.PERMISSIONS, "list", list);
            output.success(Tr._c("console.PermissionOperation.add.success", name, player == null ? Tr._c("word.no") : Tr._c("word.ok")));

            if(player != null) {
                Activity.onCreate(player);
                player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.PermissionOperation.add.success")));
            }
        }
        else {
            throw new Error(Tr._c("console.PermissionOperation.add.fail", `${name}`));
        }
    }

    public static ban(name: string, output: CommandOutput) {
        PermissionOperation.check(name);
        if (PermissionOperation.find(name)) {
            let list = Config.get(Config.PERMISSIONS, "list");
            let set = new Set(list);
            let player = mc.getPlayer(name);
            set.delete(name);
            Config.set(Config.PERMISSIONS, "list", Array.from(set));
            output.success(Tr._c("console.PermissionOperation.ban.success", name, player == null ? Tr._c("word.no") : Tr._c("word.ok")));

            if(player != null) {
                Activity.onDestroy(player);
                player.sendText(StrFactory.cmdErr(Tr._(player.langCode, "dynamic.PermissionOperation.ban.success")));
            }
        }
        else {
            throw new Error(Tr._c("console.PermissionOperation.ban.fail", `${name}`));
        }
    }
}