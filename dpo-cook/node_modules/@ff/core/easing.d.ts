/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
export declare enum EEasingCurve {
    Linear = 0,
    EaseQuad = 1,
    EaseInQuad = 2,
    EaseOutQuad = 3,
    EaseCubic = 4,
    EaseInCubic = 5,
    EaseOutCubic = 6,
    EaseQuart = 7,
    EaseInQuart = 8,
    EaseOutQuart = 9,
    EaseQuint = 10,
    EaseInQuint = 11,
    EaseOutQuint = 12,
    EaseSine = 13,
    EaseInSine = 14,
    EaseOutSine = 15
}
export declare function getEasingFunction(curve: EEasingCurve): any;
export declare const easingFunctions: {
    Linear: (t: any) => any;
    EaseQuad: (t: any) => number;
    EaseInQuad: (t: any) => number;
    EaseOutQuad: (t: any) => number;
    EaseCubic: (t: any) => number;
    EaseInCubic: (t: any) => number;
    EaseOutCubic: (t: any) => number;
    EaseQuart: (t: any) => number;
    EaseInQuart: (t: any) => number;
    EaseOutQuart: (t: any) => number;
    EaseQuint: (t: any) => number;
    EaseInQuint: (t: any) => number;
    EaseOutQuint: (t: any) => number;
    EaseSine: (t: any) => number;
    EaseInSine: (t: any) => number;
    EaseOutSine: (t: any) => number;
};
