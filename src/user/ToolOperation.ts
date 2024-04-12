import Config from "../common/Config";
import Players from "./Players";
import CAPlayer from "./CAPlayer";
import { Pos3 } from "../common/Pos3";
import { ToolType } from "../temp/Tool";
import StrFactory from "../util/StrFactory";
import * as acorn from "acorn";
import * as escodegen from "escodegen";
import * as estraverse from "estraverse";
import Tr from "../util/Translator";
import BlockType from "../common/BlockType";

type ToolVariable = {
    readonly pos: Pos3;
    readonly posf: Pos3;
    readonly block: Block;
    readonly itemA: Item;
    readonly itemB: Item;
    readonly itemArr: Array<Item>;
    readonly me: LLSE_Player;
}

export class ToolOperation {
    public static start(output: CommandOutput, caPlayer: CAPlayer, res: { enum_1: any; enum_2: any; item: Item; cmd: string; describe: string; Name: string; }) {
        switch (res.enum_1) {
            case "list":
            case "li":
                ToolOperation.list(output, caPlayer);
                break;
            case "bind":
            case "bi":
                ToolOperation.bind(output, caPlayer, res.item, res.enum_2, res.cmd, res.describe, res.Name);
                break;
            case "unbind":
            case "un":
                ToolOperation.unbind(output, caPlayer, res.item, res.enum_2, res.Name);
                break;
        }
    }

    private static getItems(caPlayer: CAPlayer, type: ToolType) {
        switch (type) {
            case ToolType.RIGHT:
                return caPlayer.settings.items.onUseItemOn
            case ToolType.LEFT:
                return caPlayer.settings.items.onStartDestroyBlock
        }
    }

    /*** private */
    private static checkName(name: string, caPlayer: CAPlayer) {
        if (name !== "") {
            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name)) {
                throw new Error(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.checkName.s0", name));
            }
        }
    }

    /*** private */
    private static getList(caPlayer: CAPlayer, type: ToolType) {
        let items = ToolOperation.getItems(caPlayer, type);
        let arr: any[] = [];
        let nameArr: any[] = [];
        let tempArr: any[] = [];
        Object.keys(items).forEach(type => {
            arr.push(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.getList.s1", StrFactory.color(Format.Bold + Format.Gold, type)));
            nameArr = [];
            Object.keys(items[type]).forEach((name, i, a) => {
                nameArr.push(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.getList.s2", StrFactory.color(Format.Bold + Format.Gold, name), StrFactory.color(Format.Bold + Format.Gold, items[type][name].describe)));
                tempArr = [];
                items[type][name].cmds.forEach((cmd: string) => {
                    tempArr.push(StrFactory.color(Format.MinecoinGold, cmd));
                })
                nameArr.push([Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.list.s10"), tempArr]);
            });
            arr.push(nameArr);
        });
        return arr;
    }

    public static getLinearList(caPlayer: CAPlayer, type: ToolType) {
        let items = ToolOperation.getItems(caPlayer, type);
        let arr: any[] = [];
        Object.keys(items).forEach(type => {
            Object.keys(items[type]).forEach((name, i, a) => {
                arr.push([type, name, items[type][name].describe, items[type][name].cmds]);
            });
        });
        return arr;
    }

    public static restoreDefaults(caPlayer: CAPlayer) {
        caPlayer.settings.items = Config.get(Config.PLAYERS_SETTINGS, "default.items");
        caPlayer.$.sendText(StrFactory.cmdSuccess(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.restoreDefaults.s3")));
    }

    public static cmdsTranslator(caPlayer: CAPlayer, itemArr: Item[], iA: number, iB: number, cmds: string[], block: Block, posFloat: FloatPos) {
        // customize variable
        //@ts-ignore
        block["states"] = BlockType.generateFromBlock(block).states;

        const data: ToolVariable = {
            pos: Pos3.fromPos(block.pos).floor(),
            posf: Pos3.fromPos(posFloat),
            block,
            itemA: itemArr[iA],
            itemB: itemArr[iB],
            itemArr: itemArr,
            me: caPlayer.$
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

    public static onClick(type: ToolType, caPlayer: CAPlayer, item: Item, block: Block, posFloat: FloatPos) {
        let items = ToolOperation.getItems(caPlayer, type);
        let name = "";
        try {
            //@ts-ignore
            name = item.getNbt().getTag("tag").getTag("display").getTag("Name")
                .toString()
                .split("\n")[0];
        }
        catch (e) { }
        if (items[item.type] != null && items[item.type][name] != null) {
            const itemArr = caPlayer.$.getInventory().getAllItems();
            ToolOperation.cmdsTranslator(caPlayer, itemArr, caPlayer.settings.barReplace, caPlayer.settings.barReplaced, items[item.type][name].cmds, block, posFloat).forEach((cmd) => {
                Players.silenceCmd(caPlayer, cmd);
            });
        }
    }

    public static bind(output: CommandOutput, caPlayer: CAPlayer, item: Item, type: ToolType, cmd: string, describe: string, name: string) {
        if (name == null) {
            name = "";
        }
        else {
            ToolOperation.checkName(name, caPlayer);
        }
        if (item.isBlock) {
            throw new Error(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.bind.s4"));
        }
        let items = ToolOperation.getItems(caPlayer, type);
        let cmds = cmd.split(";");
        items[item.type] = (items[item.type] == null ? {} : items[item.type]);
        items[item.type][name] = { cmds: cmds, describe: describe };
        if (name !== "") {
            item.setDisplayName(name + "\n" + describe);
        }
        let pos = Pos3.fromPos(caPlayer.$.pos).calibration().add(0, 1, 0);
        mc.spawnItem(item, pos.x, pos.y, pos.z, pos.dimid);
        output.success(StrFactory.cmdSuccess(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.bind.s5", cmd, item.type, name === "" ? Tr._(caPlayer.$.langCode, "word.noName") : name, describe)));
    }

    public static unbind(output: CommandOutput, caPlayer: CAPlayer, item: Item, type: ToolType, name: string) {
        let items = ToolOperation.getItems(caPlayer, type);
        name = (name == null ? "" : name);
        if (items[item.type] == null || items[item.type][name] == null) {
            throw new Error(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.unbind.s6", item.type, name === "" ? Tr._(caPlayer.$.langCode, "word.noName") : name));
        }
        delete items[item.type][name];
        if (Object.keys(items[item.type]).length == 0) {
            delete items[item.type];
        }
        output.success(StrFactory.cmdSuccess(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.unbind.s7", item.type, name === "" ? Tr._(caPlayer.$.langCode, "word.noName") : name)));
    }

    public static list(output: CommandOutput, caPlayer: CAPlayer) {
        output.success(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.list.s8") + StrFactory.catalog(ToolOperation.getList(caPlayer, ToolType.RIGHT)));
        output.success(Tr._(caPlayer.$.langCode, "dynamic.ToolOperation.list.s9") + StrFactory.catalog(ToolOperation.getList(caPlayer, ToolType.LEFT)));
    }
}