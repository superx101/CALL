import ImportService from "./ImportService";
import StrFactory from "../util/StrFactory";
import { Structure, Type } from "../common/Structure";
import Area3 from "../common/Area3";
import { Pos3 } from "../common/Pos3";
import StructureService from "../structure/StructureService";
import * as ProgressBar from "cli-progress";
import Tr from "../util/Translator";

export default class ImportOperation {
    public static async start(
        res: {
            file: string;
            playerName: string;
            includeEntity?: boolean;
            Name?: string;
        },
        output: CommandOutput
    ) {
        let xuid;
        if (res.playerName.startsWith("xuid-")) xuid = res.playerName.slice(5);
        else xuid = ImportService.findXuidByName(res.playerName);
        const file = ImportService.readFile(res.file);
        const sid = StructureService.generateSid();
        let comp: NbtCompound;

        switch (file.type) {
            case Type.MCSTRUCTURE:
                comp = NBT.parseBinaryNBT(file.data);
                break;
            default:
                break;
        }

        const size = (comp.getData("size") as NbtList).toArray();
        const st = new Structure(
            new Area3(
                new Pos3(0, 0, 0, 0),
                new Pos3(size[0] - 1, size[1] - 1, size[2] - 1, 0)
            ),
            res.Name
        );

        //初始化进度条
        const bar = new ProgressBar.Bar(
            {
                format: "{title}: {bar} | {percentage}% | {value}/{total} | {duration_formatted}",
            },
            ProgressBar.Presets.shades_classic
        );
        bar.start(size[0] * size[1] * size[2], 0, {
            title: Tr._c("console.ImportOperation.start.importing"),
        });

        //去除实体
        if (res.includeEntity == null || !res.includeEntity) {
            let structure = comp.getData("structure") as NbtCompound;
            structure.setTag("entities", new NbtList());
            comp.setTag("structure", structure);
        }

        //拆解结构
        const comps = await ImportService.separate(
            st,
            comp,
            (current: number) => {
                bar.update(current); //更新进度
            }
        );

        bar.stop();

        //保存
        if (ImportService.save(st, xuid, sid, comps)) {
            output.success(
                StrFactory.cmdSuccess(
                    Tr._c(
                        "console.ImportOperation.start.success",
                        res.file,
                        res.playerName,
                        sid,
                        st.name
                    )
                )
            );
            const player = mc.getPlayer(xuid);
            if (player != null)
                player.sendText(
                    StrFactory.cmdTip(
                        Tr._(
                            player.langCode,
                            "dynamic.ImportOperation.start.success",
                            sid,
                            st.name
                        )
                    )
                );
            logger.info("import success");
        } else {
            throw new Error(Tr._c("console.ImportOperation.start.fail"));
        }
    }
}
