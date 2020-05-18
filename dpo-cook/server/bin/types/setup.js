"use strict";
/**
 * 3D Foundation Project
 * Copyright 2019 Smithsonian Institution
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
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EShaderMode;
(function (EShaderMode) {
    EShaderMode[EShaderMode["Default"] = 0] = "Default";
    EShaderMode[EShaderMode["Clay"] = 1] = "Clay";
    EShaderMode[EShaderMode["XRay"] = 2] = "XRay";
    EShaderMode[EShaderMode["Normals"] = 3] = "Normals";
    EShaderMode[EShaderMode["Wireframe"] = 4] = "Wireframe";
})(EShaderMode = exports.EShaderMode || (exports.EShaderMode = {}));
var EBackgroundStyle;
(function (EBackgroundStyle) {
    EBackgroundStyle[EBackgroundStyle["Solid"] = 0] = "Solid";
    EBackgroundStyle[EBackgroundStyle["LinearGradient"] = 1] = "LinearGradient";
    EBackgroundStyle[EBackgroundStyle["RadialGradient"] = 2] = "RadialGradient";
})(EBackgroundStyle = exports.EBackgroundStyle || (exports.EBackgroundStyle = {}));
var ENavigationType;
(function (ENavigationType) {
    ENavigationType[ENavigationType["Orbit"] = 0] = "Orbit";
    ENavigationType[ENavigationType["Walk"] = 1] = "Walk";
})(ENavigationType = exports.ENavigationType || (exports.ENavigationType = {}));
var EReaderPosition;
(function (EReaderPosition) {
    EReaderPosition[EReaderPosition["Overlay"] = 0] = "Overlay";
    EReaderPosition[EReaderPosition["Left"] = 1] = "Left";
    EReaderPosition[EReaderPosition["Right"] = 2] = "Right";
})(EReaderPosition = exports.EReaderPosition || (exports.EReaderPosition = {}));
var ESliceAxis;
(function (ESliceAxis) {
    ESliceAxis[ESliceAxis["X"] = 0] = "X";
    ESliceAxis[ESliceAxis["Y"] = 1] = "Y";
    ESliceAxis[ESliceAxis["Z"] = 2] = "Z";
})(ESliceAxis = exports.ESliceAxis || (exports.ESliceAxis = {}));
//# sourceMappingURL=setup.js.map