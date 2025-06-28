import type { Quaternion } from './Quaternion';

const _lut: string[] = [];

for (let i = 0; i < 256; i++) {
  _lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

let _seed = 1234567;

const MathUtils = {

  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,

  generateXuid() {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-xuid-in-javascript/21963136#21963136

    /* eslint-disable */
    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
    const xuid = `${_lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] }-${
      _lut[d1 & 0xff] }${_lut[d1 >> 8 & 0xff] }-${ _lut[d1 >> 16 & 0x0f | 0x40] }${_lut[d1 >> 24 & 0xff] }-${
      _lut[d2 & 0x3f | 0x80] }${_lut[d2 >> 8 & 0xff] }-${ _lut[d2 >> 16 & 0xff] }${_lut[d2 >> 24 & 0xff]
    }${_lut[d3 & 0xff] }${_lut[d3 >> 8 & 0xff] }${_lut[d3 >> 16 & 0xff] }${_lut[d3 >> 24 & 0xff]}`;
    /* eslint-enable */

    // .toUpperCase() here flattens concatenated strings to save heap memory space.
    return xuid.toUpperCase();
  },

  clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  },

  // compute euclidian modulo of m % n
  // https://en.wikipedia.org/wiki/Modulo_operation

  euclideanModulo(n: number, m: number) {
    return ((n % m) + m) % m;
  },

  // Linear mapping from range <a1, a2> to range <b1, b2>

  mapLinear(x: number, a1: number, a2: number, b1: number, b2: number) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  },

  // https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/

  inverseLerp(x: number, y: number, value: number) {
    if (x !== y) {
      return (value - x) / (y - x);
    }
    return 0;
  },

  // https://en.wikipedia.org/wiki/Linear_interpolation

  lerp(x: number, y: number, t: number) {
    return (1 - t) * x + t * y;
  },

  // http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/

  damp(x: number, y: number, lambda: number, dt: number) {
    return MathUtils.lerp(x, y, 1 - Math.exp(-lambda * dt));
  },

  // https://www.desmos.com/calculator/vcsjnyz7x4

  pingpong(x: number, length = 1) {
    return length - Math.abs(MathUtils.euclideanModulo(x, length * 2) - length);
  },

  // http://en.wikipedia.org/wiki/Smoothstep

  smoothstep(x: number, min: number, max: number) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
  },

  smootherstep(x: number, min: number, max: number) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x * (x * (x * 6 - 15) + 10);
  },

  // Random integer from <low, high> interval

  randInt(low: number, high: number) {
    return low + Math.floor(Math.random() * (high - low + 1));
  },

  // Random float from <low, high> interval

  randFloat(low: number, high: number) {
    return low + Math.random() * (high - low);
  },

  // Random float from <-range/2, range/2> interval

  randFloatSpread(range: number) {
    return range * (0.5 - Math.random());
  },

  // Deterministic pseudo-random float in the interval [ 0, 1 ]

  seededRandom(s?: number) {
    if (s !== undefined) _seed = s % 2147483647;

    // Park-Miller algorithm

    _seed = (_seed * 16807) % 2147483647;

    return (_seed - 1) / 2147483646;
  },

  degToRad(degrees: number) {
    return degrees * MathUtils.DEG2RAD;
  },

  radToDeg(radians: number) {
    return radians * MathUtils.RAD2DEG;
  },

  isPowerOfTwo(value: number) {
    // eslint-disable-next-line
    return (value & (value - 1)) === 0 && value !== 0;
  },

  ceilPowerOfTwo(value: number) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
  },

  floorPowerOfTwo(value: number) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
  },

  setQuaternionFromProperEuler(q: Quaternion, a: number, b: number, c: number, order: string) {
    // Intrinsic Proper Euler Angles - see https://en.wikipedia.org/wiki/Euler_angles

    // rotations are applied to the axes in the order specified by 'order'
    // rotation by angle 'a' is applied first, then by angle 'b', then by angle 'c'
    // angles are in radians

    const { cos } = Math;
    const { sin } = Math;

    const c2 = cos(b / 2);
    const s2 = sin(b / 2);

    const c13 = cos((a + c) / 2);
    const s13 = sin((a + c) / 2);

    const c1_3 = cos((a - c) / 2);
    const s1_3 = sin((a - c) / 2);

    const c3_1 = cos((c - a) / 2);
    const s3_1 = sin((c - a) / 2);

    switch (order) {
      case 'XYX':
        q.set(c2 * s13, s2 * c1_3, s2 * s1_3, c2 * c13);
        break;

      case 'YZY':
        q.set(s2 * s1_3, c2 * s13, s2 * c1_3, c2 * c13);
        break;

      case 'ZXZ':
        q.set(s2 * c1_3, s2 * s1_3, c2 * s13, c2 * c13);
        break;

      case 'XZX':
        q.set(c2 * s13, s2 * s3_1, s2 * c3_1, c2 * c13);
        break;

      case 'YXY':
        q.set(s2 * c3_1, c2 * s13, s2 * s3_1, c2 * c13);
        break;

      case 'ZYZ':
        q.set(s2 * s3_1, s2 * c3_1, c2 * s13, c2 * c13);
        break;

      default:
        console.warn(`THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: ${ order}`);
    }
  },

};


export { MathUtils };
