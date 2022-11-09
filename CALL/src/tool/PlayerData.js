// const Config = require("../global/Config")
// const AreaOperation = require("../operation/AreaOperation")

class PlayerData {
    constructor(xuid) {
        let settings = Config.get(Config.PLAYERS_SETTINGS, `player.${xuid}`);
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
    }

    saveAll() {
        if (!this.settings.saveArea) {
            AreaOperation.clearArea(this);
        }
        Config.set(Config.PLAYERS_SETTINGS, `player.${this.xuid}`, this.settings);
    }
}

module.exports = PlayerData;