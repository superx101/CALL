import path = require("path");
import Config from "../common/Config";
import ExportService from "./ExportService";
import StrFactory from "../util/StrFactory";
import * as ProgressBar from "cli-progress"
import Tr from "../util/Translator";
import { Type } from "../common/Structure";

export default class ExportOperation {
    public static async start(res: {type: string, id: string, includeEntity?: boolean, Name?: string}, output: CommandOutput) {
        let content: string | ByteBuffer;
        let isBinary = false;
        const st = ExportService.checkStructure(res.id);//检查结构存在
        const fileName = (res.Name == null ? st.name : res.Name);
        //进度条
        const bar = new ProgressBar.Bar({
            format: '{title}: {bar} | {percentage}% | {value}/{total} | {duration_formatted}'
        }, ProgressBar.Presets.shades_classic);

        function initProgress(max: number) {
            bar.start(max, 0, {
                title: Tr._c("console.ExportOperation.start.exporting")
            });
        }

        function updateProgres(current: number) {
            bar.update(current);
        }

        //转化为导出格式
        switch (res.type) {
            case Type.MCSTRUCTURE:
                content = await ExportService.toMcstructure(st, res.id, res.includeEntity, initProgress, updateProgres);
                isBinary = true;
                break;
            default:
                bar.stop();
                throw new Error(Tr._c("console.ExportOperation.start.notFind"));
        }
        //写入文件
        if(ExportService.writeFile(content, fileName, res.type, isBinary)) {
            output.success(StrFactory.cmdSuccess(Tr._c("console.ExportOperation.start.success", `${res.id}`, `${path.join(process.cwd(), Config.EXPORT)}/${fileName}.${res.type}`)))
        }
        else {
            bar.stop();
            throw new Error(Tr._c("console.ExportOperation.start.fail", `${fileName}`));
        }
        bar.stop();
    }
}