import CAPlayer from "../user/CAPlayer";
import Menu from "./Menu";

export default class MenuOperation {
    static start(output:CommandOutput, caPlayer:CAPlayer, res: { option: string; }) {
        let option: number[];
        if(res.option != null) 
            option = res.option.match(/\d+/g).map(Number);
        else 
            option = [];

        new Menu(caPlayer).sendForm(option);
    }
}