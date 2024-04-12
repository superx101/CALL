import Players from "../user/Players";
import Area3 from "../common/Area3D";
import BlockType from "../common/BlockType";
import CAPlayer from "../user/CAPlayer";
import Pos3 from "../common/Pos3D";
import AreaOperation from "../structure/AreaOperation";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
import Form from "./Form";
import Menu from "./Menu";

export default class OperationForm extends Form {
    constructor(form: Form) {
        super(form.caPlayer);
    }

    private static MODE = {
        NULL: 0,
        HOLLOW: 1,
        OUTLINE: 2,
        CLEAR: 3,
        REPLACE: 4
    }

    private opt(opts: Array<number>) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.caPlayer).sendForm();
                break;
            case 1:
                this.fillForm(OperationForm.MODE.NULL);
                break;
            case 2:
                this.fillForm(OperationForm.MODE.HOLLOW);
                break;
            case 3:
                this.fillForm(OperationForm.MODE.OUTLINE);
                break;
            case 4:
                Players.silenceCmd(this.caPlayer, "ca cl");
                break;
            case 5:
                this.fillForm(OperationForm.MODE.REPLACE);
                break;
            case 6:
                this.moveForm();
                break;
            case 7:
                this.stackForm();
                break;
            case 8:
                this.mirrorForm();
                break;
            case 9:
                this.roteForm();
                break;
            default:
                break;
        }
    }

    public override sendForm(opts: Array<number> = []) {
        try {
            AreaOperation.hasArea(this.caPlayer);
        }
        catch (e) {
            this.player.sendText(StrFactory.cmdErr(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s0")));
            return;
        }

        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s1"))
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s2"), "")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s3"), "textures/ui/pocket_button_hover.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s4"), "textures/ui/selected_hotbar_slot.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s5"), "textures/ui/light.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s6"), "textures/blocks/structure_air.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s7"), "textures/ui/FriendsDiversity.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s8"), "textures/ui/move.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s9"), "textures/ui/dressing_room_skins.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s10"), "textures/ui/invisibility_effect.png")
            .addButton(Tr._(this.player.langCode, "dynamic.OperationForm.sendForm.s11"), "textures/ui/refresh_light.png")

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

    private fillForm(mode: number) {
        function run(caPlayer: CAPlayer, blockTypeA: BlockType, blockTypeB: BlockType) {
            switch (mode) {
                case OperationForm.MODE.NULL:
                    Players.silenceCmd(caPlayer, `ca fi ${blockTypeA.toFormatString()} nu`);
                    break;
                case OperationForm.MODE.HOLLOW:
                    Players.silenceCmd(caPlayer, `ca fi ${blockTypeA.toFormatString()} ho`);
                    break;
                case OperationForm.MODE.OUTLINE:
                    Players.silenceCmd(caPlayer, `ca fi ${blockTypeA.toFormatString()} ou`);
                    break;
                case OperationForm.MODE.REPLACE:
                    Players.silenceCmd(caPlayer, `ca re ${blockTypeA.toFormatString()} ${blockTypeB.toFormatString()}`);
                    break;
            }
        }

        //是否开启材质选择模式
        if (this.caPlayer.settings.textureSelectorMode) {
            //无选择默认为空气
            let typeA: string, statesA: string;
            let typeB: string, statesB: string;
            if(this.caPlayer.settings.texture.a != null) {
                typeA = this.caPlayer.settings.texture.a.type;
                statesA = this.caPlayer.settings.texture.a.states;
            }
            if(this.caPlayer.settings.texture.b != null) {
                typeB = this.caPlayer.settings.texture.b.type;
                statesB = this.caPlayer.settings.texture.b.states;
            }
            // 直接执行
            run(this.caPlayer, new BlockType(typeA, statesA), new BlockType(typeB, statesB));
        }
        else {
            let con = this.player.getInventory();
            let ia = this.settings.barReplace;
            let ib = this.settings.barReplaced;
            let showA = ia + 1;
            let showB = ib + 1;
            let blockTypeA = BlockType.generateFromItem(con.getItem(ia))
            let blockTypeB = BlockType.generateFromItem(con.getItem(ib))

            let form = mc.newCustomForm()
                .setTitle(Tr._(this.player.langCode, "dynamic.OperationForm.fillForm.s12"))
                .addInput(Tr._(this.player.langCode, "dynamic.OperationForm.fillForm.s13", showA), Tr._(this.player.langCode, "dynamic.OperationForm.fillForm.s14"), `${blockTypeA.toString()}`)
            if (mode == OperationForm.MODE.REPLACE) {
                form.addInput(Tr._(this.player.langCode, "dynamic.OperationForm.fillForm.s15", showB), Tr._(this.player.langCode, "dynamic.OperationForm.fillForm.s14"), `${blockTypeB.toString()}`)
            }
            this.player.sendForm(form, (pl, data) => {
                if (data == null) { this.sendForm(); return; }
                let blockA = data[0].split(" ");
                let blockB = ["air", ""];
                if (mode == OperationForm.MODE.REPLACE)
                    blockB = data[1].split(" ");

                run(this.caPlayer, new BlockType(blockA[0], blockA[1]), new BlockType(blockB[0] as string, blockB[1] as string));
            });
        }
    }

    private moveForm() {
        let plPos = Pos3.fromPos(this.player.pos).calibration().floor();
        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.OperationForm.moveForm.s17"))
            .addDropdown(Tr._(this.player.langCode, "dynamic.OperationForm.moveForm.s18"), [Tr._(this.player.langCode, "dynamic.OperationForm.moveForm.s19"), Tr._(this.player.langCode, "dynamic.OperationForm.moveForm.s20")], 0)
            .addLabel(Tr._(this.player.langCode, "dynamic.OperationForm.moveForm.s21"))
            .addInput("x y z", Tr._(this.player.langCode, "dynamic.OperationForm.moveForm.s22"), `${plPos.formatStr()}`)
        this.player.sendForm(form, (pl, data) => {
            if (data == null) { this.sendForm(); return; }
            let x, y, z;
            try {
                let arr = data[2].split(" ");
                x = parseInt(arr[0]);
                y = parseInt(arr[1]);
                z = parseInt(arr[2]);
            }
            catch (e) { }
            let pos;
            switch (data[0]) {
                case 0:
                    break;
                case 1:
                    pos = Area3.fromArea3D(this.settings.area).start;
                    x = x + pos.x;
                    y = y + pos.y;
                    z = z + pos.z;
                    break;
            }
            Players.silenceCmd(this.caPlayer, `ca mo ${x} ${y} ${z}`);
        });
    }

    private stackForm() {
        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.OperationForm.stackForm.s23"))
            .addLabel(Tr._(this.player.langCode, "dynamic.OperationForm.stackForm.s24"))
            .addInput("x y z", Tr._(this.player.langCode, "dynamic.OperationForm.stackForm.s25"), "0 0 0")
        this.player.sendForm(form, (pl, data) => {
            if (data == null) { this.sendForm(); return; }
            let x, y, z;
            try {
                let arr = data[1].split(" ");
                x = parseInt(arr[0]);
                y = parseInt(arr[1]);
                z = parseInt(arr[2]);
            }
            catch (e) { }
            Players.silenceCmd(this.caPlayer, `ca st ${x} ${y} ${z}`);
        });
    }

    private mirrorForm() {
        let plPos = Pos3.fromPos(this.player.pos).calibration().floor();
        let arr = ["x", "z", "xz"];
        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.OperationForm.mirrorForm.s26"))
            .addStepSlider(Tr._(this.player.langCode, "dynamic.OperationForm.mirrorForm.s27"), arr, 0)
            .addLabel(Tr._(this.player.langCode, "dynamic.OperationForm.mirrorForm.s28"))
            .addInput("x", Tr._(this.player.langCode, "dynamic.OperationForm.mirrorForm.s29"), `${plPos.x}`)
            .addInput("z", Tr._(this.player.langCode, "dynamic.OperationForm.mirrorForm.s29"), `${plPos.z}`);
        this.player.sendForm(form, (pl, data) => {
            if (data == null) { this.sendForm(); return; }
            let x, y, z;
            try {
                x = parseInt(data[2]);
                y = 0
                z = parseInt(data[3]);
            }
            catch (e) { }
            Players.silenceCmd(this.caPlayer, `ca mi ${arr[data[0]]} ${x} ${y} ${z}`);
        });
    }

    private roteForm() {
        let plPos = Pos3.fromPos(this.player.pos).calibration().floor();
        let arr = ["90", "180", "270"];
        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.OperationForm.roteForm.s31"))
            .addStepSlider(Tr._(this.player.langCode, "dynamic.OperationForm.roteForm.s32"), arr, 0)
            .addLabel(Tr._(this.player.langCode, "dynamic.OperationForm.roteForm.s33"))
            .addInput("x", Tr._(this.player.langCode, "dynamic.OperationForm.mirrorForm.s29"), `${plPos.x}`)
            .addInput("z", Tr._(this.player.langCode, "dynamic.OperationForm.mirrorForm.s29"), `${plPos.z}`);
        this.player.sendForm(form, (pl, data) => {
            if (data == null) { this.sendForm(); return; }
            let x, y, z;
            try {
                x = parseInt(data[2]);
                y = 0
                z = parseInt(data[3]);
            }
            catch (e) { }
            Players.silenceCmd(this.caPlayer, `ca ro ${arr[data[0]]}_degrees ${x} ${y} ${z}`);
        });
    }
}