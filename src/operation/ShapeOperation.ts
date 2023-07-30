import ShapeManager from "../manager/ShapeManager";
import PlayerData from "../model/PlayerData";
import Pos3D from "../model/Pos3D";
import ShapeLoader from "../plugin/ShapeLoader";
import Tr from "../util/Translator";

export default class ShapeOperation {
    public static consoleStart(output: CommandOutput) {
        ShapeOperation.list(output);
    }

    public static start(player: Player, output: CommandOutput, playerData: PlayerData, res: { enum_1: string; package: string; index: number; IntPos: IntPos; Json: string; }) {
        switch (res.enum_1) {
            case "list":
            case "li":
                ShapeOperation.list(output);
                break;
            case "load":
            case "lo":
                ShapeOperation.load(player, output, playerData, res.package, res.index, res.IntPos, res.Json);
                break;
            default:
                break;
        }
    }

    public static load(player: Player, output: CommandOutput, playerData: PlayerData, pack: string, index: number, intPos: IntPos, Json: string) {
        let pos;
        if(intPos == null) pos = player.pos;
        else pos = intPos;
        ShapeManager.run(player, playerData, pack, index, Pos3D.fromPos(pos).calibration().floor(), Json);
    }

    public static getList() {
        return ShapeManager.getList();
    }

    public static getPkgs() {
        return ShapeManager.pkgs;
    }

    public static list(output: CommandOutput) {
        let str = "";
        ShapeManager.getList().forEach(pkg => {
            str += pkg + '\n';
        });
        output.success(Tr._c("console.ShapeOperation.list.success", str.substring(-1)));
    }
}