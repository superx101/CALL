class StrFactory {
    static isLegalName(str) {
        if (str == null) {
            return true;
        }
        str = str.trim();
        if (str === "") {
            return true;
        }
        return false;
    }

    static replaceAll(str, regex, s) {
        return str.replace(new RegExp(regex, 'g'), s);
    }

    /*** private */
    static dfs(node, nextnode, str, space) {
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

    static catalog(node) {
        return StrFactory.dfs(node, null, "", 0, false);
    }

    static msg(str) {
        return "[CALL] " + str.replaceAll("\n", "\n[CALL] ");
    }

    static cmdMsg(str) {
        return Format.White + "CALL-" + str;
    }

    static cmdTip(str) {
        return Format.Green + "CALL-" + str;
    }

    static cmdSuccess(str) {
        return Format.Yellow + "CALL-" + str;
    }

    static cmdErr(str) {
        return Format.Red + "CALL-" + str;
    }

    static item(str) {
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

    static color(c, str) {
        return c + str + Format.Clear;
    }

    static red(str) {
        return Format.Red + str;
    }

    static on_off(bool, off, on) {
        if(bool) {
            return Format.Bold + Format.Red + off + Format.Clear;
        }
        else {
            return Format.Bold + Format.DarkGreen + on + Format.Clear;
        }
    }

    static formEnable(bool, text) {
        if(bool) {
            return text;
        }
        else {
            return Format.Bold + Format.Gray + text + Format.Clear;
        }
    }
}

module.exports = StrFactory;