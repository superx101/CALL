import path = require("path");
import Config from "../common/Config";
import ImportManager from "../manager/ImportManager";
import { Type } from "../type/Structure";
import StrFactory from "../util/StrFactory";
import Structure from "../model/Structure";
import Area3D from "../model/Area3D";
import Pos3D from "../model/Pos3D";
import StructureManager from "../manager/StructureManager";
import * as ProgressBar from "cli-progress"

export default class ImportOperation {
    public static start(res: { file: string, playerName: string, includeEntity?: boolean, Name?: string }, output: CommandOutput) {
        const xuid = ImportManager.findXuidByName(res.playerName);
        const file = ImportManager.readFile(res.file);
        const sid = StructureManager.generateSid(xuid);
        let comp: NbtCompound;

        switch (file.type) {
            case Type.MCSTRUCTURE:
                comp = NBT.parseBinaryNBT(file.data);
                break;
            default:
                break;
        }

        const size = (comp.getData("size") as NbtList).toArray();
        const st = new Structure(new Area3D(new Pos3D(0, 0, 0, 0), new Pos3D(size[0] - 1, size[1] - 1, size[2] - 1, 0)), res.Name);

        //初始化进度条
        const bar = new ProgressBar.Bar({
            format: '{title}: {bar} | {percentage}% | {value}/{total} | {duration_formatted}'
        }, ProgressBar.Presets.shades_classic);
        bar.start(size[0] * size[1] * size[2], 0, {
            title: '转换结构中'
        });

        //去除实体
        if (res.includeEntity != null && !res.includeEntity) {
            let structure = comp.getData("structure") as NbtCompound;
            structure.setTag("entities", new NbtList());
            comp.setTag("structure", structure);
        }

        //拆解结构
        const comps = ImportManager.separate(st, comp, (current: number) => {
            bar.update(current);//更新进度
        });

        bar.stop();

        //保存
        if (ImportManager.save(st, xuid, sid, comps)) {
            output.success(StrFactory.cmdSuccess(`已从文件 ${res.file} 导入结构到玩家 ${res.playerName} 的保存中, 结构id: ${sid} 名称: ${st.name}`))
            const player = mc.getPlayer(xuid);
            if(player != null) player.sendText(StrFactory.cmdTip(`接收到从服务端导入的结构, 已存入"我的结构"中, 结构id: ${sid} 名称: ${st.name}`));
        }
        else {
            throw new Error(`结构导入时保存失败`);
        }
    }
}