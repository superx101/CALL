/// <reference types="../dist/types/platforms/javascript/src" />
/**
 * app should be main file, but there is an dir error in LiteLoaderBDS-nodejs
 */
import main from "./src/app";
// import Test from './test/Test';

mc.listen("onServerStarted", () => {
    // Test.preTest();
    main();
    // Test.postTest();
});
