import PlayerData from "../model/PlayerData";
import StrFactory from "../util/StrFactory";

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
            throw new Error(`暂无键为${key}的设置项, 请检查拼写`);
        }
        else {
            output.success(StrFactory.cmdSuccess(`设置项${key}值为: ${value}`))
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
        output.success(StrFactory.cmdSuccess(`成功修改设置项: ${successKey}`) + `\n${failKey === "" ? "" : StrFactory.red(`其他设置项: ${failKey}修改失败, 请检查拼写和是否可修改`)}`);
    }
}