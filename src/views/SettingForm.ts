import Config from "../common/Config";
import Players from "../common/Players";
import ToolOperation from "../operation/ToolOperation";
import { ToolType } from "../type/Tool";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
import Form from "./Form";
import Menu from "./Menu";

export default class SettingForm extends Form {
    constructor(form: Form) {
        super(form.caPlayer);
        return this;
    }

    private deleteHotkey(itemType: string, type: ToolType, name: string) {
        Players.silenceCmd(this.caPlayer, `ca to un ${itemType} ${type} "${name}"`);
    }

    private updateHotkey(preArr: any[], itemType: string, type: ToolType, name: string, describe: string, cmds: string) {
        this.deleteHotkey(preArr[0], type, preArr[1]);
        this.addHotkey(itemType, type, name, describe, cmds);
    }

    private addHotkey(itemType: string, type: ToolType, name: string = "", describe: string, cmds: string) {
        Players.silenceCmd(this.caPlayer, `ca to bi ${itemType} ${type} "${cmds}" "${describe}" "${name}"`);
    }

    private getItem(itemType: string, name: string, describe: string) {
        let item = mc.newItem(itemType, 1);
        item.setDisplayName(name + "\n" + describe);
        mc.spawnItem(item, this.player.pos);
    }

    private hotkeyForm(v: any[], mod: number, type: ToolType) {
        let arr;
        if (mod == 0) {
            arr = [Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s0")];
        }
        else {
            arr = [Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s1"), Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s2"), Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s3")];
        }
        let cmdstr = "";
        (v[3] == null ? [] : v[3]).forEach((v1: any) => {
            cmdstr += v1 + ";";
        });
        if (cmdstr.length > 0) {
            cmdstr = cmdstr.slice(0, -1);
        }

        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s4", type))
            .addDropdown(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s5"), arr, 0)
            .addLabel(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s45"))
            .addInput(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s6"), Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s7"), v[0] == null ? "" : v[0])
            .addInput(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s8"), Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s9"), v[1] == null ? "" : v[1])
            .addInput(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s10"), Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s11"), v[2] == null ? "" : v[2])
            .addInput(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s12"), Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s13"), cmdstr)

