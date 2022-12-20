import { Compare } from "../type/Common";
import Version from "../util/Version";
const ROOT = './plugins/nodejs/CALL';
const DATAROOT = './plugins/CALL'
const BIN = ROOT + "/bin"
const CONFIG = ROOT + "/config"
const DATA = DATAROOT + '/data'
const GLOBAL = DATAROOT + '/config';
const PLUGINS = DATAROOT + '/plugins'
const BUILD = DATAROOT + '/build'
const SERVER_VERSION = Version.fromString(mc.getBDSVersion().substring(1));

export default class Config {
    public static ISOLDVERSION = SERVER_VERSION.compare(Version.fromArr([1, 19, 50])) == Compare.LESSER ? true : false; 
    public static ROOT = ROOT;
    public static BUILD = BUILD;
    public static BIN = BIN;
    public static CONFIG = CONFIG;
    public static DATAPATH = DATAROOT;
    public static GLOBAL = new JsonConfigFile(GLOBAL + "/configs.json");
    public static PLUGINS = PLUGINS;
    public static PERMISSIONS = new JsonConfigFile(GLOBAL + "/userlist.json");
    public static PLAYERS_SETTINGS = new JsonConfigFile(DATA + "/settings.json");
    public static STRUCTURES = new JsonConfigFile(DATA + "/structures.json");
    public static CHECK = new JsonConfigFile(CONFIG + "/check.json");
    public static SERVER_VERSION = SERVER_VERSION;
    public static PERMISSIONS_TYPE_ENUM = {
        ALL: "all",
        OP: "op",
        CUSTOMIZE: "customize"
    }

    public static get(config: JsonConfigFile, str: string): any {
        let strArr = str.split(".");
        let p = config.get(strArr[0]);
        try {
            for (let i = 1; i < strArr.length; i++) {
                p = p[strArr[i]];
            }
        }
        catch (e) {
            return null;
        }
        return p;
    }

    public static set(config: JsonConfigFile, str: string, data: any) {
        let strArr = str.split(".");
        let con = config.get(strArr[0]);
        if (strArr.length == 1) {
            config.set(strArr[0], data);
            return true;
        }
        try {
            let p = con;
            for (let i = 1; i < strArr.length - 1; i++) {
                p = p[strArr[i]]
            }
            p[strArr[strArr.length - 1]] = data;
            config.set(strArr[0], con);
        }
        catch (e) {
            return false;
        }
        return true;
    }

    public static del(config: JsonConfigFile, str: string) {
        let strArr = str.split(".");
        let faStr = "";
        let p: string;
        strArr.forEach((v, i, a) => {
            if (i == strArr.length - 1) {
                p = v;
            }
            else {
                faStr += v;
            }
        });
        try {
            let data = Config.get(config, faStr);
            delete data[p];
            Config.set(config, faStr, data);
        }
        catch (e) {
            throw e;
        }
    }

    public static check() {
        try {
            let check = Config.get(Config.CHECK, "configs");
            Object.keys(check).forEach(k => {
                let c = check[k];
                let data = Config.get(Config.GLOBAL, k);
                if (c.type != "enum" && typeof (data) != c.type) throw new Error(`${k} 应为 ${c.type} 类型`);
                switch (c.type) {
                    case "number":
                        if (data < c.min) throw new Error(`${k} 小于最小值 ${c.min}`);
                        if (data > c.max) throw new Error(`${k} 大于最大值 ${c.max}`);
                        break;
                    case "enum":
                        let has = false;
                        c.values.forEach((v: any) => {
                            if (v == data) {
                                has = true;
                            }
                        });
                        if (!has) throw new Error(`${k} 应为 ${c.values} 其中之一`);
                        break;
                }
            });
        } catch (e) {
            throw new Error(`CALL/config/configs文件配置失败: ` + e.message);
        }
    }
}

Object.freeze(Config);