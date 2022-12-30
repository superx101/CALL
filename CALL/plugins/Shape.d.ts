/// <reference path="E:\Mincraft_File\bedrock\lib\HelperLib\src/index.d.ts"/> 

declare {
    namespace SHP {
        const THREE: {
            BufferGeometry: BufferGeometry,
            BoxGeometry: BoxGeometry,
            Interpolant: Interpolant,
            Triangle: Triangle,
            Spherical: Spherical,
            Cylindrical: Cylindrical,
            Plane: Plane,
            Frustum: Frustum,
            Sphere: Sphere,
            Ray: Ray,
            Matrix4: Matrix4,
            Matrix3: Matrix3,
            Box3: Box3,
            Box2: Box2,
            Line3: Line3,
            Euler: Euler,
            Vector4: Vector4,
            Vector3: Vector3,
            Vector2: Vector2
        };
        const Message: {
            warn(player: Player, str: string, mode = 0): void;
            error(player: Player, str: string, mode = 0): void;
            info(player: Player, str: string, mode = 0): void;
            success(player: Player, str: string, mode = 0): void;
        };
        function export_cmd(callback: (player: Player, index: number, intPos: IntPos, param: JSON) => { pos: IntPos, arr: [] }): void;
        function export_form(callback: (player: Player, index: number, intPos: IntPos) => void): void;
        function export_tutorial(callback: () => any): void;
        function getData(player: Player): { posA: IntPos, posB: IntPos, itemAIndex: number, itemBIndex: number, itemA: Item, itemB: Item }
        function registerPackage(name: string, shapeNames: string[], introduction: string, shapeImages: string[], icon: string): void;
        function setBlock(x: number, y: number, z: number, block_palette = '{"name":"minecraft:concrete","states":{"color":"white"},"version":17959425}', block_position_data = null): { x: number, y: number, z: number, block_palette: string, block_position_data: string };
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
} 