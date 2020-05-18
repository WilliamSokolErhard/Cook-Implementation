/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { IVector2 } from "./Vector2";
export interface IVector3 {
    x: number;
    y: number;
    z: number;
}
/**
 * 3-dimensional vector.
 */
export default class Vector3 implements IVector3 {
    static readonly zeros: Vector3;
    static readonly ones: Vector3;
    static readonly unitX: Vector3;
    static readonly unitY: Vector3;
    static readonly unitZ: Vector3;
    /**
     * Returns a new vector with all components set to zero.
     */
    static makeZeros(): Vector3;
    /**
     * Returns a new vector with all components set to one.
     */
    static makeOnes(): Vector3;
    /**
     * Returns a new unit-length vector, parallel to the X axis.
     */
    static makeUnitX(): Vector3;
    /**
     * Returns a new unit-length vector, parallel to the Y axis.
     */
    static makeUnitY(): Vector3;
    /**
     * Returns a new unit-length vector, parallel to the Z axis.
     */
    static makeUnitZ(): Vector3;
    /**
     * Returns a new vector with components set from the given vector.
     * @param vector
     */
    static makeCopy(vector: IVector3): Vector3;
    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param scalar
     */
    static makeFromScalar(scalar: number): Vector3;
    /**
     * Returns a new vector with components set from the values of the given array.
     * @param array
     */
    static makeFromArray(array: number[]): Vector3;
    /**
     * Returns a string representation of the given vector.
     * @param vector
     */
    static toString(vector: IVector3): string;
    /** The vector's x component. */
    x: number;
    /** The vector's y component. */
    y: number;
    /** The vector's z component. */
    z: number;
    /**
     * Constructs a new vector with the given x, y, and z values.
     * Omitted or invalid values are set to zero.
     * @param x
     * @param y
     * @param z
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * Copies the components of the given vector to this.
     * @param vector
     */
    copy(vector: IVector3): Vector3;
    /**
     * Sets the components to the given values.
     * @param x
     * @param y
     * @param z
     */
    set(x: number, y: number, z: number): Vector3;
    /**
     * Sets each component to the given scalar value.
     * @param scalar
     */
    setFromScalar(scalar: number): Vector3;
    /**
     * Sets the components to the values of the given array.
     * @param array
     * @param offset Optional start index of the array. Default is 0.
     */
    setFromArray(array: number[], offset?: number): Vector3;
    /**
     * Sets all components to zero.
     */
    setZeros(): Vector3;
    /**
     * Sets all components to one.
     */
    setOnes(): Vector3;
    /**
     * Makes this a unit vector parallel to the X axis.
     */
    setUnitX(): Vector3;
    /**
     * Makes this a unit vector parallel to the Y axis.
     */
    setUnitY(): Vector3;
    /**
     * Makes this a unit vector parallel to the Z axis.
     */
    setUnitZ(): Vector3;
    /**
     * Adds the given vector to this.
     * @param other
     */
    add(other: IVector3): Vector3;
    /**
     * Subtracts the given vector from this.
     * @param other
     */
    sub(other: IVector3): Vector3;
    /**
     * Multiplies each component with the corresponding component of the given vector.
     * @param other
     */
    mul(other: IVector3): Vector3;
    /**
     * Divides each component by the corresponding component of the given vector.
     * @param other
     */
    div(other: IVector3): Vector3;
    /**
     * Adds the given scalar to each component.
     * @param scalar
     */
    addScalar(scalar: number): Vector3;
    /**
     * Subtracts the given scalar from each component.
     * @param scalar
     */
    subScalar(scalar: number): Vector3;
    /**
     * Multiplies each component with the given scalar.
     * @param scalar
     */
    mulScalar(scalar: number): Vector3;
    /**
     * Divides each component by the given scalar.
     * @param scalar
     */
    divScalar(scalar: number): Vector3;
    /**
     * Translates the vector by the given offsets.
     * @param tx
     * @param ty
     * @param tz
     */
    translate(tx: number, ty: number, tz: number): Vector3;
    /**
     * Rotates the vector by the given angle about the x-axis.
     * @param angle rotation angle in radians.
     */
    rotateX(angle: number): Vector3;
    /**
     * Rotates the vector by the given angle about the y-axis.
     * @param angle rotation angle in radians.
     */
    rotateY(angle: number): Vector3;
    /**
     * Rotates the vector by the given angle about the z-axis.
     * @param angle rotation angle in radians.
     */
    rotateZ(angle: number): Vector3;
    /**
     * Scales the vector by the given factors.
     * @param sx
     * @param sy
     * @param sz
     */
    scale(sx: number, sy: number, sz: number): Vector3;
    /**
     * Inverts each component of this, e.g. x = 1 / x, ...
     */
    invert(): Vector3;
    /**
     * Negates each component of this, e.g. x = -x, ...
     */
    negate(): Vector3;
    /**
     * Normalizes the vector, making it a unit vector.
     */
    normalize(): Vector3;
    /**
     * Makes this vector homogeneous by dividing all components by the z component.
     */
    homogenize(): Vector3;
    /**
     * Returns the dot product of this and the given vector.
     * @param other
     */
    dot(other: IVector3): number;
    /**
     * Assigns to this the cross product between this and the given vector.
     * @param other
     */
    cross(other: IVector3): Vector3;
    /**
     * Returns the 2-norm (length) of this.
     */
    length(): number;
    /**
     * Returns the squared 2-norm of this, i.e. the dot product of the vector with itself.
     */
    lengthSquared(): number;
    /**
     * Returns the distance between this and other.
     * @param other
     */
    distanceTo(other: IVector3): number;
    /**
     * Returns the smallest component.
     */
    min(): number;
    /**
     * Returns the largest component.
     */
    max(): number;
    /**
     * Returns true if all components are exactly zero.
     */
    isZero(): boolean;
    /**
     * Returns a clone.
     */
    clone(): Vector3;
    /**
     * Returns an array with the components of this.
     * @param array Optional destination array.
     * @param offset Optional start index of the array. Default is 0.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * Returns a [[Vector2]] with the x and y components of this.
     * @param vector Optional destination vector.
     */
    toVector2(vector?: IVector2): IVector2;
    /**
     * Returns a text representation.
     */
    toString(): string;
}
