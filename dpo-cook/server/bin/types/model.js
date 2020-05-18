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
const common_1 = require("./common");
exports.EUnitType = common_1.EUnitType;
var EDerivativeUsage;
(function (EDerivativeUsage) {
    EDerivativeUsage[EDerivativeUsage["Image2D"] = 0] = "Image2D";
    EDerivativeUsage[EDerivativeUsage["Web3D"] = 1] = "Web3D";
    EDerivativeUsage[EDerivativeUsage["Print3D"] = 2] = "Print3D";
    EDerivativeUsage[EDerivativeUsage["Editorial3D"] = 3] = "Editorial3D";
})(EDerivativeUsage = exports.EDerivativeUsage || (exports.EDerivativeUsage = {}));
var EDerivativeQuality;
(function (EDerivativeQuality) {
    EDerivativeQuality[EDerivativeQuality["Thumb"] = 0] = "Thumb";
    EDerivativeQuality[EDerivativeQuality["Low"] = 1] = "Low";
    EDerivativeQuality[EDerivativeQuality["Medium"] = 2] = "Medium";
    EDerivativeQuality[EDerivativeQuality["High"] = 3] = "High";
    EDerivativeQuality[EDerivativeQuality["Highest"] = 4] = "Highest";
    EDerivativeQuality[EDerivativeQuality["LOD"] = 5] = "LOD";
    EDerivativeQuality[EDerivativeQuality["Stream"] = 6] = "Stream";
})(EDerivativeQuality = exports.EDerivativeQuality || (exports.EDerivativeQuality = {}));
var EAssetType;
(function (EAssetType) {
    EAssetType[EAssetType["Model"] = 0] = "Model";
    EAssetType[EAssetType["Geometry"] = 1] = "Geometry";
    EAssetType[EAssetType["Image"] = 2] = "Image";
    EAssetType[EAssetType["Texture"] = 3] = "Texture";
    EAssetType[EAssetType["Points"] = 4] = "Points";
    EAssetType[EAssetType["Volume"] = 5] = "Volume";
})(EAssetType = exports.EAssetType || (exports.EAssetType = {}));
var EMapType;
(function (EMapType) {
    EMapType[EMapType["Color"] = 0] = "Color";
    EMapType[EMapType["Emissive"] = 1] = "Emissive";
    EMapType[EMapType["Occlusion"] = 2] = "Occlusion";
    EMapType[EMapType["Normal"] = 3] = "Normal";
    EMapType[EMapType["MetallicRoughness"] = 4] = "MetallicRoughness";
    EMapType[EMapType["Zone"] = 5] = "Zone";
})(EMapType = exports.EMapType || (exports.EMapType = {}));
//# sourceMappingURL=model.js.map