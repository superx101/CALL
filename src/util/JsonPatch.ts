import * as jsonpath from 'fast-json-patch'

export default class JsonPatch {
    public static delete = 'delete'
    public static create = 'create'
    public static patch = 'patch'
    public static patch_plus = 'patch_plus'
    public static mkDir = 'mkDir'

    private static deleteFuc(path: string) {
        return File.delete(path);
    }

    private static createFuc(path: string, value: string) {
        return File.writeTo(path, value);
    }

    private static patchFuc(path: string, patch: any) {
        const jsonString = File.readFrom(path).replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
        return File.writeTo(path, JSON.stringify(jsonpath.applyPatch(JSON.parse(jsonString), patch).newDocument, null, 2));
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
          current = current[part]
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

    private static patchInsert(obj: any, path: any, to: string, value: any): any {
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

        paths.forEach((directory: string) => {
            //获取数据
            const data = JsonPatch.getData(obj, directory);
            // log(data)
            JsonPatch.setData(obj, directory, value);//替换
            JsonPatch.setData(obj, directory + to, data);//拼接
        })

        return obj;
    }

    private static patchPlusFuc(path: string, patch: any) {
        function selectFuc(patch: any, obj: any): any {
            switch (patch.op) {
                case "insert":
                    return JsonPatch.patchInsert(obj, patch.path, patch.to, patch.value);
            }
        }

        let obj = JSON.parse(File.readFrom(path));
        if (patch == undefined) return false;
        if (Array.isArray(patch)) {
            patch.forEach((v: any) => {
                obj = selectFuc(v, obj);
            })
        } else {
            obj = selectFuc(patch, obj);
        }

        return File.writeTo(path, JSON.stringify(obj, null, 2));
    }

    private static mkDirFuc(path: string) {
        return File.createDir(path);
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