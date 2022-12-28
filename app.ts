//LiteLoaderScript Dev Helper
/// <reference path="E:\Mincraft_File\bedrock\lib\HelperLib\src/index.d.ts"/> 

import Activity from "./src/activity/Activity";
import Config from "./src/common/Config";
import Players from "./src/common/Players";
import UpdateManager from "./src/manager/UpdateManager";
import Area3D from "./src/model/Area3D";
import AreaOperation from "./src/operation/AreaOperation";
import BasicTranslOperation from "./src/operation/BasicTranslOperation";
import ChunkOperation from "./src/operation/ChunkOperation";
import EnableOperation from "./src/operation/EnableOperation";
import FillOperation from "./src/operation/FillOperation";
import HelpOperation from "./src/operation/HelpOperation";
import MenuOperation from "./src/operation/MenuOperation";
import PermissionOperation from "./src/operation/PermissionOperation";
import ReloadOperation from "./src/operation/ReloadOperation";
import SettingsOperation from "./src/operation/SettingsOperation";
import ShapeOperation from "./src/operation/ShapeOperation";
import StructureOperation from "./src/operation/StructureOperation";
import ToolOperation from "./src/operation/ToolOperation";
import UpdateOperation from "./src/operation/UpdateOperation";
import ShapeLoader from "./src/plugin/ShapeLoader";
import { Listener } from "./src/type/Common";
import Enums from "./src/type/Enums";
import { Pos } from "./src/type/Pos";
import { ToolType } from "./src/type/Tool";
import StrFactory from "./src/util/StrFactory";

function displayLogo(show: boolean) {
    if (show) {
        logger.info("     _____          _      _      ");
        logger.info("    / ____|   /\\   | |    | |     ");
        logger.info("   | |       /  \\  | |    | |     ");
        logger.info("   | |      / /\\ \\ | |    | |     ");
        logger.info("   | |____ / ____ \\| |____| |____ ");
        logger.info("    \\_____/_/    \\_\\______|______|");
        logger.info(`       ======= ${Config.PLUGIN_VERSION.toString()} =======`);
        logger.info("");
    }
}

function command_playerCallback(ori: CommandOrigin, output: CommandOutput, res: any) {
    if (!Players.hasPermission(ori.player)) {
        throw new Error("无CALL使用权限,无法执行指令");
    }
    let playerData = Players.getData(ori.player.xuid);
    let player = ori.player;
    if (playerData.forbidCmd) {
        throw new Error("无法执行指令, 请等待当前操作结束");
    }

    switch (res.action) {
        case "on":
            EnableOperation.on(player, output, playerData);
            break;
        case "off":
        case "of":
            EnableOperation.off(player, output, playerData);
            return;
    }

    if (!playerData.settings.enable) {
        throw new Error("当前CALL处于关闭状态无法执行指令 (输入/call on开启)");
    }

    switch (res.action) {
        case undefined:
        case "me":
        case "menu":
            MenuOperation.start(player, output, playerData, res);
            break;
        case "area":
        case "ar":
            AreaOperation.start(player, output, playerData, res);
            break;
        case "refresh":
        case "rf":
            ChunkOperation.start(player, output, playerData);
            break;
        case "fill":
        case "fi":
            FillOperation.fill(player, output, playerData, res);
            break;
        case "clear":
        case "cl":
            FillOperation.clear(player, output, playerData);
            break;
        case "replace":
        case "re":
            FillOperation.replace(player, output, playerData, res);
            break;
        case "move":
        case "mo":
            BasicTranslOperation.move(player, output, playerData, res);
            break;
        case "stack":
        case "st":
            BasicTranslOperation.stack(player, output, playerData, res);
            break;
        case "mirror":
        case "mi":
            BasicTranslOperation.mirror(player, output, playerData, res);
            break;
        case "rote":
        case "ro":
            BasicTranslOperation.rote(player, output, playerData, res);
            break;
        case "shape":
        case "sh":
            ShapeOperation.start(player, output, playerData, res);
            break;
        // case "brush":
        // case "br":
        //     break;
        case "copy":
        case "co":
            StructureOperation.copy(player, output, playerData);
            break;
        case "paste":
        case "pa":
            StructureOperation.paste(player, output, playerData, res);
            break;
        case "save":
        case "sa":
            StructureOperation.save(player, output, playerData, res);
            break;
        case "list":
        case "li":
            StructureOperation.list(player, output, playerData);
            break;
        case "load":
        case "lo":
            StructureOperation.load(player, output, playerData, res);
            break;
        case "delete":
        case "de":
            StructureOperation.delete(player, output, playerData, res);
            break;
        case "public":
        case "pu":
            StructureOperation.public(player, output, playerData, res);
            break;
        case "private":
        case "pr":
            StructureOperation.private(player, output, playerData, res);
            break;
        case "undo":
        case "ud":
            StructureOperation.undo(player, output, playerData);
            break;
        case "redo":
        case "rd":
            StructureOperation.redo(player, output, playerData);
            break;
        case "tool":
        case "to":
            ToolOperation.start(player, output, playerData, res);
        case "setting":
            SettingsOperation.start(player, output, playerData, res);
            break;
        case "help":
        case "he":
        case "?":
            HelpOperation.start(player, output, playerData);
            break;
        case "ban":
        case "add":
        case "reload":
        case "r":
            throw new Error("该指令为后台指令");
    }
}

