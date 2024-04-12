import HelpOperation from "../user/HelpOperation";
import Tr from "../util/Translator";
import Form from "./Form";
import Menu from "./Menu";

export default class TutorailForm extends Form {
    private obj: any;
    constructor(form: Form) {
        super(form.caPlayer);
        this.obj = HelpOperation.readFile();
        return this;
    }

    static colorArr = [Format.Gold, Format.Yellow, Format.Green, Format.Aqua, Format.LightPurple]

    private dfsSendForm(trace: any, color: number) {
        let node = this.obj;
        trace.forEach((key: string | number) => {
            node = node[key];
        });
        let title;
        if (trace.length > 0) {
            title = Tr._(this.player.langCode, trace[trace.length - 1]);
        }
        else {
            title = Tr._(this.player.langCode, "dynamic.TutorailForm.dfsSendForm.s0")
        }
        let form = mc.newSimpleForm()
            .setTitle(title)
            .addButton(TutorailForm.colorArr[color] + Tr._(this.player.langCode, "dynamic.TutorailForm.dfsSendForm.s1"))
        let arr: any = [];
        if (typeof (node) == "object") {
            Object.keys(node).forEach(v => {
                arr.push(v);
                form.addButton(Tr._(this.player.langCode, v));
            });
        }
        else if (typeof (node) == "string") {
            form.setContent(Tr._(this.player.langCode, node));
        }

        this.player.sendForm(form, (pl, id) => {
            if (id == null) return;
            if (id == 0) {
                if (trace.length == 0) {
                    new Menu(this.caPlayer).sendForm();
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

    public override sendForm() {
        this.dfsSendForm([], 0);
    }
}