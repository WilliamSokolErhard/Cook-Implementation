/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Vector3, { IVector3 } from "./Vector3";
export interface IVector4 {
    x: number;
    y: number;
    z: number;
    w: number;
}
/**
 * 4-dimensional vector.
 */
export default class Vector4 {
    static readonly zeros: Vector4;
    static readonly ones: Vector4;
    static readonly unitX: Vector4;
    static readonly unitY: Vector4;
    static readonly unitZ: Vector4;
    static readonly unitW: Vector4;
    /**
     * Returns a new vector with all components set to zero: [0, 0, 0, 0].
     */
    static makeZeros(): Vector4;
    /**
     * Returns a new vector with all components set to one: [1, 1, 1, 1].
     */
    static makeOnes(): Vector4;
    /**
     * Returns a new unit-length vector, parallel to the X axis: [1, 0, 0, 0].
     */
    static makeUnitX(): Vector4;
    /**
     * Returns a new unit-length vector, parallel to the Y axis: [0, 1, 0, 0].
     */
    static makeUnitY(): Vector4;
    /**
     * Returns a new unit-length vector, parallel to the Z axis: [0, 0, 1, 0].
     */
    static makeUnitZ(): Vector4;
    /**
     * Returns a new unit-length vector, parallel to the W axis: [0, 0, 0, 1].
     */
    static makeUnitW(): Vector4;
    /**
     * Returns a new vector with components set from the given vector.
     * @param vector
     */
    static makeCopy(vector: IVector4): Vector4;
    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param scalar
     */
    static makeFromScalar(scalar: number): Vector4;
    /**
     * Returns a new vector with components set from the values of the given array.
     * @param array
     */
    static makeFromArray(array: number[]): Vector4;
    /**
     * Returns a new positional vector from the given [[Vector3]].
     * Copies the components of the given vector to x, y, z and sets w to 1.
     * @param position
     */
    static makeFromPosition(position: IVector3): Vector4;
    /**
     * Returns a new directional vector from the given [[Vector3]].
     * Copies the components of the given vector to x, y, z and sets w to 0.
     * @param direction
     */
    static makeFromDirection(direction: IVector3): Vector4;
    /**
     * Returns a string representation of the given vector.
     * @param vector
     */
    static toString(vector: IVector4): string;
    /** The vector's x component. */
    x: number;
    /** The vector's y component. */
    y: number;
    /** The vector's z component. */
    z: number;
    /** The vector's w component. */
    w: number;
    /**
     * Constructs a new vector with the given x, y, z, and w values.
     * Omitted or invalid values are set to zero.
     * @param x
     * @param y
     * @param z
     * @param w
     */
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * Copies the components of the given vector to this.
     * @param vector
     */
    copy(vector: IVector4): Vector4;
    /**
     * Sets the components of this to the given values.
     * @param x
     * @param y
     * @param z
     * @param w Optional, is set to one if omitted.
     */
    set(x: number, y: number, z: number, w?: number): Vector4;
    /**
     * Sets each component to the given scalar value.
     * @param scalar
     */
    setFromScalar(scalar: number): Vector4;
    /**
     * Sets the components to the values of the given array.
     * @param array
     * @param offset Optional start index of the array. Default is 0.
     */
    setFromArray(array: number[], offset?: number): Vector4;
    /**
     * Sets this to a positional vector by copying the values of the given [[Vector3]]
     * and adding one as fourth component.
     * @param position
     */
    setPosition(position: IVector3): Vector4;
    /**
     * Sets this to a positional vector by copying the values of the given [[Vector3]]
     * and adding zero as fourth component.
     * @param direction
     */
    setDirection(direction: IVector3): Vector4;
    /**
     * Sets all components to zero.
     */
    setZeros(): Vector4;
    /**
     * Sets all components to one.
     */
    setOnes(): Vector4;
    /**
     * Makes this a unit vector parallel to the X axis.
     */
    setUnitX(): Vector4;
    /**
     * Makes this a unit vector parallel to the Y axis.
     */
    setUnitY(): Vector4;
    /**
     * Makes this a unit vector parallel to the Z axis.
     */
    setUnitZ(): Vector4;
    /**
     * Makes this a unit vector parallel to the W axis.
     */
    setUnitW(): Vector4;
    /**
     * Adds the given vector to this.
     * @param other
     */
    add(other: IVector4): Vector4;
    /**
     * Subtracts the given vector from this.
     * @param other
     */
    sub(other: IVector4): Vector4;
    /**
     * Multiplies each component with the corresponding component of the given vector.
     * @param other
     */
    mul(other: IVector4): Vector4;
    /**
     * Divides each component by the corresponding component of the given vector.
     * @param other
     */
    div(other: IVector4): Vector4;
    /**
     * Normalizes the vector, making it a unit vector.
     */
    normalize(): Vector4;
    /**
     * Makes this vector homogeneous by dividing all components by the w-component.
     */
    homogenize(): Vector4;
    /**
     * Projects this onto the given vector.
     * @param other
     */
    project(other: IVector4): Vector4;
    /**
     * Returns the dot product of this and the given vector.
     * @param other
     */
    dot(other: IVector4): number;
    /**
     * Returns the 2-norm (length) of this.
     */
    length(): number;
    /**
     * Returns the squared 2-norm of this, i.e. the dot product of the vector with itself.
     */
    lengthSquared(): number;
    /**
     * Returns true if all components are exactly zero.
     * @returns {boolean}
     */
    isZero(): boolean;
    /**
     * Returns a clone of this vector.
     */
    clone(): Vector4;
    /**
     * Returns an array with the components of this.
     * @param array Optional destination array.
     * @param offset Optional start index of the array. Default is 0.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * Returns a [[Vector3]] with the x, y, and z components of this.
     * @param vector Optional destination vector.
     */
    toVector3(vector?: Vector3): Vector3;
    /**
     * Returns a text representation.
     */
    toString(): string;
}
