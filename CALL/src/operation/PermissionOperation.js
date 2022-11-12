const Config = require("../global/Config")
const Activity = require("../main/Activity");
const StrFactory = require("../tool/StrFactory");

class PermissionOperation {
    /*** private */
    static find(name) {
        let list = Config.get(Config.PERMISSIONS, "list");
        if (list.indexOf(name) != -1) {
            return true;
        }
        return false;
    }

    /*** private */
    static check(name) {
        if (Config.get(Config.PERMISSIONS, "permission") != Config.PERMISSIONS_TYPE_ENUM.CUSTOMIZE) {
            throw new Error("当前设置不为: 自定义玩家(\"permission\": \"customize\"), 无法使用add/ban");
        }
        if (name == null) {
            throw new Error("请输入正确指令格式:<call> <add|ban> <玩家名字>");
        }
        name = name.trim();
        if (name === "") {
            throw new Error("玩家名字不正确");
        }
    }

    static list(output) {
        output.success("有权使用CALL名单: ", Config.get(Config.PERMISSIONS, "list"));
    }

    static add(name, output) {
        PermissionOperation.check(name);
        if (!PermissionOperation.find(name)) {
            let list = Config.get(Config.PERMISSIONS, "list");
            let player = mc.getPlayer(name);
            list.push(name);
            Config.set(Config.PERMISSIONS, "list", list);
            output.success(`成功添加 ${name} 至CALL权限名单, 从在线玩家中 ${player == null ? "不能" : "可以"} 读取到该玩家`);

            if(player != null) {
                Activity.onCreate(player);
                player.sendText(StrFactory.cmdSuccess("您已获取CALL使用权限"));
            }
        }
        else {
            throw new Error(`${name} 已在权限名单中, 无需再次添加`);
        }
    }

    static ban(name, output) {
        PermissionOperation.check(name);
        if (PermissionOperation.find(name)) {
            let list = Config.get(Config.PERMISSIONS, "list");
            let set = new Set(list);
            let player = mc.getPlayer(name);
            set.delete(name);
            Config.set(Config.PERMISSIONS, "list", Array.from(set));
            output.success(`成功将 ${name} 移出CALL权限名单, 从在线玩家中 ${player == null ? "不能" : "可以"} 读取到该玩家`);

            if(player != null) {
                Activity.onDestroy(player);
                player.sendText(StrFactory.cmdErr("您已失去CALL使用权限"));
            }
        }
        else {
            throw new Error(`${name} 不在权限名单中, 无法移除`);
        }
    }
}
module.exports = PermissionOperation;
