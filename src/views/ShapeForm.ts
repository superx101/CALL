import ShapeManager from "../manager/ShapeManager";
import CAPlayer from "../model/CAPlayer";
import ShapeOperation from "../operation/ShapeOperation";
import Tr from "../util/Translator";
import Form from "./Form";
import Menu from "./Menu";


export default class ShapeForm extends Form {
    constructor(caPlayer: CAPlayer) {
        super(caPlayer);
        return this;
    }

    public override sendForm(opts: Array<number>) {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.ShapeForm.sendForm.s1"))
            .setContent(Tr._(this.player.langCode, "dynamic.ShapeForm.sendForm.s2"))
            .addButton(Tr._(this.player.langCode, "dynamic.ShapeForm.shapeForm.s0"), "")

        let datas = ShapeOperation.getPkgs();
        let ids = Object.keys(datas);
        ids.forEach(pkgName => {
            let text = ShapeManager.getInfo(pkgName, this.caPlayer).name;
            form.addButton(`${text.replace(/\n*/g, "")} -- ${datas[pkgName].version.toString()}\n${pkgName}`, datas[pkgName].icon);
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == null) {
                return;
            }
            else if (i == 0) {
                new Menu(this.caPlayer).sendForm();
            }
            else {
                ShapeManager.form(this.caPlayer, ids[i - 1]);
            }
        });
    }
}