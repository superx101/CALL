import { Vector3 } from './Vector3';
import type { Sphere } from './Sphere';
import type { Triangle } from './Triangle';
import type { Matrix4 } from './Matrix4';

class Box3 {
  readonly isBox3 = true;
  min: Vector3;
  max: Vector3;
  constructor(
    min = new Vector3(+Infinity, +Infinity, +Infinity),
    max = new Vector3(-Infinity, -Infinity, -Infinity),
  ) {
    this.min = min;
    this.max = max;
  }

  set(min: Vector3, max: Vector3) {
    this.min.copy(min);
    this.max.copy(max);

    return this;
  }

  setFromArray(array: number[]) {
    let minX = +Infinity;
    let minY = +Infinity;
    let minZ = +Infinity;

    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    for (let i = 0, l = array.length; i < l; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (z < minZ) minZ = z;

      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      if (z > maxZ) maxZ = z;
    }

    this.min.set(minX, minY, minZ);
    this.max.set(maxX, maxY, maxZ);

    return this;
  }

  setFromPoints(points: Vector3[]) {
    this.makeEmpty();

    for (let i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i]);
    }

    return this;
  }

  setFromCenterAndSize(center: Vector3, size: Vector3) {
    const halfSize = _vector.copy(size).multiplyScalar(0.5);

    this.min.copy(center).sub(halfSize);
    this.max.copy(center).add(halfSize);

    return this;
  }

  clone() {
    return new Box3().copy(this);
  }

  copy(box: Box3) {
    this.min.copy(box.min);
    this.max.copy(box.max);

    return this;
  }

  makeEmpty() {
    this.min.x = +Infinity;
    this.min.y = +Infinity;
    this.min.z = +Infinity;

    this.max.x = -Infinity;
    this.max.y = -Infinity;
    this.max.z = -Infinity;

    return this;
  }

  isEmpty() {
    return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
  }

  getCenter(target?: Vector3) {
    if (target === undefined) {
      console.warn('THREE.Box3: .getCenter() target is now required');
      target = new Vector3();
    }

    return this.isEmpty()
      ? target.set(0, 0, 0)
      : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }

  getSize(target?: Vector3) {
    if (target === undefined) {
      console.warn('THREE.Box3: .getSize() target is now required');
      target = new Vector3();
    }

    return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
  }

  expandByPoint(point: Vector3) {
    this.min.min(point);
    this.max.max(point);

    return this;
  }

  expandByVector(vector: Vector3) {
    this.min.sub(vector);
    this.max.add(vector);

    return this;
  }

  expandByScalar(scalar: number) {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);

    return this;
  }

  containsPoint(point: Vector3) {
    return !(point.x < this.min.x || point.x > this.max.x ||
			point.y < this.min.y || point.y > this.max.y ||
			point.z < this.min.z || point.z > this.max.z);
  }

  containsBox(box: Box3) {
    return this.min.x <= box.min.x && box.max.x <= this.max.x &&
			this.min.y <= box.min.y && box.max.y <= this.max.y &&
			this.min.z <= box.min.z && box.max.z <= this.max.z;
  }

  getParameter(point: Vector3, target?: Vector3) {
    // This can potentially have a divide by zero if the box
    // has a size dimension of 0.

    if (target === undefined) {
      console.warn('THREE.Box3: .getParameter() target is now required');
      target = new Vector3();
    }

    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
      (point.z - this.min.z) / (this.max.z - this.min.z),
    );
  }

  intersectsBox(box: Box3) {
    // using 6 splitting planes to rule out intersections.
    return !(box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ||
			box.max.z < this.min.z || box.min.z > this.max.z);
  }

  intersectsSphere(sphere: Sphere) {
    // Find the point on the AABB closest to the sphere center.
    this.clampPoint(sphere.center, _vector);

    // If that point is inside the sphere, the AABB and sphere intersect.
    return _vector.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
  }

  intersectsTriangle(triangle: Triangle) {
    if (this.isEmpty()) {
      return false;
    }

    // compute box center and extents
    this.getCenter(_center);
    _extents.subVectors(this.max, _center);

    // translate triangle to aabb origin
    _v0.subVectors(triangle.a, _center);
    _v1.subVectors(triangle.b, _center);
    _v2.subVectors(triangle.c, _center);

    // compute edge vectors for triangle
    _f0.subVectors(_v1, _v0);
    _f1.subVectors(_v2, _v1);
    _f2.subVectors(_v0, _v2);

    let axes = [
      0, -_f0.z, _f0.y, 0, -_f1.z, _f1.y, 0, -_f2.z, _f2.y,
      _f0.z, 0, -_f0.x, _f1.z, 0, -_f1.x, _f2.z, 0, -_f2.x,
      -_f0.y, _f0.x, 0, -_f1.y, _f1.x, 0, -_f2.y, _f2.x, 0,
    ];
    if (!satForAxes(axes, _v0, _v1, _v2, _extents)) {
      return false;
    }

    // test 3 face normals from the aabb
    axes = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    if (!satForAxes(axes, _v0, _v1, _v2, _extents)) {
      return false;
    }

    // finally testing the face normal of the triangle
    // use already existing triangle edge vectors here
    _triangleNormal.crossVectors(_f0, _f1);
    axes = [_triangleNormal.x, _triangleNormal.y, _triangleNormal.z];

    return satForAxes(axes, _v0, _v1, _v2, _extents);
  }

  clampPoint(point: Vector3, target?: Vector3) {
    if (target === undefined) {
      console.warn('THREE.Box3: .clampPoint() target is now required');
      target = new Vector3();
    }

    return target.copy(point).clamp(this.min, this.max);
  }

  distanceToPoint(point: Vector3) {
    const clampedPoint = _vector.copy(point).clamp(this.min, this.max);

    return clampedPoint.sub(point).length();
  }

  getBoundingSphere(target: Sphere) {
    this.getCenter(target.center);

    target.radius = this.getSize(_vector).length() * 0.5;

    return target;
  }

  intersect(box: Box3) {
    this.min.max(box.min);
    this.max.min(box.max);

    if (this.isEmpty()) this.makeEmpty();

    return this;
  }

  union(box: Box3) {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  applyMatrix4(matrix: Matrix4) {
    // transform of empty box is an empty box.
    if (this.isEmpty()) return this;

    // NOTE: I am using a binary pattern to specify all 2^3 combinations below
    _points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
    _points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
    _points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
    _points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
    _points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
    _points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
    _points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
    _points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

    this.setFromPoints(_points);

    return this;
  }

  translate(offset: Vector3) {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  }

  equals(box: Box3) {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}

const _points = [
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
];

const _vector = new Vector3();

// triangle centered vertices

const _v0 = new Vector3();
const _v1 = new Vector3();
const _v2 = new Vector3();

// triangle edge vectors

const _f0 = new Vector3();
const _f1 = new Vector3();
const _f2 = new Vector3();

const _center = new Vector3();
const _extents = new Vector3();
const _triangleNormal = new Vector3();
const _testAxis = new Vector3();

//@ts-ignore
function satForAxes(axes, v0, v1, v2, extents) {
  for (let i = 0, j = axes.length - 3; i <= j; i += 3) {
    _testAxis.fromArray(axes, i);
    // project the aabb onto the seperating axis
    const r = extents.x * Math.abs(_testAxis.x)
    + extents.y * Math.abs(_testAxis.y)
    + extents.z * Math.abs(_testAxis.z);
    // project all 3 vertices of the triangle onto the seperating axis
    const p0 = v0.dot(_testAxis);
    const p1 = v1.dot(_testAxis);
    const p2 = v2.dot(_testAxis);
    // actual test, basically see if either of the most extreme of the triangle points intersects r
    if (Math.max(-Math.max(p0, p1, p2), Math.min(p0, p1, p2)) > r) {
      // points of the projected triangle are outside the projected half-length of the aabb
      // the axis is seperating and we can exit
      return false;
    }
  }

  return true;
}

export { Box3 };
