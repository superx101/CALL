import Config from "../common/Config";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import { Listener } from "../type/Common";
import { ToolType } from "../type/Tool";
import StrFactory from "../util/StrFactory";

type ToolVariable = {
    readonly pos: Pos3D;
    readonly posf: Pos3D;
    readonly block: Block;
    readonly itemA: Item;
    readonly itemB: Item;
    readonly itemArr: Array<Item>;
    readonly me: Player;
}

export default class ToolOperation {
    public static start(player: Player, output: CommandOutput, playerData: PlayerData, res: { enum_1: any; enum_2: any; item: Item; cmd: string; describe: string; Name: string; }) {
        switch (res.enum_1) {
            case "list":
            case "li":
                ToolOperation.list(player, output, playerData);
                break;
            case "bind":
            case "bi":
                ToolOperation.bind(player, output, playerData, res.item, res.enum_2, res.cmd, res.describe, res.Name);
                break;
            case "unbind":
            case "un":
                ToolOperation.unbind(player, output, playerData, res.item, res.enum_2, res.Name);
                break;
        }
    }

    private static getItems(playerData: PlayerData, type: ToolType) {
        switch (type) {
            case ToolType.RIGHT:
                return playerData.settings.items.onUseItemOn
            case ToolType.LEFT:
                return playerData.settings.items.onStartDestroyBlock
        }
    }

    /*** private */
    private static checkName(name: string) {
        if (name !== "") {
            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name)) {
                throw new Error(`名称${name}不合法, 仅允许包含中英文、数字、下划线`);
            }
        }
    }

    /*** private */
    private static getList(player: Player, playerData: PlayerData, type: ToolType) {
        let items = ToolOperation.getItems(playerData, type);
        let arr: any[] = [];
        let nameArr: any[] = [];
        let tempArr: any[] = [];
        Object.keys(items).forEach(type => {
            arr.push(`物品id: ${StrFactory.color(Format.Bold + Format.Gold, type)}`);
            nameArr = [];
            Object.keys(items[type]).forEach((name, i, a) => {
                nameArr.push(`物品名称: ${StrFactory.color(Format.Bold + Format.Gold, name)}, 描述: ${StrFactory.color(Format.Bold + Format.Gold, items[type][name].describe)}`);
                tempArr = [];
                items[type][name].cmds.forEach((cmd: string) => {
                    tempArr.push(StrFactory.color(Format.MinecoinGold, cmd));
                })
                nameArr.push([`绑定指令组:`, tempArr]);
            });
            arr.push(nameArr);
        });
        return arr;
    }

    public static getLinearList(player: Player, playerData: PlayerData, type: ToolType) {
        let items = ToolOperation.getItems(playerData, type);
        let arr: any[] = [];
        Object.keys(items).forEach(type => {
            Object.keys(items[type]).forEach((name, i, a) => {
                arr.push([type, name, items[type][name].describe, items[type][name].cmds]);
            });
        });
        return arr;
    }

    public static restoreDefaults(player: Player, playerData: PlayerData) {
        playerData.settings.items = Config.get(Config.PLAYERS_SETTINGS, "default.items");
        player.sendText(StrFactory.cmdSuccess("已恢复所有快捷键为默认设置"));
    }

    public static cmdsTranslator(player: Player, itemArr: Item[], iA: number, iB: number, cmds: string[], block: Block, posFloat: FloatPos) {
        const data: ToolVariable = {
            pos: Pos3D.fromPos(block.pos).floor(),
            posf: Pos3D.fromPos(posFloat),
            block,
            itemA: itemArr[iA],
            itemB: itemArr[iB],
            itemArr: itemArr,
            me: player
        }

        const arr: string[] = [];
        cmds.forEach((cmd, i) => {
            const strs = cmd.match(/\$\{.+?\}/g);
            const varRegex = /[a-zA-Z_][0-9a-zA-Z_]*(\.[a-zA-Z_][0-9a-zA-Z_]*)*(\(\))?/g;
            if (strs != null) {
                for (let i = 0; i < strs.length; i++) {
                    cmd = cmd.replace(new RegExp(/\$\{.+?\}/), eval('`' + strs[i].replace(varRegex, 'data.$&') + '`'));//`1 + block.pos.x * 2`
                }
            }

            arr.push(cmd);
        });
        return arr;
    }

    public static onClick(type: ToolType, player: Player, playerData: PlayerData, item: Item, block: Block, posFloat: FloatPos) {
        let items = ToolOperation.getItems(playerData, type);
        let name = "";
        try {
            //@ts-ignore
            name = item.getNbt().getTag("tag").getTag("display").getTag("Name")
                .toString()
                .split("\n")[0];
        }
        catch (e) {}
        if (items[item.type] != null && items[item.type][name] != null) {
            const itemArr = player.getInventory().getAllItems();
            ToolOperation.cmdsTranslator(player, itemArr, playerData.settings.barReplace, playerData.settings.barReplaced, items[item.type][name].cmds, block, posFloat).forEach((cmd) => {
                player.runcmd(cmd);
            });
        }
    }

    public static bind(player: Player, output: CommandOutput, playerData: PlayerData, item: Item, type: ToolType, cmd: string, describe: string, name: string) {
        if (name == null) {
            name = "";
        }
        else {
            ToolOperation.checkName(name);
        }
        if (item.isBlock) {
            throw new Error("不能将方块设置为快捷键");
        }
        let items = ToolOperation.getItems(playerData, type);
        let cmds = cmd.split(";");
        items[item.type] = (items[item.type] == null ? {} : items[item.type]);
        items[item.type][name] = { cmds: cmds, describe: describe };
        if (name !== "") {
            item.setDisplayName(name + "\n" + describe);
        }
        let pos = Pos3D.fromPos(player.pos).calibration().add(0, 1, 0);
        mc.spawnItem(item, pos.x, pos.y, pos.z, pos.dimid);
        output.success(StrFactory.cmdSuccess(`已绑定指令组: ${cmd} 到 物品(id: ${item.type}, 名称: ${name === "" ? "无名称" : name} 描述: ${describe})`));
    }

    public static unbind(player: Player, output: CommandOutput, playerData: PlayerData, item: Item, type: ToolType, name: string) {
        let items = ToolOperation.getItems(playerData, type);
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

    public static list(player: Player, output: CommandOutput, playerData: PlayerData) {
        output.success("快捷键列表-右键:\n" + StrFactory.catalog(ToolOperation.getList(player, playerData, ToolType.RIGHT)));
        output.success("快捷键列表-左键:\n" + StrFactory.catalog(ToolOperation.getList(player, playerData, ToolType.LEFT)));
    }
}