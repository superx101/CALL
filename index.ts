//LiteLoaderScript Dev Helper
/// <reference path="E:\\Mincraft_File\\bedrock\\lib\\HelperLib\\src/index.d.ts"/> 

// app should be main file, but there is an dir error in LiteLoaderBDS-nodejs
import { main } from './src/app';
import Test from './test/Test';

Test.preTest();
main();
Test.postTest();