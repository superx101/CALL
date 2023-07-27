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
    public static readonly DEFAULTLANG = 'en_US';

    public static _(lang: string, key: string, ...args: any): string {
        let reader = readerMap.get(lang);

        //if reader unload
        if (reader == null) {
            if (langListSet.has(lang)) {
                //.lang exist
                reader = PropertiesReader(`${Config.LANG}/${lang}.lang`);
                readerMap.set(lang, reader);
            }
            else {
                //.lang not exist, use default (default file must exist)
                return Translator._(Translator.DEFAULTLANG, key, args);
            }
        }

        return sprintf.sprintf(reader.get(key) as string, args);
    }
}