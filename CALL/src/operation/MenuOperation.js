class MenuOperation {
    static start(player, output, playerData, res) {
        new Menu(player, playerData).sendForm(res.option);
    }
}

module.exports = MenuOperation;