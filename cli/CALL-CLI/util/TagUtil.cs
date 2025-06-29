using System.Collections.Concurrent;
using SharpNBT;

namespace CALL_CLI.util;

public class TagUtil : Singleton<TagUtil>
{
    private readonly ConcurrentDictionary<int, IntTag> _intTagBucket = [];

    public IntTag IntTagBucket(int n)
    {
        return _intTagBucket.GetOrAdd(n, key => new IntTag(null, key));
    }
}