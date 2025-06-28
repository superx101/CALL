import Activity from "./Activity";
import Config from "./common/Config";
import Players from "./user/Players";
import AreaDisplayerService from "./structure/AreaDisplayerService";
import EnableOperation from "./user/EnableOperation";
import { ToolOperation } from "./user/ToolOperation";
import { PluginLoader } from "./plugin/PluginLoader";
import { Compare } from "./temp/Common";
import { Pos } from "./temp/Pos";
import { ToolType } from "./temp/Tool";
import StrFactory from "./util/StrFactory";
import Tr from "./util/Translator";
import CACommand from "./CACommand";

/**
 * A temp namespace for listener handler
 *
 * should use a base class and use extends
 */
namespace ListenerHandler {
    enum Listener {
        Join = "onJoin",
        Left = "onLeft",
        UseItemOn = "onUseItemOn",
        StartDestroyBlock = "onStartDestroyBlock",
        playerCmd = "onPlayerCmd",
        consoleCmd = "onConsoleCmd",
    }

    function onJoinHandler(player: LLSE_Player) {
        if (!Players.hasPermission(player)) return;

        Activity.onCreate(player.xuid);
        const caPlayer = Players.getCAPlayer(player.xuid);
        Activity.onStart(caPlayer);
    }

    function onLeftHandler(player: LLSE_Player) {
        if (!Players.hasPermission(player)) return;

        const caPlayer = Players.getCAPlayer(player.xuid);
        Activity.onStop(caPlayer);
        Activity.onDestroy(caPlayer);
    }

    function onUseItemOnHandler(
        player: LLSE_Player,
        item: Item,
        block: Block,
        side: number,
        pos: Pos
    ) {
        if (!Players.hasPermission(player)) return;
        const caPlayer = Players.fetchCAPlayer(player.xuid);
        if (!EnableOperation.isEnable(caPlayer)) return;

        //logical
        try {
            ToolOperation.onClick(ToolType.RIGHT, caPlayer, item, block, pos);
        } catch (e) {
            if (Config.get(Config.GLOBAL, "debugMod")) {
                logger.error(e.message + "\nstack:" + e.stack);
            }
            player.sendText(StrFactory.cmdErr(e.message));
        }
    }

    function onStartDestroyBlockHandler(player: LLSE_Player, block: Block) {
        if (!Players.hasPermission(player)) return;
        const caPlayer = Players.fetchCAPlayer(player.xuid);
        if (!EnableOperation.isEnable(caPlayer)) return;

        //logical
        try {
            ToolOperation.onClick(
                ToolType.LEFT,
                caPlayer,
                player.getHand(),
                block,
                block.pos
            );
        } catch (e) {
            if (Config.get(Config.GLOBAL, "debugMod")) {
                logger.error(e.message + "\nstack:" + e.stack);
            }
            player.sendText(StrFactory.cmdErr(e.message));
        }
    }

    function onConsoleCmdHandler(cmd: string) {
        // TODO: when player's op changed, tip and change the permission
    }

    function onPlayerCmdHandler(player: LLSE_Player, cmd: string) {
        // TODO: when player's op changed, tip and change the permission
    }

    export function init() {
        mc.listen(Listener.Join, onJoinHandler);
        mc.listen(Listener.Left, onLeftHandler);

        const clickMap = new Map<string, boolean>();
        mc.listen(Listener.UseItemOn, (player, item, block, side, pos: Pos) => {
            // anti-shake
            const click = clickMap.get(player.xuid);
            if (!click) {
                clickMap.set(player.xuid, true);
                setTimeout(() => {
                    clickMap.set(player.xuid, false);
                }, 200);
                onUseItemOnHandler(player, item, block, side, pos);
            }
        });

        mc.listen(Listener.StartDestroyBlock, onStartDestroyBlockHandler);
        // mc.listen(Listener.consoleCmd, onConsoleCmdHandler);
        // mc.listen(Listener.playerCmd, onPlayerCmdHandler);
    }
}

/**
 * A temp namespace for other function
 */
