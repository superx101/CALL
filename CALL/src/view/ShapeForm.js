const ShapeOperation = require("../operation/ShapeOperation");
const Form = require("./Form");

class ShapeForm extends Form {
    constructor(form) {
        super(form.player, form.playerData, form.settings);
        return this;
    }

    shapeForm(data, pkgName) {
        let form = mc.newSimpleForm()
        .setTitle(`${data.name} ${pkgName}`)
        .setContent(data.introduction)
        .addButton("返回上一级", "")

        data.shapeNames.forEach(name=>{
            form.addButton(name, "");
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == null) {
                return;
            }
            else if (i == 0) {
                this.sendForm();
            }
            else {
                ShapeOperation.sendForm(this.player, this.playerData, pkgName, i - 1);
            }
        });
    }

    sendForm(opts) {
        let form = mc.newSimpleForm()
            .setTitle("生成形状")
            .setContent("选择形状包")
            .addButton("返回上一级", "")

        let datas = ShapeOperation.getPkgs();
        let ids = Object.keys(datas);
        ids.forEach(pkgName => {
            form.addButton(`${datas[pkgName].name}\n${pkgName}`, "");
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == null) {
                return;
            }
            else if (i == 0) {
                new Menu(this.player, this.playerData).sendForm();
            }
            else {
                this.shapeForm(datas[ids[i - 1]], ids[i - 1]);
            }
        });
    }
}

module.exports = ShapeForm;