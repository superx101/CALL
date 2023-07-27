import Players from "../common/Players";
import Area3D from "../model/Area3D";
import BlockType from "../model/BlockType";
import Pos3D from "../model/Pos3D";
import AreaOperation from "../operation/AreaOperation";
import StrFactory from "../util/StrFactory";
import Form from "./Form";
import Menu from "./Menu";

export default class OperationForm extends Form {
    constructor(form: Form) {
        super(form.player, form.playerData);
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
                new Menu(this.player, this.playerData).sendForm();
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
                Players.silenceCmd(this.player, "ca cl");
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
            AreaOperation.hasArea(this.playerData);
        }
        catch (e) {
            this.player.sendText(StrFactory.cmdErr("未选区, 无法操作"));
            return;
        }

        let form = mc.newSimpleForm()
            .setTitle("选区操作")
            .addButton(`返回上一级`, "")
            .addButton(`实心填充`, "textures/ui/pocket_button_hover.png")
            .addButton(`空心填充`, "textures/ui/selected_hotbar_slot.png")
            .addButton(`方体边界填充`, "textures/ui/light.png")
            .addButton("清除", "textures/blocks/structure_air.png")
            .addButton(`替换`, "textures/ui/FriendsDiversity.png")
            .addButton("选区平移", "textures/ui/move.png")
            .addButton("选区堆叠", "textures/ui/dressing_room_skins.png")
            .addButton("选区镜像", "textures/ui/invisibility_effect.png")
            .addButton("选区旋转", "textures/ui/refresh_light.png")

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
        const player = this.player;

        function run(blockTypeA: BlockType, blockTypeB: BlockType) {
            switch (mode) {
                case OperationForm.MODE.NULL:
                    Players.silenceCmd(player, `ca fi ${blockTypeA.toFormatString()} nu`);
                    break;
                case OperationForm.MODE.HOLLOW:
                    Players.silenceCmd(player, `ca fi ${blockTypeA.toFormatString()} ho`);
                    break;
                case OperationForm.MODE.OUTLINE:
                    Players.silenceCmd(player, `ca fi ${blockTypeA.toFormatString()} ou`);
                    break;
                case OperationForm.MODE.REPLACE:
                    Players.silenceCmd(player, `ca re ${blockTypeA.toFormatString()} ${blockTypeB.toFormatString()}`);
                    break;
            }
        }

        //是否开启材质选择模式
        if (this.playerData.settings.textureSelectorMode) {
            //无选择默认为空气
            let typeA: string, statesA: string;
            let typeB: string, statesB: string;
            if(this.playerData.settings.texture.a != null) {
                typeA = this.playerData.settings.texture.a.type;
                statesA = this.playerData.settings.texture.a.states;
            }
            if(this.playerData.settings.texture.b != null) {
                typeB = this.playerData.settings.texture.b.type;
                statesB = this.playerData.settings.texture.b.states;
            }
            // 直接执行
            run(new BlockType(typeA, statesA), new BlockType(typeB, statesB));
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
                .setTitle("方块材质")
                .addInput(`方块材质与状态值\n  默认从物品栏第[${showA}]号选择方块`, "空格分割", `${blockTypeA.toString()}`)
            if (mode == OperationForm.MODE.REPLACE) {
                form.addInput(`被替换方块材质与状态值\n  默认从物品栏第[${showB}]号选择方块`, "空格分割", `${blockTypeB.toString()}`)
            }
            this.player.sendForm(form, (pl, data) => {
                if (data == null) { this.sendForm(); return; }
                let blockA = data[0].split(" ");
                let blockB = ["air", ""];
                if (mode == OperationForm.MODE.REPLACE)
                    blockB = data[1].split(" ");

                run(new BlockType(blockA[0], blockA[1]), new BlockType(blockB[0] as string, blockB[1] as string));
            });
        }
    }

    private moveForm() {
        let plPos = Pos3D.fromPos(this.player.pos).calibration().floor();
        let form = mc.newCustomForm()
            .setTitle("平移")
            .addDropdown("选择平移方式", ["输入坐标", "输入偏移量"], 0)
            .addLabel("输入参数 (默认为当前坐标值)")
            .addInput("x y z", "整数(空格分割)", `${plPos.formatStr()}`)
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
                    pos = Area3D.fromArea3D(this.settings.area).start;
                    x = x + pos.x;
                    y = y + pos.y;
                    z = z + pos.z;
                    break;
            }
            Players.silenceCmd(pl, `ca mo ${x} ${y} ${z}`);
        });
    }

    private stackForm() {
        let form = mc.newCustomForm()
            .setTitle("堆叠")
            .addLabel("输入堆叠次数, 负数则反向堆叠")
            .addInput("x y z", "正负整数(空格分割)", "0 0 0")
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
            Players.silenceCmd(pl, `ca st ${x} ${y} ${z}`);
        });
    }

    private mirrorForm() {
        let plPos = Pos3D.fromPos(this.player.pos).calibration().floor();
        let arr = ["x", "z", "xz"];
        let form = mc.newCustomForm()
            .setTitle("关于平面镜像")
            .addStepSlider("选择平面方向", arr, 0)
            .addLabel("输入平面坐标 (默认为当前坐标值)")
            .addInput("x", "整数", `${plPos.x}`)
            .addInput("z", "整数", `${plPos.z}`);
        this.player.sendForm(form, (pl, data) => {
            if (data == null) { this.sendForm(); return; }
            let x, y, z;
            try {
                x = parseInt(data[2]);
                y = 0
                z = parseInt(data[3]);
            }
            catch (e) { }
            Players.silenceCmd(pl, `ca mi ${arr[data[0]]} ${x} ${y} ${z}`);
        });
    }

    private roteForm() {
        let plPos = Pos3D.fromPos(this.player.pos).calibration().floor();
        let arr = ["90", "180", "270"];
        let form = mc.newCustomForm()
            .setTitle("绕点旋转")
            .addStepSlider("旋转角度(顺时针)", arr, 0)
            .addLabel("输入旋转轴轴点坐标 (默认为当前坐标值)")
            .addInput("x", "整数", `${plPos.x}`)
            .addInput("z", "整数", `${plPos.z}`);
        this.player.sendForm(form, (pl, data) => {
            if (data == null) { this.sendForm(); return; }
            let x, y, z;
            try {
                x = parseInt(data[2]);
                y = 0
                z = parseInt(data[3]);
            }
            catch (e) { }
            Players.silenceCmd(pl, `ca ro ${arr[data[0]]}_degrees ${x} ${y} ${z}`);
        });
    }
}