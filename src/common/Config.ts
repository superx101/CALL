import Version from "../util/Version";

export enum PermissionsType {
    ALL = "all",
    OP = "op",
    CUSTOMIZE = "customize",
    FROM_FILE = "file",
    FROM_TAG = "tag"
}

const ROOT_PATH = './plugins/call';
const CONFIG_PATH = ROOT_PATH + "/config"
const USER_DATA_PATH = ROOT_PATH + '/userdata';
const DATA_PATH = USER_DATA_PATH + '/data'
const URL_PATH = CONFIG_PATH + "/url.json";
const USER_CONFIG_PATH = USER_DATA_PATH + '/config';
const GLOBAL_PATH = USER_CONFIG_PATH + "/configs.json";
const PERMISSIONS_PATH = USER_CONFIG_PATH + "/userlist.json";
const PLAYERS_SETTINGS_PATH = DATA_PATH + "/settings.json";
const STRUCTURES_PATH = DATA_PATH + "/structures.json";
const CHECK_PATH = CONFIG_PATH + "/check.json";
const SERVER_VERSION = Version.fromString(mc.getBDSVersion().substring(1));

function getVersion(): Version {
    let config = new JsonConfigFile(Config.ROOT_PATH + "/package.json");
    let v: string = config.get("version");
    config.close();
    return Version.fromString(v.substring(-1));
}

function getDataVersion(): Version {
    const path = USER_DATA_PATH + '/version';
    if(File.exists(path)) {
        return Version.fromString(File.readFrom(path));
    }
    else {
        return null;
    }
}

export default class Config {
    static A = GLOBAL_PATH
    public static readonly MINVERSION = Version.fromArr([1, 20, 10]);
    public static readonly ROOT_PATH = ROOT_PATH;
    public static readonly CONFIG_PATH = CONFIG_PATH;
    public static readonly LANG_PATH = CONFIG_PATH + '/lang';
    public static readonly DATAPATH = USER_DATA_PATH;
    public static readonly BIN_PATH = ROOT_PATH + "/bin";
    public static readonly DATA_PATH = DATA_PATH;
    public static readonly BUILD_PATH = USER_DATA_PATH + '/build';
    public static readonly PLUGINS_PATH = USER_DATA_PATH + '/plugins';
    public static readonly TEMP_PATH = USER_DATA_PATH + '/temp';
    public static readonly IMPORT_PATH = USER_DATA_PATH + '/import';
    public static readonly EXPORT_PATH = USER_DATA_PATH + '/export';
    public static readonly UPDATE_PATH = CONFIG_PATH +  '/update.json';
    public static readonly TEMPLATES_PATH = ROOT_PATH + '/templates'
    public static readonly STUPID_PERMISSION_FILE_PATH = USER_CONFIG_PATH + "/stupid_permission_file.json"
    public static URL = new JsonConfigFile(URL_PATH);
    public static GLOBAL = new JsonConfigFile(GLOBAL_PATH);
    public static PERMISSIONS = new JsonConfigFile(PERMISSIONS_PATH);
    public static PLAYERS_SETTINGS = new JsonConfigFile(PLAYERS_SETTINGS_PATH);
    public static STRUCTURES = new JsonConfigFile(STRUCTURES_PATH);
    public static CHECK = new JsonConfigFile(CHECK_PATH);
    public static ITEM_TEXTURES = new JsonConfigFile(CONFIG_PATH + "/item_texture.json");
    public static readonly ITEM_ICONS =  new Set<string>(JSON.parse(File.readFrom(CONFIG_PATH + "/icons.json")));
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
        Config.URL = new JsonConfigFile(URL_PATH);
        Config.GLOBAL = new JsonConfigFile(GLOBAL_PATH);
        Config.PERMISSIONS = new JsonConfigFile(PERMISSIONS_PATH);
        Config.PLAYERS_SETTINGS = new JsonConfigFile(PLAYERS_SETTINGS_PATH);
        Config.STRUCTURES = new JsonConfigFile(STRUCTURES_PATH);
        Config.CHECK = new JsonConfigFile(CHECK_PATH);
    }
}