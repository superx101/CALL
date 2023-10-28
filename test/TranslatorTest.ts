import Tr from "../src/util/Translator";
import TestUtil from "./TestUtil";

export default class TranslatorTest {
    public static preTest() {
        const test = new TestUtil("Translator");
        test.equal("translator_en_US", () => {
            return Tr._("en_US", "test.t1");
        }, "test1");

        test.equal("translator_zh_CN", () => {
            return Tr._("zh_CN", "test.t1");
        }, "测试1");

        test.equal("translator_en_US_args_1", () => {
            return Tr._("en_US", "test.args1", "a", "b", "c");
        }, "there are a, b, c");

        test.equal("translator_en_US_args_2", () => {
            return Tr._("en_US", "test.args2", 12, 2.0536, "c");
        }, "there are 12, 2.05, c");

        test.equal("translator_en_US_args_3", () => {
            return Tr._("en_US", "test.args3", "a", "b", "c");
        }, "there are a, b, c");    

        test.equal("translator_not_exist", () => {
            return Tr._("en_US", "test.null");
        }, "");

        // test.equal("translator_param_error1", () => {
        //     return Tr._("en_US", "test.param.error1", "a");
        // }, "");
    }
}