namespace Other {
    export function displayLogo(show: boolean) {
        if (show) {
            logger.info("     _____          _      _      ");
            logger.info("    / ____|   /\\   | |    | |     ");
            logger.info("   | |       /  \\  | |    | |     ");
            logger.info("   | |      / /\\ \\ | |    | |     ");
            logger.info("   | |____ / ____ \\| |____| |____ ");
            logger.info("    \\_____/_/    \\_\\______|______|");
            logger.info(
                `       ======= ${Config.PLUGIN_VERSION.toString()} =======`
            );
            logger.info("");
        }
    }

    export function setClock() {
        setInterval(() => {
            let xuid;
            let caPlayer;
            for (let singleMap of Players.dataMap) {
                xuid = singleMap[0];
                caPlayer = singleMap[1];
                //选区提示
                AreaDisplayerService.areaTextTip(caPlayer);
            }
        }, 300);
    }

    export function checkConfig() {
        try {
            let check = Config.get(Config.CHECK, "configs");
            Object.keys(check).forEach((k) => {
                let c = check[k];
                let data = Config.get(Config.GLOBAL, k);
                if (data == null)
                    throw new Error(
                        Tr._c(`console.Config.check.notFind`, `${k}`)
                    );
                if (c.type != "enum" && typeof data != c.type)
                    throw new Error(
                        Tr._c("console.Config.check.type", `${k}`, `${c.type}`)
                    );
                switch (c.type) {
                    case "number":
                        if (data < c.min)
                            throw new Error(
                                Tr._c(
                                    "console.Config.check.less",
                                    `${k}`,
                                    `${c.min}`
                                )
                            );
                        if (data > c.max)
                            throw new Error(
                                Tr._c(
                                    "console.Config.check.greater",
                                    `${k}`,
                                    `${c.max}`
                                )
                            );
                        break;
                    case "enum":
                        let has = false;
                        c.values.forEach((v: any) => {
                            if (v == data) {
                                has = true;
                            }
                        });
                        if (!has)
                            throw new Error(
                                Tr._c(
                                    "console.Config.check.enum",
                                    `${k}`,
                                    `${c.values}`
                                )
                            );
                        break;
                }
            });
        } catch (e) {
            throw new Error(
                Tr._c(
                    "console.Config.check.configFail",
                    `${"CALL/config/configs"}`,
                    `${e.message}`
                )
            );
        }
    }

    export function checkVersion() {
        if (
            !ll.requireVersion(
                Config.LL_MINVERSION.major,
                Config.LL_MINVERSION.minor,
                Config.LL_MINVERSION.revision
            )
        ) {
            logger.warn(
                Tr._c(
                    "console.app.checkVersion",
                    `${ll.major}.${ll.minor}.${ll.revision}`,
                    `${Config.LL_MINVERSION.toString()}`
                )
            );
        }
        // min version
        if (
            Config.SERVER_VERSION.compare(Config.MINVERSION) == Compare.LESSER
        ) {
            logger.warn(
                Tr._c(
                    "console.app.oldVersion",
                    Config.SERVER_VERSION.toString(),
                    Config.MINVERSION.toString()
                )
            );
        }
    }
}

function init() {
    try {
        Other.checkVersion();
        //unload
        // ReloadOperation.unload();

        Other.checkConfig(); //check config
        if (!Config.get(Config.GLOBAL, "enable")) {
            return false;
        }
        //set default settings
        Config.set(
            Config.PLAYERS_SETTINGS,
            "default",
            Config.get(Config.GLOBAL, "default")
        );

        Activity.onServerCreate();

        ListenerHandler.init(); //init listener
        CACommand.register(); //register command
    } catch (e) {
        logger.error(e.message + "\nstack:" + e.stack);
        return false;
    }
    return true;
}

function loadPlugins() {
    const loader = new PluginLoader();
    loader.loadPlugins();
}

export default function main() {
    if (Config.get(Config.GLOBAL, "enable") && init()) {
        Other.setClock();
        Other.displayLogo(Config.get(Config.GLOBAL, "displayLogo"));
        loadPlugins();
    }
}
