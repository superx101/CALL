setTimeout(()=>{
    if (mc.runcmd('ll reload call')) {
        colorLog("blue", "reloaded CALL");
    }
    else {
        logger.error("reload CALL failed");
    }
}, 500)