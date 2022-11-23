"use strict"

const VERSION = [0, 1, 2];
const LL_MINVERSION = [2, 8, 1];

ll.registerPlugin(
    /* name */ "CALL",
    /* introduction */ "It aslo called Construct Assistant for LiteLoaderBDS",
    /* version */VERSION,
    /* otherInformation */ {}
);

Main_checkVersion();

//####################### Class #######################
const Constant = require("./CALL/src/global/Constant");
const Config = require("./CALL/src/global/Config");
const Players = require("./CALL/src/global/Players");
const Enums = require("./CALL/src/global/Enums");

const Vector3D = require("./CALL/src/math/simplematrix/Vector3D");
const Matrix3D = require("./CALL/src/math/simplematrix/Matrix3D");
const Transform3 = require("./CALL/src/math/simplematrix/Transform3");
// const THREE = require("./CALL/lib/three.js/src/Three");

const StrFactory = require("./CALL/src/tool/StrFactory");
const Pos3D = require("./CALL/src/tool/Pos3D");
const Area3D = require("./CALL/src/tool/Area3D");
const Structure = require("./CALL/src/tool/Structure");
const PlayerData = require("./CALL/src/tool/PlayerData");
const Version = require("./CALL/src/tool/Version");
const Test = require("./CALL/src/tool/Test");

const AreaDisplayer = require("./CALL/src/basicfun/AreaDisplayer");
const NBTManager = require("./CALL/src/basicfun/NBTManager");
const StructureManager = require("./CALL/src/basicfun/StructureManager");
const FillManager = require("./CALL/src/basicfun/FillManager");
const ShapeManager = require("./CALL/src/basicfun/ShapeManager");
const PlayerManager = require("./CALL/src/basicfun/PlayerManager");

const EnableOperation = require("./CALL/src/operation/EnableOperation");
const ChunkOperation = require("./CALL/src/operation/ChunkOperation");
const ReloadOperation = require("./CALL/src/operation/ReloadOperation");
const PermissionOperation = require("./CALL/src/operation/PermissionOperation");
const AreaOperation = require("./CALL/src/operation/AreaOperation");
const StructureOperation = require("./CALL/src/operation/StructureOperation");
const FillOperation = require("./CALL/src/operation/FillOperation");
const BasicTranslOperation = require("./CALL/src/operation/BasicTranslOperation");
const ShapeOperation = require("./CALL/src/operation/ShapeOperation");
const ToolOperation = require("./CALL/src/operation/ToolOperation");
const SettingsOperation = require("./CALL/src/operation/SettingsOperation");
const MenuOperation = require("./CALL/src/operation/MenuOperation");
const HelpOperation = require("./CALL/src/operation/HelpOperation");

const Menu = require("./CALL/src/view/Menu");
const Form = require("./CALL/src/view/Form");

const Activity = require("./CALL/src/main/Activity");

const ShapeLoader = require("./CALL/src/plugin/ShapeLoader");
//####################### Class end #######################



//####################### Main #######################

function Main_displayLogo(show) {
    if (show) {
        log("     _____          _      _      ");
        log("    / ____|   /\\   | |    | |     ");
        log("   | |       /  \\  | |    | |     ");
        log("   | |      / /\\ \\ | |    | |     ");
        log("   | |____ / ____ \\| |____| |____ ");
        log("    \\_____/_/    \\_\\______|______|");
        log(`       ======= ${VERSION[0]}.${VERSION[1]}.${VERSION[2]} =======`);
        log("");
    }
}

function Main_command_playerCallback(ori, output, res) {
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
            break;
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

function Main_command_consoleCallback(output, res) {
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
            ReloadOperation.start(output);
            break;
        case "shape":
        case "sh":
            ShapeOperation.consoleStart(output);
            break;
        default:
            throw new Error("当前指令格式错误或为非控制台指令");
    }

}

