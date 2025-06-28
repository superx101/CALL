using System.Collections.Concurrent;
using CALL_CLI.math;
using SharpNBT;

namespace CALL_CLI.util;

public class McStructureMerger
{
    private readonly List<Tuple<Vec2, McStructure>> _subStructures = [];
    private readonly McStructure _dist;
    private readonly bool _includeEntity;

    private readonly ConcurrentDictionary<string, int> _blockPaletteDict;
    private readonly ConcurrentBag<CompoundTag> _blockPaletteList;
    private readonly ConcurrentDictionary<string, CompoundTag> _blockPositionDataDict;
    private readonly ConcurrentBag<CompoundTag> _entityList;

    public McStructureMerger(string path, string name, Vec3 size, bool includeEntity)
    {
        _includeEntity = includeEntity;

        _dist = new McStructure(size);
        _blockPaletteDict = new ConcurrentDictionary<string, int>();
        _blockPaletteList = [];
        _blockPositionDataDict = new ConcurrentDictionary<string, CompoundTag>();
        _entityList = [];

        var chuckSize = new Vec2(
            size.X / 64 + size.X % 64 > 0 ? 1 : 0,
            size.Z / 64 + size.Z % 64 > 0 ? 1 : 0
        );
        for (var x = 0; x < chuckSize.X; x++)
        {
            for (var z = 0; z < chuckSize.Y; z++)
            {
                var filePath = $"{path}/{name}_{x}_{z}.mcstructure";
                var tag = NbtFile.Read<CompoundTag>(filePath, FormatOptions.BedrockFile);
                var subStructure = new McStructure(tag);
                _subStructures.Add(new Tuple<Vec2, McStructure>(new Vec2(x, z), subStructure));
            }
        }
    }

    public McStructure Merge()
    {
        var tasks = _subStructures.Select(meta =>
            Task.Run(() => ParallelBuildStructure(meta.Item1, meta.Item2)));
        Task.WaitAll(tasks.ToList());

        MergeAllBuild();

        return _dist;
    }

    private void ParallelBuildStructure(Vec2 chunkPos, McStructure child)
    {
        // local value id to global value id
        var localVarToGlobalVar = new Dictionary<int, int>();

        for (var localValue = 0; localValue < child.BlockPalette.Count; localValue++)
        {
            var blockPalette = (CompoundTag)child.BlockPalette[localValue];
            var blockType = ((StringTag)blockPalette["name"]).Value;

            if (!_blockPaletteDict.TryGetValue(blockType, out var globalValue))
            {
                _blockPaletteDict[blockType] = _blockPaletteDict.Count;
                globalValue = _blockPaletteDict.Count;

                _blockPaletteList.Add(blockPalette);
            }

            localVarToGlobalVar.Add(localValue, globalValue);
        }

        BuildIndices(chunkPos, child, localVarToGlobalVar);
    }

    private void BuildIndices(Vec2 chunkPos, McStructure child, Dictionary<int, int> lv2Gv)
    {
        var pos = new Vec3(0, 0, 0);
        var localSize = child.Size;
        for (var x = 0; x < localSize.X; x++)
        {
            for (var y = 0; y < localSize.Y; y++)
            {
                for (var z = 0; z < localSize.Z; z++)
                {
                    pos.Set(x, y, z);
                    var local = TransfromUtil.PosToIndex(pos, localSize);
                    var global = TransfromUtil.LocalPosToGlobalIndex(chunkPos, pos);
                    ProcessBlock(local, global, child, lv2Gv);
                }
            }
        }
    }

    private void ProcessBlock(int local, int global, McStructure tag, Dictionary<int, int> lv2Gv)
    {
        // build index
        var localPrimaryValue = ((IntTag)tag.PrimaryIndices[local]).Value;
        var localSecondaryValue = ((IntTag)tag.SecondaryIndices[local]).Value;

        _dist.PrimaryIndices[global] = TagUtil.IntTagBucket(lv2Gv[localPrimaryValue]);
        if (localSecondaryValue > 0)
        {
            _dist.SecondaryIndices[global] = TagUtil.IntTagBucket(lv2Gv[localSecondaryValue]);
        }

        // build block_position_data
        if (tag.BlockPositionData.ContainsKey(local.ToString()))
        {
            var data = tag.BlockPositionData[local.ToString()];
            _blockPositionDataDict.TryAdd(global.ToString(), (CompoundTag)data);
        }

        // build entity
        if (!_includeEntity) return;
        foreach (var entity in tag.Entities)
        {
            _entityList.Add((CompoundTag)entity);
        }
    }

    private void MergeAllBuild()
    {
        foreach (var palette in _blockPaletteList)
        {
            _dist.BlockPalette.Add(palette);
        }

        foreach (var pair in _blockPositionDataDict)
        {
            _dist.BlockPositionData[pair.Key] = pair.Value;
        }

        foreach (var entity in _entityList)
        {
            _dist.Entities.Add(entity);
        }
    }

    public void Save(string fullPath)
    {
        NbtFile.Write(fullPath, _dist.Tag, FormatOptions.BedrockFile, CompressionType.None);
    }
}