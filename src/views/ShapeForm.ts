import Players from "../common/Players";
import ShapeManager from "../manager/ShapeManager";
import PlayerData from "../model/PlayerData";
import ShapeOperation from "../operation/ShapeOperation";
import { data, pkgs } from "../type/Shape";
import Form from "./Form";
import Menu from "./Menu";


export default class ShapeForm extends Form {
    constructor(player: Player, playerData: PlayerData) {
        super(player, playerData);
        return this;
    }

    /** export */
    public static shapeForm(player: Player, pkgName: string) {
        let playerData = Players.getData(player.xuid);
        let data = ShapeOperation.getPkgs()[pkgName];
        let form = mc.newSimpleForm()
        .setTitle(`${data.name} ${pkgName}`)
        .setContent(data.introduction)
        .addButton("返回上一级", "")

        data.shapeNames.forEach((name: string, i: number)=>{
            form.addButton(name, data.shapeImages[i]);
        });

        player.sendForm(form, (pl, i) => {
            if (i == null) {
                return;
            }
            else if (i == 0) {
                new ShapeForm(player, playerData).sendForm([]);
            }
            else {
                ShapeOperation.sendForm(player, playerData, pkgName, i - 1);
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
            form.addButton(`${datas[pkgName].name.replace(/\n*/g, "")} -- ${datas[pkgName].version.toString()}\n${pkgName}`, datas[pkgName].icon);
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == null) {
                return;
            }
            else if (i == 0) {
                new Menu(this.player, this.playerData).sendForm();
            }
            else {
                ShapeForm.shapeForm(this.player, ids[i - 1]);
            }
        });
    }
}