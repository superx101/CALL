import Config from "../common/Config";
import Players from "../common/Players";
import ToolOperation from "../operation/ToolOperation";
import { Listener } from "../type/Common";
import { ToolType } from "../type/Tool";
import StrFactory from "../util/StrFactory";
import Form from "./Form";
import Menu from "./Menu";

export default class SettingForm extends Form {
    constructor(form: Form) {
        super(form.player, form.playerData);
        return this;
    }

    private deleteHotkey(itemType: string, type: ToolType, name: string) {
        Players.silenceCmd(this.player, `ca to un ${itemType} ${type} "${name}"`);
    }

    private updateHotkey(preArr: any[], itemType: string, type: ToolType, name: string, describe: string, cmds: string) {
        this.deleteHotkey(preArr[0], type, preArr[1]);
        this.addHotkey(itemType, type, name, describe, cmds);
    }

    private addHotkey(itemType: string, type: ToolType, name: string = "", describe: string, cmds: string) {
        Players.silenceCmd(this.player, `ca to bi ${itemType} ${type} "${cmds}" "${describe}" "${name}"`);
    }

    private getItem(itemType: string, name: string, describe: string) {
        let item = mc.newItem(itemType, 1);
        item.setDisplayName(name + "\n" + describe);
        mc.spawnItem(item, this.player.pos);
    }

    private hotkeyForm(v: any[], mod: number, type: ToolType) {
        let arr;
        if (mod == 0) {
            arr = ["添加快捷键"];
        }
        else {
            arr = ["修改快捷键", "删除快捷键", "获取快捷键物品"];
        }
        let cmdstr = "";
        (v[3] == null ? [] : v[3]).forEach((v1: any) => {
            cmdstr += v1 + ";";
        });
        if (cmdstr.length > 0) {
            cmdstr = cmdstr.slice(0, -1);
        }

        let form = mc.newCustomForm()
            .setTitle(`快捷键设置-${type}`)
            .addDropdown("执行操作:", arr, 0)
            .addLabel(`快捷键信息:`)
            .addInput("  物品种类", "请输入正确的物品英文id", v[0] == null ? "" : v[0])
            .addInput("  物品名称\n  [可不输入] 不输入则匹配无命名的工具", "仅包含中英文、数字、下划线", v[1] == null ? "" : v[1])
            .addInput("  功能描述", "(必须输入) 快捷键功能描述", v[2] == null ? "" : v[2])
            .addInput("  指令组", "输入指令 (;号分割多条指令)", cmdstr)

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
            .setTitle(`快捷键设置-${type}`)
            .addButton("返回上一级", "")
            .addButton("添加快捷键", "textures/ui/color_plus.png")
        let list = ToolOperation.getLinearList(this.player, this.playerData, type);
        list.forEach((v: any) => {
            const type = v[0].replace("minecraft:", "");
            form.addButton(
                `${StrFactory.color(Format.Black, v[0])}\n名称: ${StrFactory.color(Format.DarkGreen, v[1])} 描述: ${StrFactory.color(Format.DarkPurple, v[2])}`,
                Config.ITEM_TEXTURES.has(type) ? `textures/items/${type}` : ""
            );
        });

        this.player.sendForm(form, (pl, id) => {
            switch (id) {
                case 0:
                    this.hotkeyKindForm();
                    break;
                case 1:
                    this.hotkeyForm([], 0, type);
                    break;
                case 2:
                    this.hotkeyForm(list[id - 2], 1, type);
                    break;
                default:
                    break;
            }
        });
    }

    private hotkeyKindForm() {
        let form = mc.newSimpleForm()
            .setTitle("快捷键种类")
            .addButton("返回上一级", "")
            .addButton("恢复默认快捷键", "textures/ui/switch_home_button.png")
            .addButton("获取所有快捷键", "textures/ui/xbox_start_button.png")
            .addButton("点击(右键)式", "textures/ui/generic_right_trigger.png")
            .addButton("破坏(左键)式", "textures/ui/generic_left_trigger.png")

        this.player.sendForm(form, (pl, id) => {
            switch (id) {
                case 0:
                    this.sendForm();
                    break;
                case 1:
                    let form2 = mc.newSimpleForm()
                        .setTitle("恢复默认快捷键")
                        .setContent("是否清空当前所有快捷键设置并恢复默认设置？\n\n\n\n\n\n\n\n")
                        .addButton("确认", "textures/ui/check.png")
                        .addButton("取消", "textures/ui/cancel.png")
                    this.player.sendForm(form2, (pl, id) => {
                        switch (id) {
                            case 0:
                                ToolOperation.restoreDefaults(this.player, this.playerData);
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
                        left: ToolOperation.getLinearList(this.player, this.playerData, ToolType.LEFT),
                        right: ToolOperation.getLinearList(this.player, this.playerData, ToolType.RIGHT)
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
            ["saveEntity", this.settings.saveEntity]
        ];
        let form = mc.newCustomForm()
            .setTitle("其他设置")
            .addStepSlider("填充方块 从( )号物品栏选择", barArr, setArr[0][1])
            .addStepSlider("被替换方块 从( )号物品栏选择", barArr, setArr[1][1])
            .addSwitch("加载新区块时提示", setArr[2][1])
            .addSwitch("显示进度条", setArr[3][1])
            .addSwitch("退出后保存选区", setArr[4][1])
            .addSwitch("退出后保存撤销", setArr[5][1])
            .addSwitch("退出后保存复制", setArr[6][1])
            .addSwitch("结构中保存实体", setArr[7][1])

        this.player.sendForm(form, (pl, data) => {
            if (data == null) {
                this.sendForm();
                return;
            }
            if (data[0] == data[1]) {
                pl.sendText(StrFactory.cmdErr("填充方块和被替换方块不能相同"));
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
                Players.silenceCmd(pl, "ca setting set " + JSON.stringify(json));
            }
        });

    }

    private opt(opts: Array<number>) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.player, this.playerData).sendForm();
                break;
            case 1:
                this.hotkeyKindForm();
                break;
            case 2:
                this.otherSettingForm();
                break;
            case 3:
                if (this.settings.enable) {
                    Players.silenceCmd(this.player, `ca off`);
                }
                else {
                    Players.silenceCmd(this.player, `ca on`);
                }
                break;
            default:
                break;
        }
    }

    public override sendForm(opts: Array<number> = []) {
        let form = mc.newSimpleForm()
            .setTitle("设置")
            .addButton("返回上一级", "")
            .addButton("快捷键设置", "textures/ui/attack_pressed.png")
            .addButton("其他设置", "textures/ui/automation_glyph.png")
            .addButton(StrFactory.on_off(this.settings.enable, '关闭', '开启') + "CALL", StrFactory.choose(this.settings.enable, 'textures/ui/toggle_off.png', 'textures/ui/toggle_on.png'))

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