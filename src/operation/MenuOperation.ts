import PlayerData from "../model/PlayerData";
import Menu from "../views/Menu";

export default class MenuOperation {
    static start(player:Player, output:CommandOutput, playerData:PlayerData, res: { option: string; }) {
        let option: number[];
        if(res.option != null) 
            option = res.option.match(/\d+/g).map(Number);
        else 
            option = [];

        new Menu(player, playerData).sendForm(option);
    }
}