import { Compare } from "../type/Common";
import Version from "../util/Version";

const ROOT = './plugins/nodejs/call';
const DATAROOT = './plugins/CALL'
const CONFIG = ROOT + "/config"
const DATA = DATAROOT + '/data'
const GLOBALPATH = DATAROOT + '/config';
const URL = CONFIG + "/url.json";
const GLOBAL = GLOBALPATH + "/configs.json";
const PERMISSIONS = GLOBALPATH + "/userlist.json";
const PLAYERS_SETTINGS = DATA + "/settings.json";
const STRUCTURES = DATA + "/structures.json";
const CHECK = CONFIG + "/check.json";
const SERVER_VERSION = Version.fromString(mc.getBDSVersion().substring(1));

function getVersion(): Version {
    let config = new JsonConfigFile(Config.ROOT + "/package.json");
    let v: string = config.get("version");
    config.close();
    return Version.fromString(v.substring(-1));
}

function getDataVersion(): Version {
    const path = DATAROOT + '/version';
    if(File.exists(path)) {
        return Version.fromString(File.readFrom(path));
    }
    else {
        return null;
    }
}

export default class Config {
    public static readonly ISOLDVERSION = SERVER_VERSION.compare(Version.fromArr([1, 19, 50])) == Compare.LESSER ? true : false; 
    public static readonly ROOT = ROOT;
    public static readonly CONFIG = CONFIG;
    public static readonly LANG = CONFIG + '/lang';
    public static readonly DATAPATH = DATAROOT;
    public static readonly  BIN = ROOT + "/bin";
    public static readonly DATA = DATA;
    public static readonly BUILD = DATAROOT + '/build';
    public static readonly PLUGINS = DATAROOT + '/plugins';
    public static readonly TEMP = DATAROOT + '/temp';
    public static readonly IMPORT = DATAROOT + '/import';
    public static readonly EXPORT = DATAROOT + '/export';
    public static readonly UPDATE = CONFIG +  '/update.json';
    public static readonly TEMPLATES = ROOT + '/templates'
    public static URL = new JsonConfigFile(URL);
    public static GLOBAL = new JsonConfigFile(GLOBAL);
    public static PERMISSIONS = new JsonConfigFile(PERMISSIONS);
    public static PLAYERS_SETTINGS = new JsonConfigFile(PLAYERS_SETTINGS);
    public static STRUCTURES = new JsonConfigFile(STRUCTURES);
    public static CHECK = new JsonConfigFile(CHECK);
    public static ITEM_TEXTURES = new JsonConfigFile(CONFIG + "/item_texture.json");
    public static readonly ITEM_ICONS =  new Set<string>(JSON.parse(File.readFrom(CONFIG + "/icons.json")));
    public static readonly BLOCKS_TYPE = new Set<string>(JSON.parse(File.readFrom(CONFIG + "/blocks.json")));
    public static readonly LL_MINVERSION = Version.fromArr([2, 8, 1]);
    public static readonly SERVER_VERSION = SERVER_VERSION;
    public static readonly PLUGIN_VERSION = getVersion();
    public static readonly DATA_VERSION = getDataVersion();

    public static get(config: JsonConfigFile, str: string, def?: any): any {
        let strArr = str.split(".");
        let p = config.get(strArr[0]);
        let res;
        try {
            for (let i = 1; i < strArr.length; i++) {
                p = p[strArr[i]];
            }
        }
        catch (e) {
            res = null;
        }
        res = p;
        if(def != undefined && res == null) {
            res = def;
        }
        return res;
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
                if(data == null) throw new Error(`配置文件中未找到 ${k}`)
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

    public static closeAll() {
        Config.URL.close();
        Config.GLOBAL.close();
        Config.PERMISSIONS.close();
        Config.PLAYERS_SETTINGS.close();
        Config.STRUCTURES.close();
        Config.CHECK.close();
    }

    public static openAll() {
        Config.URL = new JsonConfigFile(URL);
        Config.GLOBAL = new JsonConfigFile(GLOBAL);
        Config.PERMISSIONS = new JsonConfigFile(PERMISSIONS);
        Config.PLAYERS_SETTINGS = new JsonConfigFile(PLAYERS_SETTINGS);
        Config.STRUCTURES = new JsonConfigFile(STRUCTURES);
        Config.CHECK = new JsonConfigFile(CHECK);
    }
}