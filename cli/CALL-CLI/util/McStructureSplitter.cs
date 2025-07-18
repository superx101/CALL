﻿using CALL_CLI.math;
using SharpNBT;

namespace CALL_CLI.util;

public class McStructureSplitter
{
    private readonly McStructure _source;
    private Tuple<Vec2, McStructure>[] _dists = [];
    private readonly bool _includeEntity;

    public McStructureSplitter(string path, bool includeEntity)
    {
        _includeEntity = includeEntity;

        var tag = NbtFile.Read<CompoundTag>(path, FormatOptions.BedrockFile);
        _source = new McStructure(tag);
    }

    public Tuple<Vec2, McStructure>[] Split()
    {
        var size = _source.Size;
        var chuckSize = TransfromUtil.Instance.GetChunkSizeByGlobalSize(size.X, size.Z);

        var tasks = new List<Task<Tuple<Vec2, McStructure>>>();
        var currentStep = 0;

        Console.Log($"Splitting structure into {chuckSize.X}x{chuckSize.Y} partitions, total size: {size.X}x{size.Y}x{size.Z}");
        for (var ix = 0; ix < chuckSize.X; ix++)
        {
            for (var iz = 0; iz < chuckSize.Y; iz++)
            {
                var a = new Vec2(ix * TransfromUtil.Instance.SingleChunkSize.X,
                    iz * TransfromUtil.Instance.SingleChunkSize.Y);
                var b = new Vec2(
                    a.X + Math.Min(TransfromUtil.Instance.SingleChunkSize.X, size.X - a.X),
                    a.Y + Math.Min(TransfromUtil.Instance.SingleChunkSize.Y, size.Z - a.Y)
                );
                var bound = new Aabb2(a, b);

                var chunkPos = new Vec2(ix, iz);
                var chuckCount = chuckSize.Area;
                tasks.Add(Task.Run(() =>
                {
                    var result = SplitChunk(bound, chunkPos);
                    
                    var step = Interlocked.Increment(ref currentStep);
                    Console.Log($"Processing partition {step} of {chuckCount} at position {chunkPos}");

                    return result;
                }));
            }
        }
        Task.WaitAll(tasks.ToList());
        Console.Log("All partitions processed");
        
        _dists = tasks.Select(t => t.Result).ToArray();
        return _dists;
    }

    private Tuple<Vec2, McStructure> SplitChunk(Aabb2 bound, Vec2 chunkPos)
    {
        var boundRange = bound.B - bound.A;
        var size = new Vec3(boundRange.X, _source.Size.Y, boundRange.Y);
        var child = new McStructure(size);

        CopyBlockPalette(child);
        if (_includeEntity)
        {
            CopyEntity(bound, child);
        }

        var v = new Vec3(0, 0, 0);
        for (var x = 0; x < size.X; x++)
        {
            for (var y = 0; y < size.Y; y++)
            {
                for (var z = 0; z < size.Z; z++)
                {
                    v.Set(x, y, z);

                    var local = TransfromUtil.Instance.PosToIndex(v, child.Size);
                    var global = TransfromUtil.Instance.LocalPosToGlobalIndex(chunkPos, v, _source.Size);
                    ProcessBlock(local, global, child);
                }
            }
        }

        return new Tuple<Vec2, McStructure>(chunkPos, child);
    }

    private void CopyBlockPalette(McStructure child)
    {
        child.BlockPalette = _source.BlockPalette;
    }

    private void CopyEntity(Aabb2 bound, McStructure child)
    {
        var v2 = new Vec2f(0, 0);
        foreach (var entity in _source.Entities)
        {
            var posTag = (ListTag)((CompoundTag)entity)["Pos"];
            var pos = new Vec3f(
                ((FloatTag)posTag[0]).Value,
                ((FloatTag)posTag[1]).Value,
                ((FloatTag)posTag[2]).Value
            );

            v2.Set(pos.X, pos.Z);
            if (!bound.InBound(v2))
            {
                continue;
            }

            child.Entities.Add(entity);
        }
    }

    private void ProcessBlock(int local, int global, McStructure child)
    {
        // set indices
        child.PrimaryIndices[local] = _source.PrimaryIndices[global];
        child.SecondaryIndices[local] = _source.SecondaryIndices[global];

        // set position data
        if (_source.BlockPositionData.ContainsKey(global.ToString()))
        {
            child.BlockPositionData[local.ToString()] =
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