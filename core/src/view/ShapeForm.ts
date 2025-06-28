import { ShapeService } from "../plugin/ShapeService";
import CAPlayer from "../user/CAPlayer";
import ShapeOperation from "../plugin/ShapeOperation";
import Tr from "../util/Translator";
import Form from "./Form";
import Menu from "./Menu";
import { PluginLoader } from "../plugin/PluginLoader";


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

        const list = ShapeService.getIdList()
        list.forEach(id => {
            const plugin = PluginLoader.pluginsMap.get(id)!;
            const info = plugin.getInfo(this.caPlayer.$.langCode);
            form.addButton(`${info.name} -- ${info.version}\n${info.introduction}`, info.icon);
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == null) {
                return;
            }
            else if (i == 0) {
                new Menu(this.caPlayer).sendForm();
            }
            else {
                const plugin = PluginLoader.pluginsMap.get(list[i - 1])!;
                plugin.onMenu(this.player)
            }
        });
    }
}