using CALL_CLI.math;
using CALL_CLI.util;
using Console = CALL_CLI.util.Console;

namespace CALL_CLI;

public class McStructureTool
{
    public void Import(ImportOptions options)
    {
        Console.Log("Start importing...");
        SetChunkSize(options);

        if (!Path.Exists(options.SourcePath))
        {
            Console.Log($"Source path '{options.SourcePath}' does not exist.");
            return;
        }

        var splitter = new McStructureSplitter(
            options.SourcePath,
            options.IncludeEntities
        );
        splitter.Split();

        if (!Directory.Exists(options.OutputDir))
        {
            Console.Log("Output directory does not exist. Creating it...");
            Directory.CreateDirectory(options.OutputDir);
        }

        splitter.SaveAll(options.OutputDir, options.StructureName);
        Console.Log($"Import success! saved: {options.OutputDir}");
    }

    public void Export(ExportOptions options)
    {
        Console.Log("Start exporting...");
        SetChunkSize(options);

        var sizeParts = options.Size.Split(',');
        var size = new Vec2(
            int.Parse(sizeParts[0]),
            int.Parse(sizeParts[1])
        );

        if (!Directory.Exists(options.SourceDir))
        {
            Console.Log($"Source directory '{options.SourceDir}' does not exist.");
            return;
        }

        var merger = new McStructureMerger(
            options.SourceDir,
            options.StructureName,
            size,
            options.IncludeEntities
        );
        merger.Merge();

        if (!Directory.Exists(Path.GetDirectoryName(options.OutputFile)))
        {
            Console.Log("Output directory does not exist. Creating it...");
            Directory.CreateDirectory(Path.GetDirectoryName(options.OutputFile)!);
        }

        merger.Save(options.OutputFile);
        Console.Log($"Export success! saved: {options.OutputFile}");
    }

    private void SetChunkSize(BaseOptions options)
    {
        var sizeParts = options.ChunkSize.Split(',');
        TransfromUtil.Instance.SingleChunkSize = new Vec2(int.Parse(sizeParts[0]), int.Parse(sizeParts[1]));
    }
}