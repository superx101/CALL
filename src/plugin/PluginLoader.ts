import Config from "../common/Config";
import * as path from "path";
import * as fs from "fs";
import { IPlugin } from "./Plugin";

const pluginPath = Config.PLUGINS + "/shape";

export class PluginLoader {
    public static idList: string[] = []
    public static pluginsMap = new Map<string, IPlugin>();

    public loadPlugins() {
        const files = fs.readdirSync(pluginPath);

        for (const file of files) {
            const fullPath = path.join(pluginPath, file);

            if (file.endsWith(".js")) continue;

            try {
                const plugin: IPlugin = require(fullPath);
                const id = plugin.getId();
                PluginLoader.pluginsMap.set(id, plugin);
                PluginLoader.idList.push(id);

                logger.log(`Module loaded: ${file}`, module);
            } catch (error) {
                logger.error(`Error loading module: ${file}`, error);
            }
        }
    }
}
