import Config from "../src/common/Config";
import BlockTypeTest from "./BlockTypeTest";
import TranslatorTest from "./TranslatorTest";

export default class Test {
    public static readonly runTest: boolean = Config.get(Config.GLOBAL, "debugMod", false);

    public static preTest() {
        if(!Test.runTest) return;
        BlockTypeTest.run();
        TranslatorTest.run();
    }

    public static postTest() {
        if(!Test.runTest) return;
    }
}