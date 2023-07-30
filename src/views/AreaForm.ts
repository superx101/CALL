import Players from "../common/Players";
import Pos3D from "../model/Pos3D";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
import Form from "./Form";
import Menu from "./Menu";

export default class AreaForm extends Form {
    constructor(form: Form) {
        super(form.player, form.playerData);
        return this;
    }

    private opt(opts: Array<number>) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.player, this.playerData).sendForm();
                break;
            case 1:
                Players.silenceCmd(this.player, `ca ar st ${Pos3D.fromPos(this.player.pos).calibration().floor().formatStr()}`);
                break;
            case 2:
                Players.silenceCmd(this.player, `ca ar en ${Pos3D.fromPos(this.player.pos).calibration().floor().formatStr()}`);
                break;
            case 3:
                Players.silenceCmd(this.player, "ca ar cl");
                break;
            case 4:
                Players.silenceCmd(this.player, `ca setting set {"areaTextShow":${this.settings.areaTextShow ? false : true}}`);
                break;
            case 5:
                Players.silenceCmd(this.player, `ca ar sh ${this.settings.displayArea ? "off" : "on"}`);
                break;
            default:
                break;
        }
    }

    public override sendForm(opts: Array<number>) {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.AreaForm.sendForm.s0"))
            .addButton(Tr._(this.player.langCode, "dynamic.AreaForm.sendForm.s1"), "")
            .addButton(Tr._(this.player.langCode, "dynamic.AreaForm.sendForm.s2"), "textures/ui/switch_bumper_left.png")
            .addButton(Tr._(this.player.langCode, "dynamic.AreaForm.sendForm.s3"), "textures/ui/switch_bumper_right.png")
            .addButton(Tr._(this.player.langCode, "dynamic.AreaForm.sendForm.s4"), "textures/ui/trash_default")
            .addButton(StrFactory.on_off(this.settings.areaTextShow, Tr._(this.player.langCode, "word.off"), Tr._(this.player.langCode, "word.on")) + Tr._(this.player.langCode, "dynamic.AreaForm.sendForm.s7"), StrFactory.choose(this.settings.areaTextShow, 'textures/ui/mute_on', 'textures/ui/mute_off'))
            .addButton(StrFactory.on_off(this.settings.displayArea, Tr._(this.player.langCode, "word.off"), Tr._(this.player.langCode, "word.on")) + Tr._(this.player.langCode, "dynamic.AreaForm.sendForm.s10"), StrFactory.choose(this.settings.displayArea, "textures/blocks/structure_void.png", "textures/ui/night_vision_effect.png"));

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