function command_consoleCallback(output: CommandOutput, res: any) {
    switch (res.action) {
        case "ban":
            PermissionOperation.ban(res.playerName, output);
            break;
        case "add":
            PermissionOperation.add(res.playerName, output);
            break;
        case "list":
        case "li":
            PermissionOperation.list(output);
            break;
        case "reload":
        case "r":
            ReloadOperation.start("管理员已重载插件");
            break;
        case "shape":
        case "sh":
            ShapeOperation.consoleStart(output);
            break;
        case "update":
        case "u":
            UpdateOperation.start(output);
            break;
        default:
            throw new Error("当前指令格式错误或为非控制台指令");
    }

}

function command() {
    let cmd = mc.newCommand("call", "建造助手CALL(Construct Assistant for LiteLoaderBDS)指令", PermType.Any, 0x80, "ca");
    //public
    cmd.mandatory("player", ParamType.Player, "", "player_man");
    cmd.mandatory("id", ParamType.String, "id", "id_man");
    cmd.mandatory("tileData", ParamType.Int, "", "tileData_man");
    cmd.mandatory("index", ParamType.Int, "", "index_man");
    cmd.mandatory("block", ParamType.Item, "", "block_man");//Item用于LL2.9.0版本过渡
    cmd.mandatory("key", ParamType.String, "", "key_man");
    cmd.mandatory("item", ParamType.Item, "", "item_man");
    cmd.optional("TileData", ParamType.Int, "", "tileData_opt");
    cmd.optional("PosInt", ParamType.BlockPos, "", "posInt_opt");
    cmd.optional("AxisPos", ParamType.BlockPos, "", "axisPos_opt");
    cmd.optional("Name", ParamType.String, "", "name_opt");

    //menu
    cmd.setEnum("menu", ["menu", "me"]);
    cmd.optional("action", ParamType.Enum, "menu", "menu_opt", 1);
    cmd.optional("option", ParamType.String, "", "option_opt");
    cmd.overload(["menu_opt", "option_opt"]);

    //on-off
    cmd.setEnum("on|off", ["on", "off", "of"]);
    cmd.mandatory("action", ParamType.Enum, "on|off", "on-off_man", 1);
    cmd.overload(["on-off_man"]);

    //refresh
    cmd.setEnum("refresh", ["refresh", "rf"]);
    cmd.mandatory("action", ParamType.Enum, "refresh", "refresh_man", 1);
    cmd.overload(["refresh_man"]);

    //area
    cmd.setEnum("area", ["area", "ar"]);
    cmd.setEnum("se", ["set", "se"]);
    cmd.setEnum("start|end|a|b", ["start", "st", "end", "en", "a", "b"]);
    cmd.setEnum("clear", ["clear", "cl"]);
    cmd.setEnum("show", ["show", "sh"]);
    cmd.setEnum("view", ["view", "vi"]);
    cmd.mandatory("action", ParamType.Enum, "area", "area_man", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "start|end|a|b", "start-end_man", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "se", "se_man", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "clear", "clear_par", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "show", "show_man", 1);
    cmd.mandatory("enum_2", ParamType.Enum, "view", "view_man", 1);
    cmd.optional("enum_2", ParamType.Enum, "on|off", "on-off_opt", 1);
    cmd.overload(["area_man", "start-end_man", "posInt_opt"]);
    cmd.overload(["area_man", "start-end_man", "view_man"]);
    cmd.overload(["area_man", "se_man", "posInt_opt"]);
    cmd.overload(["area_man", "clear_par"]);
    cmd.overload(["area_man", "show_man", "on-off_opt"]);

    //fill
    cmd.setEnum("fill", ["fill", "fi"]);
    cmd.setEnum("fillMode", ["hollow", "outline", "null", "ho", "ou", "nu"]);
    cmd.mandatory("action", ParamType.Enum, "fill", "fill_man", 1);
    cmd.optional("FillMode", ParamType.Enum, "fillMode", "fillMode_opt", 1);
    cmd.overload(["fill_man", "block_man", "tileData_opt", "fillMode_opt"]);

    //clear
    cmd.setEnum("clear", ["clear", "cl"]);
    cmd.mandatory("action", ParamType.Enum, "clear", "clear_man", 1);
    cmd.overload(["clear_man"]);

    //replace
    cmd.setEnum("replace", ["replace", "re"]);
    cmd.mandatory("action", ParamType.Enum, "replace", "replace_man", 1);
    cmd.mandatory("block2", ParamType.Item, "", "block2_man");//Item用于LL2.9.0版本过渡
    cmd.optional("tileData2", ParamType.Int, "", "tileData2_opt");
    cmd.overload(["replace_man", "block_man", "tileData_man", "block2_man", "tileData2_opt"])

    //save
    cmd.setEnum("save", ["save", "sa"]);
    cmd.mandatory("action", ParamType.Enum, "save", "save_man", 1);
    cmd.overload(["save_man", "name_opt"]);

    //list
    cmd.setEnum("list", ["list", "li"]);
    cmd.mandatory("action", ParamType.Enum, "list", "list_man", 1);
    cmd.overload(["list_man"]);

    //load
    cmd.setEnum("load", ["load", "lo"]);
    cmd.setEnum("mirror", ["none", "x", "z", "xz"]);
    cmd.setEnum("degrees", ["0_degrees", "90_degrees", "180_degrees", "270_degrees"]);
    cmd.mandatory("action", ParamType.Enum, "load", "load_man", 1);
    cmd.optional("Mirror", ParamType.Enum, "mirror", "mirror_opt");
    cmd.optional("Degrees", ParamType.Enum, "degrees", "degrees_opt");
    cmd.optional("IncludeEntities", ParamType.Bool, "", "includeEntities_opt");
    cmd.optional("IncludeBlocks", ParamType.Bool, "", "includeBlocks_opt");
    cmd.optional("Waterlogged", ParamType.Bool, "", "waterlogged_opt");
    cmd.optional("Integrity", ParamType.Float, "", "integrity_opt");
    cmd.optional("Seed", ParamType.String, "", "seed_opt");
    cmd.overload(["load_man", "id_man", "posInt_opt", "degrees_opt", "mirror_opt"]);

    //delete
    cmd.setEnum("delete", ["delete", "de"]);
    cmd.mandatory("action", ParamType.Enum, "delete", "delete_man", 1);
    cmd.overload(["delete_man", "id_man"]);

    //range
    cmd.setEnum("range", ["public", "pu", "private", "pr"]);
    cmd.mandatory("action", ParamType.Enum, "range", "range_man", 1);
    cmd.overload(["range_man", "id_man"]);

    //copy
    cmd.setEnum("copy", ["copy", "co"]);
    cmd.mandatory("action", ParamType.Enum, "copy", "copy_man", 1);
    cmd.overload(["copy_man"]);

    //paste
    cmd.setEnum("paste", ["paste", "pa"]);
    cmd.mandatory("action", ParamType.Enum, "paste", "paste_man", 1);
    cmd.overload(["paste_man", "posInt_opt"]);

    //move
    cmd.setEnum("move", ["move", "mo"]);
    cmd.mandatory("action", ParamType.Enum, "move", "move_man", 1);
    cmd.overload(["move_man", "posInt_opt"]);

    //mirror
    cmd.setEnum("mirror_act", ["mirror", "mi"]);
    cmd.setEnum("mirror_notNull", ["x", "z", "xz"]);
    cmd.mandatory("action", ParamType.Enum, "mirror_act", "mirror_act");
    cmd.mandatory("mirror", ParamType.Enum, "mirror_notNull", "mirror_notNull_man");
    cmd.overload(["mirror_act", "mirror_notNull_man", "axisPos_opt"]);

    //rote
    cmd.setEnum("rote", ["rote", "ro"]);
    cmd.setEnum("degrees_notNull", ["90_degrees", "180_degrees", "270_degrees"]);
    cmd.mandatory("action", ParamType.Enum, "rote", "rote_man");
    cmd.mandatory("degrees", ParamType.Enum, "degrees_notNull", "degrees_notNull_man");
    cmd.overload(["rote_man", "degrees_notNull_man", "axisPos_opt"]);

    //stack
    cmd.setEnum("stack", ["stack", "st"]);
    cmd.mandatory("action", ParamType.Enum, "stack", "stack_man");
    cmd.mandatory("xMultiple", ParamType.Int, "", "xMultiple_man");
    cmd.mandatory("yMultiple", ParamType.Int, "", "yMultiple_man");
    cmd.mandatory("zMultiple", ParamType.Int, "", "zMultiple_man");
    cmd.overload(["stack_man", "xMultiple_man", "yMultiple_man", "zMultiple_man"]);

    //shape
    cmd.setEnum("shape", ["shape", "sh"]);
    cmd.mandatory("action", ParamType.Enum, "shape", "shape_man");
    cmd.mandatory("package", ParamType.String, "", "package_man");
    cmd.mandatory("enum_1", ParamType.Enum, "list", "enum1_list_man");
    cmd.mandatory("enum_1", ParamType.Enum, "load", "enum1_load_man");
    cmd.optional("Json", ParamType.JsonValue, "", "json_opt");
    cmd.overload(["shape_man", "enum1_load_man", "package_man", "index_man", "json_opt", "posInt_opt"]);
    cmd.overload(["shape_man", "enum1_list_man"]);

    //undo
    cmd.setEnum("undo", ["undo", "ud"]);
    cmd.mandatory("action", ParamType.Enum, "undo", "undo_man", 1);
    cmd.overload(["undo_man"]);

    //redo
    cmd.setEnum("redo", ["redo", "rd"]);
    cmd.mandatory("action", ParamType.Enum, "redo", "redo_man", 1);
    cmd.overload(["redo_man"]);

    //tool
    cmd.setEnum("tool", ["tool", "to"]);
    cmd.setEnum("bind", ["bind", "bi"]);
    cmd.setEnum("unbind", ["unbind", "un"]);
    cmd.setEnum("type", ["right", "left"]);
    cmd.mandatory("action", ParamType.Enum, "tool", "tool_man");
    cmd.mandatory("enum_1", ParamType.Enum, "bind", "bind_man");
    cmd.mandatory("enum_1", ParamType.Enum, "unbind", "unbind_man");
    cmd.mandatory("enum_2", ParamType.Enum, "type", "type_man");
    cmd.mandatory("cmd", ParamType.String, "", "cmd_man");
    cmd.mandatory("describe", ParamType.String, "", "describe_man");
    cmd.overload(["tool_man", "enum1_list_man"]);
    cmd.overload(["tool_man", "bind_man", "item_man", "type_man", "cmd_man", "describe_man", "name_opt"]);
    cmd.overload(["tool_man", "unbind_man", "item_man", "type_man", "name_opt"]);

    //setting
    cmd.setEnum("setting", ["setting"]);
    cmd.setEnum("set", ["set", "se"]);
    cmd.setEnum("get", ["get", "ge"]);
    cmd.mandatory("action", ParamType.Enum, "setting", "setting_man");
    cmd.mandatory("enum_1", ParamType.Enum, "set", "set_man");
    cmd.mandatory("enum_1", ParamType.Enum, "get", "get_man");
    cmd.mandatory("json", ParamType.JsonValue, "", "json_man");
    cmd.overload(["setting_man", "get_man", "key_man"]);
    cmd.overload(["setting_man", "set_man", "json_man"]);

    //help
    cmd.setEnum("help", ["help", "he", "?"]);
    cmd.mandatory("action", ParamType.Enum, "help", "help_man");
    cmd.overload(["help_man"]);

    //add-ban
    cmd.setEnum("add|ban", ["ban", "add"]);
    cmd.mandatory("playerName", ParamType.String, "playerName", "playerName_man");
    cmd.mandatory("action", ParamType.Enum, "add|ban", "add-ban_man", 1);
    cmd.overload(["add-ban_man", "playerName_man"]);

    //reload
    cmd.setEnum("reload", ["reload", "r"]);
    cmd.mandatory("action", ParamType.Enum, "reload", "reload_man");
    cmd.overload(["reload_man"]);

    //update
    cmd.setEnum("update", ["update", "u"]);
    cmd.mandatory("action", ParamType.Enum, "update", "update_man");
    cmd.overload(["update_man"]);

    // cmd.setEnum("brush", ["brush", "br"]);
    // cmd.setEnum("texture", ["texture", "te"]);
    // cmd.mandatory("action", ParamType.Enum, "brush");

    cmd.setCallback((cmd, ori, output, res) => {
        try {
            if (ori.type == OriginType.Player) {
                command_playerCallback(ori, output, res);
            }
            else if (ori.type == OriginType.Block) {

            }
            else if (ori.type == OriginType.Server) {
                command_consoleCallback(output, res);
            }
        } catch (ex) {
            output.error(StrFactory.cmdErr(ex.message));
            if (Config.get(Config.GLOBAL, "debugMod")) {
                throw ex;
            }
        }
    });
    cmd.setup();
}

