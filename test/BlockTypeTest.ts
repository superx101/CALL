import TestUtil from "./TestUtil";
import BlockType from "../src/common/BlockType";

export default class BlockTypeTest {
    public static preTest() {
        const test = new TestUtil("BlockType");
        test.equal("nbtToStates_normal", ()=>{
            var nbt = new NbtCompound({
                "a": new NbtInt(3),
                "b": new NbtString("test"),
                "c": new NbtByte(0),
                "d": new NbtByte(1),
                "e": new NbtLong(66666)
            });
            return BlockType.nbtToStates(nbt);
        }, `["a"=3,"b"="test","c"=false,"d"=true,"e"=66666]`);

        test.equal("nbtToStates_empty", ()=>{
            var nbt = new NbtCompound({});
            return BlockType.nbtToStates(nbt);
        }, `[]`);
    }
}