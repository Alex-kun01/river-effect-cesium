/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */

import { a as defaultValue, d as defined } from './when-2eee95b5.js';
import './Check-ed53c783.js';
import { C as CesiumMath } from './Math-d155d327.js';
import { C as Cartesian3 } from './Cartesian2-2623b6cf.js';
import { C as Cartesian4, I as Intersect, M as Matrix4, Q as Quaternion, a as Matrix3, B as BoundingSphere } from './Transforms-77949152.js';
import { C as ComponentDatatype } from './ComponentDatatype-e94d8aff.js';
import { a as GeometryAttribute, G as Geometry, P as PrimitiveType } from './GeometryAttribute-a33bd30f.js';
import { G as GeometryAttributes } from './GeometryAttributes-a2681b8c.js';
import { P as Plane } from './Plane-5b11225b.js';
import { V as VertexFormat } from './VertexFormat-7481d617.js';

/**
 * The culling volume defined by planes. 通过六个面定义的裁剪体
 *
 * @alias CullingVolume
 * @constructor
 *
 * @param {Cartesian4[]} [planes] An array of clipping planes.
 */
function CullingVolume(planes) {
  /**
   * Each plane is represented by a Cartesian4 object, where the x, y, and z components
   * define the unit vector normal to the plane, and the w component is the distance of the
   * plane from the origin.
   * @type {Cartesian4[]}
   * @default []
   */
  this.planes = defaultValue(planes, []);
}

var faces = [new Cartesian3(), new Cartesian3(), new Cartesian3()];
Cartesian3.clone(Cartesian3.UNIT_X, faces[0]);
Cartesian3.clone(Cartesian3.UNIT_Y, faces[1]);
Cartesian3.clone(Cartesian3.UNIT_Z, faces[2]);

var scratchPlaneCenter = new Cartesian3();
var scratchPlaneNormal = new Cartesian3();
var scratchPlane = new Plane(new Cartesian3(1.0, 0.0, 0.0), 0.0);

/**
 * Constructs a culling volume from a bounding sphere. Creates six planes that create a box containing the sphere.
 * The planes are aligned to the x, y, and z axes in world coordinates.
 *
 * @param {BoundingSphere} boundingSphere The bounding sphere used to create the culling volume.
 * @param {CullingVolume} [result] The object onto which to store the result.
 * @returns {CullingVolume} The culling volume created from the bounding sphere.
 */
CullingVolume.fromBoundingSphere = function (boundingSphere, result) {
  if (!defined(result)) {
    result = new CullingVolume();
  }

  var length = faces.length;
  var planes = result.planes;
  planes.length = 2 * length;

  var center = boundingSphere.center;
  var radius = boundingSphere.radius;

  var planeIndex = 0;

  for (var i = 0; i < length; ++i) {
    var faceNormal = faces[i];

    var plane0 = planes[planeIndex];
    var plane1 = planes[planeIndex + 1];

    if (!defined(plane0)) {
      plane0 = planes[planeIndex] = new Cartesian4();
    }
    if (!defined(plane1)) {
      plane1 = planes[planeIndex + 1] = new Cartesian4();
    }

    Cartesian3.multiplyByScalar(faceNormal, -radius, scratchPlaneCenter);
    Cartesian3.add(center, scratchPlaneCenter, scratchPlaneCenter);

    plane0.x = faceNormal.x;
    plane0.y = faceNormal.y;
    plane0.z = faceNormal.z;
    plane0.w = -Cartesian3.dot(faceNormal, scratchPlaneCenter);

    Cartesian3.multiplyByScalar(faceNormal, radius, scratchPlaneCenter);
    Cartesian3.add(center, scratchPlaneCenter, scratchPlaneCenter);

    plane1.x = -faceNormal.x;
    plane1.y = -faceNormal.y;
    plane1.z = -faceNormal.z;
    plane1.w = -Cartesian3.dot(
      Cartesian3.negate(faceNormal, scratchPlaneNormal),
      scratchPlaneCenter
    );

    planeIndex += 2;
  }

  return result;
};

/**
 * Determines whether a bounding volume intersects the culling volume.
 *
 * @param {Object} boundingVolume The bounding volume whose intersection with the culling volume is to be tested.
 * @returns {Intersect}  Intersect.OUTSIDE, Intersect.INTERSECTING, or Intersect.INSIDE.
 */
CullingVolume.prototype.computeVisibility = function (boundingVolume) {
  var planes = this.planes;
  var intersecting = false;
  for (var k = 0, len = planes.length; k < len; ++k) {
    var result = boundingVolume.intersectPlane(
      Plane.fromCartesian4(planes[k], scratchPlane)
    );
    if (result === Intersect.OUTSIDE) {
      return Intersect.OUTSIDE;
    } else if (result === Intersect.INTERSECTING) {
      intersecting = true;
    }
  }

  return intersecting ? Intersect.INTERSECTING : Intersect.INSIDE;
};

/**
 * Determines whether a bounding volume intersects the culling volume.
 *
 * @param {Object} boundingVolume The bounding volume whose intersection with the culling volume is to be tested.
 * @param {Number} parentPlaneMask A bit mask from the boundingVolume's parent's check against the same culling
 *                                 volume, such that if (planeMask & (1 << planeIndex) === 0), for k < 31, then
 *                                 the parent (and therefore this) volume is completely inside plane[planeIndex]
 *                                 and that plane check can be skipped.
 * @returns {Number} A plane mask as described above (which can be applied to this boundingVolume's children).
 *
 * @private
 */
CullingVolume.prototype.computeVisibilityWithPlaneMask = function (
  boundingVolume,
  parentPlaneMask
) {
  if (
    parentPlaneMask === CullingVolume.MASK_OUTSIDE ||
    parentPlaneMask === CullingVolume.MASK_INSIDE
  ) {
    // parent is completely outside or completely inside, so this child is as well.
    return parentPlaneMask;
  }

  // Start with MASK_INSIDE (all zeros) so that after the loop, the return value can be compared with MASK_INSIDE.
  // (Because if there are fewer than 31 planes, the upper bits wont be changed.)
  var mask = CullingVolume.MASK_INSIDE;

  var planes = this.planes;
  for (var k = 0, len = planes.length; k < len; ++k) {
    // For k greater than 31 (since 31 is the maximum number of INSIDE/INTERSECTING bits we can store), skip the optimization.
    var flag = k < 31 ? 1 << k : 0;
    if (k < 31 && (parentPlaneMask & flag) === 0) {
      // boundingVolume is known to be INSIDE this plane.
      continue;
    }

    var result = boundingVolume.intersectPlane(
      Plane.fromCartesian4(planes[k], scratchPlane)
    );
    if (result === Intersect.OUTSIDE) {
      return CullingVolume.MASK_OUTSIDE;
    } else if (result === Intersect.INTERSECTING) {
      mask |= flag;
    }
  }

  return mask;
};

/**
 * For plane masks (as used in {@link CullingVolume#computeVisibilityWithPlaneMask}), this special value
 * represents the case where the object bounding volume is entirely outside the culling volume.
 *
 * @type {Number}
 * @private
 */
CullingVolume.MASK_OUTSIDE = 0xffffffff;

/**
 * For plane masks (as used in {@link CullingVolume.prototype.computeVisibilityWithPlaneMask}), this value
 * represents the case where the object bounding volume is entirely inside the culling volume.
 *
 * @type {Number}
 * @private
 */
CullingVolume.MASK_INSIDE = 0x00000000;

/**
 * For plane masks (as used in {@link CullingVolume.prototype.computeVisibilityWithPlaneMask}), this value
 * represents the case where the object bounding volume (may) intersect all planes of the culling volume.
 *
 * @type {Number}
 * @private
 */
CullingVolume.MASK_INDETERMINATE = 0x7fffffff;

/**
 * The viewing frustum is defined by 6 planes.
 * Each plane is represented by a {@link Cartesian4} object, where the x, y, and z components
 * define the unit vector normal to the plane, and the w component is the distance of the
 * plane from the origin/camera position.
 *
 * @alias OrthographicOffCenterFrustum
 * @constructor
 *
 * @param {Object} [options] An object with the following properties:
 * @param {Number} [options.left] The left clipping plane distance.
 * @param {Number} [options.right] The right clipping plane distance.
 * @param {Number} [options.top] The top clipping plane distance.
 * @param {Number} [options.bottom] The bottom clipping plane distance.
 * @param {Number} [options.near=1.0] The near clipping plane distance.
 * @param {Number} [options.far=500000000.0] The far clipping plane distance.
 *
 * @example
 * var maxRadii = ellipsoid.maximumRadius;
 *
 * var frustum = new Cesium.OrthographicOffCenterFrustum();
 * frustum.right = maxRadii * Cesium.Math.PI;
 * frustum.left = -c.frustum.right;
 * frustum.top = c.frustum.right * (canvas.clientHeight / canvas.clientWidth);
 * frustum.bottom = -c.frustum.top;
 * frustum.near = 0.01 * maxRadii;
 * frustum.far = 50.0 * maxRadii;
 */