        this.player.sendForm(form, (pl, data) => {
            if (data == null) {
                this.hotkeyListForm(type);
                return;
            }
            if (mod == 0) {
                this.addHotkey(data[2], type, data[3], data[4], data[5]);
            }
            else {
                switch (data[0]) {
                    case 0:
                        this.updateHotkey(v, data[2], type, data[3], data[4], data[5]);
                        break;
                    case 1:
                        this.deleteHotkey(data[2], type, data[3]);
                        break;
                    case 2:
                        this.getItem(data[2], data[3], data[4]);
                        break;
                }
            }
        });
    }

    private hotkeyListForm(type: ToolType) {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s4", type))
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyListForm.s15"), "")
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyForm.s0"), "textures/ui/color_plus.png")
        let list = ToolOperation.getLinearList(this.caPlayer, type);
        list.forEach((v: any) => {
            const type = v[0].replace("minecraft:", "");
            form.addButton(
                Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyListForm.s17", StrFactory.item_t(this.player.langCode, type), StrFactory.color(Format.Black, v[0]), StrFactory.color(Format.DarkGreen, v[1]), StrFactory.color(Format.DarkPurple, v[2])),
                Config.ITEM_ICONS.has(type) ? `textures/items/${type}` : Config.get(Config.ITEM_TEXTURES, type, "")
            );
        });

        this.player.sendForm(form, (pl, id) => {
            switch (id) {
                case undefined:
                    break;
                case 0:
                    this.hotkeyKindForm();
                    break;
                case 1:
                    this.hotkeyForm([], 0, type);
                    break;
                default:
                    this.hotkeyForm(list[id - 2], 1, type);
                    break;
            }
        });
    }

    private hotkeyKindForm() {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s18"))
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyListForm.s15"), "")
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s20"), "textures/ui/switch_home_button.png")
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s21"), "textures/ui/xbox_start_button.png")
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s22"), "textures/ui/generic_right_trigger.png")
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s23"), "textures/ui/generic_left_trigger.png")

        this.player.sendForm(form, (pl, id) => {
            switch (id) {
                case 0:
                    this.sendForm();
                    break;
                case 1:
                    let form2 = mc.newSimpleForm()
                        .setTitle(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s20"))
                        .setContent(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s25"))
                        .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s26"), "textures/ui/check.png")
                        .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyKindForm.s27"), "textures/ui/cancel.png")
                    this.player.sendForm(form2, (pl, id) => {
                        switch (id) {
                            case 0:
                                ToolOperation.restoreDefaults(this.caPlayer);
                                break;
                            case 1:
                            default:
                                break;
                        }
                        this.hotkeyKindForm();
                    });
                    break;
                case 2:
                    let list: { [x: string]: any[] } = {
                        left: ToolOperation.getLinearList(this.caPlayer, ToolType.LEFT),
                        right: ToolOperation.getLinearList(this.caPlayer, ToolType.RIGHT)
                    }
                    for (let key of Object.keys(list)) {
                        const arr = list[key];
                        arr.forEach((v: any) => {
                            this.getItem(v[0], v[1], v[2]);
                        });
                    }
                    break;
                case 3:
                    this.hotkeyListForm(ToolType.RIGHT);
                    break;
                case 4:
                    this.hotkeyListForm(ToolType.LEFT);
                    break;
                default:
                    break;
            }
        })
    }

    private otherSettingForm() {
        let barArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let barArr_select = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let setArr: any = [
            ["barReplace", this.settings.barReplace, barArr_select],
            ["barReplaced", this.settings.barReplaced, barArr_select],
            ["loadChuckTip", this.settings.loadChuckTip],
            ["displayProgressBar", this.settings.displayProgressBar],
            ["saveArea", this.settings.saveArea],
            ["saveUndo", this.settings.saveUndo],
            ["saveCopy", this.settings.saveCopy],
            ["saveEntity", this.settings.saveEntity],
            ["textureSelectorMode", this.settings.textureSelectorMode],
            ["refreshChunk", this.settings.refreshChunk]
        ];
        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s28"))
            .addStepSlider(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s29"), barArr, setArr[0][1])
            .addStepSlider(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s30"), barArr, setArr[1][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s31"), setArr[2][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s32"), setArr[3][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s33"), setArr[4][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s34"), setArr[5][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s35"), setArr[6][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s36"), setArr[7][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s37"), setArr[8][1])
            .addSwitch(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s39"), setArr[9][1])

        this.player.sendForm(form, (pl, data) => {
            if (data == null) {
                this.sendForm();
                return;
            }
            if (data[0] == data[1]) {
                pl.sendText(StrFactory.cmdErr(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s38")));
                return;
            }
            let json: any = {};
            data.forEach((v, i) => {
                //比较修改过的值
                if (v !== setArr[i][1]) {
                    if (typeof (v) == "number") {
                        v = setArr[i][2][v];
                    }
                    json[setArr[i][0]] = v;
                }
            });
            if (Object.keys(json).length > 0) {
                Players.silenceCmd(this.caPlayer, "ca setting set " + JSON.stringify(json));
            }
        });

    }

    private opt(opts: Array<number>) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.caPlayer).sendForm();
                break;
            case 1:
                this.hotkeyKindForm();
                break;
            case 2:
                this.otherSettingForm();
                break;
            case 3:
                if (this.settings.enable) {
                    Players.silenceCmd(this.caPlayer, `ca off`);
                }
                else {
                    Players.silenceCmd(this.caPlayer, `ca on`);
                }
                break;
            default:
                break;
        }
    }

    public override sendForm(opts: Array<number> = []) {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.SettingForm.sendForm.s39"))
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.hotkeyListForm.s15"), "")
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.sendForm.s41"), "textures/ui/attack_pressed.png")
            .addButton(Tr._(this.player.langCode, "dynamic.SettingForm.otherSettingForm.s28"), "textures/ui/automation_glyph.png")
            .addButton(StrFactory.on_off(this.settings.enable, Tr._(this.player.langCode, "dynamic.SettingForm.sendForm.s43"), Tr._(this.player.langCode, "dynamic.SettingForm.sendForm.s44")) + "CALL", StrFactory.choose(this.settings.enable, 'textures/ui/toggle_off.png', 'textures/ui/toggle_on.png'))

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
}