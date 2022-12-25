import * as jsonpath from 'fast-json-patch'

export default class JsonPatch {
    public static delete = 'delete'
    public static create = 'create'
    public static patch = 'patch'
    public static mkDir = 'mkDir'

    private static deleteFuc(path: string) {
        return File.delete(path); 
    }

    private static createFuc(path: string, value: string) {
        return File.writeTo(path, value);
    }

    private static patchFuc(path: string, patch: any) {
        const jsonString = File.readFrom(path).replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
        return File.writeTo(path, JSON.stringify(jsonpath.applyPatch(JSON.parse(jsonString), patch).newDocument));
    }

    private static mkDirFuc(path: string) {
        return File.createDir(path);
    }

    public static runArray(arr: Array<any>) {
        arr.forEach(v=>{
            JsonPatch.run(v);
        });
    }

    public static run(obj: any) {
        try {
            switch (obj.type) {
                case JsonPatch.patch:
                    return JsonPatch.patchFuc(obj.path, obj.patch);
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