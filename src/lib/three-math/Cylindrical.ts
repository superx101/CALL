/**
 * Ref: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
 */

import type { Vector3 } from './Vector3';

class Cylindrical {
  readonly isCylindrical = true;
  radius: number;
  theta: number;
  y: number;

  constructor(radius = 1, theta = 0, y = 0) {
    // distance from the origin to a point in the x-z plane
    this.radius = radius;
    // counterclockwise angle in the x-z plane measured in radians from the positive z-axis
    this.theta = theta;
    // height above the x-z plane
    this.y = y;

    return this;
  }

  set(radius: number, theta: number, y: number) {
    this.radius = radius;
    this.theta = theta;
    this.y = y;

    return this;
  }

  copy(other: Cylindrical) {
    this.radius = other.radius;
    this.theta = other.theta;
    this.y = other.y;

    return this;
  }

  setFromVector3(v: Vector3) {
    return this.setFromCartesianCoords(v.x, v.y, v.z);
  }

  setFromCartesianCoords(x: number, y: number, z: number) {
    this.radius = Math.sqrt(x * x + z * z);
    this.theta = Math.atan2(x, z);
    this.y = y;

    return this;
  }

  clone() {
    return new Cylindrical().copy(this);
  }
}

export { Cylindrical };
