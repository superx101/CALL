namespace CALL_CLI.util;

public class Console
{
    public static void Log(string message)
    {
        System.Console.Write("--LOG--");
        System.Console.WriteLine(message);
        System.Console.Out.Flush();
    }
}