function OrthographicOffCenterFrustum(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  /**
   * The left clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.left = options.left;
  this._left = undefined;

  /**
   * The right clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.right = options.right;
  this._right = undefined;

  /**
   * The top clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.top = options.top;
  this._top = undefined;

  /**
   * The bottom clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.bottom = options.bottom;
  this._bottom = undefined;

  /**
   * The distance of the near plane.
   * @type {Number}
   * @default 1.0
   */
  this.near = defaultValue(options.near, 1.0);
  this._near = this.near;

  /**
   * The distance of the far plane.
   * @type {Number}
   * @default 500000000.0;
   */
  this.far = defaultValue(options.far, 500000000.0);
  this._far = this.far;

  this._cullingVolume = new CullingVolume();
  this._orthographicMatrix = new Matrix4();
}

function update(frustum) {
  if (
    frustum.top !== frustum._top ||
    frustum.bottom !== frustum._bottom ||
    frustum.left !== frustum._left ||
    frustum.right !== frustum._right ||
    frustum.near !== frustum._near ||
    frustum.far !== frustum._far
  ) {
    frustum._left = frustum.left;
    frustum._right = frustum.right;
    frustum._top = frustum.top;
    frustum._bottom = frustum.bottom;
    frustum._near = frustum.near;
    frustum._far = frustum.far;
    frustum._orthographicMatrix = Matrix4.computeOrthographicOffCenter(
      frustum.left,
      frustum.right,
      frustum.bottom,
      frustum.top,
      frustum.near,
      frustum.far,
      frustum._orthographicMatrix
    );
  }
}

Object.defineProperties(OrthographicOffCenterFrustum.prototype, {
  /**
   * Gets the orthographic projection matrix computed from the view frustum.
   * @memberof OrthographicOffCenterFrustum.prototype
   * @type {Matrix4}
   * @readonly
   */
  projectionMatrix: {
    get: function () {
      update(this);
      return this._orthographicMatrix;
    },
  },
});

var getPlanesRight = new Cartesian3();
var getPlanesNearCenter = new Cartesian3();
var getPlanesPoint = new Cartesian3();
var negateScratch = new Cartesian3();

/**
 * Creates a culling volume for this frustum.
 *
 * @param {Cartesian3} position The eye position.
 * @param {Cartesian3} direction The view direction.
 * @param {Cartesian3} up The up direction.
 * @returns {CullingVolume} A culling volume at the given position and orientation.
 *
 * @example
 * // Check if a bounding volume intersects the frustum.
 * var cullingVolume = frustum.computeCullingVolume(cameraPosition, cameraDirection, cameraUp);
 * var intersect = cullingVolume.computeVisibility(boundingVolume);
 */
OrthographicOffCenterFrustum.prototype.computeCullingVolume = function (
  position,
  direction,
  up
) {
  var planes = this._cullingVolume.planes;
  var t = this.top;
  var b = this.bottom;
  var r = this.right;
  var l = this.left;
  var n = this.near;
  var f = this.far;

  var right = Cartesian3.cross(direction, up, getPlanesRight);
  Cartesian3.normalize(right, right);
  var nearCenter = getPlanesNearCenter;
  Cartesian3.multiplyByScalar(direction, n, nearCenter);
  Cartesian3.add(position, nearCenter, nearCenter);

  var point = getPlanesPoint;

  // Left plane
  Cartesian3.multiplyByScalar(right, l, point);
  Cartesian3.add(nearCenter, point, point);

  var plane = planes[0];
  if (!defined(plane)) {
    plane = planes[0] = new Cartesian4();
  }
  plane.x = right.x;
  plane.y = right.y;
  plane.z = right.z;
  plane.w = -Cartesian3.dot(right, point);

  // Right plane
  Cartesian3.multiplyByScalar(right, r, point);
  Cartesian3.add(nearCenter, point, point);

  plane = planes[1];
  if (!defined(plane)) {
    plane = planes[1] = new Cartesian4();
  }
  plane.x = -right.x;
  plane.y = -right.y;
  plane.z = -right.z;
  plane.w = -Cartesian3.dot(Cartesian3.negate(right, negateScratch), point);

  // Bottom plane
  Cartesian3.multiplyByScalar(up, b, point);
  Cartesian3.add(nearCenter, point, point);

  plane = planes[2];
  if (!defined(plane)) {
    plane = planes[2] = new Cartesian4();
  }
  plane.x = up.x;
  plane.y = up.y;
  plane.z = up.z;
  plane.w = -Cartesian3.dot(up, point);

  // Top plane
  Cartesian3.multiplyByScalar(up, t, point);
  Cartesian3.add(nearCenter, point, point);

  plane = planes[3];
  if (!defined(plane)) {
    plane = planes[3] = new Cartesian4();
  }
  plane.x = -up.x;
  plane.y = -up.y;
  plane.z = -up.z;
  plane.w = -Cartesian3.dot(Cartesian3.negate(up, negateScratch), point);

  // Near plane
  plane = planes[4];
  if (!defined(plane)) {
    plane = planes[4] = new Cartesian4();
  }
  plane.x = direction.x;
  plane.y = direction.y;
  plane.z = direction.z;
  plane.w = -Cartesian3.dot(direction, nearCenter);

  // Far plane
  Cartesian3.multiplyByScalar(direction, f, point);
  Cartesian3.add(position, point, point);

  plane = planes[5];
  if (!defined(plane)) {
    plane = planes[5] = new Cartesian4();
  }
  plane.x = -direction.x;
  plane.y = -direction.y;
  plane.z = -direction.z;
  plane.w = -Cartesian3.dot(Cartesian3.negate(direction, negateScratch), point);

  return this._cullingVolume;
};

/**
 * Returns the pixel's width and height in meters.
 *
 * @param {Number} drawingBufferWidth The width of the drawing buffer.
 * @param {Number} drawingBufferHeight The height of the drawing buffer.
 * @param {Number} distance The distance to the near plane in meters.
 * @param {Number} pixelRatio The scaling factor from pixel space to coordinate space.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new instance of {@link Cartesian2} with the pixel's width and height in the x and y properties, respectively.
 *
 * @exception {DeveloperError} drawingBufferWidth must be greater than zero.
 * @exception {DeveloperError} drawingBufferHeight must be greater than zero.
 * @exception {DeveloperError} pixelRatio must be greater than zero.
 *
 * @example
 * // Example 1
 * // Get the width and height of a pixel.
 * var pixelSize = camera.frustum.getPixelDimensions(scene.drawingBufferWidth, scene.drawingBufferHeight, 0.0, scene.pixelRatio, new Cesium.Cartesian2());
 */
OrthographicOffCenterFrustum.prototype.getPixelDimensions = function (
  drawingBufferWidth,
  drawingBufferHeight,
  distance,
  pixelRatio,
  result
) {
  update(this);

  var frustumWidth = this.right - this.left;
  var frustumHeight = this.top - this.bottom;
  var pixelWidth = (pixelRatio * frustumWidth) / drawingBufferWidth;
  var pixelHeight = (pixelRatio * frustumHeight) / drawingBufferHeight;

  result.x = pixelWidth;
  result.y = pixelHeight;
  return result;
};

/**
 * Returns a duplicate of a OrthographicOffCenterFrustum instance.
 *
 * @param {OrthographicOffCenterFrustum} [result] The object onto which to store the result.
 * @returns {OrthographicOffCenterFrustum} The modified result parameter or a new OrthographicOffCenterFrustum instance if one was not provided.
 */
OrthographicOffCenterFrustum.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new OrthographicOffCenterFrustum();
  }

  result.left = this.left;
  result.right = this.right;
  result.top = this.top;
  result.bottom = this.bottom;
  result.near = this.near;
  result.far = this.far;

  // force update of clone to compute matrices
  result._left = undefined;
  result._right = undefined;
  result._top = undefined;
  result._bottom = undefined;
  result._near = undefined;
  result._far = undefined;

  return result;
};

/**
 * Compares the provided OrthographicOffCenterFrustum componentwise and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {OrthographicOffCenterFrustum} [other] The right hand side OrthographicOffCenterFrustum.
 * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
 */
OrthographicOffCenterFrustum.prototype.equals = function (other) {
  return (
    defined(other) &&
    other instanceof OrthographicOffCenterFrustum &&
    this.right === other.right &&
    this.left === other.left &&
    this.top === other.top &&
    this.bottom === other.bottom &&
    this.near === other.near &&
    this.far === other.far
  );
};

