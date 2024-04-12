import Players from "../user/Players";
import AreaOperation from "../structure/AreaOperation";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
import Form from "./Form";
import Menu from "./Menu";

export default class SaveForm extends Form {
    constructor(form: Form) {
        super(form.caPlayer);
        return this;
    }

    public override sendForm(opts: Array<number>) {
        try {
            AreaOperation.hasArea(this.caPlayer);
        }
        catch (e) {
            this.player.sendText(StrFactory.cmdErr(Tr._(this.player.langCode, "dynamic.SaveForm.sendForm.s0")));
            return;
        }

        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.SaveForm.sendForm.s1"))
            .addInput(Tr._(this.player.langCode, "dynamic.SaveForm.sendForm.s2"), Tr._(this.player.langCode, "dynamic.SaveForm.sendForm.s3"))

        this.player.sendForm(form, (pl, data) => {
            if (data == null) {
                new Menu(this.caPlayer).sendForm();
                return;
            }
            Players.silenceCmd(this.caPlayer, `ca sa "${data[0]}"`);
        });
    }
}