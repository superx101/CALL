//LiteLoaderScript Dev Helper
/// <reference path="E:\\Mincraft_File\\bedrock\\lib\\HelperLib\\src/index.d.ts"/> 

import Activity from "./activity/Activity";
import Config from "./common/Config";
import Players from "./common/Players";
import AreaDisplayerManager from "./manager/AreaDisplayerManager";
import UpdateManager from "./manager/UpdateManager";
import AreaOperation from "./operation/AreaOperation";
import BasicTranslOperation from "./operation/BasicTranslOperation";
import BlockEditerOperation from "./operation/BlockEditerOperation";
import ChunkOperation from "./operation/ChunkOperation";
import EnableOperation from "./operation/EnableOperation";
import ExportOperation from "./operation/ExportOperation";
import FillOperation from "./operation/FillOperation";
import HelpOperation from "./operation/HelpOperation";
import ImportOperation from "./operation/ImportOperation";
import MenuOperation from "./operation/MenuOperation";
import PermissionOperation from "./operation/PermissionOperation";
import ReloadOperation from "./operation/ReloadOperation";
import SettingsOperation from "./operation/SettingsOperation";
import ShapeOperation from "./operation/ShapeOperation";
import StructureOperation from "./operation/StructureOperation";
import TextureOperation from "./operation/TextureOperation";
import ToolOperation from "./operation/ToolOperation";
import UpdateOperation from "./operation/UpdateOperation";
import ShapeLoader from "./plugin/ShapeLoader";
import { Listener } from "./type/Common";
import { Warn } from "./type/Error";
import { Pos } from "./type/Pos";
import { ToolType } from "./type/Tool";
import StrFactory from "./util/StrFactory";

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
        case "texture":
        case "te":
            TextureOperation.start(player, output, playerData, res);
            break;
        case "block":
        case "bl":
            BlockEditerOperation.start(player, output, playerData, res);
            break;
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
        case "update":
        case "u":
        case "import":
        case "im":
        case "export":
        case "ex":
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
        case "import":
        case "im":
            ImportOperation.start(res, output);
            break;
        case "export":
        case "ex":
            ExportOperation.start(res, output);
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
    cmd.mandatory("states", ParamType.String, "", "states_man");
    cmd.mandatory("index", ParamType.Int, "", "index_man");
    cmd.mandatory("block", ParamType.Block, "", "block_man");
    cmd.mandatory("key", ParamType.String, "", "key_man");
    cmd.mandatory("item", ParamType.Item, "", "item_man");
    cmd.mandatory("intPos", ParamType.BlockPos, "", "intPos_man");
    cmd.mandatory("nbt", ParamType.JsonValue, "", "nbt_man");
    cmd.mandatory("xuid", ParamType.String, "", "xuid_man");
    cmd.optional("States", ParamType.String, "", "states_opt");
    cmd.optional("IntPos", ParamType.BlockPos, "", "intPos_opt");
    cmd.optional("AxisPos", ParamType.BlockPos, "", "axisPos_opt");
    cmd.optional("Name", ParamType.String, "", "name_opt");
    cmd.optional("BlockEntity", ParamType.JsonValue, "", "blockEntity_man");

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
    cmd.overload(["area_man", "start-end_man", "intPos_opt"]);
    cmd.overload(["area_man", "start-end_man", "view_man"]);
    cmd.overload(["area_man", "se_man", "intPos_opt"]);
    cmd.overload(["area_man", "clear_par"]);
    cmd.overload(["area_man", "show_man", "on-off_opt"]);

    //fill
    cmd.setEnum("fill", ["fill", "fi"]);
    cmd.setEnum("fillMode", ["hollow", "outline", "null", "ho", "ou", "nu"]);
    cmd.mandatory("action", ParamType.Enum, "fill", "fill_man", 1);
    cmd.optional("FillMode", ParamType.Enum, "fillMode", "fillMode_opt", 1);
    cmd.overload(["fill_man", "block_man", "states_opt", "fillMode_opt"]);

    //clear
    cmd.setEnum("clear", ["clear", "cl"]);
    cmd.mandatory("action", ParamType.Enum, "clear", "clear_man", 1);
    cmd.overload(["clear_man"]);

    //replace
    cmd.setEnum("replace", ["replace", "re"]);
    cmd.mandatory("action", ParamType.Enum, "replace", "replace_man", 1);
    cmd.mandatory("block2", ParamType.Block, "", "block2_man");
    cmd.optional("states2", ParamType.String, "", "states2_opt");
    cmd.overload(["replace_man", "block_man", "states_man", "block2_man", "states2_opt"])

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
    cmd.overload(["load_man", "id_man", "intPos_opt", "degrees_opt", "mirror_opt"]);

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
    cmd.overload(["paste_man", "intPos_opt"]);

    //move
    cmd.setEnum("move", ["move", "mo"]);
    cmd.mandatory("action", ParamType.Enum, "move", "move_man", 1);
    cmd.overload(["move_man", "intPos_opt"]);

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

    //block
    cmd.setEnum("block", ["block", "bl"]);
    cmd.mandatory("action", ParamType.Enum, "block", "block_enum_man");
    cmd.mandatory("enum_1", ParamType.Enum, "menu", "menu_man");
    cmd.overload(["block_enum_man", "intPos_man", "nbt_man", "blockEntity_man"]);
    cmd.overload(["block_enum_man", "intPos_man", "menu_man"]);

    //texture
    cmd.setEnum("texture", ["texture", "te"]);
    cmd.setEnum("ab", ["a", "b"]);
    cmd.mandatory("action", ParamType.Enum, "texture", "texture_man");
    cmd.mandatory("enum_1", ParamType.Enum, "ab", "ab_man");
    cmd.overload(["texture_man", "ab_man", "intPos_man"]);

    //shape
    cmd.setEnum("shape", ["shape", "sh"]);
    cmd.mandatory("action", ParamType.Enum, "shape", "shape_man");
    cmd.mandatory("package", ParamType.String, "", "package_man");
    cmd.mandatory("enum_1", ParamType.Enum, "list", "enum1_list_man");
    cmd.mandatory("enum_1", ParamType.Enum, "load", "enum1_load_man");
    cmd.optional("Json", ParamType.JsonValue, "", "json_opt");
    cmd.overload(["shape_man", "enum1_load_man", "package_man", "index_man", "json_opt", "intPos_opt"]);
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

    //import
    cmd.setEnum("import", ["import", "im"]);
    cmd.mandatory("action", ParamType.Enum,  "import", "import_man");
    cmd.mandatory("file", ParamType.String,  "", "file_man");
    cmd.optional("includeEntity", ParamType.Bool,  "", "includeEntity_opt");
    cmd.overload(["import_man", "file_man", "playerName_man", "includeEntity_opt", "name_opt"]);

    //export
    cmd.setEnum("export", ["export", "ex"]);
    cmd.setEnum("fileType", ["mcstructure"])
    cmd.mandatory("action", ParamType.Enum,  "export", "export_man");
    cmd.mandatory("type", ParamType.Enum,  "fileType", "fileType_man");
    cmd.overload(["export_man", "fileType_man", "id_man", "includeEntity_opt", "name_opt"]);

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
        
        } catch (e) {
            if(e instanceof Warn) {
                output.error(StrFactory.cmdWarn(e.message));
            }
            else {
                output.error(StrFactory.cmdErr(e.message));
            }
            if (Config.get(Config.GLOBAL, "debugMod")) {
                logger.error(e.message + "\nstack:" + e.stack);
            }
        }
    });
    cmd.setup();
}

