using CALL_CLI.math;
using SharpNBT;

namespace CALL_CLI.util;

public class McStructure
{
    public CompoundTag Tag;

    private ListTag SizeTag => (ListTag)Tag["size"];

    public Vec3 Size =>
        new(
            ((IntTag)SizeTag[0]).Value,
            ((IntTag)SizeTag[1]).Value,
            ((IntTag)SizeTag[2]).Value
        );

    private CompoundTag Structure
        => (CompoundTag)Tag["structure"];

    public ListTag PrimaryIndices
        => (ListTag)((ListTag)(Structure["block_indices"]))[0];

    public ListTag SecondaryIndices
        => (ListTag)((ListTag)(Structure["block_indices"]))[1];

    public ListTag Entities => (ListTag)Structure["entities"];

    private CompoundTag Palette => (CompoundTag)Structure["palette"];

    private CompoundTag Default => (CompoundTag)Palette["default"];

    public ListTag BlockPalette
    {
        get => (ListTag)Default["block_palette"];
        set => Default["block_palette"] = value;
    }

    public CompoundTag BlockPositionData => (CompoundTag)Default["block_position_data"];

    public McStructure(Vec3 size)
    {
        Tag = BuildFrame(size);
        Tag["structure"] = BuildStructure(size.Volume);
    }

    public McStructure(CompoundTag tag)
    {
        var sizeTag = ((ListTag)tag["size"]);
        Tag = BuildFrame(
            new Vec3(
                ((IntTag)sizeTag[0]).Value,
                ((IntTag)sizeTag[1]).Value,
                ((IntTag)sizeTag[2]).Value
            )
        );
        Tag["structure"] = tag["structure"];
    }

    private CompoundTag BuildFrame(Vec3 size)
    {
        return (
            new TagBuilder("McStructure")
                .AddInt("format_version", 1)
                .BeginList(TagType.Int, "size")
                .AddInt(size.X).AddInt(size.Y).AddInt(size.Z)
                .EndList()
                .BeginList(TagType.Int, "structure_world_origin")
                .AddInt(0).AddInt(0).AddInt(0)
                .EndList()
                .Create()
        );
    }

    private CompoundTag BuildStructure(int capacity)
    {
        var tag = new TagBuilder("structure")
            .BeginList(TagType.List, "block_indices")
            .EndList()
            .BeginList(TagType.Compound, "entities")
            .EndList()
            .BeginCompound("palette")
            .BeginCompound("default")
            .BeginList(TagType.Compound, "block_palette")
            .EndList()
            .BeginCompound("block_position_data")
            .EndList()
            .EndCompound()
            .EndCompound()
            .Create();

        ((ListTag)tag["block_indices"]).Add(BuildBlockIndexList(capacity));
        ((ListTag)tag["block_indices"]).Add(BuildBlockIndexList(capacity));

        return tag;
    }

    private ListTag BuildBlockIndexList(int capacity)
    {
        var intTag = new IntTag(null, -1);
        var tag = new ListTag(null, TagType.Int, capacity);
        for (var i = 0; i < capacity; i++)
        {
            tag.Add(intTag);
        }

        return tag;
    }
}