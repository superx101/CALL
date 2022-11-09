// const StrFactory = require("../tool/StrFactory")

class ReloadOperation {
    static name = 'plugins.tmp';
    static start(output) {
        mc.getOnlinePlayers().forEach(pl => {
            pl.sendText(StrFactory.cmdTip("管理员已重载插件"));
        });
        let success = false;
        if (mc.runcmd('ll unload "CALL.lxl.js"')) {
            if (mc.runcmd('ll load "./plugins/CALL.lxl.js"')) {
                success = true;
                colorLog("blue", "已重载CALL.lxl.js");
            }
        }
        if (!success) {
            colorLog("red", "CALL.lxl.js重载失败");
        }
    }
}

module.exports = ReloadOperation;