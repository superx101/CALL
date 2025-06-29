using CALL_CLI.math;
using SharpNBT;

namespace CALL_CLI.util;

public class TransfromUtil : Singleton<TransfromUtil>
{
    public Vec2 SingleChunkSize { get; set; }

    public Vec2 GetChunkSizeByGlobalSize(int x, int z)
    {
        return new Vec2(
            x / SingleChunkSize.X + (x % SingleChunkSize.X > 0 ? 1 : 0),
            z / SingleChunkSize.Y + (z % SingleChunkSize.Y > 0 ? 1 : 0)
        );
    }

    public int PosToIndex(Vec3 pos, Vec3 size)
    {
        return (pos.X * size.Z * size.Y) + (pos.Y * size.Z) + pos.Z;
    }

    public Vec3 LocalPosToGlobalPos(Vec2 chunkPos, Vec3 v)
    {
        return new Vec3(
            chunkPos.X * SingleChunkSize.X + v.X,
            v.Y,
            chunkPos.Y * SingleChunkSize.Y + v.Z
        );
    }

    public int LocalPosToGlobalIndex(Vec2 chunkPos, Vec3 v, Vec3 globalSize)
    {
        var globalPos = LocalPosToGlobalPos(chunkPos, v);
        return PosToIndex(globalPos, globalSize);
    }
}