/**
 * Compares the provided OrthographicOffCenterFrustum componentwise and returns
 * <code>true</code> if they pass an absolute or relative tolerance test,
 * <code>false</code> otherwise.
 *
 * @param {OrthographicOffCenterFrustum} other The right hand side OrthographicOffCenterFrustum.
 * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
 * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
 * @returns {Boolean} <code>true</code> if this and other are within the provided epsilon, <code>false</code> otherwise.
 */
OrthographicOffCenterFrustum.prototype.equalsEpsilon = function (
  other,
  relativeEpsilon,
  absoluteEpsilon
) {
  return (
    other === this ||
    (defined(other) &&
      other instanceof OrthographicOffCenterFrustum &&
      CesiumMath.equalsEpsilon(
        this.right,
        other.right,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.left,
        other.left,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.top,
        other.top,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.bottom,
        other.bottom,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.near,
        other.near,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.far,
        other.far,
        relativeEpsilon,
        absoluteEpsilon
      ))
  );
};

/**
 * The viewing frustum is defined by 6 planes.
 * Each plane is represented by a {@link Cartesian4} object, where the x, y, and z components
 * define the unit vector normal to the plane, and the w component is the distance of the
 * plane from the origin/camera position.
 *
 * @alias OrthographicFrustum
 * @constructor
 *
 * @param {Object} [options] An object with the following properties:
 * @param {Number} [options.width] The width of the frustum in meters.
 * @param {Number} [options.aspectRatio] The aspect ratio of the frustum's width to it's height.
 * @param {Number} [options.near=1.0] The distance of the near plane.
 * @param {Number} [options.far=500000000.0] The distance of the far plane.
 *
 * @example
 * var maxRadii = ellipsoid.maximumRadius;
 *
 * var frustum = new Cesium.OrthographicFrustum();
 * frustum.near = 0.01 * maxRadii;
 * frustum.far = 50.0 * maxRadii;
 */
function OrthographicFrustum(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  this._offCenterFrustum = new OrthographicOffCenterFrustum();

  /**
   * The horizontal width of the frustum in meters.
   * @type {Number}
   * @default undefined
   */
  this.width = options.width;
  this._width = undefined;

  /**
   * The aspect ratio of the frustum's width to it's height.
   * @type {Number}
   * @default undefined
   */
  this.aspectRatio = options.aspectRatio;
  this._aspectRatio = undefined;

  /**
   * The distance of the near plane.
   * @type {Number}
   * @default 1.0
   */
  this.near = defaultValue(options.near, 1.0);
  this._near = this.near;

  /**
   * The distance of the far plane.
   * @type {Number}
   * @default 500000000.0;
   */
  this.far = defaultValue(options.far, 500000000.0);
  this._far = this.far;
}

/**
 * The number of elements used to pack the object into an array.
 * @type {Number}
 */
OrthographicFrustum.packedLength = 4;

/**
 * Stores the provided instance into the provided array.
 *
 * @param {OrthographicFrustum} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
OrthographicFrustum.pack = function (value, array, startingIndex) {
  startingIndex = defaultValue(startingIndex, 0);

  array[startingIndex++] = value.width;
  array[startingIndex++] = value.aspectRatio;
  array[startingIndex++] = value.near;
  array[startingIndex] = value.far;

  return array;
};

/**
 * Retrieves an instance from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {OrthographicFrustum} [result] The object into which to store the result.
 * @returns {OrthographicFrustum} The modified result parameter or a new OrthographicFrustum instance if one was not provided.
 */
OrthographicFrustum.unpack = function (array, startingIndex, result) {
  startingIndex = defaultValue(startingIndex, 0);

  if (!defined(result)) {
    result = new OrthographicFrustum();
  }

  result.width = array[startingIndex++];
  result.aspectRatio = array[startingIndex++];
  result.near = array[startingIndex++];
  result.far = array[startingIndex];

  return result;
};

function update$1(frustum) {
  var f = frustum._offCenterFrustum;

  if (
    frustum.width !== frustum._width ||
    frustum.aspectRatio !== frustum._aspectRatio ||
    frustum.near !== frustum._near ||
    frustum.far !== frustum._far
  ) {
    frustum._aspectRatio = frustum.aspectRatio;
    frustum._width = frustum.width;
    frustum._near = frustum.near;
    frustum._far = frustum.far;

    var ratio = 1.0 / frustum.aspectRatio;
    f.right = frustum.width * 0.5;
    f.left = -f.right;
    f.top = ratio * f.right;
    f.bottom = -f.top;
    f.near = frustum.near;
    f.far = frustum.far;
  }
}

Object.defineProperties(OrthographicFrustum.prototype, {
  /**
   * Gets the orthographic projection matrix computed from the view frustum.
   * @memberof OrthographicFrustum.prototype
   * @type {Matrix4}
   * @readonly
   */
  projectionMatrix: {
    get: function () {
      update$1(this);
      return this._offCenterFrustum.projectionMatrix;
    },
  },
});

/**
 * Creates a culling volume for this frustum.
 *
 * @param {Cartesian3} position The eye position.
 * @param {Cartesian3} direction The view direction.
 * @param {Cartesian3} up The up direction.
 * @returns {CullingVolume} A culling volume at the given position and orientation.
 *
 * @example
 * // Check if a bounding volume intersects the frustum.
 * var cullingVolume = frustum.computeCullingVolume(cameraPosition, cameraDirection, cameraUp);
 * var intersect = cullingVolume.computeVisibility(boundingVolume);
 */
OrthographicFrustum.prototype.computeCullingVolume = function (
  position,
  direction,
  up
) {
  update$1(this);
  return this._offCenterFrustum.computeCullingVolume(position, direction, up);
};

/**
 * Returns the pixel's width and height in meters.
 *
 * @param {Number} drawingBufferWidth The width of the drawing buffer.
 * @param {Number} drawingBufferHeight The height of the drawing buffer.
 * @param {Number} distance The distance to the near plane in meters.
 * @param {Number} pixelRatio The scaling factor from pixel space to coordinate space.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new instance of {@link Cartesian2} with the pixel's width and height in the x and y properties, respectively.
 *
 * @exception {DeveloperError} drawingBufferWidth must be greater than zero.
 * @exception {DeveloperError} drawingBufferHeight must be greater than zero.
 * @exception {DeveloperError} pixelRatio must be greater than zero.
 *
 * @example
 * // Example 1
 * // Get the width and height of a pixel.
 * var pixelSize = camera.frustum.getPixelDimensions(scene.drawingBufferWidth, scene.drawingBufferHeight, 0.0, scene.pixelRatio, new Cesium.Cartesian2());
 */
OrthographicFrustum.prototype.getPixelDimensions = function (
  drawingBufferWidth,
  drawingBufferHeight,
  distance,
  pixelRatio,
  result
) {
  update$1(this);
  return this._offCenterFrustum.getPixelDimensions(
    drawingBufferWidth,
    drawingBufferHeight,
    distance,
    pixelRatio,
    result
  );
};

/**
 * Returns a duplicate of a OrthographicFrustum instance.
 *
 * @param {OrthographicFrustum} [result] The object onto which to store the result.
 * @returns {OrthographicFrustum} The modified result parameter or a new OrthographicFrustum instance if one was not provided.
 */
OrthographicFrustum.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new OrthographicFrustum();
  }

  result.aspectRatio = this.aspectRatio;
  result.width = this.width;
  result.near = this.near;
  result.far = this.far;

  // force update of clone to compute matrices
  result._aspectRatio = undefined;
  result._width = undefined;
  result._near = undefined;
  result._far = undefined;

  this._offCenterFrustum.clone(result._offCenterFrustum);

  return result;
};

/**
 * Compares the provided OrthographicFrustum componentwise and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {OrthographicFrustum} [other] The right hand side OrthographicFrustum.
 * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
 */
OrthographicFrustum.prototype.equals = function (other) {
  if (!defined(other) || !(other instanceof OrthographicFrustum)) {
    return false;
  }

  update$1(this);
  update$1(other);

  return (
    this.width === other.width &&
    this.aspectRatio === other.aspectRatio &&
    this._offCenterFrustum.equals(other._offCenterFrustum)
  );
};

/**
 * Compares the provided OrthographicFrustum componentwise and returns
 * <code>true</code> if they pass an absolute or relative tolerance test,
 * <code>false</code> otherwise.
 *
 * @param {OrthographicFrustum} other The right hand side OrthographicFrustum.
 * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
 * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
 * @returns {Boolean} <code>true</code> if this and other are within the provided epsilon, <code>false</code> otherwise.
 */
