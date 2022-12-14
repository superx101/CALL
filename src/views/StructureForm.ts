import Players from "../common/Players";
import Pos3D from "../model/Pos3D";
import StructureOperation from "../operation/StructureOperation";
import StrFactory from "../util/StrFactory";
import Form from "./Form";
import Menu from "./Menu";

interface Data {
    name: string
    author: string
    id: string
    isPublic?: boolean
}

export default class StructureForm extends Form {
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
                this.publicForm();
                break;
            case 2:
                this.myForm();
                break;
            default:
                break;
        }
    }

    public override sendForm(opts: Array<number> = []) {
        let form = mc.newSimpleForm()
            .setTitle("保存的结构")
            .addButton("返回上一级", "")
            .addButton("公开的结构", "textures/ui/backup_noline.png")
            .addButton("我的结构", "textures/ui/icon_steve")

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

    private loadOpertionForm(stData: Data) {
        let plPos = Pos3D.fromPos(this.player.pos).calibration().floor();
        let degreeArr = ["0", "90", "180", "270"];
        let mirrorArr = ["无", "x", "z", "xz"];
        let mirrorArr_select = ["none", "x", "z", "xz"];
        let form = mc.newCustomForm()
            .setTitle(`加载结构 ${stData.name} (${data.xuid2name(stData.author)})`)
            .addLabel("输入坐标 (默认为当前坐标值)")
            .addInput("x y z", "整数(空格分割)", `${plPos.formatStr()}`)
            .addStepSlider("旋转角度(顺时针)", degreeArr, 0)
            .addStepSlider("镜像", mirrorArr, 0)
            .addLabel("注：镜像旋转同时存在时，先镜像再旋转")

        this.player.sendForm(form, (pl, data) => {
            if (data == null) return;
            let x, y, z;
            try {
                let arr = data[1].split(" ");
                x = parseInt(arr[0]);
                y = parseInt(arr[1]);
                z = parseInt(arr[2]);
            }
            catch (e) { }
            Players.silenceCmd(pl, `ca lo ${stData.id} ${x} ${y} ${z} ${degreeArr[data[2]]}_degrees ${mirrorArr_select[data[3]]}`);
        });
    }

    private publicForm() {
        let form = mc.newSimpleForm()
            .setTitle("公开的结构")
            .addButton("返回上一级")

        let list = StructureOperation.getSaveList(1, this.player);
        list.forEach((d: Data) => {
            form.addButton(`名称: ${d.name} 作者: ${data.xuid2name(d.author)}\nid: ${d.id}`);
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == 0) {
                this.sendForm();
            }
            else if (i != null) {
                this.loadOpertionForm(list[i - 1]);
            }
        });
    }

    private my_structureForm(data: Data) {
        let form = mc.newSimpleForm()
            .setTitle(`结构: ${data.name}`)
            .setContent(`id: ${data.id}`)
            .addButton("返回上一级", "")
            .addButton("加载结构")
            .addButton("删除结构")
            .addButton(`${StrFactory.on_off(data.isPublic, '不公开', '公开')}此结构`);

        this.player.sendForm(form, (pl, i) => {
            switch (i) {
                case 0:
                    this.myForm();
                    break;
                case 1:
                    this.loadOpertionForm(data);
                    break;
                case 2:
                    Players.silenceCmd(pl, `ca de ${data.id}`);
                    break;
                case 3:
                    if (data.isPublic) {
                        Players.silenceCmd(pl, `ca pr ${data.id}`);
                    }
                    else {
                        Players.silenceCmd(pl, `ca pu ${data.id}`);
                    }
                    break;
                default:
                    break;
            }
        });
    }

    private myForm() {
        let form = mc.newSimpleForm()
            .setTitle("我的结构")
            .addButton("返回上一级")

        let list = StructureOperation.getSaveList(0, this.player);
        list.forEach((data: Data) => {
            form.addButton(`${data.name}\nid: ${data.id}`);
        });

        this.player.sendForm(form, (pl, i) => {
            if (i == 0) {
                this.sendForm();
            }
            else if (i != null) {
                this.my_structureForm(list[i - 1]);
            }
        });
    }
}