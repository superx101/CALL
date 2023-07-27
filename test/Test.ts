import Config from "../src/common/Config";
import BlockTypeTest from "./BlockTypeTest";

export default class Test {
    public static readonly runTest: boolean = Config.get(Config.GLOBAL, "debugMod", false);

    public static preTest() {
        if(!Test.runTest) return;
        BlockTypeTest.run();
    }

    public static postTest() {
        if(!Test.runTest) return;
    }
}