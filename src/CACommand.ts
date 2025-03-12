import Config from "./common/Config";
import Players from "./user/Players";
import AreaOperation from "./structure/AreaOperation";
import BasicTranslOperation from "./structure/BasicTranslOperation";
import BlockEditerOperation from "./structure/BlockEditerOperation";
import ChunkOperation from "./structure/ChunkOperation";
import EnableOperation from "./user/EnableOperation";
import ExportOperation from "./io/ExportOperation";
import FillOperation from "./structure/FillOperation";
import HelpOperation from "./user/HelpOperation";
import ImportOperation from "./io/ImportOperation";
import MenuOperation from "./view/MenuOperation";
import PermissionOperation from "./user/PermissionOperation";
import SettingsOperation from "./user/SettingsOperation";
import ShapeOperation from "./plugin/ShapeOperation";
import StructureOperation from "./structure/StructureOperation";
import TextureOperation from "./structure/TextureOperation";
import { ToolOperation } from "./user/ToolOperation";
import { Warn } from "./util/Error";
import StrFactory from "./util/StrFactory";
import Tr from "./util/Translator";

/**
 * this a temp class for register command
 * standard command should consist of single command object and callback
 */

/**
 * If you are a beginner in LL plugin development, please do not imitate the structure of this class
 * Please use sub modules to register and callback a sub command separately
 * rather than writing them together
 * 
 * This project is doing this because of laziness
 */
