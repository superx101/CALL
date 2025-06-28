import * as jsonpath from 'fast-json-patch'
import * as fs from "fs"
import Tr from './Translator'

export default class JsonPatch {
    public static delete = 'delete'
    public static create = 'create'
    public static patch = 'patch'
    public static patch_plus = 'patch_plus'
    public static mkDir = 'mkDir'

    private static deleteFuc(path: string) {
        fs.unlinkSync(path);
        return !fs.existsSync(path)
    }

    private static createFuc(path: string, value: string) {
        fs.writeFileSync(path, value);
        return true;
    }

    private static patchFuc(path: string, patch: any) {
        const jsonString = File.readFrom(path).replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
        const data = JSON.stringify(jsonpath.applyPatch(JSON.parse(jsonString), patch).newDocument, null, 2);

        try {
            fs.writeFileSync(path, data);
            return true;
        }
        catch(ex) {
            logger.error(Tr._c("console.JsonPatch.patchFuc.s0", path, data));
            return false;
        }
    }

    /**
     * @returns pointer
     */
    private static getData(obj: any, path: string): any {
        if (!path.startsWith('/')) {
            path = '/' + path;
        }

        const pathParts = path.split('/').filter(part => part !== '');
        let current = obj;

        for (const part of pathParts) {
            current = current[part];
        }
        return current;
    }

    private static setData(obj: any, path: string, value: any): any {
        const arr = path.split('/');
        const fatherPath = arr.slice(0, -1).join('/');
        const lastPath = arr.slice(-1)[0];

        let father = JsonPatch.getData(obj, fatherPath);
        if (father != null) {
            father[lastPath] = value;
            return true;
        }
        else {
            return false;
        }
    }

    private static getPaths(obj: any, path: any): string[] {
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        const segs: string[] = path.split("/");
        const treeArr: Array<Array<string>> = [];
        const queue: string[] = [];
        const paths: string[] = [];
        const regex = /\*(?!\*)/;

        if (regex.test(path)) {
            queue.push(path);

            //生成详细目录
            let pointer: any = obj;
            segs.forEach((value) => {
                const keys = Object.keys(pointer);
                if (value === "*") {
                    treeArr.push(keys);
                }
                if (keys.includes(value)) {
                    pointer = pointer[value];
                }
            })

            //替换所有*
            let starIndex = 0;
            while (queue.length > 0) {
                let path = queue.shift();
                let temp: string[] = [];
                treeArr[starIndex].forEach((v: string) => {
                    temp.push(path.replace(regex, v))
                })
                starIndex++;
                temp.forEach((v: string) => {
                    if (regex.test(v)) {
                        queue.push(v);
                    } else {
                        paths.push(v);
                    }
                });
            }
        } else {
            paths.push(path);
        }

        return paths;
    }

    /**
     * add data in exist json
     * 
     * @example: {a: {b: 1, c: 2}} ---- add d:3 to a ---> {a: {b: 1, c: 2, d: 3}}
     */
    private static patchPlusAdd(obj: any, path: any, name: any, value: any): any {
        JsonPatch.getPaths(obj, path).forEach((directory: string) => {
            let json = JsonPatch.getData(obj, directory);
            json[`${name}`] = value;
            JsonPatch.setData(obj, directory, json);
        });

        return obj;
    }

    /**
     * insert path in exist json
     * 
     * @example /a/b/c/d --- insert i to c ---> /a/b/c/i/d
     */
    private static patchPlusInsert(obj: any, path: any, to: string, value: any): any {
        JsonPatch.getPaths(obj, path).forEach((directory: string) => {
            //获取数据
            const data = JsonPatch.getData(obj, directory);
            JsonPatch.setData(obj, directory, value);//替换
            JsonPatch.setData(obj, directory + to, data);//拼接
        })

        return obj;
    }

    private static patchPlusFuc(path: string, patch: any) {
        function selectFuc(patch: any, obj: any): any {
            switch (patch.op) {
                case "insert":
                    return JsonPatch.patchPlusInsert(obj, patch.path, patch.to, patch.value);
                case "add":
                    return JsonPatch.patchPlusAdd(obj, patch.path, patch.name, patch.value);
            }
        }

        let obj = JSON.parse(fs.readFileSync(path, "utf-8"));
        if (patch == undefined) return false;
        if (Array.isArray(patch)) {
            patch.forEach((v: any) => {
                obj = selectFuc(v, obj);
            })
        } else {
            obj = selectFuc(patch, obj);
        }

        const data = JSON.stringify(obj, null, 2);
        try {
            fs.writeFileSync(path, data);
            return true;
        }
        catch(ex) {
            logger.error(Tr._c("console.JsonPatch.patchFuc.s0", path, data));
            return false;
        }
    }

    private static mkDirFuc(path: string) {
        if(fs.existsSync(path)) {
            return true;
        }
        try {
            fs.mkdirSync(path);
            return true;
        }
        catch(e) {
            logger.error(Tr._c("console.JsonPatch.mkDirFuc.s2", path))
            return false; 
        }
    }

    public static runArray(arr: Array<any>) {
        arr.forEach(v => {
            JsonPatch.run(v);
        });
    }

    public static run(obj: any) {
        try {
            switch (obj.type) {
                case JsonPatch.patch:
                    return JsonPatch.patchFuc(obj.path, obj.patch);
                case JsonPatch.patch_plus:
                    return JsonPatch.patchPlusFuc(obj.path, obj.patch);
                case JsonPatch.create:
                    return JsonPatch.createFuc(obj.path, obj.value);
                case JsonPatch.delete:
                    return JsonPatch.deleteFuc(obj.path);
                case JsonPatch.mkDir:
                    return JsonPatch.mkDirFuc(obj.path);
            }
        }
        catch (e) {
            logger.debug(e.message)
        }
    }
}

Object.freeze(JsonPatch.create)
Object.freeze(JsonPatch.delete)
Object.freeze(JsonPatch.patch)