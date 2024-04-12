import { Vec3Tuple } from "../common/Pos3";

export default class StructureNBT extends NbtCompound {
    constructor(
        public format_version: number,
        public size: Vec3Tuple,
        public block_indices: NbtInt[][],
        public entities: NbtList,
        public block_palette: NbtList,
        public block_position_data: NbtCompound,
        public structure_world_origin: Vec3Tuple
    ) {
        super({
            format_version: new NbtInt(format_version),
            size: new NbtList([
                new NbtInt(size[0]),
                new NbtInt(size[1]),
                new NbtInt(size[2]),
            ]),
            structure: new NbtCompound({
                block_indices: new NbtList([
                    new NbtList(block_indices[0]),
                    new NbtList(block_indices[1]),
                ]),
                entities: entities,
                palette: new NbtCompound({
                    default: new NbtCompound({
                        block_palette: block_palette,
                        block_position_data: block_position_data,
                    }),
                }),
            }),
            structure_world_origin: new NbtList([
                new NbtInt(structure_world_origin[0]),
                new NbtInt(structure_world_origin[1]),
                new NbtInt(structure_world_origin[2]),
            ]),
        });
    }
}
