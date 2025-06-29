import path from "path";
import Config from "../common/Config";
import ExportService from "./ExportService";
import StrFactory from "../util/StrFactory";
import * as ProgressBar from "cli-progress";
import Tr from "../util/Translator";
import { Structure, Type } from "../common/Structure";
import { spawn } from "child_process";
import { CLI_EXE_PATH } from "./Utils";
import NBTService from "../structure/NBTService";
import Constant from "../temp/Constant";

export default class ExportOperation {
    /**
     * @deprecated
     */
    public static async oldStart(
        res: {
            type: string;
            id: string;
            includeEntity?: boolean;
            Name?: string;
        },
        output: CommandOutput
    ) {
        let content: string | ByteBuffer;
        let isBinary = false;
        const st = ExportService.checkStructure(res.id);
        const fileName = res.Name == null ? st.name : res.Name;

        const bar = new ProgressBar.Bar(
            {
                format: "{title}: {bar} | {percentage}% | {value}/{total} | {duration_formatted}",
            },
            ProgressBar.Presets.shades_classic
        );

        function initProgress(max: number) {
            bar.start(max, 0, {
                title: Tr._c("console.ExportOperation.start.exporting"),
            });
        }

        function updateProgres(current: number) {
            bar.update(current);
        }

        //转化为导出格式
        switch (res.type) {
            case Type.MCSTRUCTURE:
                content = await ExportService.toMcstructure(
                    st,
                    res.id,
                    res.includeEntity,
                    initProgress,
                    updateProgres
                );
                isBinary = true;
                break;
            default:
                bar.stop();
                throw new Error(Tr._c("console.ExportOperation.start.notFind"));
        }

        //写入文件
        if (ExportService.writeFile(content, fileName, res.type, isBinary)) {
            logger.log(
                Tr._c(
                    "console.ExportOperation.start.success",
                    `${res.id}`,
                    `${path.join(
                        process.cwd(),
                        Config.EXPORT_PATH
                    )}/${fileName}.${res.type}`
                )
            );
            output.success(
                StrFactory.cmdSuccess(
                    Tr._c(
                        "console.ExportOperation.start.success",
                        `${res.id}`,
                        `${path.join(
                            process.cwd(),
                            Config.EXPORT_PATH
                        )}/${fileName}.${res.type}`
                    )
                )
            );
        } else {
            bar.stop();
            throw new Error(
                Tr._c("console.ExportOperation.start.fail", `${fileName}`)
            );
        }
        bar.stop();
    }

    public static async start(options: {
        type: string;
        id: string;
        includeEntity?: boolean;
        Name?: string;
    }) {
        let structure: Structure;
        try {
            structure = ExportService.checkStructure(options.id);
        } catch (error) {
            logger.warn(error.message);
            return;
        }

        const outputName = options.Name == null ? structure.name : options.Name;

        const areas = structure.getAreas();
        const size = [areas[0].length, areas.length];

        const params = [
            "export",
            `${NBTService.PATH}`,
            options.id,
            `${path.join(Config.EXPORT_PATH, outputName, ".mcstructure")}`,
            "--size",
            `${size[0]},${size[1]}`,
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

                if (tirm.startsWith("Export success")) {
                    logger.info(
                        Tr._c(
                            "console.ExportOperation.start.success",
                            `${options.id}`,
                            `${path.join(
                                process.cwd(),
                                Config.EXPORT_PATH
                            )}/${outputName}.${options.type}`
                        )
                    );
                }
            });
        });
        child.stderr.on("data", (data) => {
            logger.error(data.toString());
        });
    }
}
