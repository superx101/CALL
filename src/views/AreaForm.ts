import Pos3D from "../model/Pos3D";
import StrFactory from "../util/StrFactory";
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
                this.player.runcmd(`ca ar st ${Pos3D.fromPos(this.player.pos).calibration().floor().formatStr()}`);
                break;
            case 2:
                this.player.runcmd(`ca ar en ${Pos3D.fromPos(this.player.pos).calibration().floor().formatStr()}`);
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

    public override sendForm(opts: Array<number>) {
        let form = mc.newSimpleForm()
            .setTitle("选区")
            .addButton("返回上一级", "")
            .addButton("设置点A为当前坐标", "textures/ui/switch_bumper_left.png")
            .addButton("设置点B为当前坐标", "textures/ui/switch_bumper_right.png")
            .addButton("清除选区", "textures/ui/trash_default")
            .addButton(StrFactory.on_off(this.settings.areaTextShow, '关闭', '开启') + "选区文字提示", StrFactory.choose(this.settings.areaTextShow, 'textures/ui/mute_on', 'textures/ui/mute_off'))
            .addButton(StrFactory.on_off(this.settings.displayArea, '关闭', '开启') + "选区显示", StrFactory.choose(this.settings.displayArea, "textures/blocks/structure_void.png", "textures/ui/night_vision_effect.png"));

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