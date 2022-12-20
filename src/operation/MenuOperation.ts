import PlayerData from "../model/PlayerData";
import Menu from "../views/Menu";

export default class MenuOperation {
    static start(player:Player, output:CommandOutput, playerData:PlayerData, res: { option: number[]; }) {
        new Menu(player, playerData).sendForm(res.option);
    }
}