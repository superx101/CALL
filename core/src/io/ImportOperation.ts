import ImportService from "./ImportService";
import StrFactory from "../util/StrFactory";
import { Structure, Type } from "../common/Structure";
import Area3 from "../common/Area3";
import { Pos3 } from "../common/Pos3";
import StructureService from "../structure/StructureService";
import * as ProgressBar from "cli-progress";
import Tr from "../util/Translator";
import NBTService from "../structure/NBTService";
import path from "path";
import Config from "../common/Config";
import { CLI_EXE_PATH } from "./Utils";
import { spawn } from "child_process";
import Constant from "../temp/Constant";
import { FileMode } from "../temp/Common";

export default class ImportOperation {
    /**
     * @deprecated
     */
    public static async oldStart(
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

        const bar = new ProgressBar.Bar(
            {
                format: "{title}: {bar} | {percentage}% | {value}/{total} | {duration_formatted}",
            },
            ProgressBar.Presets.shades_classic
        );
        bar.start(size[0] * size[1] * size[2], 0, {
            title: Tr._c("console.ImportOperation.start.importing"),
        });

        if (res.includeEntity == null || !res.includeEntity) {
            let structure = comp.getData("structure") as NbtCompound;
            structure.setTag("entities", new NbtList());
            comp.setTag("structure", structure);
        }

        const comps = await ImportService.separate(
            st,
            comp,
            (current: number) => {
                bar.update(current);
            }
        );

        bar.stop();

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

    public static async start(
        options: {
            file: string;
            playerName: string;
            includeEntity?: boolean;
            Name?: string;
        },
        output: CommandOutput
    ) {
        let xuid: string;
        if (options.playerName.startsWith("xuid-"))
            xuid = options.playerName.slice(5);
        else xuid = ImportService.findXuidByName(options.playerName);

        const sid = StructureService.generateSid();
        const sourcePath = path.join(
            process.cwd(),
            Config.IMPORT_PATH,
            options.file
        );

        const file = new File(sourcePath, FileMode.ReadMode, true);
        const bnbt = file.readAllSync();
        //@ts-ignore
        const nbt = NBT.parseBinaryNBT(bnbt);

        const size = (nbt.getData("size") as NbtList).toArray();

        const params = [
            "import",
            `${sourcePath}`,
            sid,
            `${NBTService.PATH}`,
            "--entities",
            options.includeEntity ? "true" : "false",
            "--chunk-size",
            `${Constant.STRUCTURE.MAX_LENGTH},${Constant.STRUCTURE.MAX_HIGHT}`,
        ];

        const child = spawn(CLI_EXE_PATH, params);
        child.stdout.on("data", (data) => {
            const output: string = data.toString();

            output.split("--LOG--").forEach((v) => {
                const tirm = v.trim();
                if (tirm === "") return;

                logger.info(tirm);

                if (tirm.startsWith("Import success"))
                    ImportOperation.onSuccess(
                        options,
                        size,
                        sid,
                        xuid,
                        options.Name
                    );
            });
        });
        child.stderr.on("data", (data) => {
            logger.error(data.toString());
        });
    }

    private static onSuccess(
        options: {
            file: string;
            playerName: string;
            includeEntity?: boolean;
            Name?: string;
        },
        size: number[],
        sid: string,
        xuid: string,
        name?: string
    ) {
        const structure = new Structure(
            new Area3(
                new Pos3(0, 0, 0, 0),
                new Pos3(size[0] - 1, size[1] - 1, size[2] - 1, 0)
            ),
            name
        );

        // save player's reference
        const data = StructureService.getData(xuid);
        data.saveList[sid] = structure;
        StructureService.setData(xuid, data);

        logger.info(
            Tr._c(
                "console.ImportOperation.start.success",
                options.file,
                options.playerName,
                sid,
                name
            )
        );
    }
}
