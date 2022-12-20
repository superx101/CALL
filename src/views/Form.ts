import { Settings } from "../type/Data";
import PlayerData from "../model/PlayerData";

export default class Form {
    public settings: Settings;

    constructor(public player: Player, public playerData: PlayerData) {
        this.settings = playerData.settings;
    }

    public sendForm(opts: Array<number>) {}
}