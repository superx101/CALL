import path = require("path");
import Config from "../common/Config";
import * as PropertiesReader from 'properties-reader';
import * as sprintf from 'sprintf-js'

const langListSet: Set<string> = getListSet(Config.LANG);

const readerMap: Map<string, PropertiesReader.Reader> = new Map();

function getListSet(p: string): Set<string> {
    let files = File.getFilesList(p);
    const set = new Set<string>();
    files.forEach((v, i) => {
        set.add(path.parse(v).name);
    });
    return set;
}

export default class Translator {
    public static readonly ITEM = "item";
    public static readonly DEFAULTLANG = 'zh_CN'

    public static t(type: string, lang: string, key: string, ...args: any): string {
        let reader = readerMap.get(lang);

        //若reader未加载
        if (reader == null) {
            if (langListSet.has(lang)) {
                //存在语言文件，加载
                reader = PropertiesReader(`${Config.LANG}/${lang}.lang`);
                readerMap.set(lang, reader);
            }
            else {
                //不存在语言文件，使用默认（默认文件必须存在）
                return Translator.t(type, Translator.DEFAULTLANG, key, args);
            }
        }

        return sprintf.sprintf(reader.get(`${type}.${key}`) as string, args);
    }
}