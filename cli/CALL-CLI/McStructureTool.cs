using CALL_CLI.math;
using CALL_CLI.util;

namespace CALL_CLI;

public class McStructureTool
{
    public void Import(ImportOptions options)
    {
        var includeEntities = !options.ExcludeEntities;

        if (!Directory.Exists(options.SourcePath))
        {
            Console.WriteLine($"Source path '{options.SourcePath}' does not exist.");
            return;
        }
        
        var splitter = new McStrcutureSplitter(
            options.SourcePath, 
            includeEntities
        );
        splitter.Split();

        if (!Directory.Exists(options.OutputDir))
        {
            Console.Write("Output directory does not exist. Creating it...");
            Directory.CreateDirectory(options.OutputDir);
        }
        
        splitter.SaveAll(options.OutputDir, options.StructureName);
        Console.WriteLine($"Import success! saved: {options.OutputDir}");
    }
    
    public void Export(ExportOptions options)
    {
        var sizeParts = options.Size.Split(',');
        var size = new Vec3(
            int.Parse(sizeParts[0]),
            int.Parse(sizeParts[1]),
            int.Parse(sizeParts[2])
        );

        var includeEntities = !options.ExcludeEntities;
        
        if (!Directory.Exists(options.SourceDir))
        {
            Console.WriteLine($"Source directory '{options.SourceDir}' does not exist.");
            return;
        }
        
        var merger = new McStructureMerger(
            options.SourceDir, 
            options.StructureName, 
            size, 
            includeEntities
        );
        merger.Merge();
        
        if (!Directory.Exists(Path.GetDirectoryName(options.OutputFile)))
        {
            Console.Write("Output directory does not exist. Creating it...");
            Directory.CreateDirectory(Path.GetDirectoryName(options.OutputFile)!);
        }
        
        merger.Save(options.OutputFile);
        Console.WriteLine($"Export success! saved: {options.OutputFile}");
    }
}