function listener() {
    mc.listen(Listener.Join, (player) => {
        if (Players.hasPermission(player)) {
            Activity.onCreate(player);
            Activity.onStart(player);
        }
    });

    mc.listen(Listener.Left, (player) => {
        if (Players.hasPermission(player)) {
            Activity.onStop(player);
            Activity.onDestroy(player);
        }
    });

    mc.listen(Listener.UseItemOn, (player, item, block, side, pos: Pos) => {
        if (Players.hasPermission(player) && EnableOperation.isEnable(player)) {
            let playerData = Players.getData(player.xuid);
            // 防抖
            if (playerData.click == null || !playerData.click) {
                playerData.click = true;
                setTimeout(() => {
                    playerData.click = false;
                }, 200);

                //业务
                try {
                    ToolOperation.onClick(ToolType.RIGHT, player, playerData, item, block, pos);
                } catch (e) {
                    if (Config.get(Config.GLOBAL, "debugMod")) {
                        throw e;
                    }
                    player.sendText(StrFactory.cmdErr(e.message))
                }
            }
        }
    });

    mc.listen(Listener.StartDestroyBlock, (player: Player, block: Block) => {
        if (Players.hasPermission(player) && EnableOperation.isEnable(player)) {
            let playerData = Players.getData(player.xuid);

            //业务
            try {
                ToolOperation.onClick(ToolType.LEFT, player, playerData, player.getHand(), block, block.pos);
            } catch (e) {
                if (Config.get(Config.GLOBAL, "debugMod")) {
                    throw e;
                }
                player.sendText(StrFactory.cmdErr(e.message))
            }
        }
    }
    );
}

