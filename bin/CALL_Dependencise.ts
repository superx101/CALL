logger.warn("检查更新依赖中")

system.cmd("cd plugins/nodejs/call&&npm install", (exitCode, output)=>{
    logger.warn("检查完成：" + output);
    setTimeout(()=>{
        mc.runcmd("ll unload CALL_Dependencise");
    }, 1000);
});