import Area3D from "../model/Area3D";
import Pos3D from "../model/Pos3D";

type e = 0 | 1 | 2 | 3;

export default class NBTManager {
    public static PATH = "./plugins/CALL/data/nbt/";
    // static LOADPOOL = [];
    // static SAVEPOOL = [];

    public static save(saveid: string, area: Area3D, ignoreBlocks = false, ignoreEntities = false) {
        let start = mc.newIntPos(area.start.x, area.start.y, area.start.z, area.start.dimid);
        let end = mc.newIntPos(area.end.x, area.end.y, area.end.z, area.end.dimid);
        let comp = mc.getStructure(start, end, ignoreBlocks, ignoreEntities);
        let file = new File(NBTManager.PATH + `${saveid}.mcstructure`, 1, true);
        file.write(comp.toBinaryNBT(), () => {
            file.close();
        });
    }

    public static load(player: Player, saveid: string, pos: Pos3D, mirror = "None", rataion = 0) {
        let file = new File(NBTManager.PATH + `${saveid}.mcstructure`, 0, true);
        let bnbt = file.readAllSync();
        //@ts-ignore
        let nbtObj = NBT.parseBinaryNBT(bnbt);
        let intPos = mc.newIntPos(pos.x, pos.y, pos.z, pos.dimid);
        let mir: e = 0;
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
        return mc.setStructure(nbtObj, intPos, mir, (rataion / 90) as e);
    }

    public static del(saveid: string) {
        return File.delete(NBTManager.PATH + `${saveid}.mcstructure`);
    }
}

Object.freeze(NBTManager.PATH);