function clock() {
    setInterval(() => {
        let xuid;
        let playerData;
        let player;
        for (let singleMap of Players.dataMap) {
            xuid = singleMap[0];
            playerData = singleMap[1];
            player = mc.getPlayer(xuid);
            //选区提示
            if (playerData.settings.areaTextShow && playerData.hasSetArea) {
                let area = Area3D.fromArea3D(playerData.settings.area);
                player.sendText(`当前选区: ${playerData.settings.area.start}->${playerData.settings.area.end}\n长度: ${area.getLensStr()}`, Enums.msg.TIP);
            }
        }
    }, 300);

    if (Config.get(Config.GLOBAL, "autoUpdate", true)) {
        setInterval(() => {
            UpdateManager.updatePlugin(true);
        }, 10 * 1000);
    }
}

function checkVersion() {
    if (!ll.requireVersion(Config.LL_MINVERSION.major, Config.LL_MINVERSION.minor, Config.LL_MINVERSION.revision)) {
        logger.warn(`当前ll版本为${ll.major}.${ll.minor}.${ll.revision}, 小于CALL发布时的ll版本${Config.LL_MINVERSION.toString()}, 若出现部分功能失效请更新ll(LiteLoader)`)
    }
    if (Config.ISOLDVERSION) {
        logger.warn(`当前BDS版本为:${Config.SERVER_VERSION.toString()}, CALL-0.2.0后主要适配1.19.50即以上版本, 已不做旧版兼容, 若使用中出现问题请安装CALL-0.1.2`);
    }
}

function init() {
    try {
        checkVersion();
        //updateData
        UpdateManager.updateData();

        //unload
        ReloadOperation.unload();

        Config.check();
        if (!Config.get(Config.GLOBAL, "enable")) {
            return false;
        }
        //默认设置
        Config.set(Config.PLAYERS_SETTINGS, "default", Config.get(Config.GLOBAL, "default"));

        Activity.onServerCreate();

        listener(); //监听器初始化
        command();//指令初始化
    }
    catch (ex) {
        colorLog("red", ex.message);
        return false;
    }
    return true;
}

function loadPlugins() {
    ShapeLoader.start();
}

function myDebug() {
    let path = Config.ROOT + "/test";
    //@ts-ignore
    File.getFilesList(path).forEach(file => {
        if (file.endsWith("js")) {
            //@ts-ignore
            let code = File.readFrom(`${path}/${file}`);
            if (code != null) {
                ll.eval(code);
            }
        }
    })
}

function main(debug: boolean) {
    if (Config.get(Config.GLOBAL, "enable")) {
        if (init()) {
            clock();
            displayLogo(Config.get(Config.GLOBAL, "displayLogo"));
            loadPlugins();
        }
        if (debug) {
            myDebug();
        }
    }
}

main(true);