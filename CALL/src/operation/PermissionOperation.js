// const Config = require("../global/Config")

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
        if (Config.get(Config.PERMISSIONS, "permission") != Config.PERMISSIONS_TYPE_ENUM_CUSTOMIZE) {
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
        output.success("CALL使用权限: ", Config.get(Config.PERMISSIONS, "list"));
    }

    static add(name, output) {
        PermissionOperation.check(name);
        if (!PermissionOperation.find(name)) {
            let list = Config.get(Config.PERMISSIONS, "list");
            list.push(name);
            Config.set(Config.PERMISSIONS, "list", list);
            output.success(`成功添加 ${name} 至CALL权限名单`);
        }
        else {
            throw new Error(`${name} 已在权限名单中, 无需再次添加`);
        }
    }

    static ban(name, output) {
        PermissionOperation.check();
        if (PermissionOperation.find(name)) {
            let list = Config.get(Config.PERMISSIONS, "list");
            let set = new Set(list);
            set.delete(name);
            Config.set(Config.PERMISSIONS, "list", Array.from(set));
            output.success(`成功将 ${name} 移出CALL权限名单`);
        }
        else {
            throw new Error(`${name} 不在权限名单中, 无法移除`);
        }
    }
}
module.exports = PermissionOperation;
