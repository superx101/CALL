class Form {
    constructor(player, playerData, option) {
        this.player = player;
        this.playerData = playerData;
        this.settings = playerData.settings;
        return this;
    }

    sendForm() {}
}

module.exports = Form;