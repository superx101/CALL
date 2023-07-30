logger.warn("checking CALL's dependencise...")

system.cmd("cd plugins/nodejs/call&&npm install", (exitCode, output)=>{
    logger.warn("success: " + output);
    setTimeout(()=>{
        mc.runcmd("ll unload CALL_Dependencise");
    }, 1000);
});