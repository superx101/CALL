try {
    ll.export(export_cmd, EXPORTSAPCE, PKG + CMD);
    ll.export(export_form, EXPORTSAPCE, PKG + FORM);
    ll.export(export_tutorial, EXPORTSAPCE, PKG + TUTORAIL);
}
catch (e) {
    if (/'export_cmd'/.test(e.message)) {
        throw new Error("CALL形状包 " + PKG + ": 未定义函数export_cmd");
    }
    else if (/'export_form'/.test(e.message)) {
        throw new Error("CALL形状包 " + PKG + ": 未定义函数export_form");
    }
    else if (/'export_tutorial'/.test(e.message)) {
        throw new Error("CALL形状包 " + PKG + ": 未定义函数export_tutorial");
    }
    else {
        throw new Error(e);
    }
}
