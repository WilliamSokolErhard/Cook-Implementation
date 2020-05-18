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
const Task_1 = require("../app/Task");
const ToolTask_1 = require("../app/ToolTask");
/**
 * Bakes various features to texture by projecting them from a high poly mesh
 * onto the UV space of a low poly mesh.
 *
 * Parameters: [[IBakeMapsTaskParameters]].
 * Tool: [[XNormalTool]].
 */
class BakeMapsTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        if (params.tool === "RapidCompact") {
            this.setupRapidCompact(params);
        }
        else {
            this.setupXNormal(params);
        }
    }
    setupXNormal(parameters) {
        const settings = {
            highPolyMeshFile: parameters.highPolyMeshFile,
            lowPolyUnwrappedMeshFile: parameters.lowPolyUnwrappedMeshFile,
            mapBaseName: parameters.mapBaseName,
            mapSize: parameters.mapSize,
            maxRayDistance: parameters.maxRayDistance,
            bakeDiffuse: !!parameters.highPolyDiffuseMapFile && parameters.bakeDiffuse,
            bakeOcclusion: parameters.bakeOcclusion,
            bakeNormals: parameters.bakeNormals,
            bakeTest: parameters.bakeTest,
            occlusionRays: parameters.occlusionRays,
            occlusionConeAngle: parameters.occlusionConeAngle,
            occlusionAttConstant: parameters.occlusionAttConstant,
            occlusionAttLinear: parameters.occlusionAttLinear,
            occlusionAttQuadratic: parameters.occlusionAttQuadratic,
            tangentSpaceNormals: parameters.tangentSpaceNormals,
            timeout: parameters.timeout
        };
        if (settings.bakeDiffuse) {
            settings.highPolyDiffuseMapFile = parameters.highPolyDiffuseMapFile;
        }
        this.addTool("XNormal", settings);
    }
    setupRapidCompact(parameters) {
        const mapBaseName = parameters.mapBaseName;
        const settings = {
            mode: "bake",
            mapBaseName,
            mapSize: parameters.mapSize,
            bakeOcclusion: parameters.bakeOcclusion,
            tangentSpaceNormals: parameters.tangentSpaceNormals,
            timeout: parameters.timeout
        };
        this.addTool("RapidCompact", settings);
    }
}
exports.default = BakeMapsTask;
BakeMapsTask.taskName = "BakeMaps";
BakeMapsTask.description = "Bakes various features to texture by projecting them " +
    "from a high poly mesh onto the UV space of a low poly mesh.";
BakeMapsTask.parameterSchema = {
    type: "object",
    properties: {
        highPolyMeshFile: { type: "string", minLength: 1 },
        highPolyDiffuseMapFile: { type: "string" },
        lowPolyUnwrappedMeshFile: { type: "string", minLength: 1 },
        mapBaseName: { type: "string", minLength: 1 },
        mapSize: { type: "integer", multipleOf: 128 },
        maxRayDistance: { type: "number", default: 0.001 },
        bakeDiffuse: { type: "boolean", default: true },
        bakeOcclusion: { type: "boolean", default: true },
        bakeNormals: { type: "boolean", default: true },
        bakeTest: { type: "boolean", default: false },
        occlusionRays: { type: "integer", minimum: 1, maximum: 512, default: 128 },
        occlusionConeAngle: { type: "integer", minimum: 1, maximum: 180, default: 165 },
        occlusionAttConstant: { type: "number", minimum: 0, maximum: 1, default: 1 },
        occlusionAttLinear: { type: "number", minimum: 0, maximum: 1, default: 0 },
        occlusionAttQuadratic: { type: "number", minimum: 0, maximum: 1, default: 0 },
        tangentSpaceNormals: { type: "boolean", default: false },
        timeout: { type: "integer", minimum: 0, default: 0 },
        tool: { type: "string", enum: ["XNormal", "RapidCompact"], default: "XNormal" }
    },
    required: [
        "highPolyMeshFile",
        "lowPolyUnwrappedMeshFile",
        "mapBaseName",
        "mapSize"
    ],
    additionalProperties: false
};
BakeMapsTask.parameterValidator = Task_1.default.jsonValidator.compile(BakeMapsTask.parameterSchema);
//# sourceMappingURL=BakeMapsTask.js.map