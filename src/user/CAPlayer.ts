import Config from "../common/Config";
import AreaOperation from "../structure/AreaOperation";
import { Settings, defaultSettings } from "../temp/Data";

export default class CAPlayer {
    public xuid: string;
    public settings: Settings;
    public click: boolean;
    public isSetPosA: boolean;
    public hasSetArea: boolean;
    public isDisplayArea: boolean;
    public displayPos: any;
    public forbidCmd: boolean;
    public prePos: any;
    public direction: DirectionAngle;
    public $: LLSE_Player;

    constructor(xuid: string) {
        let settings: Settings = Config.get(Config.PLAYERS_SETTINGS, `player.${xuid}`);
        if (settings == null) {
            settings = Config.get(Config.PLAYERS_SETTINGS, `default`);
        }
        this.xuid = xuid;
        this.settings = settings;
        this.click = false;
        this.isSetPosA = true;
        this.hasSetArea = false;
        this.isDisplayArea = false;
        this.displayPos = null;
        this.forbidCmd = false;
        this.prePos = null;
        this.$ = mc.getPlayer(xuid);
        this.setDefaultSettings();
    }

    public setDefaultSettings() {
        Object.keys(defaultSettings).forEach(key => {
            if (this.settings[key] == null) this.settings[key] = defaultSettings[key];
        })
    }

    public refreshAllChunks() {
        if (this.settings.refreshChunks) {
            this.$.refreshChunks();
        }
    }

    public saveAll() {
        if (!this.settings.saveArea) {
            AreaOperation.clearArea(this);
        }
        Config.set(Config.PLAYERS_SETTINGS, `player.${this.xuid}`, this.settings);
    }
}