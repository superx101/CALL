import { Vector2 } from './Vector2';

const _vector = new Vector2();

class Box2 {
  readonly isBox2 = true;
  min: Vector2;
  max: Vector2;

  constructor(min = new Vector2(+Infinity, +Infinity), max = new Vector2(-Infinity, -Infinity)) {
    this.min = min;
    this.max = max;
  }

  set(min: Vector2, max: Vector2) {
    this.min.copy(min);
    this.max.copy(max);

    return this;
  }

  setFromPoints(points: Vector2[]) {
    this.makeEmpty();

    for (let i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i]);
    }

    return this;
  }

  setFromCenterAndSize(center: Vector2, size: Vector2) {
    const halfSize = _vector.copy(size).multiplyScalar(0.5);
    this.min.copy(center).sub(halfSize);
    this.max.copy(center).add(halfSize);

    return this;
  }

  clone() {
    return new Box2().copy(this);
  }

  copy(box: Box2) {
    this.min.copy(box.min);
    this.max.copy(box.max);

    return this;
  }

  makeEmpty() {
    this.min.x = +Infinity;
    this.min.y = +Infinity;
    this.max.x = -Infinity;
    this.max.y = -Infinity;

    return this;
  }

  isEmpty() {
    return (this.max.x < this.min.x) || (this.max.y < this.min.y);
  }

  getCenter(target?: Vector2) {
    if (target === undefined) {
      console.warn('THREE.Box2: .getCenter() target is now required');
      target = new Vector2();
    }

    return this.isEmpty()
      ? target.set(0, 0)
      : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }

  getSize(target?: Vector2) {
    if (target === undefined) {
      console.warn('THREE.Box2: .getSize() target is now required');
      target = new Vector2();
    }

    return this.isEmpty() ? target.set(0, 0) : target.subVectors(this.max, this.min);
  }

  expandByPoint(point: Vector2) {
    this.min.min(point);
    this.max.max(point);

    return this;
  }

  expandByVector(vector: Vector2) {
    this.min.sub(vector);
    this.max.add(vector);

    return this;
  }

  expandByScalar(scalar: number) {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);

    return this;
  }

  containsPoint(point: Vector2) {
    return !(point.x < this.min.x || point.x > this.max.x ||
			point.y < this.min.y || point.y > this.max.y);
  }

  containsBox(box: Box2) {
    return this.min.x <= box.min.x && box.max.x <= this.max.x &&
			this.min.y <= box.min.y && box.max.y <= this.max.y;
  }

  getParameter(point: Vector2, target?: Vector2) {
    // This can potentially have a divide by zero if the box
    // has a size dimension of 0.

    if (target === undefined) {
      console.warn('THREE.Box2: .getParameter() target is now required');
      target = new Vector2();
    }

    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
    );
  }

  intersectsBox(box: Box2) {
    // using 4 splitting planes to rule out intersections

    return !(box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y);
  }

  clampPoint(point: Vector2, target?: Vector2) {
    if (target === undefined) {
      console.warn('THREE.Box2: .clampPoint() target is now required');
      target = new Vector2();
    }

    return target.copy(point).clamp(this.min, this.max);
  }

  distanceToPoint(point: Vector2) {
    const clampedPoint = _vector.copy(point).clamp(this.min, this.max);
    return clampedPoint.sub(point).length();
  }

  intersect(box: Box2) {
    this.min.max(box.min);
    this.max.min(box.max);

    return this;
  }

  union(box: Box2) {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  translate(offset: Vector2) {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  }

  equals(box: Box2) {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}

export { Box2 };
