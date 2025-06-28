import Players from "../user/Players";
import CAPlayer from "../user/CAPlayer";
import { Pos3 } from "../common/Pos3";
import StrFactory from "../util/StrFactory";
import Tr from "../util/Translator";
import Form from "./Form";

enum Mode {
    NBT = 0,
    BLOCK_ENTITY = 1
}

enum Type {
    Number = 0,
    String = 1,
    Object = 2,
    Null = 3
}

export default class BlockEditerForm extends Form {
    private blockNbt: any;
    private entityNbt: any;
    private obj: any;
    private hasEntity: boolean;
    private pos: Pos3;
    private mode: Mode;
    constructor(caPlayer: CAPlayer) {
        super(caPlayer);
        return this;
    }

    private failMsg() {
        this.player.sendText(StrFactory.cmdErr(Tr._(this.player.langCode, "dynamic.BlockEditerForm.failMsg.s0")));
    }

    private getType(n: any): Type {
        switch (typeof n) {
            case "number":
                return Type.Number;
            case "string":
                return Type.String;
            case "object":
                return Type.Object;
            default:
                return Type.Null;
        }
    }

    private ValueToString(v: any) {
        if (typeof v == "string") return v;
        else return JSON.stringify(v);
    }

    private getValue(value: string, type: Type) {
        try {
            if (value === '') {
                return Type.Null;
            }
            else {
                switch (type) {
                    case Type.Number:
                        return parseFloat(value);
                    case Type.String:
                        return `${value}`;
                    case Type.Object:
                        return JSON.parse(value);
                }
            }
        }
        catch (e) {
            throw new Error(Tr._(this.player.langCode, "dynamic.BlockEditerForm.getValue.s1"));
        }
    }