function listener() {
    log(11111)
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

    const clickMap = new Map<string, boolean>();

    mc.listen(Listener.UseItemOn, (player, item, block, side, pos: Pos) => {
        // 防抖
        log(2222)
        log("xuid", player.xuid)
        const click = clickMap.get(player.xuid);
        if (!click) {
            clickMap.set(player.xuid, true);
            setTimeout(() => {
                clickMap.set(player.xuid, false);
            }, 200);
            
            //业务
            if (Players.hasPermission(player) && EnableOperation.isEnable(player)) {
                let playerData = Players.getData(player.xuid);
                try {
                    ToolOperation.onClick(ToolType.RIGHT, player, playerData, item, block, pos);
                } catch (e) {
                    if (Config.get(Config.GLOBAL, "debugMod")) {
                        logger.error(e.message + "\nstack:" + e.stack);
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
                    logger.error(e.message + "\nstack:" + e.stack);
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
            AreaDisplayerManager.areaTextTip(player, playerData);
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
        logger.warn(`当前LL版本为${ll.major}.${ll.minor}.${ll.revision}, 小于当前CALL支持的LL最小版本${Config.LL_MINVERSION.toString()}, 若出现部分功能失效请更新LL(LiteLoaderBDS)`)
    }
    if (Config.ISOLDVERSION) {
        logger.warn(`当前BDS版本为:${Config.SERVER_VERSION.toString()}, CALL-1.1.5后主要适配1.19.70即以上版本, 已不与旧版兼容, 若使用中出现问题请安装旧版`);
    }
}

function init() {
    try {
        checkVersion();
        //updateData
        UpdateManager.updateData();

        //unload
        ReloadOperation.unload();

        Config.check();//检查配置
        if (!Config.get(Config.GLOBAL, "enable")) {
            return false;
        }
        //默认设置
        Config.set(Config.PLAYERS_SETTINGS, "default", Config.get(Config.GLOBAL, "default"));

        Activity.onServerCreate();

        listener(); //监听器初始化
        command();//指令初始化
    }
    catch (e) {
        logger.error(e.message + "\nstack:" + e.stack);
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

export function main(debug: boolean) {
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

