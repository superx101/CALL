import * as unzipper from 'unzipper'
import Config from '../common/Config';
import Version from '../util/Version';
import { Compare } from '../type/Common';
import axios from 'axios';
import * as fs from 'fs';
import ReloadOperation from '../operation/ReloadOperation';
import JsonPatch from '../util/JsonPatch';
import path = require('path');
import { execFileSync } from 'child_process';
import * as fse from 'fs-extra'
import Tr from '../util/Translator';

const shapeFilePath = 'CALL/plugins/shape'
const pluginFileName = 'CALL.llplugin';
const packageLockPath = Config.ROOT + '/package-lock.json';
const node_modulesPath = Config.ROOT + '/node_modules';
const unzip7zPath = './plugins/LiteLoader/7z/7za.exe';
const URL = Config.get(Config.URL, "update");
class Urls {
    constructor(public check: string, public download?: string) { }
}

export default class UpdateManager {

    //安装形状包
    private static async installShapePackage(file: string) {
        fs.createReadStream(file)
            .pipe(unzipper.Parse())
            .on('entry', entry => {
                const pathName = entry.path;

                if (pathName.startsWith(shapeFilePath)) {
                    const outputPathName = Config.PLUGINS + `/shape/${path.basename(pathName)}`;
                    if (!fs.existsSync(outputPathName)) {
                        fs.mkdirSync(path.dirname(outputPathName));
                    }
                    entry.pipe(fs.createWriteStream(outputPathName));
                } else {
                    entry.autodrain();
                }
            })
            .on("close", () => {
                return new Promise(() => { })
            })
    }

    private static unzipByUnzipper(file: string, closeCallback: () => Promise<void>) {
        logger.warn(Tr._c("console.UpdateManager.unzipByUnzipper.warn"));
        logger.info(Tr._c("console.UpdateManager.unzipByUnzipper.info"));
        fs.createReadStream(file)
            .pipe(unzipper.ParseOne(new RegExp(pluginFileName)))
            .pipe(unzipper.Extract({ path: Config.ROOT }))
            .on("close", () => {
                closeCallback();
            })
            .on("error", (e: Error) => {
                logger.warn(Tr._c("console.UpdateManager.unzipByUnzipper.fail", e.message));
            })
    }

    private static unzipBy7z(file: string, closeCallback: () => Promise<void>) {
        const p = path.parse(file);
        const tempDir = `${Config.TEMP}/${p.name}`;
        const tempFile = `${tempDir}/${pluginFileName}`;
        logger.info(Tr._c(`console.UpdateManager.unzipBy7z.installing`));

        if(fs.existsSync(tempDir)) {
            fse.removeSync(tempDir);
        }
        execFileSync(unzip7zPath, ['x', file, '-o' + tempDir]);

        fse.removeSync(Config.ROOT);
        execFileSync(unzip7zPath, ['x', tempFile, '-o' + Config.ROOT]);

        closeCallback();
    }

    //安装
    private static async install(file: string) {
        async function onClose() {
            await UpdateManager.installShapePackage(file);

            logger.info(Tr._c("console.UpdateManager.install.success"));
            //重载
            ReloadOperation.start();

            return;
        }

        try {
            //删除package-lock.json
            if (File.exists(packageLockPath)) {
                File.delete(packageLockPath);
            }
            //删除node_modules
            if (File.exists(node_modulesPath)) {
                File.delete(node_modulesPath);
            }

            //解压
            if (fs.existsSync(unzip7zPath)) {
                //存在7za.exe 使用7z解压
                UpdateManager.unzipBy7z(file, onClose);
            }
            else {
                //不存在 使用unzipper解压
                UpdateManager.unzipByUnzipper(file, onClose);
            }
        }
        catch (e) {
            logger.error(Tr._c("console.UpdateManager.install.fail", e.message));
        }
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
            logger.info(Tr._c("console.UpdateManager.download.downloading", `${url}`));
            await axios({
                url,
                method: "GET",
                responseType: "stream"
            }).then((response) => {
                if (response.status == 200) {
                    response.data.pipe(fs.createWriteStream(file))
                        .on("finish", () => {
                            logger.info(Tr._c("console.UpdateManager.download.success"));
                            UpdateManager.install(file);//安装
                        })
                        .on("error", (e: Error) => {
                            logger.warn(e.message);
                        });
                }
                else {
                    logger.warn(Tr._c("console.UpdateManager.download.warn"));
                }
            }).catch((reason) => {
                logger.warn(Tr._c("console.UpdateManager.download.fail", reason));
            });
        }
    }

    //github版本检查
    private static checkFromGithub(urls: Urls, isAuto: boolean) {
        axios.get(urls.check).then((respone) => {
            if (respone.status != 200) throw new Error(Tr._c("console.UpdateManager.networkError"));
            //比较
            const data = respone.data;
            let v = Version.fromString(data.name);
            if (v.compare(Config.PLUGIN_VERSION) == Compare.GREATER) {
                UpdateManager.download(isAuto, v, data.assets[0].browser_download_url);
            } else {
                if (!isAuto) logger.info(Tr._c("console.UpdateManager.lastVersion", v.toString()));
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
                    if (!isAuto) logger.info(Tr._c("console.UpdateManager.lastVersion", v.toString()));
                }
            } else {
                throw new Error(Tr._c("console.UpdateManager.networkError"));
            }
        }).catch((reason) => {
            //debug
            if (Config.get(Config.GLOBAL, "debugMod", false)) {
                logger.warn(Tr._c("console.UpdateManager.error", reason));
            }
        }).catch((reason) => {
            //debug
            if (Config.get(Config.GLOBAL, "debugMod", false)) {
                logger.warn(`检查更新失败,请重试: ` + reason);
            }
        });
    }

    public static updatePlugin(isAuto: boolean) {
        try {
            //网络获取最新版本
            const url = Config.get(Config.GLOBAL, "updateFrom");
            if (!isAuto) logger.info(Tr._c("console.UpdateManager.updatePlugin.checking"));
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
            logger.error(Tr._c("console.UpdateManager.error2"), error.message);
        }
    }

    public static updateData() {
        if (Config.DATA_VERSION == null) {
            logger.warn(Tr._c("console.UpdateManager.updateData.warn"));
            Config.closeAll();
            const updateJson = JSON.parse(File.readFrom(Config.UPDATE));
            for (const key of Object.keys(updateJson)) {
                JsonPatch.runArray(updateJson[key]);
            }
            logger.info(Tr._c("console.UpdateManager.success"));
            Config.openAll();
        }
        //比较
        else if (Config.DATA_VERSION.compare(Config.PLUGIN_VERSION) == Compare.LESSER) {
            //更新
            logger.info(Tr._c("console.UpdateManager.updateData.info"));
            Config.closeAll();
            const updateJson = JSON.parse(File.readFrom(Config.UPDATE));
            for (const key of Object.keys(updateJson)) {
                const v = Version.fromString(key);
                //v > DATA_VERSIONN && v <= PLUGIN_VERSION
                if (v.compare(Config.DATA_VERSION) == Compare.GREATER && v.compare(Config.PLUGIN_VERSION) != Compare.GREATER) {
                    JsonPatch.runArray(updateJson[key]);
                }
            }
            logger.info(Tr._c("console.UpdateManager.success"));
            Config.openAll();
        }
    }
}