export default class CACommand {
    public static register(): void {
        let cmd = mc.newCommand(
            "call",
            Tr._c("console.app.command.introduction"),
            PermType.Any,
            0x80,
            "ca"
        );
        //public param
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
        cmd.setEnum("cancel", ["cancel", "cc"])
        cmd.setEnum("start|end|a|b", ["start", "st", "end", "en", "a", "b"]);
        cmd.setEnum("show", ["show", "sh"]);
        cmd.setEnum("view", ["view", "vi"]);
        cmd.mandatory("action", ParamType.Enum, "area", "area_man", 1);
        cmd.mandatory(
            "enum_1",
            ParamType.Enum,
            "start|end|a|b",
            "start-end_man",
            1
        );
        cmd.mandatory("enum_1", ParamType.Enum, "se", "se_man", 1);
        cmd.mandatory("enum_1", ParamType.Enum, "cancel", "cancel_man", 1);
        cmd.mandatory("enum_1", ParamType.Enum, "show", "show_man", 1);
        cmd.mandatory("enum_2", ParamType.Enum, "view", "view_man", 1);
        cmd.optional("enum_2", ParamType.Enum, "on|off", "on-off_opt", 1);
        cmd.overload(["area_man", "start-end_man", "intPos_opt"]);
        cmd.overload(["area_man", "start-end_man", "view_man"]);
        cmd.overload(["area_man", "se_man", "intPos_opt"]);
        cmd.overload(["area_man", "cancel_man"]);
        cmd.overload(["area_man", "show_man", "on-off_opt"]);

        //fill
        cmd.setEnum("fill_enum", ["fill", "fi"]);
        cmd.setEnum("fillMode", [
            "hollow",
            "outline",
            "null",
            "ho",
            "ou",
            "nu",
        ]);
        cmd.mandatory("action", ParamType.Enum, "fill_enum", "fill_man", 1);
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
        cmd.overload([
            "replace_man",
            "block_man",
            "states_man",
            "block2_man",
            "states2_opt",
        ]);

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
        cmd.setEnum("degrees", [
            "0_degrees",
            "90_degrees",
            "180_degrees",
            "270_degrees",
        ]);
        cmd.mandatory("action", ParamType.Enum, "load", "load_man", 1);
        cmd.optional("Mirror", ParamType.Enum, "mirror", "mirror_opt");
        cmd.optional("Degrees", ParamType.Enum, "degrees", "degrees_opt");
        cmd.optional(
            "IncludeEntities",
            ParamType.Bool,
            "",
            "includeEntities_opt"
        );
        cmd.optional("IncludeBlocks", ParamType.Bool, "", "includeBlocks_opt");
        cmd.optional("Waterlogged", ParamType.Bool, "", "waterlogged_opt");
        cmd.optional("Integrity", ParamType.Float, "", "integrity_opt");
        cmd.optional("Seed", ParamType.String, "", "seed_opt");
        cmd.overload([
            "load_man",
            "id_man",
            "intPos_opt",
            "degrees_opt",
            "mirror_opt",
        ]);

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
        cmd.mandatory(
            "mirror",
            ParamType.Enum,
            "mirror_notNull",
            "mirror_notNull_man"
        );
        cmd.overload(["mirror_act", "mirror_notNull_man", "axisPos_opt"]);

        //rote
        cmd.setEnum("rote", ["rote", "ro"]);
        cmd.setEnum("degrees_notNull", [
            "90_degrees",
            "180_degrees",
            "270_degrees",
        ]);
        cmd.mandatory("action", ParamType.Enum, "rote", "rote_man");
        cmd.mandatory(
            "degrees",
            ParamType.Enum,
            "degrees_notNull",
            "degrees_notNull_man"
        );
        cmd.overload(["rote_man", "degrees_notNull_man", "axisPos_opt"]);

        //stack
        cmd.setEnum("stack", ["stack", "st"]);
        cmd.mandatory("action", ParamType.Enum, "stack", "stack_man");
        cmd.mandatory("xMultiple", ParamType.Int, "", "xMultiple_man");
        cmd.mandatory("yMultiple", ParamType.Int, "", "yMultiple_man");
        cmd.mandatory("zMultiple", ParamType.Int, "", "zMultiple_man");
        cmd.overload([
            "stack_man",
            "xMultiple_man",
            "yMultiple_man",
            "zMultiple_man",
        ]);

        //block
        cmd.setEnum("block", ["block", "bl"]);
        cmd.mandatory("action", ParamType.Enum, "block", "block_enum_man");
        cmd.mandatory("enum_1", ParamType.Enum, "menu", "menu_man");
        cmd.overload([
            "block_enum_man",
            "intPos_man",
            "nbt_man",
            "blockEntity_man",
        ]);
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
        cmd.overload([
            "shape_man",
            "enum1_load_man",
            "package_man",
            "index_man",
            "json_opt",
            "intPos_opt",
        ]);
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
        cmd.overload([
            "tool_man",
            "bind_man",
            "item_man",
            "type_man",
            "cmd_man",
            "describe_man",
            "name_opt",
        ]);
        cmd.overload([
            "tool_man",
            "unbind_man",
            "item_man",
            "type_man",
            "name_opt",
        ]);

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
        cmd.mandatory(
            "playerName",
            ParamType.String,
            "playerName",
            "playerName_man"
        );
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
        cmd.mandatory("action", ParamType.Enum, "import", "import_man");
        cmd.mandatory("file", ParamType.String, "", "file_man");
        cmd.optional("includeEntity", ParamType.Bool, "", "includeEntity_opt");
        cmd.overload([
            "import_man",
            "file_man",
            "playerName_man",
            "includeEntity_opt",
            "name_opt",
        ]);

        //export
        cmd.setEnum("export", ["export", "ex"]);
        cmd.setEnum("fileType", ["mcstructure"]);
        cmd.mandatory("action", ParamType.Enum, "export", "export_man");
        cmd.mandatory("type", ParamType.Enum, "fileType", "fileType_man");
        cmd.overload([
            "export_man",
            "fileType_man",
            "id_man",
            "includeEntity_opt",
            "name_opt",
        ]);

        // cmd.setEnum("brush", ["brush", "br"]);
        // cmd.setEnum("texture", ["texture", "te"]);
        // cmd.mandatory("action", ParamType.Enum, "brush");

        cmd.setCallback(
            (
                cmd: Command,
                ori: CommandOrigin,
                output: CommandOutput,
                res: any
            ) => {
                try {
                    CACommand.command_callback(cmd, ori, output, res);
                } catch (e) {
                    const text = e.message;
                    if (e instanceof Warn)
                        output.error(StrFactory.cmdWarn(text));
                    else output.error(StrFactory.cmdErr(text));

                    if (Config.get(Config.GLOBAL, "debugMod")) {
                        logger.error(
                            "msg:",
                            e.message,
                            "\ntr:",
                            text + "\nstack:" + e.stack
                        );
                    }
                }
            }
        );
        cmd.setup();
    }

    private static command_callback(
        cmd: Command,
        ori: CommandOrigin,
        output: CommandOutput,
        res: any
    ) {
        switch (ori.type) {
            case OriginType.Player:
                CACommand.command_playerCallback(ori, output, res);
                return;
            case OriginType.DedicatedServer:
                try {
                    CACommand.command_consoleCallback(output, res);
                } catch (error) {
                   logger.error(error);
                }
                return;
            case OriginType.Virtual:
                //use command: execute
                if (ori.player == undefined) break;
                CACommand.command_playerCallback(ori, output, res);
                break;
            default:
                logger.error(
                    Tr._c(
                        "console.app.command.unknowType",
                        ori.type
                    )
                );
                break;
        }
    }

