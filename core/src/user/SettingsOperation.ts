import CAPlayer from "./CAPlayer";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class SettingsOperation {
    private static forbidModifyKeys: Set<string>;

    public static onServerCreate() {
        SettingsOperation.forbidModifyKeys = new Set(["enable", "displayPos", "area"]);
    }

    public static start(output: CommandOutput, caPlayer: any, res: { enum_1: any; key: any; json: any; }) {
        switch (res.enum_1) {
            case "get":
            case "ge":
                SettingsOperation.get(output, caPlayer, res.key);
                break;
            case "set":
            case "se":
                SettingsOperation.set(output, caPlayer, res.json);
                break;
        }
    }

    public static get(output: CommandOutput, caPlayer: CAPlayer, key: string) {
        const player = caPlayer.$;
        let value = null;
        Object.keys(caPlayer.settings).forEach((k) => {
            if (k == key) {
                value = caPlayer.settings[k];
            }
        });
        if (value == null) {
            throw new Error(Tr._(player.langCode, "dynamic.SettingsOperation.get.error", `${key}`));
        }
        else {
            output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.SettingsOperation.get.success", key, value)))
        }
    }

    public static set(output: CommandOutput, caPlayer: CAPlayer, jsonText: string) {
        let successKey = "";
        let failKey = "";
        let data = JSON.parse(jsonText);
        let set = new Set(Object.keys(caPlayer.settings));
        Object.keys(data).forEach((key) => {
            if (set.has(key) && !SettingsOperation.forbidModifyKeys.has(key)) {
                successKey += `${key}=${data[key]},`;
                caPlayer.settings[key] = data[key];
            }
            else {
                failKey += key + ",";
            }
        });
        successKey = successKey.substring(0, successKey.length - 1);
        failKey = failKey.substring(0, failKey.length - 1);
        output.success(StrFactory.cmdSuccess(Tr._(caPlayer.$.langCode, "dynamic.SettingsOperation.set.success", successKey, failKey === "" ? "" : StrFactory.red(Tr._(caPlayer.$.langCode, "dynamic.SettingsOperation.set.other", failKey)))));
    }
}