function Main_command() {
    let cmd = mc.newCommand("call", "建造助手CALL(Construct Assistant for LiteLoaderBDS)指令", PermType.Any, 0x80, "ca");
    //public
    cmd.mandatory("player", ParamType.Player, "", "player_man");
    cmd.mandatory("id", ParamType.String, "id", "id_man");
    cmd.mandatory("tileData", ParamType.Int, "", "tileData_man");
    cmd.mandatory("index", ParamType.Int, "", "index_man");
    cmd.mandatory("block", ParamType.Block, "", "block_man");
    cmd.mandatory("key", ParamType.String, "", "key_man");
    cmd.mandatory("item", ParamType.Item, "", "item_man");
    cmd.optional("TileData", ParamType.Int, "", "tileData_opt");
    cmd.optional("Block", ParamType.Block, "", "block_opt");
    cmd.optional("PosInt", ParamType.BlockPos, "", "posInt_opt");
    cmd.optional("AxisPos", ParamType.BlockPos, "", "axisPos_opt");
    cmd.optional("Name", ParamType.String, "", "name_opt");

    //menu
    cmd.setEnum("menu", ["menu", "me"]);
    cmd.optional("action", ParamType.Enum, "menu", "menu_opt", 1);
    cmd.optional("option", ParamType.String, "", "option_opt");
    cmd.overload("menu_opt", "option_opt");

    //on-off
    cmd.setEnum("on|off", ["on", "off", "of"]);
    cmd.mandatory("action", ParamType.Enum, "on|off", "on-off_man", 1);
    cmd.overload("on-off_man");

    //refresh
    cmd.setEnum("refresh", ["refresh", "rf"]);
    cmd.mandatory("action", ParamType.Enum, "refresh", "refresh_man", 1);
    cmd.overload("refresh_man");

    //area
    cmd.setEnum("area", ["area", "ar"]);
    cmd.setEnum("se", ["set", "se"]);
    cmd.setEnum("start|end", ["start", "st", "end", "en", "a", "b"]);
    cmd.setEnum("clear", ["clear", "cl"]);
    cmd.setEnum("show", ["show", "sh"]);
    cmd.setEnum("view", ["view", "vi"]);
    cmd.mandatory("action", ParamType.Enum, "area", "area_man", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "start|end", "start-end_man", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "se", "se_man", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "clear", "clear_par", 1);
    cmd.mandatory("enum_1", ParamType.Enum, "show", "show_man", 1);
    cmd.mandatory("enum_2", ParamType.Enum, "view", "view_man", 1);
    cmd.optional("enum_2", ParamType.Enum, "on|off", "on-off_opt", 1);
    cmd.overload("area_man", "start-end_man", "posInt_opt");
    cmd.overload("area_man", "start-end_man", "view_man");
    cmd.overload("area_man", "se_man", "posInt_opt");
    cmd.overload("area_man", "clear_par");
    cmd.overload("area_man", "show_man", "on-off_opt");

    //fill
    cmd.setEnum("fill", ["fill", "fi"]);
    cmd.setEnum("fillMode", ["hollow", "outline", "null", "ho", "ou", "nu"]);
    cmd.mandatory("action", ParamType.Enum, "fill", "fill_man", 1);
    cmd.optional("FillMode", ParamType.Enum, "fillMode", "fillMode_opt", 1);
    cmd.overload("fill_man", "block_man", "tileData_opt", "fillMode_opt");

    //clear
    cmd.setEnum("clear", ["clear", "cl"]);
    cmd.mandatory("action", ParamType.Enum, "clear", "clear_man", 1);
    cmd.overload("clear_man");

    //replace
    cmd.setEnum("replace", ["replace", "re"]);
    cmd.mandatory("action", ParamType.Enum, "replace", "replace_man", 1);
    cmd.mandatory("block2", ParamType.Block, "", "block2_man");
    cmd.optional("tileData2", ParamType.Int, "", "tileData2_opt");
    cmd.overload("replace_man", "block_man", "tileData_man", "block2_man", "tileData2_opt")

    //save
    cmd.setEnum("save", ["save", "sa"]);
    cmd.mandatory("action", ParamType.Enum, "save", "save_man", 1);
    cmd.overload("save_man", "name_opt");

    //list
    cmd.setEnum("list", ["list", "li"]);
    cmd.mandatory("action", ParamType.Enum, "list", "list_man", 1);
    cmd.overload("list_man");

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
    cmd.overload("load_man", "id_man", "posInt_opt", "degrees_opt", "mirror_opt");

    //delete
    cmd.setEnum("delete", ["delete", "de"]);
    cmd.mandatory("action", ParamType.Enum, "delete", "delete_man", 1);
    cmd.overload("delete_man", "id_man");

    //range
    cmd.setEnum("range", ["public", "pu", "private", "pr"]);
    cmd.mandatory("action", ParamType.Enum, "range", "range_man", 1);
    cmd.overload("range_man", "id_man");

    //copy
    cmd.setEnum("copy", ["copy", "co"]);
    cmd.mandatory("action", ParamType.Enum, "copy", "copy_man", 1);
    cmd.overload("copy_man");

    //paste
    cmd.setEnum("paste", ["paste", "pa"]);
    cmd.mandatory("action", ParamType.Enum, "paste", "paste_man", 1);
    cmd.overload("paste_man", "posInt_opt");

    //move
    cmd.setEnum("move", ["move", "mo"]);
    cmd.mandatory("action", ParamType.Enum, "move", "move_man", 1);
    cmd.overload("move_man", "posInt_opt");

    //mirror
    cmd.setEnum("mirror_act", ["mirror", "mi"]);
    cmd.setEnum("mirror_notNull", ["x", "z", "xz"]);
    cmd.mandatory("action", ParamType.Enum, "mirror_act", "mirror_act");
    cmd.mandatory("mirror", ParamType.Enum, "mirror_notNull", "mirror_notNull_man");
    cmd.overload("mirror_act", "mirror_notNull_man", "axisPos_opt");

    //rote
    cmd.setEnum("rote", ["rote", "ro"]);
    cmd.setEnum("degrees_notNull", ["90_degrees", "180_degrees", "270_degrees"]);
    cmd.mandatory("action", ParamType.Enum, "rote", "rote_man");
    cmd.mandatory("degrees", ParamType.Enum, "degrees_notNull", "degrees_notNull_man");
    cmd.overload("rote_man", "degrees_notNull_man", "axisPos_opt");

    //stack
    cmd.setEnum("stack", ["stack", "st"]);
    cmd.mandatory("action", ParamType.Enum, "stack", "stack_man");
    cmd.mandatory("xMultiple", ParamType.Int, "", "xMultiple_man");
    cmd.mandatory("yMultiple", ParamType.Int, "", "yMultiple_man");
    cmd.mandatory("zMultiple", ParamType.Int, "", "zMultiple_man");
    cmd.overload("stack_man", "xMultiple_man", "yMultiple_man", "zMultiple_man");

    //shape
    cmd.setEnum("shape", ["shape", "sh"]);
    cmd.mandatory("action", ParamType.Enum, "shape", "shape_man");
    cmd.mandatory("package", ParamType.String, "", "package_man");
    cmd.mandatory("enum_1", ParamType.Enum, "list", "enum1_list_man");
    cmd.mandatory("enum_1", ParamType.Enum, "load", "enum1_load_man");
    cmd.optional("Json", ParamType.JsonValue, "", "json_opt");
    cmd.overload("shape_man", "enum1_load_man", "package_man", "index_man", "json_opt", "posInt_opt");
    cmd.overload("shape_man", "enum1_list_man");

    //undo
    cmd.setEnum("undo", ["undo", "ud"]);
    cmd.mandatory("action", ParamType.Enum, "undo", "undo_man", 1);
    cmd.overload("undo_man");

    //redo
    cmd.setEnum("redo", ["redo", "rd"]);
    cmd.mandatory("action", ParamType.Enum, "redo", "redo_man", 1);
    cmd.overload("redo_man");

    //tool
    cmd.setEnum("tool", ["tool", "to"]);
    cmd.setEnum("bind", ["bind", "bi"]);
    cmd.setEnum("unbind", ["unbind", "un"]);
    cmd.mandatory("action", ParamType.Enum, "tool", "tool_man");
    cmd.mandatory("enum_1", ParamType.Enum, "bind", "bind_man");
    cmd.mandatory("enum_1", ParamType.Enum, "unbind", "unbind_man");
    cmd.mandatory("cmd", ParamType.String, "", "cmd_man");
    cmd.mandatory("describe", ParamType.String, "", "describe_man");
    cmd.overload("tool_man", "enum1_list_man");
    cmd.overload("tool_man", "bind_man", "item_man", "cmd_man", "describe_man", "name_opt");
    cmd.overload("tool_man", "unbind_man", "item_man", "name_opt");

    //setting
    cmd.setEnum("setting", ["setting"]);
    cmd.setEnum("set", ["set", "se"]);
    cmd.setEnum("get", ["get", "ge"]);
    cmd.mandatory("action", ParamType.Enum, "setting", "setting_man");
    cmd.mandatory("enum_1", ParamType.Enum, "set", "set_man");
    cmd.mandatory("enum_1", ParamType.Enum, "get", "get_man");
    cmd.mandatory("json", ParamType.JsonValue, "", "json_man");
    cmd.overload("setting_man", "get_man", "key_man");
    cmd.overload("setting_man", "set_man", "json_man");

    //help
    cmd.setEnum("help", ["help", "he", "?"]);
    cmd.mandatory("action", ParamType.Enum, "help", "help_man");
    cmd.overload("help_man");

    //add-ban
    cmd.setEnum("add|ban", ["ban", "add"]);
    cmd.mandatory("playerName", ParamType.String, "playerName", "playerName_man");
    cmd.mandatory("action", ParamType.Enum, "add|ban", "add-ban_man", 1);
    cmd.overload("add-ban_man", "playerName_man");

    //reload
    cmd.setEnum("reload", ["reload", "r"]);
    cmd.mandatory("action", ParamType.Enum, "reload", "reload_man");
    cmd.overload("reload_man");

    // cmd.setEnum("brush", ["brush", "br"]);
    // cmd.setEnum("texture", ["texture", "te"]);
    // cmd.mandatory("action", ParamType.Enum, "brush");

    cmd.setCallback((cmd, ori, output, res) => {
        try {
            if (ori.type == OriginType.Player) {
                Main_command_playerCallback(ori, output, res);
            }
            else if (ori.type == OriginType.Block) {

            }
            else if (ori.type == OriginType.Server) {
                Main_command_consoleCallback(output, res);
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

function Main_listener() {
    mc.listen("onJoin", (player) => {
        if (Players.hasPermission(player)) {
            Activity.onCreate(player);
            Activity.onStart(player);
        }
    });

    mc.listen("onLeft", (player) => {
        if (Players.hasPermission(player)) {
            Activity.onStop(player);
            Activity.onDestroy(player);
        }
    });

    mc.listen("onUseItemOn", (player, item, block, side, pos) => {
        if (Players.hasPermission(player) && EnableOperation.isEnable(player)) {
            let playerData = Players.getData(player.xuid);
            // 防抖
            if (playerData.click == null || !playerData.click) {
                playerData.click = true;
                setTimeout(() => {
                    playerData.click = false;
                }, 200);

                //业务
                ToolOperation.onClick(player, playerData, item, block, pos);
            }
        }
    });
}

function Main_clock() {
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
                let area = new Area3D(playerData.settings.area);
                player.sendText(`当前选区: ${playerData.settings.area.start}->${playerData.settings.area.end}\n长度: ${area.getLensStr()}`, Enums.msg.TIP);
            }
        }
    }, 300);
}

function Main_checkVersion() {
    if (!ll.requireVersion(LL_MINVERSION[0], LL_MINVERSION[1], LL_MINVERSION[2])) {
        colorLog("red", `当前ll版本为${ll.major}.${ll.minor}.${ll.revision}, 小于CALL-${VERSION[0]}.${VERSION[1]}.${VERSION[2]}发布时的ll版本${LL_MINVERSION[0]}.${LL_MINVERSION[1]}.${LL_MINVERSION[2]}, 若出现部分功能失效请更新ll(LiteLoader)`)
    }
}

function Main_ini() {
    try {
        Config.check();
        if (!Config.get(Config.GLOBAL, "enable")) {
            return false;
        }
        //默认设置
        Config.set(Config.PLAYERS_SETTINGS, "default", Config.get(Config.GLOBAL, "default"));

        Activity.onServerCreate();

        Main_listener(); //监听器初始化
        Main_command();//指令初始化
    }
    catch (ex) {
        colorLog("red", ex.message);
        return false;
    }
    return true;
}

function Main_loadPlugins() {
    ShapeLoader.start();
}

function Main_debug() {
    let path = "./plugins/CALL/test";
    File.getFilesList(path).forEach(file => {
        if (".+\.js".match().length == 1) {
            let code = File.readFrom(`${path}/${file}`);
            if (code != null) {
                ll.eval(code);
            }
        }
    })
}

function Main(debug) {
    if (Config.get(Config.GLOBAL, "enable")) {
        if (Main_ini()) {
            Main_clock();

            Main_displayLogo(Config.get(Config.GLOBAL, "displayLogo"));
            Main_loadPlugins();
        }
        if (debug) {
            Main_debug();
        }
    }
}

Main(1);
//####################### Main end #######################