const ToolOperation = require("../operation/ToolOperation");
const Form = require("./Form");

class SettingForm extends Form {
    constructor(form) {
        super(form.player, form.playerData, form.settings);
        return this;
    }

    deleteHotkey(type, name) {
        this.player.runcmd(`ca to un ${type} "${name}"`);
    }

    updateHotkey(preArr, type, name, describe, cmds) {
        this.deleteHotkey(preArr[0], preArr[1]);
        this.addHotkey(type, name, describe, cmds);
    }

    addHotkey(type, name = "", describe, cmds) {
        this.player.runcmd(`ca to bi ${type} "${cmds}" "${describe}" "${name}"`);
    }

    getItem(type, name, describe) {
        let item = mc.newItem(type, 1);
        item.setDisplayName(name + "\n" + describe);
        mc.spawnItem(item, this.player.pos);
    }

    hotkeyForm(v, mod) {
        let arr;
        if (mod == 0) {
            arr = ["添加快捷键"];
        }
        else {
            arr = ["修改快捷键", "删除快捷键", "获取快捷键物品"];
        }
        let cmdstr = "";
        (v[3] == null ? [] : v[3]).forEach(v => {
            cmdstr += v + ";";
        });
        if (cmdstr.length > 0) {
            cmdstr = cmdstr.slice(0, -1);
        }

        let form = mc.newCustomForm()
            .setTitle("快捷键设置")
            .addDropdown("执行操作:", arr, 0)
            .addLabel(`快捷键信息:`)
            .addInput("  物品种类", "请输入正确的物品英文id", v[0] == null ? "" : v[0])
            .addInput("  物品名称\n  [可不输入] 不输入则匹配无命名的工具", "仅包含中英文、数字、下划线", v[1] == null ? "" : v[1])
            .addInput("  功能描述", "(必须输入) 快捷键功能描述", v[2] == null ? "" : v[2])
            .addInput("  指令组", "输入指令 (;号分割多条指令)", cmdstr)

        this.player.sendForm(form, (pl, data) => {
            log(data)
            if (data == null) return;
            if (mod == 0) {
                this.addHotkey(data[2], data[3], data[4], data[5]);
            }
            else {
                switch (data[0]) {
                    case 0:
                        this.updateHotkey(v, data[2], data[3], data[4], data[5]);
                        break;
                    case 1:
                        this.deleteHotkey(data[2], data[3]);
                        break;
                    case 2:
                        this.getItem(data[2], data[3], data[4]);
                        break;
                }
            }
        });
    }

    hotkeyListForm() {
        let form = mc.newSimpleForm()
            .setTitle("快捷键设置")
            .addButton("返回上一级", "")

        let list = ToolOperation.getLinearList(this.player, this.playerData);
        list.forEach((v, i) => {
            form.addButton(`${StrFactory.color(Format.Black, v[0])}\n名称: ${StrFactory.color(Format.DarkGreen, v[1])} 描述: ${StrFactory.color(Format.DarkPurple, v[2])}`);
        });
        form.addButton("添加快捷键")
            .addButton("恢复默认快捷键")

        this.player.sendForm(form, (pl, id) => {
            if (id == 0) {
                this.sendForm()
            }
            else if (id <= list.length) {
                this.hotkeyForm(list[id - 1], 1);
            }
            else if (id == list.length + 1) {
                this.hotkeyForm([], 0);
            }
            else if (id == list.length + 2) {
                let form2 = mc.newSimpleForm()
                    .setTitle("恢复默认快捷键")
                    .setContent("是否清空当前所有快捷键设置并恢复默认设置？\n\n\n\n\n\n")
                    .addButton("返回上一级", "")
                    .addButton("确认")
                    .addButton("取消")
                this.player.sendForm(form2, (pl, id) => {
                    if (id == 0) {
                        this.hotkeyListForm([], 0);
                    }
                    else if (id == 1) {
                        ToolOperation.restoreDefaults(this.player, this.playerData);
                    }
                });
            }
        });
    }

    otherSettingForm() {
        let barArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let barArr_select = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let setArr = [
            ["barReplace", this.settings.barReplace - 1, barArr_select],
            ["barReplaced", this.settings.barReplaced - 1, barArr_select],
            ["loadChuckTip", this.settings.loadChuckTip],
            ["saveArea", this.settings.saveArea],
            ["saveUndo", this.settings.saveUndo],
            ["saveCopy", this.settings.saveCopy]
        ];
        let form = mc.newCustomForm()
            .setTitle("其他设置")
            .addStepSlider("填充方块 从( )号物品栏选择", barArr, setArr[0][1])
            .addStepSlider("被替换方块 从( )号物品栏选择", barArr, setArr[1][1])
            .addSwitch("加载新区块时提示", setArr[2][1])
            .addSwitch("退出后保存选区", setArr[3][1])
            .addSwitch("退出后保存撤销", setArr[4][1])
            .addSwitch("退出后保存复制", setArr[5][1])

        this.player.sendForm(form, (pl, data) => {
            if (data == null) return;
            if (data[0] == data[1]) {
                pl.sendText(StrFactory.cmdErr("填充方块和被替换方块不能相同"));
                return;
            }
            let json = {};
            data.forEach((v, i) => {
                if (v !== setArr[i][1]) {
                    if (typeof (v) == "number") {
                        v = setArr[i][2][v];
                    }
                    json[setArr[i][0]] = v;
                }
            });
            if (Object.keys(json).length > 0) {
                pl.runcmd("ca setting set " + JSON.stringify(json));
            }
        });

    }

    opt(opts) {
        switch (opts.shift()) {
            case 0:
                new Menu(this.player, this.playerData).sendForm();
                break;
            case 1:
                this.hotkeyListForm()
                break;
            case 2:
                this.otherSettingForm();
                break;
            case 3:
                if (this.settings.enable) {
                    this.player.runcmd(`ca off`);
                }
                else {
                    this.player.runcmd(`ca on`);
                }
                break;
            default:
                break;
        }
    }

    sendForm(opts = []) {
        let form = mc.newSimpleForm()
            .setTitle("设置")
            .addButton("返回上一级", "")
            .addButton("快捷键设置", "")
            .addButton("其他设置", "")
            .addButton(StrFactory.on_off(this.settings.enable, '关闭', '开启') + "CALL", "")

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

module.exports = SettingForm