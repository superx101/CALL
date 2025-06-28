using CALL_CLI.math;

namespace CALL_CLI.util;

public class TransfromUtil
{
    public static int Vec3ToSize(Vec3 v)
    {
        return v.X * v.Y * v.Z;
    }
    
    public static int PosToIndex(Vec3 pos, Vec3 size)
    {
        return (pos.X * size.Z * size.Y) + (pos.Y * size.Z) + pos.Z;
    }
    
    public static Vec3 LocalPosToGlobalPos(Vec2 chunkPos, Vec3 v)
    {
        return new Vec3(
            chunkPos.X * 64 + v.X,
            v.Y,
            chunkPos.Y * 64 + v.Z
        );
    }
    
    public static int LocalPosToGlobalIndex(Vec2 chunkPos, Vec3 v)
    {
        var globalPos = LocalPosToGlobalPos(chunkPos, v);
        return PosToIndex(globalPos, new Vec3(64, v.Y, 64));
    }
}