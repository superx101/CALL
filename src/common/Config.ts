import Version from "../util/Version";

export enum PermissionsType {
    ALL = "all",
    OP = "op",
    CUSTOMIZE = "customize"
}

const ROOT = './plugins/call';
const CONFIG = ROOT + "/config"
const USER_DATA = ROOT + '/userdata';
const DATA = USER_DATA + '/data'
const URL = CONFIG + "/url.json";
const USER_CONFIG = USER_DATA + '/config';
const GLOBAL = USER_CONFIG + "/configs.json";
const PERMISSIONS = USER_CONFIG + "/userlist.json";
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
    const path = USER_DATA + '/version';
    if(File.exists(path)) {
        return Version.fromString(File.readFrom(path));
    }
    else {
        return null;
    }
}

export default class Config {
    static A = GLOBAL
    public static readonly MINVERSION = Version.fromArr([1, 20, 10]);
    public static readonly ROOT = ROOT;
    public static readonly CONFIG = CONFIG;
    public static readonly LANG = CONFIG + '/lang';
    public static readonly DATAPATH = USER_DATA;
    public static readonly BIN = ROOT + "/bin";
    public static readonly DATA = DATA;
    public static readonly BUILD = USER_DATA + '/build';
    public static readonly PLUGINS = USER_DATA + '/plugins';
    public static readonly TEMP = USER_DATA + '/temp';
    public static readonly IMPORT = USER_DATA + '/import';
    public static readonly EXPORT = USER_DATA + '/export';
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
    public static readonly LL_MINVERSION = Version.fromArr([0, 9, 2]);
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