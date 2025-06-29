namespace CALL_CLI.util;

public abstract class Singleton<T> where T : Singleton<T>, new()
{
    private static readonly Lazy<T> _instance = new Lazy<T>(() => new T());

    public static T Instance => _instance.Value;

    protected Singleton()
    {
        if (_instance.IsValueCreated)
        {
            throw new InvalidOperationException("Singleton instance already created.");
        }
    }
}