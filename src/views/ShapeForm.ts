import ShapeOperation from "../operation/ShapeOperation";
import { data, pkgs } from "../type/Shape";
import Form from "./Form";
import Menu from "./Menu";


export default class ShapeForm extends Form {
    constructor(form: Form) {
        super(form.player, form.playerData);
        return this;
    }

    private shapeForm(data: data, pkgName: string) {
        let form = mc.newSimpleForm()
        .setTitle(`${data.name} ${pkgName}`)
        .setContent(data.introduction)
        .addButton("返回上一级", "")

        data.shapeNames.forEach((name: string, i: number)=>{
            form.addButton(name, data.shapeImages[i]);
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == null) {
                return;
            }
            else if (i == 0) {
                this.sendForm([]);
            }
            else {
                ShapeOperation.sendForm(this.player, this.playerData, pkgName, i - 1);
            }
        });
    }

    public override sendForm(opts: Array<number>) {
        let form = mc.newSimpleForm()
            .setTitle("生成形状")
            .setContent("选择形状包")
            .addButton("返回上一级", "")

        let datas = ShapeOperation.getPkgs();
        let ids = Object.keys(datas);
        ids.forEach(pkgName => {
            form.addButton(`${datas[pkgName].name}\n${pkgName}`, datas[pkgName].icon);
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