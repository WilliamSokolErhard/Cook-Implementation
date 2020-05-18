/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
export interface IVector2 {
    x: number;
    y: number;
}
/**
 * 2-dimensional vector.
 */
export default class Vector2 implements IVector2 {
    static readonly zeros: Vector2;
    static readonly ones: Vector2;
    static readonly unitX: Vector2;
    static readonly unitY: Vector2;
    /**
     * Returns a new vector with all components set to zero.
     */
    static makeZeros(): Vector2;
    /**
     * Returns a new vector with all components set to one.
     */
    static makeOnes(): Vector2;
    /**
     * Returns a new vector of unit length, parallel to the X axis.
     */
    static makeUnitX(): Vector2;
    /**
     * Returns a new vector of unit length, parallel to the Y axis.
     */
    static makeUnitY(): Vector2;
    /**
     * Returns a new vector with components set from the given vector.
     * @param vector
     */
    static makeCopy(vector: IVector2): Vector2;
    /**
     * Returns a new vector with each component set to the given scalar value.
     * @param scalar
     */
    static makeFromScalar(scalar: number): Vector2;
    /**
     * Returns a new vector with components set from the values of the given array.
     * @param array
     */
    static makeFromArray(array: number[]): Vector2;
    /**
     * Returns a string representation of the given vector.
     * @param vector
     */
    static toString(vector: IVector2): string;
    /** The vector's x component. */
    x: number;
    /** The vector's y component. */
    y: number;
    /**
     * Constructs a new vector with the given x and y values.
     * Omitted or invalid values are set to zero.
     * @param x
     * @param y
     */
    constructor(x?: number, y?: number);
    /**
     * Copies the components of the given vector to this.
     * @param vector
     */
    copy(vector: IVector2): Vector2;
    /**
     * Sets the components to the given values.
     * @param x
     * @param y
     */
    set(x: number, y: number): Vector2;
    /**
     * Sets each component to the given scalar value.
     * @param scalar
     */
    setFromScalar(scalar: number): Vector2;
    /**
     * Sets the components to the values of the given array.
     * @param array
     * @param offset Optional start index of the array. Default is 0.
     */
    setFromArray(array: number[], offset?: number): Vector2;
    /**
     * Sets all components to zero.
     */
    setZeros(): Vector2;
    /**
     * Sets all components to one.
     */
    setOnes(): Vector2;
    /**
     * Makes this a unit vector parallel to the X axis.
     */
    setUnitX(): Vector2;
    /**
     * Makes this a unit vector parallel to the Y axis.
     */
    setUnitY(): Vector2;
    /**
     * Adds the given vector to this.
     * @param other
     */
    add(other: IVector2): Vector2;
    /**
     * Subtracts the given vector from this.
     * @param other
     */
    sub(other: IVector2): Vector2;
    /**
     * Multiplies each component with the corresponding component of the given vector.
     * @param other
     */
    mul(other: IVector2): Vector2;
    /**
     * Divides each component by the corresponding component of the given vector.
     * @param other
     */
    div(other: IVector2): Vector2;
    /**
     * Adds the given scalar to each component.
     * @param scalar
     */
    addScalar(scalar: number): Vector2;
    /**
     * Subtracts the given scalar from each component.
     * @param scalar
     */
    subScalar(scalar: number): Vector2;
    /**
     * Multiplies each component with the given scalar.
     * @param scalar
     */
    mulScalar(scalar: number): Vector2;
    /**
     * Divides each component by the given scalar.
     * @param scalar
     */
    divScalar(scalar: number): Vector2;
    /**
     * Translates the vector by the given offsets.
     * @param tx
     * @param ty
     */
    translate(tx: number, ty: number): Vector2;
    /**
     * Rotates the vector by the given angle.
     * @param angle rotation angle in radians.
     */
    rotate(angle: number): Vector2;
    /**
     * Scales the vector by the given factors.
     * @param sx
     * @param sy
     */
    scale(sx: number, sy: number): Vector2;
    /**
     * Inverts each component, e.g. x = 1 / x, ...
     */
    invert(): Vector2;
    /**
     * Negates each component, e.g. x = -x, ...
     */
    negate(): Vector2;
    /**
     * Normalizes the vector, making it a unit vector.
     */
    normalize(): Vector2;
    /**
     * Returns the dot product of this and the given vector.
     * @param other
     */
    dot(other: IVector2): number;
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
    distanceTo(other: IVector2): number;
    /**
     * Returns the angle between this and the positive X axis.
     * @returns angle in radians.
     */
    angle(): number;
    /**
     * Returns the angle between this and the given vector.
     * @param other
     * @returns angle in radians.
     */
    angleTo(other: IVector2): number;
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
    clone(): Vector2;
    /**
     * Returns an array with the components of this.
     * @param array Optional destination array.
     * @param offset Optional start index of the array. Default is 0.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * Returns a text representation.
     */
    toString(): string;
}
