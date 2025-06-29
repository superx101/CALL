using CommandLine;

namespace CALL_CLI;

public abstract class BaseOptions
{
    [Option('e', "entities", Default = true, HelpText = "Exclude entities from processing")]
    public bool IncludeEntities { get; set; }
    
    [Option('c', "chunk-size", Default = "64,64", HelpText = "Single Chunk size in X,Y format (default: 64,64)")]
    public string ChunkSize { get; set; }
}

[Verb("import", HelpText = "Import .mcstructure file to Minecraft structure")]
public class ImportOptions : BaseOptions
{
    [Value(0, MetaName = "source", Required = true, HelpText = "Source .mcstructure file path")]
    public string SourcePath { get; set; }

    [Value(1, MetaName = "name", Required = true, HelpText = "Target structure name")]
    public string StructureName { get; set; }

    [Value(2, MetaName = "output", Required = true, HelpText = "Output directory path")]
    public string OutputDir { get; set; }
}

[Verb("export", HelpText = "Export Minecraft structure to .mcstructure file")]
public class ExportOptions : BaseOptions
{
    [Value(0, MetaName = "source", Required = true, HelpText = "Source structure directory")]
    public string SourceDir { get; set; }

    [Value(1, MetaName = "name", Required = true, HelpText = "Structure name to export")]
    public string StructureName { get; set; }

    [Value(2, MetaName = "output", Required = true, HelpText = "Output .mcstructure file path")]
    public string OutputFile { get; set; }

    [Option('s', "size", Required = true, HelpText = "Structure size in X,Y,Z format")]
    public string Size { get; set; }
}