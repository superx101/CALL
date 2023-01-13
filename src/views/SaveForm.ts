import Players from "../common/Players";
import AreaOperation from "../operation/AreaOperation";
import StrFactory from "../util/StrFactory";
import Form from "./Form";
import Menu from "./Menu";

export default class SaveForm extends Form {
    constructor(form: Form) {
        super(form.player, form.playerData);
        return this;
    }

    public override sendForm(opts: Array<number>) {
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
            if (data == null) {
                new Menu(this.player, this.playerData).sendForm();
                return;
            }
            Players.silenceCmd(pl, `ca sa "${data[0]}"`);
        });
    }
}