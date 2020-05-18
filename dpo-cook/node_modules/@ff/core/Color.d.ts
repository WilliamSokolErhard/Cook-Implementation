/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Vector3, { IVector3 } from "./Vector3";
import Vector4, { IVector4 } from "./Vector4";
export { Vector3, IVector3, Vector4, IVector4 };
/**
 * RGB color with alpha channel. The class is compatible with Vector4,
 * the field names for the colors are x (red), y (green), z (blue), and w (alpha).
 *
 * Source for RGB/HSL/HSV conversions: https://gist.github.com/mjackson/5311256
 */
export default class Color implements IVector4 {
    static fromString(color: string): Color;
    static fromArray(color: number[]): Color;
    x: number;
    y: number;
    z: number;
    w: number;
    length: 4;
    constructor(red?: number | number[] | string | Color, green?: number, blue?: number, alpha?: number);
    get r(): number;
    get g(): number;
    get b(): number;
    get a(): number;
    set r(value: number);
    set g(value: number);
    set b(value: number);
    set a(value: number);
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    set red(value: number);
    set green(value: number);
    set blue(value: number);
    set alpha(value: number);
    get redByte(): number;
    get greenByte(): number;
    get blueByte(): number;
    get alphaByte(): number;
    set redByte(value: number);
    set greenByte(value: number);
    set blueByte(value: number);
    set alphaByte(value: number);
    inverseMultiply(factor: number): Color;
    multiply(factor: number): Color;
    copy(color: Color): void;
    clone(): Color;
    set(red: number, green: number, blue: number, alpha?: number): this;
    setBytes(red: number, green: number, blue: number, alpha?: number): this;
    setUInt24RGB(x: number): this;
    setUInt32RGBA(x: number): this;
    setRed(red: number): Color;
    setGreen(green: number): Color;
    setBlue(blue: number): Color;
    setAlpha(alpha: number): Color;
    setRedByte(red: number): Color;
    setGreenByte(green: number): Color;
    setBlueByte(blue: number): Color;
    setAlphaByte(alpha: number): Color;
    setHSV(hue: number | IVector3 | IVector4, saturation?: number, value?: number, alpha?: number): Color;
    setHSL(hue: number | IVector3 | IVector4, saturation?: number, luminance?: number, alpha?: number): Color;
    fromArray(arr: number[]): void;
    setString(color: string, alpha?: number, throws?: boolean): Color;
    toUInt24RGB(): number;
    toUInt32RGBA(): number;
    toVector3(rgb: IVector3): IVector3;
    toVector4(rgba: IVector4): IVector4;
    toHSV(hsv?: IVector3): IVector3;
    toHSL(hsl?: IVector3): IVector3;
    toRGBArray(arr?: number[]): number[];
    toRGBAArray(arr?: number[]): number[];
    toString(includeAlpha?: boolean): string;
    private static presets;
}
