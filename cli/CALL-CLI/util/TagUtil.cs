using SharpNBT;

namespace CALL_CLI.util;

public class TagUtil
{
    private static Dictionary<int, IntTag> _intTagBucket = [];
    
    public static IntTag IntTagBucket(int n)
    {
        if(_intTagBucket.TryGetValue(n, out var tag))
        {
            return tag;
        }
        
        tag = new IntTag(null, n);
        _intTagBucket[n] = tag;
        return tag;
    }
}