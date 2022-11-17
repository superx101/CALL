class NBTManager {
    static PATH = "./plugins/CALL/data/nbt/";
    // static LOADPOOL = [];
    // static SAVEPOOL = [];

    static save(saveid, area, ignoreBlocks = false, ignoreEntities = false) {
        let start = mc.newIntPos(area.start.x, area.start.y, area.start.z, area.start.dimid);
        let end = mc.newIntPos(area.end.x, area.end.y, area.end.z, area.end.dimid);
        let comp = mc.getStructure(start, end, ignoreBlocks, ignoreEntities);
        let file = new File(NBTManager.PATH + `${saveid}.mcstructure`, 1, true);
        file.write(comp.toBinaryNBT(), () => {
            file.close();
        });
    }

    static load(player, saveid, pos, mirror = "None", rataion = 0) {
        let file = new File(NBTManager.PATH + `${saveid}.mcstructure`, 0, true);
        let bnbt = file.readAllSync();
        let nbt = NBT.parseBinaryNBT(bnbt);
        let intPos = mc.newIntPos(pos.x, pos.y, pos.z, pos.dimid);
        let mir = 0;
        file.close();
        switch (mirror) {
            case "x":
                mir = 1;
                break;
            case "z":
                mir = 2;
                break;
            case "xz":
                mir = 3;
                break;
        }
        player.teleport(intPos);
        return mc.setStructure(nbt, intPos, mir, parseInt(parseFloat(rataion) / 90));
    }

    static del(saveid) {
        return File.delete(NBTManager.PATH + `${saveid}.mcstructure`);
    }
}

Object.freeze(NBTManager.PATH);

module.exports = NBTManager;