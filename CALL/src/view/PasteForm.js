const Form = require("./Form");

class PasteForm extends Form {
    constructor(form) {
        super(form.player, form.playerData, form.settings);
        return this;
    }

    sendForm(opts) {
        try {
            AreaOperation.hasArea(this.playerData);
        }
        catch (e) {
            this.player.sendText(StrFactory.cmdErr("未选区, 无法操作"));
            return;
        }

        let form = mc.newCustomForm()
            .setTitle("保存")
            .addInput("名称", "支持中文、字母、数字(可不输入)")

        this.player.sendForm(form, (pl, data) => {
            if (data == null) return;
            pl.runcmd(`ca sa ${data[0]}`);
        });
    }
}

module.exports = PasteForm;