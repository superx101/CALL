import Config from "../common/Config";
import Area3 from "../common/Area3";
import CAPlayer from "../user/CAPlayer";
import { Pos3 } from "../common/Pos3";
import { FileMode } from "../temp/Common";

type e = 0 | 1 | 2 | 3;

export default class NBTService {
    public static PATH = Config.DATA + "/nbt";
    // static LOADPOOL = [];
    // static SAVEPOOL = [];

    public static save(saveid: string, area: Area3, ignoreBlocks = false, ignoreEntities = false) {
        let start = mc.newIntPos(area.start.x, area.start.y, area.start.z, area.start.dimid);
        let end = mc.newIntPos(area.end.x, area.end.y, area.end.z, area.end.dimid);
        let comp = mc.getStructure(start, end, ignoreBlocks, ignoreEntities);
        //@ts-ignore
        let file = new File(NBTService.PATH + `/${saveid}.mcstructure`, FileMode.WriteMode, true);
        file.write(comp.toBinaryNBT(), () => {
            file.close();
        });
    }

    public static saveFromNBT(saveid: string, comp: NbtCompound): boolean {
        //@ts-ignore
        let file = new File(NBTService.PATH + `/${saveid}.mcstructure`, FileMode.WriteMode, true);
        let res = file.writeSync(comp.toBinaryNBT());
        file.close();
        return res;
    }

    public static load(caPlayer: CAPlayer, saveid: string, pos: Pos3, mirror = "None", rataion = 0) {
        //@ts-ignore
        let file = new File(NBTService.PATH + `/${saveid}.mcstructure`, FileMode.ReadMode, true);
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
        caPlayer.$.teleport(intPos);
        return mc.setStructure(nbtObj, intPos, mir, (rataion / 90) as e);
    }

    public static del(saveid: string) {
        return File.delete(NBTService.PATH + `/${saveid}.mcstructure`);
    }
}

Object.freeze(NBTService.PATH);