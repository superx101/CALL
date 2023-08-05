import Players from "../common/Players";
import Pos3D from "../model/Pos3D";
import StructureOperation from "../operation/StructureOperation";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
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
        super(form.caPlayer);
        return this;
    }

    private opt(opts: Array<number>) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.caPlayer).sendForm();
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
            .setTitle(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s0"))
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s1"), "")
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s2"), "textures/ui/backup_noline.png")
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s3"), "textures/ui/icon_steve")

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

    private loadOpertionForm(stData: Data, callBack: ()=> void) {
        let plPos = Pos3D.fromPos(this.player.pos).calibration().floor();
        let degreeArr = ["0", "90", "180", "270"];
        let mirrorArr = [Tr._(this.player.langCode, "dynamic.StructureForm.loadOpertionForm.s4"), "x", "z", "xz"];
        let mirrorArr_select = ["none", "x", "z", "xz"];
        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.StructureForm.loadOpertionForm.s5", stData.name, data.xuid2name(stData.author)))
            .addLabel(Tr._(this.player.langCode, "dynamic.StructureForm.loadOpertionForm.s6"))
            .addInput("x y z", Tr._(this.player.langCode, "dynamic.StructureForm.loadOpertionForm.s7"), `${plPos.formatStr()}`)
            .addStepSlider(Tr._(this.player.langCode, "dynamic.StructureForm.loadOpertionForm.s8"), degreeArr, 0)
            .addStepSlider(Tr._(this.player.langCode, "dynamic.StructureForm.loadOpertionForm.s9"), mirrorArr, 0)
            .addLabel(Tr._(this.player.langCode, "dynamic.StructureForm.loadOpertionForm.s10"))

        this.player.sendForm(form, (pl, data) => {
            if (data == null) {callBack(); return ;}
            let x, y, z;
            try {
                let arr = data[1].split(" ");
                x = parseInt(arr[0]);
                y = parseInt(arr[1]);
                z = parseInt(arr[2]);
            }
            catch (e) { }
            Players.silenceCmd(this.caPlayer, `ca lo ${stData.id} ${x} ${y} ${z} ${degreeArr[data[2]]}_degrees ${mirrorArr_select[data[3]]}`);
        });
    }

    private publicForm() {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s2"))
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s1"))

        let list = StructureOperation.getSaveList(1, this.caPlayer) as Array<Data>;
        //倒序加入
        for (let i = list.length - 1; i >= 0; i--) {
            form.addButton(Tr._(this.player.langCode, "dynamic.StructureForm.publicForm.s13", list[i].name, data.xuid2name(list[i].author), list[i].id));
        }

        this.player.sendForm(form, (pl, i) => {
            if (i == 0) {
                this.sendForm();
            }
            else if (i != null) {
                //倒序访问
                this.loadOpertionForm(list[list.length - i], ()=>{this.publicForm()});
            }
        });
    }

    private my_structureForm(data: Data) {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.StructureForm.my_structureForm.s14", data.name))
            .setContent(`id: ${data.id}`)
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s1"), "")
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.my_structureForm.s16"))
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.my_structureForm.s17"))
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.my_structureForm.s18", StrFactory.on_off(data.isPublic, Tr._(this.player.langCode, 'word.unpublic'), Tr._(this.player.langCode,'word.public'))));

        this.player.sendForm(form, (pl, i) => {
            switch (i) {
                case 0:
                    this.myForm();
                    break;
                case 1:
                    this.loadOpertionForm(data, ()=>{this.my_structureForm(data)});
                    break;
                case 2:
                    Players.silenceCmd(this.caPlayer, `ca de ${data.id}`);
                    break;
                case 3:
                    if (data.isPublic) {
                        Players.silenceCmd(this.caPlayer, `ca pr ${data.id}`);
                    }
                    else {
                        Players.silenceCmd(this.caPlayer, `ca pu ${data.id}`);
                    }
                    break;
                default:
                    break;
            }
        });
    }

    private myForm() {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s3"))
            .addButton(Tr._(this.player.langCode, "dynamic.StructureForm.sendForm.s1"))

        let list = StructureOperation.getSaveList(0, this.caPlayer) as Array<Data>;
        //倒序加入
        for (let i = list.length - 1; i >= 0; i--) {
            form.addButton(`${list[i].name}\nid: ${list[i].id}`);
        }

        this.player.sendForm(form, (pl, i) => {
            if (i == 0) {
                this.sendForm();
            }
            else if (i != null) {
                //倒序访问
                this.my_structureForm(list[list.length - i]);
            }
        });
    }
}