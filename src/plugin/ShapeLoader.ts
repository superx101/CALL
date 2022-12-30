import Config from "../common/Config"
import ShapeManager from "../manager/ShapeManager"
import StrFactory from "../util/StrFactory"
import Version from "../util/Version"

const APISAPCE = "call_shape_api"
const EXPORTSAPCE = "call_shape_plugin"
const CMD = "_cmd"
const FORM = "_form"
const TUTORAIL = "_tutorail"

const pluginPath = Config.PLUGINS + "/shape";
const buildPath = Config.DATAPATH + "/build/shape";
const templatesPath = Config.ROOT + "/src/plugin/ShapeTemplates";

interface Plugin {
    version: Version;
    name: string;
}

export default class ShapeLoader {
    static EXPORTSAPCE = EXPORTSAPCE;
    static CMD = CMD;
    static FORM = FORM;
    static TUTORAIL = TUTORAIL;
    static pluginsSet = new Set();

    private static parser(str: string): Plugin | null {
        try {
            if (/call\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+\_\d+\.\d+\.\d+\.js/.test(str) == false) {
                throw new Error("文件命名错误, 格式: [call.作者名.插件名_版本号.js] 作者名、插件名由英文+数字组成, 作者名建议为github用户名或其他不会重复的名称, 文件名示例: call.steve.example_0.1.0.js");
            }
            let arr = str.split("_");
            let version = Version.fromString(arr[1].slice(0, -3));
            let name = arr[0];

            return { version, name };
        }
        catch (e) {
            colorLog("red", `形状包文件${str}读取失败, 原因: ` + e.message);
        }
        return null;
    }

    public static start() {
        //@ts-ignore
        ll.export(ShapeManager.registerPackage, APISAPCE, "registerPackage");
        //@ts-ignore
        ll.export(ShapeManager.getData, APISAPCE, "getData");

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
        let im = File.readFrom(templatesPath + "/import.js");
        let ex = File.readFrom(templatesPath + "/export.js");
        loadMap.forEach((plugin, name) => {
            let context = File.readFrom(pluginPath + "/" + name + "_" + plugin.version.toString() + ".js")
                .replace(/^\s*\/\/.+\n/gm, '')
                .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
                .replace(/^\s*[\r\n]/gm, '');
            let target = buildPath + "/" + name.replaceAll(".", "_") + ".js";
            let ti = StrFactory.replaceAll(im, "APISAPCE", `"${APISAPCE}"`);
            ti = StrFactory.replaceAll(ti, "PKG", `"${name}"`);
            ti = StrFactory.replaceAll(ti, "VERSION", `[${plugin.version.major},${plugin.version.minor},${plugin.version.revision}]`);
            let te = StrFactory.replaceAll(ex, "EXPORTSAPCE", `"${EXPORTSAPCE}"`);
            te = StrFactory.replaceAll(te, "CMD", `"${CMD}"`);
            te = StrFactory.replaceAll(te, "FORM", `"${FORM}"`);
            te = StrFactory.replaceAll(te, "TUTORAIL", `"${TUTORAIL}"`);
            te = StrFactory.replaceAll(te, "PKG", `"${name}"`);
            File.writeTo(target, ti + "\n" + context + "\n" + te);
        });

        //加载未加载的js
        setTimeout(() => {
            loadMap.forEach((plugin, name) => {
                name = name.replaceAll(".", "_");
                logger.info(`ll load "${buildPath}/${name}.js"`)
                if (mc.runcmd(`ll load "${buildPath}/${name}.js"`)) {
                    colorLog("green", `初始化形状包: ${plugin.name} 版本: ${plugin.version}`)
                }
            });
        }, 1000)
    }
}