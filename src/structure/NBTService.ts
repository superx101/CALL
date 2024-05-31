import Config from "../common/Config";
import Area3 from "../common/Area3";
import CAPlayer from "../user/CAPlayer";
import { Pos3 } from "../common/Pos3";
import { FileMode } from "../temp/Common";

type e = 0 | 1 | 2 | 3;

export default class NBTService {
    public static PATH = Config.DATA_PATH + "/nbt";
    // static LOADPOOL = [];
    // static SAVEPOOL = [];

    public static save(saveid: string, area: Area3, ignoreBlocks = false, ignoreEntities = false) {
        const start = mc.newIntPos(area.start.x, area.start.y, area.start.z, area.start.dimid);
        const end = mc.newIntPos(area.end.x, area.end.y, area.end.z, area.end.dimid);
        const comp = mc.getStructure(start, end, ignoreBlocks, ignoreEntities);
        const file = new File(NBTService.PATH + `/${saveid}.mcstructure`, FileMode.WriteMode, true);
        file.write(comp.toBinaryNBT(), () => {
            file.close();
        });
    }

    public static saveFromNBT(saveid: string, comp: NbtCompound): boolean {
        const file = new File(NBTService.PATH + `/${saveid}.mcstructure`, FileMode.WriteMode, true);
        const res = file.writeSync(comp.toBinaryNBT());
        file.close();
        return res;
    }

    public static load(caPlayer: CAPlayer, saveid: string, pos: Pos3, mirror = "None", rataion = 0) {
        const file = new File(NBTService.PATH + `/${saveid}.mcstructure`, FileMode.ReadMode, true);
        const bnbt = file.readAllSync();
        //@ts-ignore
        const nbtObj = NBT.parseBinaryNBT(bnbt);
        // TOFIX: pos.y - 1 is a compromise to setStructure's error
        const intPos = mc.newIntPos(pos.x, pos.y - 1, pos.z, pos.dimid);
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
        caPlayer.$.teleport(intPos);
        return mc.setStructure(nbtObj, intPos, mir, (rataion / 90) as e);
    }

    public static del(saveid: string) {
        return File.delete(NBTService.PATH + `/${saveid}.mcstructure`);
    }
}

Object.freeze(NBTService.PATH);