OrthographicFrustum.prototype.equalsEpsilon = function (
  other,
  relativeEpsilon,
  absoluteEpsilon
) {
  if (!defined(other) || !(other instanceof OrthographicFrustum)) {
    return false;
  }

  update$1(this);
  update$1(other);

  return (
    CesiumMath.equalsEpsilon(
      this.width,
      other.width,
      relativeEpsilon,
      absoluteEpsilon
    ) &&
    CesiumMath.equalsEpsilon(
      this.aspectRatio,
      other.aspectRatio,
      relativeEpsilon,
      absoluteEpsilon
    ) &&
    this._offCenterFrustum.equalsEpsilon(
      other._offCenterFrustum,
      relativeEpsilon,
      absoluteEpsilon
    )
  );
};

/**
 * The viewing frustum is defined by 6 planes.
 * Each plane is represented by a {@link Cartesian4} object, where the x, y, and z components
 * define the unit vector normal to the plane, and the w component is the distance of the
 * plane from the origin/camera position.
 *
 * @alias PerspectiveOffCenterFrustum
 * @constructor
 *
 * @param {Object} [options] An object with the following properties:
 * @param {Number} [options.left] The left clipping plane distance.
 * @param {Number} [options.right] The right clipping plane distance.
 * @param {Number} [options.top] The top clipping plane distance.
 * @param {Number} [options.bottom] The bottom clipping plane distance.
 * @param {Number} [options.near=1.0] The near clipping plane distance.
 * @param {Number} [options.far=500000000.0] The far clipping plane distance.
 *
 * @example
 * var frustum = new Cesium.PerspectiveOffCenterFrustum({
 *     left : -1.0,
 *     right : 1.0,
 *     top : 1.0,
 *     bottom : -1.0,
 *     near : 1.0,
 *     far : 100.0
 * });
 *
 * @see PerspectiveFrustum
 */
function PerspectiveOffCenterFrustum(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  /**
   * Defines the left clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.left = options.left;
  this._left = undefined;

  /**
   * Defines the right clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.right = options.right;
  this._right = undefined;

  /**
   * Defines the top clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.top = options.top;
  this._top = undefined;

  /**
   * Defines the bottom clipping plane.
   * @type {Number}
   * @default undefined
   */
  this.bottom = options.bottom;
  this._bottom = undefined;

  /**
   * The distance of the near plane.
   * @type {Number}
   * @default 1.0
   */
  this.near = defaultValue(options.near, 1.0);
  this._near = this.near;

  /**
   * The distance of the far plane.
   * @type {Number}
   * @default 500000000.0
   */
  this.far = defaultValue(options.far, 500000000.0);
  this._far = this.far;

  this._cullingVolume = new CullingVolume();
  this._perspectiveMatrix = new Matrix4();
  this._infinitePerspective = new Matrix4();
}

function update$2(frustum) {
  var t = frustum.top;
  var b = frustum.bottom;
  var r = frustum.right;
  var l = frustum.left;
  var n = frustum.near;
  var f = frustum.far;

  if (
    t !== frustum._top ||
    b !== frustum._bottom ||
    l !== frustum._left ||
    r !== frustum._right ||
    n !== frustum._near ||
    f !== frustum._far
  ) {
    frustum._left = l;
    frustum._right = r;
    frustum._top = t;
    frustum._bottom = b;
    frustum._near = n;
    frustum._far = f;
    frustum._perspectiveMatrix = Matrix4.computePerspectiveOffCenter(
      l,
      r,
      b,
      t,
      n,
      f,
      frustum._perspectiveMatrix
    );
    frustum._infinitePerspective = Matrix4.computeInfinitePerspectiveOffCenter(
      l,
      r,
      b,
      t,
      n,
      frustum._infinitePerspective
    );
  }
}

Object.defineProperties(PerspectiveOffCenterFrustum.prototype, {
  /**
   * Gets the perspective projection matrix computed from the view frustum.
   * @memberof PerspectiveOffCenterFrustum.prototype
   * @type {Matrix4}
   * @readonly
   *
   * @see PerspectiveOffCenterFrustum#infiniteProjectionMatrix
   */
  projectionMatrix: {
    get: function () {
      update$2(this);
      return this._perspectiveMatrix;
    },
  },

  /**
   * Gets the perspective projection matrix computed from the view frustum with an infinite far plane.
   * @memberof PerspectiveOffCenterFrustum.prototype
   * @type {Matrix4}
   * @readonly
   *
   * @see PerspectiveOffCenterFrustum#projectionMatrix
   */
  infiniteProjectionMatrix: {
    get: function () {
      update$2(this);
      return this._infinitePerspective;
    },
  },
});

var getPlanesRight$1 = new Cartesian3();
var getPlanesNearCenter$1 = new Cartesian3();
var getPlanesFarCenter = new Cartesian3();
var getPlanesNormal = new Cartesian3();
/**
 * Creates a culling volume for this frustum.
 *
 * @param {Cartesian3} position The eye position.
 * @param {Cartesian3} direction The view direction.
 * @param {Cartesian3} up The up direction.
 * @returns {CullingVolume} A culling volume at the given position and orientation.
 *
 * @example
 * // Check if a bounding volume intersects the frustum.
 * var cullingVolume = frustum.computeCullingVolume(cameraPosition, cameraDirection, cameraUp);
 * var intersect = cullingVolume.computeVisibility(boundingVolume);
 */
PerspectiveOffCenterFrustum.prototype.computeCullingVolume = function (
  position,
  direction,
  up
) {
  var planes = this._cullingVolume.planes;

  var t = this.top;
  var b = this.bottom;
  var r = this.right;
  var l = this.left;
  var n = this.near;
  var f = this.far;

  var right = Cartesian3.cross(direction, up, getPlanesRight$1);

  var nearCenter = getPlanesNearCenter$1;
  Cartesian3.multiplyByScalar(direction, n, nearCenter);
  Cartesian3.add(position, nearCenter, nearCenter);

  var farCenter = getPlanesFarCenter;
  Cartesian3.multiplyByScalar(direction, f, farCenter);
  Cartesian3.add(position, farCenter, farCenter);

  var normal = getPlanesNormal;

  //Left plane computation
  Cartesian3.multiplyByScalar(right, l, normal);
  Cartesian3.add(nearCenter, normal, normal);
  Cartesian3.subtract(normal, position, normal);
  Cartesian3.normalize(normal, normal);
  Cartesian3.cross(normal, up, normal);
  Cartesian3.normalize(normal, normal);

  var plane = planes[0];
  if (!defined(plane)) {
    plane = planes[0] = new Cartesian4();
  }
  plane.x = normal.x;
  plane.y = normal.y;
  plane.z = normal.z;
  plane.w = -Cartesian3.dot(normal, position);

  //Right plane computation
  Cartesian3.multiplyByScalar(right, r, normal);
  Cartesian3.add(nearCenter, normal, normal);
  Cartesian3.subtract(normal, position, normal);
  Cartesian3.cross(up, normal, normal);
  Cartesian3.normalize(normal, normal);

  plane = planes[1];
  if (!defined(plane)) {
    plane = planes[1] = new Cartesian4();
  }
  plane.x = normal.x;
  plane.y = normal.y;
  plane.z = normal.z;
  plane.w = -Cartesian3.dot(normal, position);

  //Bottom plane computation
  Cartesian3.multiplyByScalar(up, b, normal);
  Cartesian3.add(nearCenter, normal, normal);
  Cartesian3.subtract(normal, position, normal);
  Cartesian3.cross(right, normal, normal);
  Cartesian3.normalize(normal, normal);

  plane = planes[2];
  if (!defined(plane)) {
    plane = planes[2] = new Cartesian4();
  }
  plane.x = normal.x;
  plane.y = normal.y;
  plane.z = normal.z;
  plane.w = -Cartesian3.dot(normal, position);

  //Top plane computation
  Cartesian3.multiplyByScalar(up, t, normal);
  Cartesian3.add(nearCenter, normal, normal);
  Cartesian3.subtract(normal, position, normal);
  Cartesian3.cross(normal, right, normal);
  Cartesian3.normalize(normal, normal);

  plane = planes[3];
  if (!defined(plane)) {
    plane = planes[3] = new Cartesian4();
  }
  plane.x = normal.x;
  plane.y = normal.y;
  plane.z = normal.z;
  plane.w = -Cartesian3.dot(normal, position);

  //Near plane computation
  plane = planes[4];
  if (!defined(plane)) {
    plane = planes[4] = new Cartesian4();
  }
  plane.x = direction.x;
  plane.y = direction.y;
  plane.z = direction.z;
  plane.w = -Cartesian3.dot(direction, nearCenter);

  //Far plane computation
  Cartesian3.negate(direction, normal);

  plane = planes[5];
  if (!defined(plane)) {
    plane = planes[5] = new Cartesian4();
  }
  plane.x = normal.x;
  plane.y = normal.y;
  plane.z = normal.z;
  plane.w = -Cartesian3.dot(normal, farCenter);

  return this._cullingVolume;
};

