import * as unzipper from 'unzipper'
import Config from '../common/Config';
import Version from '../util/Version';
import { Compare } from '../type/Common';
import axios from 'axios';
import * as fs from 'fs';
import ReloadOperation from '../operation/ReloadOperation';
import JsonPatch from '../util/JsonPatch';
import path = require('path');

const shapeFilePath = 'CALL/plugins/shape'
const pluginFileName = 'CALL.llplugin';
const URL = Config.get(Config.URL, "update");
class Urls {
    constructor(public check: string, public download?: string) { }
}

export default class UpdateManager {

    //安装形状包
    static async installShapePackage(file: string) {
        fs.createReadStream(file)
            .pipe(unzipper.Parse())
            .on('entry', entry => {
                const pathName = entry.path;

                if (pathName.startsWith(shapeFilePath)) {
                    const outputPathName = Config.PLUGINS + `/shape/${path.basename(pathName)}`;
                    if (!fs.existsSync(outputPathName)) {
                        File.mkdir(path.dirname(outputPathName));
                    }
                    entry.pipe(fs.createWriteStream(outputPathName));
                } else {
                    entry.autodrain();
                }
            })
            .on("close", () => {
                return new Promise(()=>{})
            })
    }

    //安装
    private static async install(file: string) {
        logger.warn('安装过程中请勿重启服务器或插件');
        logger.warn(`开始安装中.... 此过程大概需要1至5分钟`);

        //解压
        fs.createReadStream(file)
            .pipe(unzipper.ParseOne(new RegExp(pluginFileName)))
            .pipe(unzipper.Extract({ path: Config.ROOT }))
            .on("close", async () => {
                await UpdateManager.installShapePackage(file);
                logger.info(`安装完成, 已成功更新插件`);
                //重载
                ReloadOperation.start("自动更新完成, 已重新加载插件");
            })
            .on("error", (e: Error) => {
                logger.warn("安装失败:" + e.message);
            })
    }

    //下载
    private static async download(isAuto: boolean, v: Version, url: string) {
        const file = `${Config.TEMP}/CALL-${v.toString()}.zip`;
        //检查目录
        if (!fs.existsSync(Config.TEMP)) {
            fs.mkdirSync(Config.TEMP);
        }
        //检查文件
        if (fs.existsSync(file)) {
            UpdateManager.install(file);//安装
        }
        else {
            //下载最新版本
            logger.info(`从${url}下载最新版中...`);
            await axios({
                url,
                method: "GET",
                responseType: "stream"
            }).then((response) => {
                if (response.status == 200) {
                    response.data.pipe(fs.createWriteStream(file))
                        .on("finish", () => {
                            logger.info("下载成功");
                            UpdateManager.install(file);//安装
                        })
                        .on("error", (e: Error) => {
                            logger.warn(e.message);
                        });
                }
                else {
                    logger.warn("服务器响应不成功, 请重试");
                }
            }).catch((reason) => {
                logger.warn(`下载失败,请重试: ` + reason);
            });
        }
    }

    //github版本检查
    private static checkFromGithub(urls: Urls, isAuto: boolean) {
        axios.get(urls.check).then((respone) => {
            if (respone.status != 200) throw new Error("请求失败, 请检查网络");
            //比较
            const data = respone.data;
            let v = Version.fromString(data.name);
            if (v.compare(Config.PLUGIN_VERSION) == Compare.GREATER) {
                UpdateManager.download(isAuto, v, data.assets[0].browser_download_url);
            } else {
                if (!isAuto) logger.info(`当前为最新版本: ${v.toString()}, 无需更新`);
            }
        })
    }

    //minebbs版本检查
    private static checkFromMinebbs(urls: Urls, isAuto: boolean) {
        axios.get(urls.check).then((respone) => {
            if (respone.status == 200 && respone.data.status == 2000) {
                let v = Version.fromString(respone.data.data.version);
                if (v.compare(Config.PLUGIN_VERSION) == Compare.GREATER) {
                    UpdateManager.download(isAuto, v, URL.minebbs.download);
                } else {
                    if (!isAuto) logger.info(`当前为最新版本: ${v.toString()}, 无需更新`);
                }
            } else {
                throw new Error("请求失败, 请检查网络");
            }
        });
    }

    public static updatePlugin(isAuto: boolean) {
        try {
            //网络获取最新版本
            const url = Config.get(Config.GLOBAL, "updateFrom");
            if (!isAuto) logger.info("检查最新版本中");
            //判断url
            switch (url) {
                case "github":
                    UpdateManager.checkFromGithub(new Urls(URL.github.check), isAuto);
                    break;
                case "minebbs":
                    UpdateManager.checkFromMinebbs(new Urls(URL.minebbs.check, URL.minebbs.download), isAuto);
                    break;
            }
        } catch (error) {
            logger.error("更新失败：" + error.message);
        }
    }

    public static updateData() {
        if (Config.DATA_VERSION == null) {
            logger.warn("未检测到数据标识, 尝试自动更新数据");
            Config.closeAll();
            JsonPatch.runArray(JSON.parse(File.readFrom(Config.UPDATE))['1.0.0']);
            logger.info("更新完成");
            Config.openAll();
        }
        //比较
        else if (Config.DATA_VERSION.compare(Config.PLUGIN_VERSION) == Compare.LESSER) {
            //更新
            logger.info("检测到版本更新, 正在更新数据");
            let updateJson = JSON.parse(File.readFrom(Config.UPDATE));
            Config.closeAll();
            for (const key of Object.keys(updateJson)) {
                const v = Version.fromString(key);
                //v > DATA_VERSIONN && v <= PLUGIN_VERSION
                if (v.compare(Config.DATA_VERSION) == Compare.GREATER && v.compare(Config.PLUGIN_VERSION) != Compare.GREATER) {
                    JsonPatch.runArray(updateJson[key]);
                }
            }
            logger.info("更新完成");
            Config.openAll();
        }
    }
}