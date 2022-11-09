const Form = require("./Form");

class AreaForm extends Form {
    constructor(form) {
        super(form.player, form.playerData, form.settings);
        return this;
    }

    opt(opts) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.player, this.playerData).sendForm();
                break;
            case 1:
                this.player.runcmd(`ca ar st ${new Pos3D(this.player.pos).calibration().floor().formatStr()}`);
                break;
            case 2:
                this.player.runcmd(`ca ar en ${new Pos3D(this.player.pos).calibration().floor().formatStr()}`);
                break;
            case 3:
                this.player.runcmd("ca ar cl");
                break;
            case 4:
                this.player.runcmd(`ca setting set {"areaTextShow":${this.settings.areaTextShow ? false : true}}`);
                break;
            case 5:
                this.player.runcmd(`ca ar sh ${this.settings.displayArea ? "off" : "on"}`);
                break;
            default:
                break;
        }
    }

    sendForm(opts = []) {
        let form = mc.newSimpleForm()
            .setTitle("选区")
            .addButton("返回上一级", "")
            .addButton("设置点A为当前坐标", "")
            .addButton("设置点B为当前坐标", "")
            .addButton("清除选区", "")
            .addButton(StrFactory.on_off(this.settings.areaTextShow, '关闭', '开启') + "选区文字提示", "")
            .addButton(StrFactory.on_off(this.settings.displayArea, '关闭', '开启') + "选区显示", "");

        if (opts.length > 0) {
            this.opt(opts);
        }
        else {
            this.player.sendForm(form, (pl, id) => {
                opts.push(id);
                this.opt(opts);
            });
        }
    }
}

module.exports = AreaForm;