/**
 * Returns the pixel's width and height in meters.
 *
 * @param {Number} drawingBufferWidth The width of the drawing buffer.
 * @param {Number} drawingBufferHeight The height of the drawing buffer.
 * @param {Number} distance The distance to the near plane in meters.
 * @param {Number} pixelRatio The scaling factor from pixel space to coordinate space.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new instance of {@link Cartesian2} with the pixel's width and height in the x and y properties, respectively.
 *
 * @exception {DeveloperError} drawingBufferWidth must be greater than zero.
 * @exception {DeveloperError} drawingBufferHeight must be greater than zero.
 * @exception {DeveloperError} pixelRatio must be greater than zero.
 *
 * @example
 * // Example 1
 * // Get the width and height of a pixel.
 * var pixelSize = camera.frustum.getPixelDimensions(scene.drawingBufferWidth, scene.drawingBufferHeight, 1.0, scene.pixelRatio, new Cesium.Cartesian2());
 *
 * @example
 * // Example 2
 * // Get the width and height of a pixel if the near plane was set to 'distance'.
 * // For example, get the size of a pixel of an image on a billboard.
 * var position = camera.position;
 * var direction = camera.direction;
 * var toCenter = Cesium.Cartesian3.subtract(primitive.boundingVolume.center, position, new Cesium.Cartesian3());      // vector from camera to a primitive
 * var toCenterProj = Cesium.Cartesian3.multiplyByScalar(direction, Cesium.Cartesian3.dot(direction, toCenter), new Cesium.Cartesian3()); // project vector onto camera direction vector
 * var distance = Cesium.Cartesian3.magnitude(toCenterProj);
 * var pixelSize = camera.frustum.getPixelDimensions(scene.drawingBufferWidth, scene.drawingBufferHeight, distance, scene.pixelRatio, new Cesium.Cartesian2());
 */
PerspectiveOffCenterFrustum.prototype.getPixelDimensions = function (
  drawingBufferWidth,
  drawingBufferHeight,
  distance,
  pixelRatio,
  result
) {
  update$2(this);

  var inverseNear = 1.0 / this.near;
  var tanTheta = this.top * inverseNear;
  var pixelHeight =
    (2.0 * pixelRatio * distance * tanTheta) / drawingBufferHeight;
  tanTheta = this.right * inverseNear;
  var pixelWidth =
    (2.0 * pixelRatio * distance * tanTheta) / drawingBufferWidth;

  result.x = pixelWidth;
  result.y = pixelHeight;
  return result;
};

/**
 * Returns a duplicate of a PerspectiveOffCenterFrustum instance.
 *
 * @param {PerspectiveOffCenterFrustum} [result] The object onto which to store the result.
 * @returns {PerspectiveOffCenterFrustum} The modified result parameter or a new PerspectiveFrustum instance if one was not provided.
 */
PerspectiveOffCenterFrustum.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new PerspectiveOffCenterFrustum();
  }

  result.right = this.right;
  result.left = this.left;
  result.top = this.top;
  result.bottom = this.bottom;
  result.near = this.near;
  result.far = this.far;

  // force update of clone to compute matrices
  result._left = undefined;
  result._right = undefined;
  result._top = undefined;
  result._bottom = undefined;
  result._near = undefined;
  result._far = undefined;

  return result;
};

/**
 * Compares the provided PerspectiveOffCenterFrustum componentwise and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {PerspectiveOffCenterFrustum} [other] The right hand side PerspectiveOffCenterFrustum.
 * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
 */
PerspectiveOffCenterFrustum.prototype.equals = function (other) {
  return (
    defined(other) &&
    other instanceof PerspectiveOffCenterFrustum &&
    this.right === other.right &&
    this.left === other.left &&
    this.top === other.top &&
    this.bottom === other.bottom &&
    this.near === other.near &&
    this.far === other.far
  );
};

/**
 * Compares the provided PerspectiveOffCenterFrustum componentwise and returns
 * <code>true</code> if they pass an absolute or relative tolerance test,
 * <code>false</code> otherwise.
 *
 * @param {PerspectiveOffCenterFrustum} other The right hand side PerspectiveOffCenterFrustum.
 * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
 * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
 * @returns {Boolean} <code>true</code> if this and other are within the provided epsilon, <code>false</code> otherwise.
 */
