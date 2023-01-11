import path = require("path");
import Config from "../common/Config";
import ExportManager from "../manager/ExportManager";
import { Type } from "../type/Structure";
import StrFactory from "../util/StrFactory";
import * as ProgressBar from "cli-progress"

export default class ExportOperation {
    public static start(res: {type: string, id: string, includeEntity?: boolean, Name?: string}, output: CommandOutput) {
        let content: string | ByteBuffer;
        let isBinary = false;
        const st = ExportManager.checkStructure(res.id);//检查结构存在
        const fileName = (res.Name == null ? st.name : res.Name);
        //进度条
        const bar = new ProgressBar.Bar({
            format: '{title}: {bar} | {percentage}% | {value}/{total} | {duration_formatted}'
        }, ProgressBar.Presets.shades_classic);

        function initProgress(max: number) {
            bar.start(max, 0, {
                title: '导出结构中'
            });
        }

        function updateProgres(current: number) {
            bar.update(current);
        }

        //转化为导出格式
        switch (res.type) {
            case Type.MCSTRUCTURE:
                content = ExportManager.toMcstructure(st, res.id, res.includeEntity, initProgress, updateProgres);
                isBinary = true;
                break;
            default:
                bar.stop();
                throw new Error("无法识别导出格式");
        }
        //写入文件
        if(ExportManager.writeFile(content, fileName, res.type, isBinary)) {
            output.success(StrFactory.cmdSuccess(`已导出结构 ${res.id} 到服务端, 路径: ${path.join(process.cwd(), Config.EXPORT)}/${fileName}.${res.type}`))
        }
        else {
            bar.stop();
            throw new Error(`写入文件${fileName}失败`);
        }
        bar.stop();
    }
}