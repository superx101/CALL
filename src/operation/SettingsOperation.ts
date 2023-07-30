import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";

export default class SettingsOperation {
    private static forbidModifyKeys: Set<string>;

    public static onServerCreate() {
        SettingsOperation.forbidModifyKeys = new Set(["enable", "displayPos", "area"]);
    }

    public static start(player: any, output: CommandOutput, playerData: any, res: { enum_1: any; key: any; json: any; }) {
        switch (res.enum_1) {
            case "get":
            case "ge":
                SettingsOperation.get(player, output, playerData, res.key);
                break;
            case "set":
            case "se":
                SettingsOperation.set(player, output, playerData, res.json);
                break;
        }
    }

    public static get(player: Player, output: CommandOutput, playerData: PlayerData, key: string) {
        let value = null;
        Object.keys(playerData.settings).forEach((k) => {
            if (k == key) {
                value = playerData.settings[k];
            }
        });
        if (value == null) {
            throw new Error(Tr._(player.langCode, "dynamic.SettingsOperation.get.error", `${key}`));
        }
        else {
            output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.SettingsOperation.get.success", key, value)))
        }
    }

    public static set(player: Player, output: CommandOutput, playerData: PlayerData, jsonText: string) {
        let successKey = "";
        let failKey = "";
        let data = JSON.parse(jsonText);
        let set = new Set(Object.keys(playerData.settings));
        Object.keys(data).forEach((key) => {
            if (set.has(key) && !SettingsOperation.forbidModifyKeys.has(key)) {
                successKey += `${key}=${data[key]},`;
                playerData.settings[key] = data[key];
            }
            else {
                failKey += key + ",";
            }
        });
        successKey = successKey.substring(0, successKey.length - 1);
        failKey = failKey.substring(0, failKey.length - 1);
        output.success(StrFactory.cmdSuccess(Tr._(player.langCode, "dynamic.SettingsOperation.set.success", successKey, failKey === "" ? "" : StrFactory.red(Tr._(player.langCode, "dynamic.SettingsOperation.set.other", failKey)))));
    }
}