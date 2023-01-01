export default class StrFactory {
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
        return Format.White + "CALL-" + str;
    }

    public static cmdTip(str: string) {
        return Format.Green + "CALL-" + str;
    }

    public static cmdSuccess(str: string) {
        return Format.Yellow + "CALL-" + str;
    }

    public static cmdErr(str: string) {
        return Format.Red + "CALL-" + str;
    }

    public static item(str: string) {
        let arr = str.split(":");
        if (arr.length > 2) {
            throw new Error("[StrFactory.item] 字符串格式错误");
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

    public static formEnable(bool: boolean, text: string) {
        if(bool)
            return text;
        else 
            return Format.Bold + Format.Gray + text + Format.Clear;
    }
}