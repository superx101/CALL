setTimeout(()=>{
    if (mc.runcmd('ll reload call')) {
        colorLog("blue", "已重载CALL");
    }
    else {
        logger.error("CALL重载失败");
    }
}, 500)