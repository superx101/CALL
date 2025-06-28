import Config from "../common/Config";
import * as path from "path";
import * as fs from "fs";
import { IPlugin, PluginTool } from "./Plugin";

export class PluginLoader {
    public static idList: string[] = [];
    public static pluginsMap = new Map<string, IPlugin>();

    public loadPlugins() {
        const files = fs.readdirSync(Config.PLUGINS_PATH);

        for (const fileName of files) {
            const fullPath = "../../userdata/plugins/" + fileName;

            if (!fileName.endsWith(".js")) continue;

            try {
                const PluginClass: new (tool: PluginTool) => IPlugin = require(fullPath).default;
                
                const tool = new PluginTool()
                const instance = new PluginClass(tool);
                tool.setPlugin(instance);

                const id = instance.getId();
                PluginLoader.pluginsMap.set(id, instance);
                PluginLoader.idList.push(id);

                logger.log(`Module loaded: ${fileName}`);
            } catch (error) {
                logger.error(`Error loading module: ${fileName}`, error);
            }
        }
    }
}
