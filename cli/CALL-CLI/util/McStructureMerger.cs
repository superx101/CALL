using System.Collections.Concurrent;
using CALL_CLI.math;
using SharpNBT;

namespace CALL_CLI.util;

public class McStructureMerger
{
    private readonly List<Tuple<Vec2, McStructure>> _subStructures = [];
    private readonly Dictionary<McStructure, Dictionary<int, int>> _lv2GvDict = new();
    private readonly McStructure _dist;
    private readonly bool _includeEntity;

    private readonly Dictionary<string, int> _blockPaletteDict = new();
    private readonly List<CompoundTag> _blockPaletteList = [];
    private readonly ConcurrentDictionary<string, CompoundTag> _blockPositionDataDict = new();
    private readonly ConcurrentBag<CompoundTag> _entityList = [];

    public McStructureMerger(string path, string name, Vec2 chunkSize, bool includeEntity)
    {
        McStructure? lastStructure = null;
        for (var x = 0; x < chunkSize.X; x++)
        {
            for (var z = 0; z < chunkSize.Y; z++)
            {
                var filePath = $"{path}/{name}_{x}_{z}.mcstructure";
                var tag = NbtFile.Read<CompoundTag>(filePath, FormatOptions.BedrockFile);
                var subStructure = new McStructure(tag);
                lastStructure = subStructure;

                _subStructures.Add(new Tuple<Vec2, McStructure>(new Vec2(x, z), subStructure));
            }
        }

        var size = new Vec3(
            (chunkSize.X - 1) * TransfromUtil.Instance.SingleChunkSize.X + lastStructure!.Size.X,
            lastStructure!.Size.Y,
            (chunkSize.Y - 1) * TransfromUtil.Instance.SingleChunkSize.Y + lastStructure.Size.Z
        );
        _dist = new McStructure(size);

        _includeEntity = includeEntity;
    }

    public McStructure Merge()
    {
        Console.Log("Starting pre-build...");
        foreach (var subStructure in _subStructures)
        {
            PreBuild(subStructure.Item2);
        }
        Console.Log("Pre-build completed, starting parallel build...");
        
        Console.Log("Building indices and entities in parallel...");
        var currentStep = 0;
        var tasks = _subStructures.Select(meta =>
            Task.Run(() =>
            {
                ParallelBuildStructure(meta.Item1, meta.Item2);
                int step = Interlocked.Increment(ref currentStep);
                Console.Log($"Progress: {step} of {_subStructures.Count}");
            }));
        Task.WaitAll(tasks.ToList());
        
        Console.Log("Parallel build completed, merging all builds...");
        MergeAllBuild();
        Console.Log("All builds merged successfully.");

        return _dist;
    }

    private void PreBuild(McStructure child)
    {
        // merge entity
        if (_includeEntity)
        {
            foreach (var entity in child.Entities)
            {
                _dist.Entities.Add((CompoundTag)entity);
            }
        }
        
        // merge block palette
        var localVarToGlobalVar = new Dictionary<int, int>();
        for (var i = 0; i < child.BlockPalette.Count; i++)
        {
            var blockPalette = (CompoundTag)child.BlockPalette[i];
            var key = blockPalette.ToJson();
            if (!_blockPaletteDict.TryGetValue(key, out var globalPaletteIndex))
            {
                globalPaletteIndex = _blockPaletteList.Count;
                _blockPaletteList.Add(blockPalette);
                _blockPaletteDict[key] = globalPaletteIndex;
            }
            localVarToGlobalVar[i] = globalPaletteIndex;
        }
        _lv2GvDict[child] = localVarToGlobalVar;
    }
    
    private void ParallelBuildStructure(Vec2 chunkPos, McStructure child)
    {
        BuildIndices(chunkPos, child);
        BuildEntity(child);
    }

    private void BuildIndices(Vec2 chunkPos, McStructure child)
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

                    var local = TransfromUtil.Instance.PosToIndex(pos, localSize);
                    var global = TransfromUtil.Instance.LocalPosToGlobalIndex(chunkPos, pos, _dist.Size);
                    ProcessBlock(local, global, child);
                }
            }
        }
    }

    private void ProcessBlock(int local, int global, McStructure child)
    {
        // build index
        var localPrimaryValue = ((IntTag)child.PrimaryIndices[local]).Value;
        var localSecondaryValue = ((IntTag)child.SecondaryIndices[local]).Value;

        var lv2Gv = _lv2GvDict[child];
        
        _dist.PrimaryIndices[global] = TagUtil.Instance.IntTagBucket(lv2Gv[localPrimaryValue]);
        if (localSecondaryValue > 0)
        {
            _dist.SecondaryIndices[global] = TagUtil.Instance.IntTagBucket(lv2Gv[localSecondaryValue]);
        }

        // build block_position_data
        if (!child.BlockPositionData.ContainsKey(local.ToString())) return;
        
        var data = child.BlockPositionData[local.ToString()];
        _blockPositionDataDict.TryAdd(global.ToString(), (CompoundTag)data);
    }

    private void BuildEntity(McStructure child)
    {
        if (!_includeEntity) return;
        foreach (var entity in child.Entities)
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