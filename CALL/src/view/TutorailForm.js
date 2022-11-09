const HelpOperation = require("../operation/HelpOperation");
const Form = require("./Form");

class TutorailForm extends Form {
    constructor(form) {
        super(form.player, form.playerData, form.settings);
        this.obj = HelpOperation.readFile();
        return this;
    }

    static colorArr = [Format.Red, Format.Gold, Format.Yellow, Format.Green, Format.Aqua, Format.LightPurple]

    dfsSendForm(trace, color) {
        let node = this.obj;
        trace.forEach(key => {
            node = node[key];
        });
        let title;
        if (trace.length > 0) {
            title = trace[trace.length - 1];
        }
        else {
            title = "基础教程"
        }
        let form = mc.newSimpleForm()
            .setTitle(title)
            .addButton(TutorailForm.colorArr[color] + "返回上一级")
        let arr = [];
        if (typeof (node) == "object") {
            Object.keys(node).forEach(v => {
                arr.push(v);
                form.addButton(v);
            });
        }
        else if (typeof (node) == "string") {
            form.setContent(node);
        }

        this.player.sendForm(form, (pl, id) => {
            if (id == null) return;
            if (id == 0) {
                if (trace.length == 0) {
                    new Menu(this.player, this.playerData).sendForm();
                }
                else {
                    trace.pop();
                    color -= 1;
                    this.dfsSendForm(trace, color < 0 ? TutorailForm.colorArr.length - 1 : color);
                }
            }
            else {
                trace.push(arr[id - 1]);
                this.dfsSendForm(trace, color + 1 % TutorailForm.colorArr.length);
            }
        });
    }

    sendForm() {
        this.dfsSendForm([], 0);
    }
}

module.exports = TutorailForm;