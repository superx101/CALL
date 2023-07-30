import Activity from "./activity/Activity";
import Config from "./common/Config";
import Players from "./common/Players";
import AreaDisplayerManager from "./manager/AreaDisplayerManager";
import UpdateManager from "./manager/UpdateManager";
import EnableOperation from "./operation/EnableOperation";
import ReloadOperation from "./operation/ReloadOperation";
import ToolOperation from "./operation/ToolOperation";
import ShapeLoader from "./plugin/ShapeLoader";
import { Compare, Listener } from "./type/Common";
import { Pos } from "./type/Pos";
import { ToolType } from "./type/Tool";
import StrFactory from "./util/StrFactory";
import Tr from "./util/Translator";
import CACommand from "./command/CACommand";

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

function listenerHandler() {
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
        // anti-shake
        const click = clickMap.get(player.xuid);
        if (!click) {
            clickMap.set(player.xuid, true);
            setTimeout(() => {
                clickMap.set(player.xuid, false);
            }, 200);

            //logical
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

function checkConfig() {
    try {
        let check = Config.get(Config.CHECK, "configs");
        Object.keys(check).forEach(k => {
            let c = check[k];
            let data = Config.get(Config.GLOBAL, k);
            if(data == null) throw new Error(Tr._c(`console.Config.check.notFind`, `${k}`));
            if (c.type != "enum" && typeof (data) != c.type) throw new Error(Tr._c("console.Config.check.type", `${k}`, `${c.type}`));
            switch (c.type) {
                case "number":
                    if (data < c.min) throw new Error(Tr._c("console.Config.check.less", `${k}`, `${c.min}`));
                    if (data > c.max) throw new Error(Tr._c("console.Config.check.greater", `${k}`, `${c.max}`));
                    break;
                case "enum":
                    let has = false;
                    c.values.forEach((v: any) => {
                        if (v == data) {
                            has = true;
                        }
                    });
                    if (!has) throw new Error(Tr._c("console.Config.check.enum", `${k}`, `${c.values}`));
                    break;
            }
        });
    } catch (e) {
        throw new Error(Tr._c("console.Config.check.configFail", `${"CALL/config/configs"}`, `${e.message}`));
    }
}

function checkVersion() {
    if (!ll.requireVersion(Config.LL_MINVERSION.major, Config.LL_MINVERSION.minor, Config.LL_MINVERSION.revision)) {
        logger.warn(Tr._c("console.app.checkVersion", `${ll.major}.${ll.minor}.${ll.revision}`, `${Config.LL_MINVERSION.toString()}`))
    }
    // min version
    if (Config.SERVER_VERSION.compare(Config.MINVERSION) == Compare.LESSER) {
        logger.warn(Tr._c("console.app.oldVersion", Config.SERVER_VERSION.toString(), Config.MINVERSION.toString()));
    }
}

function init() {
    try {
        checkVersion();
        //updateData
        UpdateManager.updateData();

        //unload
        ReloadOperation.unload();

        checkConfig();//check config
        if (!Config.get(Config.GLOBAL, "enable")) {
            return false;
        }
        //set default settings
        Config.set(Config.PLAYERS_SETTINGS, "default", Config.get(Config.GLOBAL, "default"));

        Activity.onServerCreate();

        listenerHandler(); //init listener
        CACommand.register();//register command
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

export function main() {
    if (Config.get(Config.GLOBAL, "enable") && init()) {
        clock();
        displayLogo(Config.get(Config.GLOBAL, "displayLogo"));
        loadPlugins();
    }
}

