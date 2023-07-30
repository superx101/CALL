import Config from "../common/Config"
import ShapeManager from "../manager/ShapeManager"
import Tr from "../util/Translator"
import Version from "../util/Version"
import * as path from "path"

const APISAPCE = "call_shape_api"
const EXPORTSAPCE = "call_shape_plugin"
const CMD = "_cmd"
const FORM = "_form"
const INFO = "_info"
const TUTORAIL = "_tutorail"

const pluginPath = Config.PLUGINS + "/shape";
const distPath = Config.DATAPATH + "/dist/shape";
const templatesPath = Config.TEMPLATES + "/ShapeTemplate.js";

interface Plugin {
    version: Version;
    name: string;
}

export default class ShapeLoader {
    static EXPORTSAPCE = EXPORTSAPCE;
    static CMD = CMD;
    static FORM = FORM;
    static INFO = INFO;
    static TUTORAIL = TUTORAIL;
    static pluginsSet = new Set();

    private static parser(str: string): Plugin | null {
        try {
            if (/call\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+\_\d+\.\d+\.\d+\.js/.test(str) == false) {
                throw new Error(Tr._c("console.ShapeLoader.parser.s0"));
            }
            let arr = str.split("_");
            let version = Version.fromString(arr[1].slice(0, -3));
            let name = arr[0];

            return { version, name };
        }
        catch (e) {
            colorLog("red", Tr._c("console.ShapeLoader.parser.s1", str) + e.message);
        }
        return null;
    }

    public static start() {
        //@ts-ignore
        ll.export(ShapeManager.registerPackage, APISAPCE, "registerPackage");
        //@ts-ignore
        ll.export(ShapeManager.getData, APISAPCE, "getData");
        //@ts-ignore
        ll.export(ShapeManager.listForm, APISAPCE, "listForm");

        let loadMap = new Map<string, Plugin>();
        let plugins = ll.listPlugins();
        const regex = new RegExp('^call_[A-Za-z0-9]+_[A-Za-z0-9]+$');
        //查找已加载的形状包并卸载
        plugins.forEach(str => {
            if (regex.test(str)) {
                mc.runcmd(`ll unload ${str}`)
            }
        });

        //查找plugins/shape中js文件
        File.getFilesList(pluginPath).forEach(file => {
            let ext = path.extname(file);
            if (ext !== ".js") return;
            let plugin = ShapeLoader.parser(file);
            if (plugin != null) {
                //版本检测
                let plugin2 = loadMap.get(plugin.name);
                if (plugin2 == null || plugin.version.compare(plugin2.version)) {
                    //版本大于则替换
                    loadMap.set(plugin.name, plugin);
                }
            }
        });

        //加工
        let template = File.readFrom(templatesPath);
        loadMap.forEach((plugin, name) => {
            let code = File.readFrom(pluginPath + "/" + name + "_" + plugin.version.toString() + ".js")
                .replace(/^\s*\/\/.+\n/gm, '')
                .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
                .replace(/^\s*[\r\n]/gm, '');
            let target = distPath + "/" + name.replaceAll(".", "_") + ".js";
            let output = template
                .replace(/APISAPCE/g, `"${APISAPCE}"`)
                .replace(/PKG/g, `"${name}"`)
                .replace(/VERSION/g, `[${plugin.version.major},${plugin.version.minor},${plugin.version.revision}]`)
                .replace(/EXPORTSAPCE/g, `"${EXPORTSAPCE}"`)
                .replace(/CMD/g, `"${CMD}"`)
                .replace(/INFO/g, `"${INFO}"`)
                .replace(/FORM/g, `"${FORM}"`)
                .replace(/TUTORAIL/g, `"${TUTORAIL}"`)
                .replace(/CODE/g, code)

            File.writeTo(target, output);
        });

        //加载未加载的js
        setTimeout(() => {
            loadMap.forEach((plugin, name) => {
                name = name.replaceAll(".", "_");
                logger.info(`ll load "${distPath}/${name}.js"`)
                if (mc.runcmd(`ll load "${distPath}/${name}.js"`)) {
                    colorLog("green", Tr._c("console.ShapeLoader.start.s2", plugin.name, `${plugin.version}`))
                }
            });
        }, 1000)
    }
}