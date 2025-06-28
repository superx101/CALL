using CALL_CLI.math;
using SharpNBT;

namespace CALL_CLI.util;

class McStrcutureSplitter
{
    private readonly McStructure _source;
    private Tuple<Vec2, McStructure>[] _dists = [];
    private readonly bool _includeEntity;

    public McStrcutureSplitter(string path, bool includeEntity)
    {
        _includeEntity = includeEntity;
        
        var tag = NbtFile.Read<CompoundTag>(path, FormatOptions.BedrockFile);
        _source = new McStructure(tag);
    }

    public Tuple<Vec2, McStructure>[] Split()
    {
        var size = _source.Size;
        var chuckSize = new Vec2(
            size.X / 64 + size.X % 64 > 0 ? 1 : 0,
            size.Z / 64 + size.Z % 64 > 0 ? 1 : 0
        );

        var tasks = new List<Task<Tuple<Vec2, McStructure>>>();

        for (var ix = 0; ix < chuckSize.X; ix++)
        {
            for (var iz = 0; iz < chuckSize.Y; iz++)
            {
                var a = new Vec2(ix * 64, iz * 64);
                var b = new Vec2(
                    a.X + Math.Min(64, size.X - a.X),
                    a.Y + Math.Min(64, size.Z - a.Y)
                );
                var bound = new Aabb2(a, b);

                tasks.Add(Task.Run(() => SplitChunk(bound, new Vec2(ix, iz))));
            }
        }

        Task.WaitAll(tasks.ToArray());
        _dists = tasks.Select(t => t.Result).ToArray();
        return _dists;
    }

    private Tuple<Vec2, McStructure> SplitChunk(Aabb2 bound, Vec2 chunkPos)
    {
        var boundRange = bound.B - bound.A;
        var size = new Vec3(boundRange.X, _source.Size.Y, boundRange.Y);

        var tag = new McStructure(size);

        CopyBlockPalette(tag);
        if (_includeEntity)
        {
            CopyEntity(bound, tag);
        }

        var v = new Vec3(0, 0, 0);
        for (var x = 0; x < size.X; x++)
        {
            for (var y = 0; y < size.Y; y++)
            {
                for (var z = 0; z < size.Z; z++)
                {
                    v.Set(x, y, z);

                    var localSize = tag.Size;
                    var local = TransfromUtil.PosToIndex(v, localSize);
                    var global = TransfromUtil.LocalPosToGlobalIndex(chunkPos, v);
                    ProcessBlock(global, local, tag);
                }
            }
        }

        return new Tuple<Vec2, McStructure>(chunkPos, tag);
    }

    private void CopyBlockPalette(McStructure tag)
    {
        tag.BlockPalette = _source.BlockPalette;
    }

    private void CopyEntity(Aabb2 bound, McStructure tag)
    {
        var v2 = new Vec2f(0, 0);
        foreach (var entity in _source.Entities)
        {
            var posTag = (ListTag)((CompoundTag)entity)["Pos"];
            var pos = new Vec3f(
                ((DoubleTag)posTag[0]).Value,
                ((DoubleTag)posTag[1]).Value,
                ((DoubleTag)posTag[2]).Value
            );

            v2.Set((float)pos.X, (float)pos.Z);
            if (!bound.InBound(v2))
            {
                continue;
            }

            tag.Entities.Add(entity);
        }
    }

    private void ProcessBlock(int global, int local, McStructure distTag)
    {
        // set indices
        distTag.PrimaryIndices[local] = _source.PrimaryIndices[global];
        distTag.SecondaryIndices[local] = _source.SecondaryIndices[global];

        // set position data
        if (_source.BlockPositionData.ContainsKey(global.ToString()))
        {
            distTag.BlockPositionData[local.ToString()] =
                _source.BlockPositionData[global.ToString()];
        }
    }

    public void SaveAll(string dir, string name)
    {
        foreach (var tagMeta in _dists)
        {
            var distPath = $"{dir}/{name}_{tagMeta.Item1.X}_{tagMeta.Item1.Y}.mcstructure";
            NbtFile.Write(distPath, tagMeta.Item2.Tag, FormatOptions.BedrockFile, CompressionType.None);
        }
    }
}