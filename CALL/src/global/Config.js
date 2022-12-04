const Version = require("../tool/Version");

const ROOT = './plugins/CALL';
const DATAPATH = ROOT + '/data';
const GLOBAL = ROOT + '/config';
const PLUGINS = ROOT + '/plugins'
const SERVER_VERSION = new Version(mc.getBDSVersion().substring(1));
log(mc.getBDSVersion().substring(1))
log(SERVER_VERSION)
log(SERVER_VERSION.compare({arr: [1, 19, 80]}) < 0 ? true : false)

class Config {
    static ISOLDCOMMAND = SERVER_VERSION.compare({arr: [1, 19, 50]}) < 0 ? true : false; 
    static ROOT = ROOT;
    static DATAPATH = DATAPATH;
    static GLOBAL = new JsonConfigFile(GLOBAL + "/configs.json");
    static PLUGINS = PLUGINS;
    static PERMISSIONS = new JsonConfigFile(GLOBAL + "/userlist.json");
    static PLAYERS_SETTINGS = new JsonConfigFile(DATAPATH + "/settings.json");
    static STRUCTURES = new JsonConfigFile(DATAPATH + "/structures.json");
    static CHECK = new JsonConfigFile(DATAPATH + "/check.json");
    static SERVER_VERSION = SERVER_VERSION;
    static PERMISSIONS_TYPE_ENUM = {
        ALL: "all",
        OP: "op",
        CUSTOMIZE: "customize"
    }
    static idNum = 0;

    static getId() {
        Config.idNum = Config.idNum + 1;
        return Config.idNum;
    }

    static get(config, str) {
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

    static set(config, str, data) {
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

    static del(config, str) {
        let strArr = str.split(".");
        let faStr = "";
        let p;
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

    static check() {
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
                        c.values.forEach(v => {
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
Object.keys(Config).forEach(v => {
    Object.freeze(Config[v]);
});

module.exports = Config;