PerspectiveOffCenterFrustum.prototype.equalsEpsilon = function (
  other,
  relativeEpsilon,
  absoluteEpsilon
) {
  return (
    other === this ||
    (defined(other) &&
      other instanceof PerspectiveOffCenterFrustum &&
      CesiumMath.equalsEpsilon(
        this.right,
        other.right,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.left,
        other.left,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.top,
        other.top,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.bottom,
        other.bottom,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.near,
        other.near,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      CesiumMath.equalsEpsilon(
        this.far,
        other.far,
        relativeEpsilon,
        absoluteEpsilon
      ))
  );
};

/**
 * The viewing frustum is defined by 6 planes.
 * Each plane is represented by a {@link Cartesian4} object, where the x, y, and z components
 * define the unit vector normal to the plane, and the w component is the distance of the
 * plane from the origin/camera position.
 *
 * @alias PerspectiveFrustum
 * @constructor
 *
 * @param {Object} [options] An object with the following properties:
 * @param {Number} [options.fov] The angle of the field of view (FOV), in radians.
 * @param {Number} [options.aspectRatio] The aspect ratio of the frustum's width to it's height.
 * @param {Number} [options.near=1.0] The distance of the near plane.
 * @param {Number} [options.far=500000000.0] The distance of the far plane.
 * @param {Number} [options.xOffset=0.0] The offset in the x direction.
 * @param {Number} [options.yOffset=0.0] The offset in the y direction.
 *
 * @example
 * var frustum = new Cesium.PerspectiveFrustum({
 *     fov : Cesium.Math.PI_OVER_THREE,
 *     aspectRatio : canvas.clientWidth / canvas.clientHeight
 *     near : 1.0,
 *     far : 1000.0
 * });
 *
 * @see PerspectiveOffCenterFrustum
 */
function PerspectiveFrustum(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  this._offCenterFrustum = new PerspectiveOffCenterFrustum();

  /**
   * The angle of the field of view (FOV), in radians.  This angle will be used
   * as the horizontal FOV if the width is greater than the height, otherwise
   * it will be the vertical FOV.
   * @type {Number}
   * @default undefined
   */
  this.fov = options.fov;
  this._fov = undefined;
  this._fovy = undefined;

  this._sseDenominator = undefined;

  /**
   * The aspect ratio of the frustum's width to it's height.
   * @type {Number}
   * @default undefined
   */
  this.aspectRatio = options.aspectRatio;
  this._aspectRatio = undefined;

  /**
   * The distance of the near plane.
   * @type {Number}
   * @default 1.0
   */
  this.near = defaultValue(options.near, 1.0);
  this._near = this.near;

  /**
   * The distance of the far plane.
   * @type {Number}
   * @default 500000000.0
   */
  this.far = defaultValue(options.far, 500000000.0);
  this._far = this.far;

  /**
   * Offsets the frustum in the x direction.
   * @type {Number}
   * @default 0.0
   */
  this.xOffset = defaultValue(options.xOffset, 0.0);
  this._xOffset = this.xOffset;

  /**
   * Offsets the frustum in the y direction.
   * @type {Number}
   * @default 0.0
   */
  this.yOffset = defaultValue(options.yOffset, 0.0);
  this._yOffset = this.yOffset;
}

/**
 * The number of elements used to pack the object into an array.
 * @type {Number}
 */
PerspectiveFrustum.packedLength = 6;

/**
 * Stores the provided instance into the provided array.
 *
 * @param {PerspectiveFrustum} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
PerspectiveFrustum.pack = function (value, array, startingIndex) {
  startingIndex = defaultValue(startingIndex, 0);

  array[startingIndex++] = value.fov;
  array[startingIndex++] = value.aspectRatio;
  array[startingIndex++] = value.near;
  array[startingIndex++] = value.far;
  array[startingIndex++] = value.xOffset;
  array[startingIndex] = value.yOffset;

  return array;
};

/**
 * Retrieves an instance from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {PerspectiveFrustum} [result] The object into which to store the result.
 * @returns {PerspectiveFrustum} The modified result parameter or a new PerspectiveFrustum instance if one was not provided.
 */
PerspectiveFrustum.unpack = function (array, startingIndex, result) {
  startingIndex = defaultValue(startingIndex, 0);

  if (!defined(result)) {
    result = new PerspectiveFrustum();
  }

  result.fov = array[startingIndex++];
  result.aspectRatio = array[startingIndex++];
  result.near = array[startingIndex++];
  result.far = array[startingIndex++];
  result.xOffset = array[startingIndex++];
  result.yOffset = array[startingIndex];

  return result;
};

function update$3(frustum) {
  var f = frustum._offCenterFrustum;

  if (
    frustum.fov !== frustum._fov ||
    frustum.aspectRatio !== frustum._aspectRatio ||
    frustum.near !== frustum._near ||
    frustum.far !== frustum._far ||
    frustum.xOffset !== frustum._xOffset ||
    frustum.yOffset !== frustum._yOffset
  ) {
    frustum._aspectRatio = frustum.aspectRatio;
    frustum._fov = frustum.fov;
    frustum._fovy =
      frustum.aspectRatio <= 1
        ? frustum.fov
        : Math.atan(Math.tan(frustum.fov * 0.5) / frustum.aspectRatio) * 2.0;
    frustum._near = frustum.near;
    frustum._far = frustum.far;
    frustum._sseDenominator = 2.0 * Math.tan(0.5 * frustum._fovy);
    frustum._xOffset = frustum.xOffset;
    frustum._yOffset = frustum.yOffset;

    f.top = frustum.near * Math.tan(0.5 * frustum._fovy);
    f.bottom = -f.top;
    f.right = frustum.aspectRatio * f.top;
    f.left = -f.right;
    f.near = frustum.near;
    f.far = frustum.far;

    f.right += frustum.xOffset;
    f.left += frustum.xOffset;
    f.top += frustum.yOffset;
    f.bottom += frustum.yOffset;
  }
}

Object.defineProperties(PerspectiveFrustum.prototype, {
  /**
   * Gets the perspective projection matrix computed from the view frustum.
   * @memberof PerspectiveFrustum.prototype
   * @type {Matrix4}
   * @readonly
   *
   * @see PerspectiveFrustum#infiniteProjectionMatrix
   */
  projectionMatrix: {
    get: function () {
      update$3(this);
      return this._offCenterFrustum.projectionMatrix;
    },
  },

  /**
   * The perspective projection matrix computed from the view frustum with an infinite far plane.
   * @memberof PerspectiveFrustum.prototype
   * @type {Matrix4}
   * @readonly
   *
   * @see PerspectiveFrustum#projectionMatrix
   */
  infiniteProjectionMatrix: {
    get: function () {
      update$3(this);
      return this._offCenterFrustum.infiniteProjectionMatrix;
    },
  },

  /**
   * Gets the angle of the vertical field of view, in radians.
   * @memberof PerspectiveFrustum.prototype
   * @type {Number}
   * @readonly
   * @default undefined
   */
  fovy: {
    get: function () {
      update$3(this);
      return this._fovy;
    },
  },

  /**
   * @readonly
   * @private
   */
  sseDenominator: {
    get: function () {
      update$3(this);
      return this._sseDenominator;
    },
  },
});

/**
 * Creates a culling volume for this frustum.
 *
 * @param {Cartesian3} position The eye position.
 * @param {Cartesian3} direction The view direction.
 * @param {Cartesian3} up The up direction.
 * @returns {CullingVolume} A culling volume at the given position and orientation.
 *
 * @example
 * // Check if a bounding volume intersects the frustum.
 * var cullingVolume = frustum.computeCullingVolume(cameraPosition, cameraDirection, cameraUp);
 * var intersect = cullingVolume.computeVisibility(boundingVolume);
 */
PerspectiveFrustum.prototype.computeCullingVolume = function (
  position,
  direction,
  up
) {
  update$3(this);
  return this._offCenterFrustum.computeCullingVolume(position, direction, up);
};

/**
 * Returns the pixel's width and height in meters.
 *
 * @param {Number} drawingBufferWidth The width of the drawing buffer.
 * @param {Number} drawingBufferHeight The height of the drawing buffer.
 * @param {Number} distance The distance to the near plane in meters.
 * @param {Number} pixelRatio The scaling factor from pixel space to coordinate space.
 * @param {Cartesian2} result The object onto which to store the result.
 * @returns {Cartesian2} The modified result parameter or a new instance of {@link Cartesian2} with the pixel's width and height in the x and y properties, respectively.
 *
 * @exception {DeveloperError} drawingBufferWidth must be greater than zero.
 * @exception {DeveloperError} drawingBufferHeight must be greater than zero.
 * @exception {DeveloperError} pixelRatio must be greater than zero.
 *
 * @example
 * // Example 1
 * // Get the width and height of a pixel.
 * var pixelSize = camera.frustum.getPixelDimensions(scene.drawingBufferWidth, scene.drawingBufferHeight, 1.0, scene.pixelRatio, new Cesium.Cartesian2());
 *
 * @example
 * // Example 2
 * // Get the width and height of a pixel if the near plane was set to 'distance'.
 * // For example, get the size of a pixel of an image on a billboard.
 * var position = camera.position;
 * var direction = camera.direction;
 * var toCenter = Cesium.Cartesian3.subtract(primitive.boundingVolume.center, position, new Cesium.Cartesian3());      // vector from camera to a primitive
 * var toCenterProj = Cesium.Cartesian3.multiplyByScalar(direction, Cesium.Cartesian3.dot(direction, toCenter), new Cesium.Cartesian3()); // project vector onto camera direction vector
 * var distance = Cesium.Cartesian3.magnitude(toCenterProj);
 * var pixelSize = camera.frustum.getPixelDimensions(scene.drawingBufferWidth, scene.drawingBufferHeight, distance, scene.pixelRatio, new Cesium.Cartesian2());
 */
PerspectiveFrustum.prototype.getPixelDimensions = function (
  drawingBufferWidth,
  drawingBufferHeight,
  distance,
  pixelRatio,
  result
) {
  update$3(this);
  return this._offCenterFrustum.getPixelDimensions(
    drawingBufferWidth,
    drawingBufferHeight,
    distance,
    pixelRatio,
    result
  );
};

/**
 * Returns a duplicate of a PerspectiveFrustum instance.
 *
 * @param {PerspectiveFrustum} [result] The object onto which to store the result.
 * @returns {PerspectiveFrustum} The modified result parameter or a new PerspectiveFrustum instance if one was not provided.
 */
PerspectiveFrustum.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new PerspectiveFrustum();
  }

  result.aspectRatio = this.aspectRatio;
  result.fov = this.fov;
  result.near = this.near;
  result.far = this.far;

  // force update of clone to compute matrices
  result._aspectRatio = undefined;
  result._fov = undefined;
  result._near = undefined;
  result._far = undefined;

  this._offCenterFrustum.clone(result._offCenterFrustum);

  return result;
};

/**
 * Compares the provided PerspectiveFrustum componentwise and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {PerspectiveFrustum} [other] The right hand side PerspectiveFrustum.
 * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
 */
PerspectiveFrustum.prototype.equals = function (other) {
  if (!defined(other) || !(other instanceof PerspectiveFrustum)) {
    return false;
  }

  update$3(this);
  update$3(other);

  return (
    this.fov === other.fov &&
    this.aspectRatio === other.aspectRatio &&
    this._offCenterFrustum.equals(other._offCenterFrustum)
  );
};

/**
 * Compares the provided PerspectiveFrustum componentwise and returns
 * <code>true</code> if they pass an absolute or relative tolerance test,
 * <code>false</code> otherwise.
 *
 * @param {PerspectiveFrustum} other The right hand side PerspectiveFrustum.
 * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
 * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
 * @returns {Boolean} <code>true</code> if this and other are within the provided epsilon, <code>false</code> otherwise.
 */
PerspectiveFrustum.prototype.equalsEpsilon = function (
  other,
  relativeEpsilon,
  absoluteEpsilon
) {
  if (!defined(other) || !(other instanceof PerspectiveFrustum)) {
    return false;
  }

  update$3(this);
  update$3(other);

  return (
    CesiumMath.equalsEpsilon(
      this.fov,
      other.fov,
      relativeEpsilon,
      absoluteEpsilon
    ) &&
    CesiumMath.equalsEpsilon(
      this.aspectRatio,
      other.aspectRatio,
      relativeEpsilon,
      absoluteEpsilon
    ) &&
    this._offCenterFrustum.equalsEpsilon(
      other._offCenterFrustum,
      relativeEpsilon,
      absoluteEpsilon
    )
  );
};

var PERSPECTIVE = 0;
var ORTHOGRAPHIC = 1;

/**
 * Describes a frustum at the given the origin and orientation.
 *
 * @alias FrustumGeometry
 * @constructor
 *
 * @param {Object} options Object with the following properties:
 * @param {PerspectiveFrustum|OrthographicFrustum} options.frustum The frustum.
 * @param {Cartesian3} options.origin The origin of the frustum.
 * @param {Quaternion} options.orientation The orientation of the frustum.
 * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
 */
