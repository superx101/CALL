import Tr from "./Translator";

const tag = "CALL-";

export default class StrFactory {
    public static item_t(lang: string, key: string, ...args: any) {
        return Tr._(lang, `item.${key}.name`, args);
    }

    public static isLegalName(str: string) {
        if (str == null) {
            return true;
        }
        str = str.trim();
        if (str === "") {
            return true;
        }
        return false;
    }

    public static replaceAll(str: string, regex: string, s: string) {
        if(str == null) {
            str = "";
        }
        return str.replace(new RegExp(regex, 'g'), s);
    }

    /*** private */
    private static dfs(node: any, nextnode: any, str: string, space: number) {
        if (Array.isArray(node)) {
            node.forEach((v, i, arr) => {
                if (i < node.length - 1) {
                    nextnode = node[i + 1];
                }
                else {
                    nextnode = null;
                }
                str = StrFactory.dfs(v, nextnode, str, space + 1);
            })
        }
        else {
            let s = "";
            for (let i = 0; i < space - 1; i++) {
                s += "  ";
            }
            if (Array.isArray(nextnode)) {
                s += "> "
            }
            else {
                s += "• "
            }
            str += s + node + "\n";
        }
        return str;
    }

    public static catalog(node: any) {
        return StrFactory.dfs(node, null, "", 0);
    }

    public static msg(str: string) {
        return "[CALL] " + str.replaceAll("\n", "\n[CALL] ");
    }

    public static cmdMsg(str: string) {
        return Format.White + tag + str;
    }

    public static cmdTip(str: string) {
        return Format.Green + tag + str;
    }

    public static cmdSuccess(str: string) {
        return Format.Yellow + tag + str;
    }

    public static cmdErr(str: string) {
        return Format.Red + tag + str;
    }

    public static cmdWarn(str: string) {
        return Format.Gold + tag + str;
    }

    public static item(str: string) {
        let arr = str.toLowerCase().split(":");
        if (arr.length > 2) {
            throw new Error("[StrFactory.item] string formatting error");
        }
        else if (arr.length == 2) {
            return str;
        }
        else {
            if (arr[0] !== "minecraft") {
                str = "minecraft:" + arr[0];
            }
            return str;
        }
    }

    public static color(c: Format | string, str: string) {
        return c + str + Format.Clear;
    }

    public static red(str: string) {
        return Format.Red + str;
    }

    public static choose(bool: boolean, a: string, b: string) {
        if(bool) return a;
        else return b;
    }

    public static on_off(bool: boolean, off: string, on: string) {
        if(bool) 
            return Format.Bold + Format.Red + off + Format.Clear;
        else 
            return Format.Bold + Format.DarkGreen + on + Format.Clear;
    }

    public static Bold(str: string) {
        return Format.Bold + str + Format.Clear;
    }

    public static formEnable(bool: boolean, text: string) {
        if(bool)
            return text;
        else 
            return Format.DarkRed + text + Format.Clear;
    }
}