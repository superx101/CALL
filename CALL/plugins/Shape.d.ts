/// <reference path="E:\Mincraft_File\bedrock\lib\HelperLib\src/index.d.ts"/> 

declare namespace THREE {
    class BufferGeometry { }
    class BoxGeometry { }
    class Interpolant { }
    class Triangle { }
    class Spherical { }
    class Cylindrical { }
    class Plane { }
    class Frustum { }
    class Sphere { }
    class Ray { }
    class Matrix4 { }
    class Matrix3 { }
    class Box3 { }
    class Box2 { }
    class Line3 { }
    class Euler { }
    class Vector4 { }
    class Vector3 { }
    class Vector2 { }
}

declare namespace SHP {
    const THREE: {
        BufferGeometry: THREE.BufferGeometry,
        BoxGeometry: THREE.BoxGeometry,
        Interpolant: THREE.Interpolant,
        Triangle: THREE.Triangle,
        Spherical: THREE.Spherical,
        Cylindrical: THREE.Cylindrical,
        Plane: THREE.Plane,
        Frustum: THREE.Frustum,
        Sphere: THREE.Sphere,
        Ray: THREE.Ray,
        Matrix4: THREE.Matrix4,
        Matrix3: THREE.Matrix3,
        Box3: THREE.Box3,
        Box2: THREE.Box2,
        Line3: THREE.Line3,
        Euler: THREE.Euler,
        Vector4: THREE.Vector4,
        Vector3: THREE.Vector3,
        Vector2: THREE.Vector2
    };
    const Message: {
        warn(player: Player, str: string, mode?: number): void;
        error(player: Player, str: string, mode?: number): void;
        info(player: Player, str: string, mode?: number): void;
        success(player: Player, str: string, mode?: number): void;
    };
    function export_cmd(callback: (player: Player, index: number, intPos: IntPos, param: JSON) => { pos: IntPos, arr: [] }): void;
    function export_form(callback: (player: Player, index: number, intPos: IntPos) => void): void;
    function export_tutorial(callback: () => any): void;
    function getData(player: Player): { posA: IntPos, posB: IntPos, itemAIndex: number, itemBIndex: number, itemA: Item, itemB: Item }
    function listForm(player: Player): void;
    function getVersion(): number[];
    function registerPackage(name: string, shapeNames: string[], introduction: string, shapeImages: string[], icon: string): void;
    function setBlock(x: number, y: number, z: number, block_palette?: string, block_position_data?: string): { x: number, y: number, z: number, block_palette: string, block_position_data: string };
    function getPackageName(): string;
    function getVector3(x: number, y: number, z: number): THREE.Vector3;
    function getVector4(x: number, y: number, z: number, w: number): THREE.Vector4;
    function getMAT4(): THREE.Matrix4;
    function getRoteMAT4(x: number, y: number, z: number, order: "XYZ" | "XZY" | "YXZ" | "YZX" | "ZXY" | "ZYX"): THREE.Matrix4;
    function getScaleMAT4(x: number, y: number, z: number): THREE.Matrix4;
    function getTranslationMAT4(x: number, y: number, z: number): THREE.Matrix4;
    function getShearMAT4(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): THREE.Matrix4;
    function getMirrorMAT4(x: number, y: number, z: number): THREE.Matrix4;
    function transform(shape: { pos: IntPos, arr: [] }, m4: THREE.Matrix4): void;
}