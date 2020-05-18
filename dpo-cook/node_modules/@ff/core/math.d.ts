/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
declare const math: {
    PI: number;
    DOUBLE_PI: number;
    HALF_PI: number;
    QUARTER_PI: number;
    DEG2RAD: number;
    RAD2DEG: number;
    limit: (v: any, min: any, max: any) => any;
    limitInt: (v: any, min: any, max: any) => any;
    normalize: (v: any, min: any, max: any) => number;
    normalizeLimit: (v: any, min: any, max: any) => any;
    denormalize: (t: any, min: any, max: any) => number;
    scale: (v: any, minIn: any, maxIn: any, minOut: any, maxOut: any) => any;
    scaleLimit: (v: any, minIn: any, maxIn: any, minOut: any, maxOut: any) => any;
    deg2rad: (degrees: any) => number;
    rad2deg: (radians: any) => number;
    deltaRadians: (radA: any, radB: any) => number;
    deltaDegrees: (degA: any, degB: any) => number;
    curves: {
        linear: (t: any) => any;
        easeIn: (t: any) => number;
        easeOut: (t: any) => number;
        ease: (t: any) => number;
        easeInQuad: (t: any) => number;
        easeOutQuad: (t: any) => number;
        easeQuad: (t: any) => number;
        easeInCubic: (t: any) => number;
        easeOutCubic: (t: any) => number;
        easeCubic: (t: any) => number;
        easeInQuart: (t: any) => number;
        easeOutQuart: (t: any) => number;
        easeQuart: (t: any) => number;
    };
};
export default math;
