import { Settings } from "../type/Data";
import CAPlayer from "../model/CAPlayer";

export default class Form {
    public settings: Settings;
    public player: LLSE_Player;

    constructor(public caPlayer: CAPlayer) {
        this.settings = caPlayer.settings;
        this.player = caPlayer.$;
    }

    public sendForm(opts: Array<number>, content?: string) {}
}