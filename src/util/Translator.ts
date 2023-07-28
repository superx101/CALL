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

export default class Tr {
    public static readonly DEFAULTLANG = 'en_US';

    public static _c(key: string, ...args: any): string {
        return Tr._(Config.get(Config.GLOBAL, "consoleLanguage", Tr.DEFAULTLANG), key, args);
    }

    public static _(lang: string, key: string, ...args: any[]): string {
        if (!langListSet.has(lang)) lang = Tr.DEFAULTLANG;

        let reader = readerMap.get(lang);

        //first load reader
        if (reader == null) {
            readerMap.set(lang, PropertiesReader(`${Config.LANG}/${lang}.lang`));
            reader = readerMap.get(lang);
        }

        return sprintf.sprintf(reader.get(key) as string, ...args);
    }
}