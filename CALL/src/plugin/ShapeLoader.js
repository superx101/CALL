const Config = require("../global/Config")
//[x] const ShapeManager = require("../basicfun/ShapeManager")
const StrFactory = require("../tool/StrFactory")
const Version = require("../tool/Version")

const APISAPCE = "call_shape_api"
const EXPORTSAPCE = "call_shape_plugin"
const CMD = "_cmd"
const FORM = "_form"
const TUTORAIL = "_tutorail"

const pluginPath = Config.PLUGINS + "/shape";
const buildPath = Config.ROOT + "/build/shape";
const templatesPath = Config.ROOT + "/src/plugin/ShapeTemplates";

class ShapeLoader {
    static EXPORTSAPCE = EXPORTSAPCE;
    static CMD = CMD;
    static FORM = FORM;
    static TUTORAIL = TUTORAIL;
    static start() {
        ll.export(ShapeManager.registerPackage, APISAPCE, "registerPackage");
        ll.export(ShapeManager.getData, APISAPCE, "getData");
   
        let delList = [];
        let set = new Set(ll.listPlugins());
        File.getFilesList(buildPath).forEach(file => {
            let pkg = file.slice(0, -3);
            let name = "call-" + pkg.replaceAll(".", "-");
            File.delete(buildPath + "/" + file);
            if (set.has(name)) {
                log(`ll unload "${name}"`);
                if (mc.runcmdEx(`ll unload "${name}"`).success) {
                    delList.push(pkg);
                }
            }
        });
        let map = new Map();
        File.getFilesList(pluginPath).forEach(name => {
            if (/.+\.js/.test(name)) {
                try {
                    if (/[a-zA-Z0-9]+\.[a-zA-Z0-9]+\_\d+\.\d+\.\d+\.js/.test(name) == false) {
                        throw new Error("文件命名错误, 格式: [作者名.插件名_版本号.js] 作者名、插件名由英文+数字组成, 作者名建议为github用户名或其他不会重复的名称, 文件名示例: steve.example_0.1.0.js");
                    }
                    let arr = name.split("_");
                    let ver = new Version(arr[1].slice(0, -3));
                    let preVer = map.get(arr[0]);
                    if (preVer == null) {
                        map.set(arr[0], ver);
                    }
                    else {
                        if (ver.compare(preVer) == 1) {
                            map.set(arr[0], ver);
                        }
                    }
                }
                catch (e) {
                    colorLog("red", `形状包文件${name}读取失败, 原因: ` + e.message);
                }
            }
        });
        let im = File.readFrom(templatesPath + "/import.js");
        let ex = File.readFrom(templatesPath + "/export.js");
        map.forEach((ver, pkg) => {
            let context = File.readFrom(pluginPath + "/" + pkg + "_" + ver.str + ".js");
            let target = buildPath + "/" + pkg + ".js";
            let ti = StrFactory.replaceAll(im, "APISAPCE", `"${APISAPCE}"`);
            ti = StrFactory.replaceAll(ti, "PKG", `"${pkg}"`);
            ti = StrFactory.replaceAll(ti, "VERSION", `[${ver.arr}]`);
            let te = StrFactory.replaceAll(ex, "EXPORTSAPCE", `"${EXPORTSAPCE}"`);
            te = StrFactory.replaceAll(te, "CMD", `"${CMD}"`);
            te = StrFactory.replaceAll(te, "FORM", `"${FORM}"`);
            te = StrFactory.replaceAll(te, "TUTORAIL", `"${TUTORAIL}"`);
            te = StrFactory.replaceAll(te, "PKG", `"${pkg}"`);
            File.writeTo(target, ti + "\n" + context + "\n" + te);
        });
        ShapeLoader.load(delList);
    }

    static load(delList) {
        setTimeout(() => {
            let delSet = new Set(delList);
            // log(Array.from(set))
            File.getFilesList(buildPath).forEach(v => {
                let pkg = v.slice(0, -3);
                // let name = "call-" + pkg.replaceAll(".", "-");
                log(`ll load "${buildPath}/${v}"`)
                let res = mc.runcmdEx(`ll load "${buildPath}/${v}"`);
                if (res.success) {
                    if (delSet.has(pkg)) {
                        colorLog("blue", `重载形状包${pkg}`);
                    }
                    else {
                        colorLog("green", `加载形状包${pkg}`);
                    }
                }
                else {
                    if (delSet.has(pkg)) {
                        colorLog("red", `形状包${pkg}重载失败`)
                    }
                    else {
                        colorLog("red", `形状包${pkg}加载失败`);
                    }
                }
            });
        }, 1000);

    }
}

module.exports = ShapeLoader;