    private operationForm(key: string, type: Type = Type.Number, isInsert: boolean) {
        let defKey: string = "";
        let defValue: string = "";

        if (!isInsert) {
            defKey = key;
            defValue = this.ValueToString(this.obj[key]);
        }

        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s2"))
            .addDropdown(Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s3"), [Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s4"), Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s5")], 0)
            .addInput(Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s6"), Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s7"), defKey)
            .addInput(Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s8"), Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s9"), defValue)
            .addDropdown(Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s10"), [Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s11"), Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s12"), Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s13")], type)

        this.player.sendForm(form, (pl: LLSE_Player, data: any[]) => {
            if (data == null) {
                this.attributeForm(Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s14"));
                return;
            }
            else {
                let key = data[1];
                let value = data[2];
                let type = parseInt(data[3]);
                let result: string;
                try {
                    if (data[0] == 0) {
                        //key存在-->修改
                        if (this.obj[key] != null) {
                            result = Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s15", key, this.ValueToString(this.obj[key]), value)
                            this.obj[key] = this.getValue(value, type);
                        }
                        //key不存在-->插入
                        else {
                            result = Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s16", key, value)
                            this.obj[key] = this.getValue(value, type);
                        }
                    }
                    else {
                        //删除
                        result = Tr._(this.player.langCode, "dynamic.BlockEditerForm.operationForm.s17", key, this.ValueToString(this.obj[key]));
                        delete this.obj[key];
                    }
                } catch (e) {
                    result = e.message;
                }

                this.attributeForm(result);
            }
        });
    }

    private attributeForm(content: string = "") {
        let form = mc.newSimpleForm().setContent(content);
        if (this.mode == Mode.NBT) {
            form.setTitle(Tr._(this.player.langCode, "dynamic.BlockEditerForm.attributeForm.s32"))
            this.obj = this.blockNbt;
        }
        else {
            form.setTitle(Tr._(this.player.langCode, "dynamic.BlockEditerForm.attributeForm.s33"))
            this.obj = this.entityNbt;
        }
        form.addButton(Tr._(this.player.langCode, "dynamic.BlockEditerForm.attributeForm.s18")).addButton(Tr._(this.player.langCode, "dynamic.BlockEditerForm.attributeForm.s19"));

        const keys = Object.keys(this.obj)
        for (const key of keys) {
            form.addButton(key)
        }

        this.player.sendForm(form, (pl: LLSE_Player, id: number) => {
            if (id == null) {
                this.failMsg();
                return;
            }
            if (id == 0) {
                this.totalForm();
            }
            else if (id == 1) {
                this.operationForm(undefined, undefined, true);
            }
            else {
                const key = keys[id - 2];
                this.operationForm(keys[id - 2], this.getType(this.obj[key]), false);
            }
        });
    }

    private totalForm(content: string = "") {
        let form = mc.newSimpleForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.BlockEditerForm.totalForm.s20", this.pos.toString()))
            .addButton(Tr._(this.player.langCode, "dynamic.BlockEditerForm.attributeForm.s18"))
            .addButton(Tr._(this.player.langCode, "dynamic.BlockEditerForm.totalForm.s22"))
            .addButton((this.hasEntity ? "" : Format.DarkRed + Format.Bold) + Tr._(this.player.langCode, "dynamic.BlockEditerForm.totalForm.s23"))
            .addButton(Tr._(this.player.langCode, "dynamic.BlockEditerForm.totalForm.s24"))

        if (content !== "") form.setContent(content);

        this.player.sendForm(form, (pl: LLSE_Player, id: number) => {
            switch (id) {
                case 0:
                    this.sendForm(null);
                    break;
                case 1:
                    this.mode = Mode.NBT;
                    this.attributeForm();
                    break;
                case 2:
                    if (this.entityNbt == null) this.totalForm(Format.Red + Tr._(this.player.langCode, "dynamic.BlockEditerForm.totalForm.s25"));
                    else {
                        this.mode = Mode.BLOCK_ENTITY;
                        this.attributeForm();
                    }
                    break;
                case 3:
                    Players.silenceCmd(this.caPlayer, `ca bl ${this.pos.formatStr()} ${JSON.stringify(this.blockNbt)} ${this.hasEntity ? JSON.stringify(this.entityNbt) : ""}`)
                    break;
                default:
                    this.failMsg();
                    break;
            }
        });
    }

    public init(pos: Pos3) {
        const block = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
        if (block == null) {
            this.sendForm(null, Format.Red + Tr._(this.player.langCode, "dynamic.BlockEditerForm.init.s26"));
        } else {
            this.pos = pos;
            this.blockNbt = JSON.parse(block.getNbt().toString());
            if (block.hasBlockEntity()) {
                this.entityNbt = JSON.parse(block.getBlockEntity().getNbt().toString());
                this.hasEntity = true;
            }
            else {
                this.hasEntity = false;
            }
            this.totalForm(Tr._(this.player.langCode, "dynamic.BlockEditerForm.init.s27"));
        }
    }

    public override sendForm(opts: Array<number>, content: string = "") {
        let form = mc.newCustomForm()
            .setTitle(Tr._(this.player.langCode, "dynamic.BlockEditerForm.sendForm.s28"))
            .addLabel(content)
            .addInput(Tr._(this.player.langCode, "dynamic.BlockEditerForm.sendForm.s29"), Tr._(this.player.langCode, "dynamic.BlockEditerForm.sendForm.s30"), `${Pos3.fromPos(this.player.pos).calibration().add(0, -1, 0).floor().formatStr()}`)

        this.player.sendForm(form, (pl: LLSE_Player, data: string[]) => {
            if (data == null) {
                this.failMsg();
            } else {
                let strs = data[1].split(" ");
                let pos = new Pos3();
                try {
                    pos.x = Number.parseInt(strs[0]);
                    pos.y = Number.parseInt(strs[1]);
                    pos.z = Number.parseInt(strs[2]);
                } catch (e) {
                    throw new Error(Tr._(this.player.langCode, "dynamic.BlockEditerForm.sendForm.s31"));
                }
                this.init(pos);
            }
        });
    }
}