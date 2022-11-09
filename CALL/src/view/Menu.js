// const FillOperation = require("../operation/FillOperation");
// const PlayerData = require("../tool/PlayerData");
// const StrFactory = require("../tool/StrFactory");
const StructureOperation = require("../operation/StructureOperation")
const Form = require("./Form")
const AreaForm = require("./AreaForm")
const OperationForm = require("./OperationForm")
const PasteForm = require("./PasteForm")
const StructureForm = require("./StructureForm")
const ShapeForm = require("./ShapeForm")
const SettingForm = require("./SettingForm")
const TutorailForm = require("./TutorailForm")
const StructureManager = require("../basicfun/StructureManager")

class Menu extends Form {
    constructor(player, playerData, option) {
        super(player, playerData, playerData.settings);
        this.option = option;
    }

    sendForm(opts = []) {
        let undoSize = StructureOperation.getUndoSize(this.player.xuid);
        let redoSize = StructureOperation.getRedoSize(this.player.xuid);
        let canPaste = StructureOperation.canPaste(this.player.xuid);
        let form = mc.newSimpleForm()
            .setTitle("CALL快捷菜单")
            .addButton("选区", "")
            .addButton(StrFactory.formEnable(undoSize > 0, `撤销 (${undoSize})`), "")
            .addButton(StrFactory.formEnable(redoSize > 0, `恢复撤销 (${redoSize})`), "")
            .addButton("选区操作", "")
            .addButton("复制", "")
            .addButton(StrFactory.formEnable(canPaste, "粘贴", "粘贴"))
            .addButton("保存", "")
            .addButton("保存的结构", "")
            .addButton("生成形状", "")
            .addButton("设置", "")
            .addButton("基础教程", "")
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

    opt(opts) {
        switch (opts.shift()) {
            case 0:
                new AreaForm(this).sendForm(opts);
                break;
            case 1:
                this.player.runcmd("ca ud");
                break;
            case 2:
                this.player.runcmd("ca rd");
                break;
            case 3:
                new OperationForm(this).sendForm(opts);
                break;
            case 4:
                this.player.runcmd("ca co");
                break;
            case 5:
                this.player.runcmd("ca pa");
                break;
            case 6:
                new PasteForm(this).sendForm(opts);
                break;
            case 7:
                new StructureForm(this).sendForm(opts);
                break;
            case 8:
                new ShapeForm(this).sendForm(opts);
                break;
            case 9:
                new SettingForm(this).sendForm(opts);
                break;
            case 10:
                new TutorailForm(this).sendForm(opts);
                break;
            default:
                break;
        }
    }
}

module.exports = Menu