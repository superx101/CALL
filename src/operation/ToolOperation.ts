import Config from "../common/Config";
import Players from "../common/Players";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import { Listener } from "../type/Common";
import { ToolType } from "../type/Tool";
import StrFactory from "../util/StrFactory";
import * as acorn from "acorn";
import * as escodegen from "escodegen";
import * as estraverse from "estraverse";
import Tr from "../util/Translator";
import BlockType from "../model/BlockType";

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
    private static checkName(name: string, player: Player) {
        if (name !== "") {
            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name)) {
                throw new Error(Tr._(player.langCode, "dynamic.ToolOperation.checkName.s0", name));
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
            arr.push(Tr._(player.langCode, "dynamic.ToolOperation.getList.s1", StrFactory.color(Format.Bold + Format.Gold, type)));
            nameArr = [];
            Object.keys(items[type]).forEach((name, i, a) => {
                nameArr.push(Tr._(player.langCode, "dynamic.ToolOperation.getList.s2", StrFactory.color(Format.Bold + Format.Gold, name), StrFactory.color(Format.Bold + Format.Gold, items[type][name].describe)));
                tempArr = [];
                items[type][name].cmds.forEach((cmd: string) => {
                    tempArr.push(StrFactory.color(Format.MinecoinGold, cmd));
                })
                nameArr.push([Tr._(player.langCode, "dynamic.ToolOperation.list.s10"), tempArr]);
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
        player.sendText(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.ToolOperation.restoreDefaults.s3")));
    }

    public static cmdsTranslator(player: Player, itemArr: Item[], iA: number, iB: number, cmds: string[], block: Block, posFloat: FloatPos) {
        // customize variable
        //@ts-ignore
        block["states"] = BlockType.generateFromBlock(block).states;

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
            if (strs != null) {
                for (let i = 0; i < strs.length; i++) {
                    // 解析表达式
                    const ast: any = acorn.parse(strs[i].slice(2, -1), { ecmaVersion: 2021 });
                    // 遍历语法树的函数
                    estraverse.replace(ast, {
                        enter(node, parent) {
                            if (node.type === "Identifier" && !(parent.type === "MemberExpression" && parent.property == node)) {
                                node.name = 'data.' + node.name;
                            }
                        }
                    })
                    // 表达式生成指令
                    cmd = cmd.replace(new RegExp(/\$\{.+?\}/), eval('`${' + escodegen.generate(ast).slice(0, -1) + '}`'));//`1 + block.pos.x * 2`
                }
            }

            if (!(cmd === '' || cmd === '/')) {
                arr.push(cmd);
            }
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
        catch (e) { }
        if (items[item.type] != null && items[item.type][name] != null) {
            const itemArr = player.getInventory().getAllItems();
            ToolOperation.cmdsTranslator(player, itemArr, playerData.settings.barReplace, playerData.settings.barReplaced, items[item.type][name].cmds, block, posFloat).forEach((cmd) => {
                Players.silenceCmd(player, cmd);
            });
        }
    }

    public static bind(player: Player, output: CommandOutput, playerData: PlayerData, item: Item, type: ToolType, cmd: string, describe: string, name: string) {
        if (name == null) {
            name = "";
        }
        else {
            ToolOperation.checkName(name, player);
        }
        if (item.isBlock) {
            throw new Error(Tr._(player.langCode, "dynamic.ToolOperation.bind.s4"));
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
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.ToolOperation.bind.s5", cmd, item.type, name === "" ? Tr._(player.langCode, "word.noName") : name, describe)));
    }

    public static unbind(player: Player, output: CommandOutput, playerData: PlayerData, item: Item, type: ToolType, name: string) {
        let items = ToolOperation.getItems(playerData, type);
        name = (name == null ? "" : name);
        if (items[item.type] == null || items[item.type][name] == null) {
            throw new Error(Tr._(player.langCode, "dynamic.ToolOperation.unbind.s6", item.type, name === "" ? Tr._(player.langCode, "word.noName") : name));
        }
        delete items[item.type][name];
        if (Object.keys(items[item.type]).length == 0) {
            delete items[item.type];
        }
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.ToolOperation.unbind.s7", item.type, name === "" ? Tr._(player.langCode, "word.noName") : name)));
    }

    public static list(player: Player, output: CommandOutput, playerData: PlayerData) {
        output.success(Tr._(player.langCode, "dynamic.ToolOperation.list.s8") + StrFactory.catalog(ToolOperation.getList(player, playerData, ToolType.RIGHT)));
        output.success(Tr._(player.langCode, "dynamic.ToolOperation.list.s9") + StrFactory.catalog(ToolOperation.getList(player, playerData, ToolType.LEFT)));
    }
}