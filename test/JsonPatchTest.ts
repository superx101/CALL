import JsonPatch from "../src/util/JsonPatch";
import TestUtil from "./TestUtil";
import * as fs from "fs";

export default class JsonPatchTest {
    public static preTest() {
        const test = new TestUtil("JsonPatch");
        const root = "./plugins/CALL/temp/jsonpatch.json";
        const obj = {
            a: 1,
            b: "2",
            c: { "c1": 1.2233, "c2": [1, 2, 3] },
            d: false
        }

        test.check("delete file",
            () => {
                fs.writeFileSync(root, JSON.stringify(obj));
                JsonPatch.run({
                    type: JsonPatch.delete,
                    path: root
                });
            },
            (res: any) => {
                if(fs.existsSync(root)) {
                    fs.unlinkSync(root);
                    return { success: false, msg: "not delete" };
                }
                return { success: true, msg: "" };
            });

        test.check("patch_add",
            () => {
                fs.writeFileSync(root, JSON.stringify(obj));
                JsonPatch.run({
                    type: JsonPatch.patch,
                    path: root,
                    patch: [
                        {
                            "op": "add",
                            "path": "/test",
                            "value": "testContent"
                        }
                    ]
                });
                return;
            }, (res: any) => {
                let obj1 = JSON.parse(fs.readFileSync(root, "utf-8"));
                fs.unlinkSync(root);
                if (TestUtil.objEqual(obj1, obj)) return { success: false, msg: "not add" };
                if (obj1["test"] === "testContent") return { success: true, msg: "" };
                else return { success: false, msg: "not find test:testContent" };
            })

        test.check("patch_remove", 
        () => {
            fs.writeFileSync(root, JSON.stringify(obj));
            JsonPatch.run({
                type: JsonPatch.patch,
                path: root,
                patch: [
                    {
                        "op": "remove",
                        "path": "/c"
                    }
                ]
            });
            return;
        }, 
        (res: any) => {
            let obj1 = JSON.parse(fs.readFileSync(root, "utf-8"));
            fs.unlinkSync(root);
            if (TestUtil.objEqual(obj1, obj)) return { success: false, msg: "not remove" };
            if (obj1["c"] === undefined) return { success: true, msg: "" };
            else return { success: false, msg: "not remove c" };
        });

        test.check("patchPlusAdd",
            () => {
                fs.writeFileSync(root, JSON.stringify(obj));
                JsonPatch.run({
                    type: JsonPatch.patch_plus,
                    path: root,
                    patch: [
                        {
                            "op": "add",
                            "path": "/c",
                            "name": "c3",
                            "value": "3"
                        }
                    ]
                })
                return;
            },
            (res: any) => {
                let obj1 = JSON.parse(fs.readFileSync(root, "utf-8"));
                fs.unlinkSync(root);
                if (TestUtil.objEqual(obj1, obj)) return { success: false, msg: "not add" };
                if (obj1["c"]["c3"] === "3") return { success: true, msg: "" };
                else return { success: false, msg: "not find c" };
            });
    }
}