// const Pos3D = require("../tool/Pos3D")
// const StrFactory = require("../tool/StrFactory")

class ToolOperation {
    static start(player, output, playerData, res) {
        switch (res.enum_1) {
            case "list":
            case "li":
                ToolOperation.list(player, output, playerData);
                break;
            case "bind":
            case "bi":
                ToolOperation.bind(player, output, playerData, res.item, res.cmd, res.describe, res.Name);
                break;
            case "unbind":
            case "un":
                ToolOperation.unbind(player, output, playerData, res.item, res.Name);
                break;
        }
    }

    /*** private */
    static checkName(name) {
        if (name !== "") {
            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name)) {
                throw new Error(`名称${name}不合法, 仅允许包含中英文、数字、下划线`);
            }
        }
    }

    /*** private */
    static getList(player, playerData) {
        let items = playerData.settings.items;
        let arr = [];
        let nameArr = [];
        let tempArr = [];
        Object.keys(items).forEach(type => {
            arr.push(`物品id: ${StrFactory.color(Format.Bold + Format.Gold, type)}`);
            nameArr = [];
            Object.keys(items[type]).forEach((name, i, a) => {
                nameArr.push(`物品名称: ${StrFactory.color(Format.Bold + Format.Gold, name)}, 描述: ${StrFactory.color(Format.Bold + Format.Gold, items[type][name].describe)}`);
                tempArr = [];
                items[type][name].cmds.forEach(cmd => {
                    tempArr.push(StrFactory.color(Format.MinecoinGold, cmd));
                })
                nameArr.push([`绑定指令组:`, tempArr]);
            });
            arr.push(nameArr);
        });
        return arr;
    }

    static getLinearList(player, playerData) {
        let items = playerData.settings.items;
        let arr = [];
        Object.keys(items).forEach(type => {
            Object.keys(items[type]).forEach((name, i, a) => {
                arr.push([type, name, items[type][name].describe, items[type][name].cmds]);
            });
        });
        return arr;
    }

    static restoreDefaults(player, playerData) {
        playerData.settings.items = Config.get(Config.PLAYERS_SETTINGS, "default.items");
        player.sendText(StrFactory.cmdSuccess("已恢复所有快捷键为默认设置"));
    }

    static cmdsTranslator(cmds, block, posFloat) {
        let pos = new Pos3D(block.pos).floor();
        let posf = new Pos3D(posFloat);
        let arr = [];
        cmds.forEach((cmd, i) => {
            /**
             * ${posf.x}: posFloat
             * ${posf.y}: posFloat
             * ${posf.z}: posFloat
             * ${pos.x}:  block.pos
             * ${pos.y}:  block.pos
             * ${pos.z}:  block.pos
             * ${type}: block.type
             * ${tileData}: block.tileData
            */
            let strs = cmd.match(/\$\{.+\}/g);
            if (strs != null) {
                for (let i = 0; i < strs.length; i++) {
                    cmd = cmd.replace(new RegExp(/\$\{.+\}/), eval('`' + strs[i] + '`'));
                }
            }

            arr.push(cmd);
        });
        return arr;
    }

    static onClick(player, playerData, item, block, posFloat) {
        let items = playerData.settings.items;
        let name = "";
        try {
            name = item.getNbt()
                .getTag("tag")
                .getTag("display")
                .getTag("Name")
                .toString()
                .split("\n")[0];
        }
        catch (e) { }
        if (items[item.type] != null && items[item.type][name] != null) {
            ToolOperation.cmdsTranslator(items[item.type][name].cmds, block, posFloat).forEach((cmd) => {
                player.runcmd(cmd);
            });
        }
    }

    static bind(player, output, playerData, item, cmd, describe, name) {
        if (name == null) {
            name = "";
        }
        else {
            ToolOperation.checkName(name);
        }
        if (item.isBlock) {
            throw new Error("不能将方块设置为快捷键");
        }
        let items = playerData.settings.items;
        let cmds = cmd.split(";");
        items[item.type] = (items[item.type] == null ? {} : items[item.type]);
        items[item.type][name] = { cmds: cmds, describe: describe };
        if (name !== "") {
            item.setDisplayName(name + "\n" + describe);
        }
        let pos = new Pos3D(player.pos).calibration().add(0, 1, 0);
        mc.spawnItem(item, pos.x, pos.y, pos.z, pos.dimid);
        output.success(StrFactory.cmdSuccess(`已绑定指令组: ${cmd} 到 物品(id: ${item.type}, 名称: ${name === "" ? "无名称" : name} 描述: ${describe})`));
    }

    static unbind(player, output, playerData, item, name) {
        let items = playerData.settings.items;
        name = (name == null ? "" : name);
        if (items[item.type] == null || items[item.type][name] == null) {
            throw new Error(`物品 (id: ${item.type} 名称: ${name === "" ? "无名称" : name}) 未找到绑定记录, 无法解绑, 请检查是否绑定或名称是否正确`);
        }
        delete items[item.type][name];
        if (Object.keys(items[item.type]).length == 0) {
            delete items[item.type];
        }
        output.success(StrFactory.cmdSuccess(`已解绑物品(id: ${item.type} 名称: ${name === "" ? "无名称" : name})`));
    }


    static list(player, output, playerData) {
        output.success("指令快捷键绑定列表如下:\n" + StrFactory.catalog(ToolOperation.getList(player, playerData)));
    }
}

module.exports = ToolOperation