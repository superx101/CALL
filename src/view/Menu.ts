import Config from "../common/Config";
import Players from "../user/Players";
import CAPlayer from "../user/CAPlayer";
import StructureOperation from "../structure/StructureOperation";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
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
    constructor(public caPlayer: CAPlayer) {
        super(caPlayer);
    }

    public override sendForm(opts: Array<number> = []) {
        let undoSize = StructureOperation.getUndoSize(this.player.xuid);
        let redoSize = StructureOperation.getRedoSize(this.player.xuid);
        let canPaste = StructureOperation.canPaste(this.player.xuid);
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s0", Config.PLUGIN_VERSION.toString()))
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s1"), "textures/gui/newgui/buttons/new_checkbox/spaceHover.png")
            .addButton(StrFactory.formEnable(undoSize > 0, Tr._(this.player.langCode, "dynamic.Menu.sendForm.s2", undoSize)), "textures/ui/arrow_dark_left_stretch.png")
            .addButton(StrFactory.formEnable(redoSize > 0, Tr._(this.player.langCode, "dynamic.Menu.sendForm.s3", redoSize)), "textures/ui/arrow.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s4"), "textures/items/iron_pickaxe.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s5"), "textures/ui/copy.png")
            .addButton(StrFactory.formEnable(canPaste, Tr._(this.player.langCode, "dynamic.Menu.sendForm.s6")), "textures/ui/paste.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s7"), "textures/ui/download_backup.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s8"), "textures/ui/structure_block.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s9"), "textures/ui/worldsIcon.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s10"), "textures/ui/book_edit_default.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s11"), "textures/ui/refresh.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s12"), "textures/ui/settings_glyph_color_2x.png")
            .addButton(Tr._(this.player.langCode, "dynamic.Menu.sendForm.s13"), "textures/ui/sidebar_icons/my_content.png")

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
                Players.silenceCmd(this.caPlayer, "call undo");
                break;
            case 2:
                Players.silenceCmd(this.caPlayer, "call redo");
                break;
            case 3:
                new OperationForm(this).sendForm(opts);
                break;
            case 4:
                Players.silenceCmd(this.caPlayer, "call copy");
                break;
            case 5:
                Players.silenceCmd(this.caPlayer, "call paste");
                break;
            case 6:
                new SaveForm(this).sendForm(opts);
                break;
            case 7:
                new StructureForm(this).sendForm(opts);
                break;
            case 8:
                new ShapeForm(this.caPlayer).sendForm(opts);
                break;
            case 9:
                new BlockEditerForm(this.caPlayer).sendForm(opts);
                break;
            case 10:
                Players.silenceCmd(this.caPlayer, "ca refresh");
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