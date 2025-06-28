using CommandLine;

namespace CALL_CLI;

public abstract class BaseOptions
{
    [Option('e', "include-entities", Default = true, HelpText = "Exclude entities from processing")]
    public bool ExcludeEntities { get; set; }
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