    private static command_playerCallback(
        ori: CommandOrigin,
        output: CommandOutput,
        res: any
    ) {
        const player = ori.player;
        if (!Players.hasPermission(player)) {
            throw new Error(
                Tr._(
                    ori.player.langCode,
                    "dynamic.app.command_playerCallback.notHasPermission"
                )
            );
        }
        const caPlayer = Players.fetchCAPlayer(ori.player.xuid);
        if (caPlayer.forbidCmd) {
            throw new Error(
                Tr._(player.langCode, "dynamic.app.command_playerCallback.wait")
            );
        }

        switch (res.action) {
            case "on":
                EnableOperation.on(output, caPlayer);
                return;
            case "off":
            case "of":
                EnableOperation.off(output, caPlayer);
                return;
        }

        if (!caPlayer.settings.enable) {
            throw new Error(
                Tr._(
                    player.langCode,
                    "dynamic.app.command_playerCallback.close"
                )
            );
        }

        switch (res.action) {
            case undefined:
            case "me":
            case "menu":
                MenuOperation.start(output, caPlayer, res);
                return
            case "area":
            case "ar":
                AreaOperation.start(output, caPlayer, res);
                return;
            case "refresh":
            case "rf":
                ChunkOperation.start(output, caPlayer);
                return;
            case "fill":
            case "fi":
                FillOperation.fill(output, caPlayer, res);
                return;
            case "clear":
            case "cl":
                FillOperation.clear(output, caPlayer);
                return;
            case "replace":
            case "re":
                FillOperation.replace(output, caPlayer, res);
                return;
            case "move":
            case "mo":
                BasicTranslOperation.move(output, caPlayer, res);
                return;
            case "stack":
            case "st":
                BasicTranslOperation.stack(output, caPlayer, res);
                return;
            case "mirror":
            case "mi":
                BasicTranslOperation.mirror(output, caPlayer, res);
                return;
            case "rote":
            case "ro":
                BasicTranslOperation.rote(output, caPlayer, res);
                return;
            case "shape":
            case "sh":
                ShapeOperation.start(output, caPlayer, res);
                return;
            case "texture":
            case "te":
                TextureOperation.start(output, caPlayer, res);
                return;
            case "block":
            case "bl":
                BlockEditerOperation.start(output, caPlayer, res);
                return;
            case "copy":
            case "co":
                StructureOperation.copy(output, caPlayer);
                return;
            case "paste":
            case "pa":
                StructureOperation.paste(output, caPlayer, res);
                return;
            case "save":
            case "sa":
                StructureOperation.save(output, caPlayer, res);
                return;
            case "list":
            case "li":
                StructureOperation.list(output, caPlayer);
                return;
            case "load":
            case "lo":
                StructureOperation.load(output, caPlayer, res);
                return;
            case "delete":
            case "de":
                StructureOperation.delete(output, caPlayer, res);
                return;
            case "public":
            case "pu":
                StructureOperation.public(output, caPlayer, res);
                return;
            case "private":
            case "pr":
                StructureOperation.private(output, caPlayer, res);
                return;
            case "undo":
            case "ud":
                StructureOperation.undo(output, caPlayer);
                return;
            case "redo":
            case "rd":
                StructureOperation.redo(output, caPlayer);
                return;
            case "tool":
            case "to":
                ToolOperation.start(output, caPlayer, res);
            case "setting":
                SettingsOperation.start(output, caPlayer, res);
                return;
            case "help":
            case "he":
            case "?":
                HelpOperation.start(output, caPlayer);
                return;
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
                throw new Error(
                    Tr._(
                        player.langCode,
                        "dynamic.app.command_playerCallback.consoleCmd"
                    )
                );
        }

        // [To Adapt Bug]
        if(Object.keys(res).includes("FillMode")) {
            FillOperation.fill(output, caPlayer, res);
        }
    }

    private static command_consoleCallback(output: CommandOutput, res: any) {

        switch (res.action) {
            case "ban":
                PermissionOperation.ban(res.playerName, output);
                return;
            case "add":
                PermissionOperation.add(res.playerName, output);
                return;
            case "list":
            case "li":
                PermissionOperation.list(output);
                return;
            case "shape":
            case "sh":
                ShapeOperation.consoleStart(output);
                return;
            case "import":
            case "im":
                ImportOperation.start(res, output);
                return;
            case "export":
            case "ex":
                ExportOperation.start(res, output);
                return;
            case "reload":
                case "r":
                    throw new Error("this command is deprecated")
            default:
                throw new Error(
                    Tr._c("console.app.command_consoleCallback.cmdError")
                );
        }
    }
}
