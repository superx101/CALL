import { Box3 } from './Box3';
import { Vector3 } from './Vector3';
import type { Matrix4 } from './Matrix4';

const _box = new Box3();
const _v1 = new Vector3();
const _toFarthestPoint = new Vector3();
const _toPoint = new Vector3();

class Sphere {
  readonly isSphere = true;
  center: Vector3;
  radius: number;

  constructor(center = new Vector3(), radius = -1) {
    this.center = center;
    this.radius = radius;
  }

  set(center: Vector3, radius: number) {
    this.center.copy(center);
    this.radius = radius;

    return this;
  }

  setFromPoints(points: Vector3[], optionalCenter?: Vector3) {
    const { center } = this;

    if (optionalCenter !== undefined) {
      center.copy(optionalCenter);
    } else {
      _box.setFromPoints(points).getCenter(center);
    }

    let maxRadiusSq = 0;

    for (let i = 0, il = points.length; i < il; i++) {
      maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
    }

    this.radius = Math.sqrt(maxRadiusSq);

    return this;
  }

  copy(sphere: Sphere) {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;

    return this;
  }

  isEmpty() {
    return (this.radius < 0);
  }

  makeEmpty() {
    this.center.set(0, 0, 0);
    this.radius = -1;

    return this;
  }

  containsPoint(point: Vector3) {
    return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
  }

  distanceToPoint(point: Vector3) {
    return (point.distanceTo(this.center) - this.radius);
  }

  intersectsSphere(sphere: Sphere) {
    const radiusSum = this.radius + sphere.radius;

    return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
  }

  intersectsBox(box: Box3) {
    return box.intersectsSphere(this);
  }

  clampPoint(point: Vector3, target?: Vector3) {
    const deltaLengthSq = this.center.distanceToSquared(point);

    if (target === undefined) {
      console.warn('THREE.Sphere: .clampPoint() target is now required');
      target = new Vector3();
    }

    target.copy(point);

    if (deltaLengthSq > (this.radius * this.radius)) {
      target.sub(this.center).normalize();
      target.multiplyScalar(this.radius).add(this.center);
    }

    return target;
  }

  getBoundingBox(target?: Box3) {
    if (target === undefined) {
      console.warn('THREE.Sphere: .getBoundingBox() target is now required');
      target = new Box3();
    }

    if (this.isEmpty()) {
      // Empty sphere produces empty bounding box
      target.makeEmpty();
      return target;
    }

    target.set(this.center, this.center);
    target.expandByScalar(this.radius);

    return target;
  }

  applyMatrix4(matrix: Matrix4) {
    this.center.applyMatrix4(matrix);
    this.radius *= matrix.getMaxScaleOnAxis();

    return this;
  }

  translate(offset: Vector3) {
    this.center.add(offset);

    return this;
  }

  expandByPoint(point: Vector3) {
    // from https://github.com/juj/MathGeoLib/blob/2940b99b99cfe575dd45103ef20f4019dee15b54/src/Geometry/Sphere.cpp#L649-L671

    _toPoint.subVectors(point, this.center);

    const lengthSq = _toPoint.lengthSq();

    if (lengthSq > (this.radius * this.radius)) {
      const length = Math.sqrt(lengthSq);
      const missingRadiusHalf = (length - this.radius) * 0.5;

      // Nudge this sphere towards the target point. Add half the missing distance to radius,
      // and the other half to position. This gives a tighter enclosure, instead of if
      // the whole missing distance were just added to radius.

      this.center.add(_toPoint.multiplyScalar(missingRadiusHalf / length));
      this.radius += missingRadiusHalf;
    }

    return this;
  }

  union(sphere: Sphere) {
    // from https://github.com/juj/MathGeoLib/blob/2940b99b99cfe575dd45103ef20f4019dee15b54/src/Geometry/Sphere.cpp#L759-L769

    // To enclose another sphere into this sphere, we only need to enclose two points:
    // 1) Enclose the farthest point on the other sphere into this sphere.
    // 2) Enclose the opposite point of the farthest point into this sphere.

    _toFarthestPoint
      .subVectors(sphere.center, this.center)
      .normalize()
      .multiplyScalar(sphere.radius);

    this.expandByPoint(_v1.copy(sphere.center).add(_toFarthestPoint));
    this.expandByPoint(_v1.copy(sphere.center).sub(_toFarthestPoint));

    return this;
  }

  equals(sphere: Sphere) {
    return sphere.center.equals(this.center) && (sphere.radius === this.radius);
  }

  clone() {
    return new Sphere().copy(this);
  }
}

export { Sphere };
