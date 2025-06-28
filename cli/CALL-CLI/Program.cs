using CommandLine;
using CommandLine.Text;

namespace CALL_CLI;

class Program
{
    private static int Main(string[] args)
    {
        var tool = new McStructureTool();
        
        return Parser.Default.ParseArguments<ImportOptions, ExportOptions>(args)
            .MapResult(
                (ImportOptions opts) => { tool.Import(opts); return 0; },
                (ExportOptions opts) => { tool.Export(opts); return 0; },
                errs => HandleParseError(errs)
            );
    }

    static int HandleParseError(IEnumerable<Error> errs)
    {
        return 1;
    }
}