function FrustumGeometry(options) {
  var frustum = options.frustum;
  var orientation = options.orientation;
  var origin = options.origin;
  var vertexFormat = defaultValue(options.vertexFormat, VertexFormat.DEFAULT);

  // This is private because it is used by DebugCameraPrimitive to draw a multi-frustum by
  // creating multiple FrustumGeometrys. This way the near plane of one frustum doesn't overlap
  // the far plane of another.
  var drawNearPlane = defaultValue(options._drawNearPlane, true);

  var frustumType;
  var frustumPackedLength;
  if (frustum instanceof PerspectiveFrustum) {
    frustumType = PERSPECTIVE;
    frustumPackedLength = PerspectiveFrustum.packedLength;
  } else if (frustum instanceof OrthographicFrustum) {
    frustumType = ORTHOGRAPHIC;
    frustumPackedLength = OrthographicFrustum.packedLength;
  }

  this._frustumType = frustumType;
  this._frustum = frustum.clone();
  this._origin = Cartesian3.clone(origin);
  this._orientation = Quaternion.clone(orientation);
  this._drawNearPlane = drawNearPlane;
  this._vertexFormat = vertexFormat;
  this._workerName = "createFrustumGeometry";

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  this.packedLength =
    2 +
    frustumPackedLength +
    Cartesian3.packedLength +
    Quaternion.packedLength +
    VertexFormat.packedLength;
}

/**
 * Stores the provided instance into the provided array.
 *
 * @param {FrustumGeometry} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
FrustumGeometry.pack = function (value, array, startingIndex) {
  startingIndex = defaultValue(startingIndex, 0);

  var frustumType = value._frustumType;
  var frustum = value._frustum;

  array[startingIndex++] = frustumType;

  if (frustumType === PERSPECTIVE) {
    PerspectiveFrustum.pack(frustum, array, startingIndex);
    startingIndex += PerspectiveFrustum.packedLength;
  } else {
    OrthographicFrustum.pack(frustum, array, startingIndex);
    startingIndex += OrthographicFrustum.packedLength;
  }

  Cartesian3.pack(value._origin, array, startingIndex);
  startingIndex += Cartesian3.packedLength;
  Quaternion.pack(value._orientation, array, startingIndex);
  startingIndex += Quaternion.packedLength;
  VertexFormat.pack(value._vertexFormat, array, startingIndex);
  startingIndex += VertexFormat.packedLength;
  array[startingIndex] = value._drawNearPlane ? 1.0 : 0.0;

  return array;
};

var scratchPackPerspective = new PerspectiveFrustum();
var scratchPackOrthographic = new OrthographicFrustum();
var scratchPackQuaternion = new Quaternion();
var scratchPackorigin = new Cartesian3();
var scratchVertexFormat = new VertexFormat();

/**
 * Retrieves an instance from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {FrustumGeometry} [result] The object into which to store the result.
 */
FrustumGeometry.unpack = function (array, startingIndex, result) {
  startingIndex = defaultValue(startingIndex, 0);

  var frustumType = array[startingIndex++];

  var frustum;
  if (frustumType === PERSPECTIVE) {
    frustum = PerspectiveFrustum.unpack(
      array,
      startingIndex,
      scratchPackPerspective
    );
    startingIndex += PerspectiveFrustum.packedLength;
  } else {
    frustum = OrthographicFrustum.unpack(
      array,
      startingIndex,
      scratchPackOrthographic
    );
    startingIndex += OrthographicFrustum.packedLength;
  }

  var origin = Cartesian3.unpack(array, startingIndex, scratchPackorigin);
  startingIndex += Cartesian3.packedLength;
  var orientation = Quaternion.unpack(
    array,
    startingIndex,
    scratchPackQuaternion
  );
  startingIndex += Quaternion.packedLength;
  var vertexFormat = VertexFormat.unpack(
    array,
    startingIndex,
    scratchVertexFormat
  );
  startingIndex += VertexFormat.packedLength;
  var drawNearPlane = array[startingIndex] === 1.0;

  if (!defined(result)) {
    return new FrustumGeometry({
      frustum: frustum,
      origin: origin,
      orientation: orientation,
      vertexFormat: vertexFormat,
      _drawNearPlane: drawNearPlane,
    });
  }

  var frustumResult =
    frustumType === result._frustumType ? result._frustum : undefined;
  result._frustum = frustum.clone(frustumResult);

  result._frustumType = frustumType;
  result._origin = Cartesian3.clone(origin, result._origin);
  result._orientation = Quaternion.clone(orientation, result._orientation);
  result._vertexFormat = VertexFormat.clone(vertexFormat, result._vertexFormat);
  result._drawNearPlane = drawNearPlane;

  return result;
};

function getAttributes(
  offset,
  normals,
  tangents,
  bitangents,
  st,
  normal,
  tangent,
  bitangent
) {
  var stOffset = (offset / 3) * 2;

  for (var i = 0; i < 4; ++i) {
    if (defined(normals)) {
      normals[offset] = normal.x;
      normals[offset + 1] = normal.y;
      normals[offset + 2] = normal.z;
    }
    if (defined(tangents)) {
      tangents[offset] = tangent.x;
      tangents[offset + 1] = tangent.y;
      tangents[offset + 2] = tangent.z;
    }
    if (defined(bitangents)) {
      bitangents[offset] = bitangent.x;
      bitangents[offset + 1] = bitangent.y;
      bitangents[offset + 2] = bitangent.z;
    }
    offset += 3;
  }

  st[stOffset] = 0.0;
  st[stOffset + 1] = 0.0;
  st[stOffset + 2] = 1.0;
  st[stOffset + 3] = 0.0;
  st[stOffset + 4] = 1.0;
  st[stOffset + 5] = 1.0;
  st[stOffset + 6] = 0.0;
  st[stOffset + 7] = 1.0;
}

var scratchRotationMatrix = new Matrix3();
var scratchViewMatrix = new Matrix4();
var scratchInverseMatrix = new Matrix4();

var scratchXDirection = new Cartesian3();
var scratchYDirection = new Cartesian3();
var scratchZDirection = new Cartesian3();
var scratchNegativeX = new Cartesian3();
var scratchNegativeY = new Cartesian3();
var scratchNegativeZ = new Cartesian3();

var frustumSplits = new Array(3);

var frustumCornersNDC = new Array(4);
frustumCornersNDC[0] = new Cartesian4(-1.0, -1.0, 1.0, 1.0);
frustumCornersNDC[1] = new Cartesian4(1.0, -1.0, 1.0, 1.0);
frustumCornersNDC[2] = new Cartesian4(1.0, 1.0, 1.0, 1.0);
frustumCornersNDC[3] = new Cartesian4(-1.0, 1.0, 1.0, 1.0);

var scratchFrustumCorners = new Array(4);
for (var i = 0; i < 4; ++i) {
  scratchFrustumCorners[i] = new Cartesian4();
}

FrustumGeometry._computeNearFarPlanes = function (
  origin,
  orientation,
  frustumType,
  frustum,
  positions,
  xDirection,
  yDirection,
  zDirection
) {
  var rotationMatrix = Matrix3.fromQuaternion(
    orientation,
    scratchRotationMatrix
  );
  var x = defaultValue(xDirection, scratchXDirection);
  var y = defaultValue(yDirection, scratchYDirection);
  var z = defaultValue(zDirection, scratchZDirection);

  x = Matrix3.getColumn(rotationMatrix, 0, x);
  y = Matrix3.getColumn(rotationMatrix, 1, y);
  z = Matrix3.getColumn(rotationMatrix, 2, z);

  Cartesian3.normalize(x, x);
  Cartesian3.normalize(y, y);
  Cartesian3.normalize(z, z);

  Cartesian3.negate(x, x);

  var view = Matrix4.computeView(origin, z, y, x, scratchViewMatrix);

  var inverseView;
  var inverseViewProjection;
  if (frustumType === PERSPECTIVE) {
    var projection = frustum.projectionMatrix;
    var viewProjection = Matrix4.multiply(
      projection,
      view,
      scratchInverseMatrix
    );
    inverseViewProjection = Matrix4.inverse(
      viewProjection,
      scratchInverseMatrix
    );
  } else {
    inverseView = Matrix4.inverseTransformation(view, scratchInverseMatrix);
  }

  if (defined(inverseViewProjection)) {
    frustumSplits[0] = frustum.near;
    frustumSplits[1] = frustum.far;
  } else {
    frustumSplits[0] = 0.0;
    frustumSplits[1] = frustum.near;
    frustumSplits[2] = frustum.far;
  }

  for (var i = 0; i < 2; ++i) {
    for (var j = 0; j < 4; ++j) {
      var corner = Cartesian4.clone(
        frustumCornersNDC[j],
        scratchFrustumCorners[j]
      );

      if (!defined(inverseViewProjection)) {
        if (defined(frustum._offCenterFrustum)) {
          frustum = frustum._offCenterFrustum;
        }

        var near = frustumSplits[i];
        var far = frustumSplits[i + 1];

        corner.x =
          (corner.x * (frustum.right - frustum.left) +
            frustum.left +
            frustum.right) *
          0.5;
        corner.y =
          (corner.y * (frustum.top - frustum.bottom) +
            frustum.bottom +
            frustum.top) *
          0.5;
        corner.z = (corner.z * (near - far) - near - far) * 0.5;
        corner.w = 1.0;

        Matrix4.multiplyByVector(inverseView, corner, corner);
      } else {
        corner = Matrix4.multiplyByVector(
          inverseViewProjection,
          corner,
          corner
        );

        // Reverse perspective divide
        var w = 1.0 / corner.w;
        Cartesian3.multiplyByScalar(corner, w, corner);

        Cartesian3.subtract(corner, origin, corner);
        Cartesian3.normalize(corner, corner);

        var fac = Cartesian3.dot(z, corner);
        Cartesian3.multiplyByScalar(corner, frustumSplits[i] / fac, corner);
        Cartesian3.add(corner, origin, corner);
      }

      positions[12 * i + j * 3] = corner.x;
      positions[12 * i + j * 3 + 1] = corner.y;
      positions[12 * i + j * 3 + 2] = corner.z;
    }
  }
};

