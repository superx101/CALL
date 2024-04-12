import { Settings } from "../temp/Data";
import CAPlayer from "../user/CAPlayer";

export default class Form {
    public settings: Settings;
    public player: LLSE_Player;

    constructor(public caPlayer: CAPlayer) {
        this.settings = caPlayer.settings;
        this.player = caPlayer.$;
    }

    public sendForm(opts: Array<number>, content?: string) {}
}