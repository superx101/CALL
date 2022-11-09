const Form = require("./Form");

class OperationForm extends Form {
    constructor(form) {
        super(form.player, form.playerData, form.settings);
        return this;
    }

    opt(opts, itemA, itemB) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.player, this.playerData).sendForm();
                break;
            case 1:
                this.player.runcmd(`ca fi ${itemA.type} ${itemA.aux} nu`);
                break;
            case 2:
                this.player.runcmd(`ca fi ${itemA.type} ${itemA.aux} ho`);
                break;
            case 3:
                this.player.runcmd(`ca fi ${itemA.type} ${itemA.aux} ou`);
                break;
            case 4:
                this.player.runcmd("ca cl");
                break;
            case 5:
                this.player.runcmd(`ca re ${itemA.type} ${itemA.aux} ${itemB.type} ${itemB.aux}`);
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

    sendForm(opts = []) {
        try {
            AreaOperation.hasArea(this.playerData);
        }
        catch (e) {
            this.player.sendText(StrFactory.cmdErr("未选区, 无法操作"));
            return;
        }

        let con = this.player.getInventory();
        let ia = this.settings.barReplace;
        let ib = this.settings.barReplaced;
        let showA = ia + 1;
        let showB = ib + 1;
        let itemA = con.getItem(ia);
        let itemB = con.getItem(ib);
        if (itemA.isNull() || !itemA.isBlock) {
            itemA = { type: "minecraft:air", aux: 0 };
        }
        if (itemB.isNull() || !itemB.isBlock) {
            itemB = { type: "minecraft:air", aux: 0 };
        }
        let form = mc.newSimpleForm()
            .setTitle("选区操作")
            .setContent(`填充替换时自动选择物品栏第[${showA}][${showB}]格中方块\n[${showA}]:(种类: ${itemA.type} 特殊值: ${itemA.aux})\n[${showB}]:(种类: ${itemB.type} 特殊值: ${itemB.aux})`)
            .addButton(`返回上一级`, "")
            .addButton(`实心填充[${showA}]`, "")
            .addButton(`空心填充[${showA}]`, "")
            .addButton(`方体边界填充[${showA}]`, "")
            .addButton("清除", "")
            .addButton(`替换[${showA}]->[${showB}]`, "")
            .addButton("选区平移", "")
            .addButton("选区堆叠", "")
            .addButton("选区镜像", "")
            .addButton("选区旋转", "")

        if (opts.length > 0) {
            this.opt(opts, itemA, itemB);
        }
        else {
            this.player.sendForm(form, (pl, id) => {
                opts.push(id);
                this.opt(opts, itemA, itemB);
            });
        }
    }

    moveForm() {
        let plPos = new Pos3D(this.player.pos).calibration().floor();
        let form = mc.newCustomForm()
            .setTitle("平移")
            .addDropdown("选择平移方式", ["输入坐标", "输入偏移量"], 0)
            .addLabel("输入参数 (默认为当前坐标值)")
            .addInput("x y z", "整数(空格分割)", `${plPos.formatStr()}`)
        this.player.sendForm(form, (pl, data) => {
            if (data == null) return;
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
                    pos = new Area3D(this.settings.area).start;
                    x = x + pos.x;
                    y = y + pos.y;
                    z = z + pos.z;
                    break;
            }
            pl.runcmd(`ca mo ${x} ${y} ${z}`);
        });
    }

    stackForm() {
        let form = mc.newCustomForm()
            .setTitle("堆叠")
            .addLabel("输入堆叠次数, 负数则反向堆叠")
            .addInput("x y z", "正负整数(空格分割)", "0 0 0")
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
            pl.runcmd(`ca st ${x} ${y} ${z}`);
        });
    }

    mirrorForm() {
        let plPos = new Pos3D(this.player.pos).calibration().floor();
        let arr = ["x", "z", "xz"];
        let form = mc.newCustomForm()
            .setTitle("关于平面镜像")
            .addStepSlider("选择平面方向", arr, 0)
            .addLabel("输入平面坐标 (默认为当前坐标值)")
            .addInput("x", "整数", `${plPos.x}`)
            .addInput("z", "整数", `${plPos.z}`);
        this.player.sendForm(form, (pl, data) => {
            if (data == null) return;
            let x, y, z;
            try {
                x = parseInt(data[2]);
                y = 0
                z = parseInt(data[3]);
            }
            catch (e) { }
            pl.runcmd(`ca mi ${arr[data[0]]} ${x} ${y} ${z}`);
        });
    }

    roteForm() {
        let plPos = new Pos3D(this.player.pos).calibration().floor();
        let arr = ["90", "180", "270"];
        let form = mc.newCustomForm()
            .setTitle("绕点旋转")
            .addStepSlider("旋转角度(顺时针)", arr, 0)
            .addLabel("输入点坐标 (默认为当前坐标值)")
            .addInput("x", "整数", `${plPos.x}`)
            .addInput("z", "整数", `${plPos.z}`);
        this.player.sendForm(form, (pl, data) => {
            if (data == null) return;
            let x, y, z;
            try {
                x = parseInt(data[2]);
                y = 0
                z = parseInt(data[3]);
            }
            catch (e) { }
            pl.runcmd(`ca ro ${arr[data[0]]}_degrees ${x} ${y} ${z}`);
        });
    }
}

module.exports = OperationForm;