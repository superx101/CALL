import Players from "../common/Players";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import StrFactory from "../util/StrFactory";
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
    private pos: Pos3D;
    private mode: Mode;
    constructor(player: Player, playerData: PlayerData) {
        super(player, playerData);
        return this;
    }

    private failMsg() {
        this.player.sendText(StrFactory.cmdErr("已放弃修改方块属性"));
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
            throw new Error("类型与值不匹配");
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
            .setTitle("属性操作")
            .addDropdown("操作种类:", ["设置", "删除"], 0)
            .addInput("键:", "属性的名称", defKey)
            .addInput("值:", "属性的值", defValue)
            .addDropdown("值的类型:", ["数字", "字符", "对象"], type)

        this.player.sendForm(form, (pl: Player, data: any[]) => {
            if (data == null) {
                this.attributeForm("已返回上一级");
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
                            result = `${key} : ${this.ValueToString(this.obj[key])} 修改为: ${value}`
                            this.obj[key] = this.getValue(value, type);
                        }
                        //key不存在-->插入
                        else {
                            result = `已添加属性 ${key} : ${value}`
                            this.obj[key] = this.getValue(value, type);
                        }
                    }
                    else {
                        //删除
                        result = `已删除 ${key} : ${this.ValueToString(this.obj[key])}`;
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
            form.setTitle(`方块nbt编辑`)
            this.obj = this.blockNbt;
        }
        else {
            form.setTitle(`方块实体nbt编辑`)
            this.obj = this.entityNbt;
        }
        form.addButton("返回上一级").addButton("添加属性");

        const keys = Object.keys(this.obj)
        for (const key of keys) {
            form.addButton(key)
        }

        this.player.sendForm(form, (pl: Player, id: number) => {
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
            .setTitle(`${this.pos.toString()} 方块属性编辑`)
            .addButton("返回上一级")
            .addButton("方块nbt编辑")
            .addButton((this.hasEntity ? "" : Format.DarkRed + Format.Bold) + "方块实体nbt编辑")
            .addButton("确认修改")

        if (content !== "") form.setContent(content);

        this.player.sendForm(form, (pl: Player, id: number) => {
            switch (id) {
                case 0:
                    this.sendForm(null);
                    break;
                case 1:
                    this.mode = Mode.NBT;
                    this.attributeForm();
                    break;
                case 2:
                    if (this.entityNbt == null) this.totalForm(Format.Red + "当前方块无方块实体");
                    else {
                        this.mode = Mode.BLOCK_ENTITY;
                        this.attributeForm();
                    }
                    break;
                case 3:
                    Players.silenceCmd(this.player, `ca bl ${this.pos.formatStr()} ${JSON.stringify(this.blockNbt)} ${this.hasEntity ? JSON.stringify(this.entityNbt) : ""}`)
                    break;
                default:
                    this.failMsg();
                    break;
            }
        });
    }

    public init(pos: Pos3D) {
        const block = mc.getBlock(pos.x, pos.y, pos.z, pos.dimid);
        if (block == null) {
            this.sendForm(null, Format.Red + "无法读取方块, 请选择已加载的坐标");
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
            this.totalForm("注: 需在本级目录点击\"确认修改\"后生效");
        }
    }

    public override sendForm(opts: Array<number>, content: string = "") {
        let form = mc.newCustomForm()
            .setTitle("选择方块")
            .addLabel(content)
            .addInput("输入方块坐标:\n(默认为脚下坐标)", "输入三个整数(空格隔开)", `${Pos3D.fromPos(this.player.pos).calibration().add(0, -1, 0).floor().formatStr()}`)

        this.player.sendForm(form, (pl: Player, data: string[]) => {
            if (data == null) {
                this.failMsg();
            } else {
                let strs = data[1].split(" ");
                let pos = new Pos3D();
                try {
                    pos.x = Number.parseInt(strs[0]);
                    pos.y = Number.parseInt(strs[1]);
                    pos.z = Number.parseInt(strs[2]);
                } catch (e) {
                    throw new Error("坐标输入格式有误");
                }
                this.init(pos);
            }
        });
    }
}