/**
 * Computes the geometric representation of a frustum, including its vertices, indices, and a bounding sphere.
 *
 * @param {FrustumGeometry} frustumGeometry A description of the frustum.
 * @returns {Geometry|undefined} The computed vertices and indices.
 */
FrustumGeometry.createGeometry = function (frustumGeometry) {
  var frustumType = frustumGeometry._frustumType;
  var frustum = frustumGeometry._frustum;
  var origin = frustumGeometry._origin;
  var orientation = frustumGeometry._orientation;
  var drawNearPlane = frustumGeometry._drawNearPlane;
  var vertexFormat = frustumGeometry._vertexFormat;

  var numberOfPlanes = drawNearPlane ? 6 : 5;
  var positions = new Float64Array(3 * 4 * 6);
  FrustumGeometry._computeNearFarPlanes(
    origin,
    orientation,
    frustumType,
    frustum,
    positions
  );

  // -x plane
  var offset = 3 * 4 * 2;
  positions[offset] = positions[3 * 4];
  positions[offset + 1] = positions[3 * 4 + 1];
  positions[offset + 2] = positions[3 * 4 + 2];
  positions[offset + 3] = positions[0];
  positions[offset + 4] = positions[1];
  positions[offset + 5] = positions[2];
  positions[offset + 6] = positions[3 * 3];
  positions[offset + 7] = positions[3 * 3 + 1];
  positions[offset + 8] = positions[3 * 3 + 2];
  positions[offset + 9] = positions[3 * 7];
  positions[offset + 10] = positions[3 * 7 + 1];
  positions[offset + 11] = positions[3 * 7 + 2];

  // -y plane
  offset += 3 * 4;
  positions[offset] = positions[3 * 5];
  positions[offset + 1] = positions[3 * 5 + 1];
  positions[offset + 2] = positions[3 * 5 + 2];
  positions[offset + 3] = positions[3];
  positions[offset + 4] = positions[3 + 1];
  positions[offset + 5] = positions[3 + 2];
  positions[offset + 6] = positions[0];
  positions[offset + 7] = positions[1];
  positions[offset + 8] = positions[2];
  positions[offset + 9] = positions[3 * 4];
  positions[offset + 10] = positions[3 * 4 + 1];
  positions[offset + 11] = positions[3 * 4 + 2];

  // +x plane
  offset += 3 * 4;
  positions[offset] = positions[3];
  positions[offset + 1] = positions[3 + 1];
  positions[offset + 2] = positions[3 + 2];
  positions[offset + 3] = positions[3 * 5];
  positions[offset + 4] = positions[3 * 5 + 1];
  positions[offset + 5] = positions[3 * 5 + 2];
  positions[offset + 6] = positions[3 * 6];
  positions[offset + 7] = positions[3 * 6 + 1];
  positions[offset + 8] = positions[3 * 6 + 2];
  positions[offset + 9] = positions[3 * 2];
  positions[offset + 10] = positions[3 * 2 + 1];
  positions[offset + 11] = positions[3 * 2 + 2];

  // +y plane
  offset += 3 * 4;
  positions[offset] = positions[3 * 2];
  positions[offset + 1] = positions[3 * 2 + 1];
  positions[offset + 2] = positions[3 * 2 + 2];
  positions[offset + 3] = positions[3 * 6];
  positions[offset + 4] = positions[3 * 6 + 1];
  positions[offset + 5] = positions[3 * 6 + 2];
  positions[offset + 6] = positions[3 * 7];
  positions[offset + 7] = positions[3 * 7 + 1];
  positions[offset + 8] = positions[3 * 7 + 2];
  positions[offset + 9] = positions[3 * 3];
  positions[offset + 10] = positions[3 * 3 + 1];
  positions[offset + 11] = positions[3 * 3 + 2];

  if (!drawNearPlane) {
    positions = positions.subarray(3 * 4);
  }

  var attributes = new GeometryAttributes({
    position: new GeometryAttribute({
      componentDatatype: ComponentDatatype.DOUBLE,
      componentsPerAttribute: 3,
      values: positions,
    }),
  });

  if (
    defined(vertexFormat.normal) ||
    defined(vertexFormat.tangent) ||
    defined(vertexFormat.bitangent) ||
    defined(vertexFormat.st)
  ) {
    var normals = defined(vertexFormat.normal)
      ? new Float32Array(3 * 4 * numberOfPlanes)
      : undefined;
    var tangents = defined(vertexFormat.tangent)
      ? new Float32Array(3 * 4 * numberOfPlanes)
      : undefined;
    var bitangents = defined(vertexFormat.bitangent)
      ? new Float32Array(3 * 4 * numberOfPlanes)
      : undefined;
    var st = defined(vertexFormat.st)
      ? new Float32Array(2 * 4 * numberOfPlanes)
      : undefined;

    var x = scratchXDirection;
    var y = scratchYDirection;
    var z = scratchZDirection;

    var negativeX = Cartesian3.negate(x, scratchNegativeX);
    var negativeY = Cartesian3.negate(y, scratchNegativeY);
    var negativeZ = Cartesian3.negate(z, scratchNegativeZ);

    offset = 0;
    if (drawNearPlane) {
      getAttributes(offset, normals, tangents, bitangents, st, negativeZ, x, y); // near
      offset += 3 * 4;
    }
    getAttributes(offset, normals, tangents, bitangents, st, z, negativeX, y); // far
    offset += 3 * 4;
    getAttributes(
      offset,
      normals,
      tangents,
      bitangents,
      st,
      negativeX,
      negativeZ,
      y
    ); // -x
    offset += 3 * 4;
    getAttributes(
      offset,
      normals,
      tangents,
      bitangents,
      st,
      negativeY,
      negativeZ,
      negativeX
    ); // -y
    offset += 3 * 4;
    getAttributes(offset, normals, tangents, bitangents, st, x, z, y); // +x
    offset += 3 * 4;
    getAttributes(offset, normals, tangents, bitangents, st, y, z, negativeX); // +y

    if (defined(normals)) {
      attributes.normal = new GeometryAttribute({
        componentDatatype: ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: normals,
      });
    }
    if (defined(tangents)) {
      attributes.tangent = new GeometryAttribute({
        componentDatatype: ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: tangents,
      });
    }
    if (defined(bitangents)) {
      attributes.bitangent = new GeometryAttribute({
        componentDatatype: ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: bitangents,
      });
    }
    if (defined(st)) {
      attributes.st = new GeometryAttribute({
        componentDatatype: ComponentDatatype.FLOAT,
        componentsPerAttribute: 2,
        values: st,
      });
    }
  }

  var indices = new Uint16Array(6 * numberOfPlanes);
  for (var i = 0; i < numberOfPlanes; ++i) {
    var indexOffset = i * 6;
    var index = i * 4;

    indices[indexOffset] = index;
    indices[indexOffset + 1] = index + 1;
    indices[indexOffset + 2] = index + 2;
    indices[indexOffset + 3] = index;
    indices[indexOffset + 4] = index + 2;
    indices[indexOffset + 5] = index + 3;
  }

  return new Geometry({
    attributes: attributes,
    indices: indices,
    primitiveType: PrimitiveType.TRIANGLES,
    boundingSphere: BoundingSphere.fromVertices(positions),
  });
};

export { FrustumGeometry as F, OrthographicFrustum as O, PerspectiveFrustum as P };
