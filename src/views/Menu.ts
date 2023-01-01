import PlayerData from "../model/PlayerData";
import StructureOperation from "../operation/StructureOperation";
import StrFactory from "../util/StrFactory";
import AreaForm from "./AreaForm";
import BlockEditerForm from "./BlockEditerForm";
import Form from "./Form";
import OperationForm from "./OperationForm";
import SaveForm from "./SaveForm";
import SettingForm from "./SettingForm";
import ShapeForm from "./ShapeForm";
import StructureForm from "./StructureForm";
import TutorailForm from "./TutorailForm";


export default class Menu extends Form {
    constructor(public player: Player, public playerData: PlayerData) {
        super(player, playerData);
    }

    public override sendForm(opts: Array<number> = []) {
        let undoSize = StructureOperation.getUndoSize(this.player.xuid);
        let redoSize = StructureOperation.getRedoSize(this.player.xuid);
        let canPaste = StructureOperation.canPaste(this.player.xuid);
        let form = mc.newSimpleForm()
            .setTitle("CALL快捷菜单")
            .addButton("选区", "textures/gui/newgui/buttons/new_checkbox/spaceHover.png")
            .addButton(StrFactory.formEnable(undoSize > 0, `撤销 (${undoSize})`), "textures/ui/arrow_dark_left_stretch.png")
            .addButton(StrFactory.formEnable(redoSize > 0, `恢复撤销 (${redoSize})`), "textures/ui/arrow.png")
            .addButton("选区操作", "textures/items/iron_pickaxe.png")
            .addButton("复制", "textures/ui/copy.png")
            .addButton(StrFactory.formEnable(canPaste, "粘贴"), "textures/ui/paste.png")
            .addButton("保存", "textures/ui/download_backup.png")
            .addButton("保存的结构", "textures/ui/structure_block.png")
            .addButton("生成形状", "textures/ui/worldsIcon.png")
            .addButton("方块属性编辑", "textures/ui/book_edit_default.png")
            .addButton("刷新区块", "textures/ui/refresh.png")
            .addButton("设置", "textures/ui/settings_glyph_color_2x.png")
            .addButton("基础教程", "textures/ui/sidebar_icons/my_content.png")

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

    private opt(opts: Array<number>) {
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
                new SaveForm(this).sendForm(opts);
                break;
            case 7:
                new StructureForm(this).sendForm(opts);
                break;
            case 8:
                new ShapeForm(this.player, this.playerData).sendForm(opts);
                break;
            case 9:
                new BlockEditerForm(this.player, this.playerData).sendForm(opts);
                break;
            case 10:
                this.player.runcmd("ca rf");
                break;
            case 11:
                new SettingForm(this).sendForm(opts);
                break;
            case 12:
                new TutorailForm(this).sendForm();
                break;
            default:
                break;
        }
    }
}