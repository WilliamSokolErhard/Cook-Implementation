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
////////////////////////////////////////////////////////////////////////////////
const limit = (n, min, max) => n < min ? min : (n > max ? max : n);
/**
 * Unwraps a mesh's surface onto a plane and generates a set of texture coordinates for map baking.
 *
 * - Parameters: [[IUnwrapMeshTaskParameters]].
 * - Tools: [[RizomUVTool]], [[RapidCompactTool]], [[UnknitTool]].
 */
class UnwrapMeshTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        const segmentationStrength = parseFloat(params.segmentationStrength.toString());
        const packEffort = parseFloat(params.packEffort.toString());
        switch (params.tool) {
            case "RizomUV":
                const cutSegmentationStrength = limit(segmentationStrength, 0, 1);
                const index = limit(Math.trunc(packEffort * 5), 0, 4);
                const mutations = [1, 1, 2, 2, 2];
                const steps = [90, 45, 30, 30, 15];
                const packResolution = limit(100 + packEffort * 800, 100, 900);
                const packMutations = mutations[index];
                const packRotateStep = steps[index];
                const rizomUVSettings = {
                    inputMeshFile: params.inputMeshFile,
                    outputMeshFile: params.outputMeshFile,
                    saveObj: params.saveObj,
                    saveFbx: params.saveFbx,
                    saveCollada: params.saveCollada,
                    cutSegmentationStrength,
                    cutHandles: params.cutHandles,
                    packResolution,
                    packMutations,
                    packRotateStep,
                    timeout: params.timeout
                };
                this.addTool("RizomUV", rizomUVSettings);
                break;
            case "RapidCompact":
                const chartAngleDeg = limit(60 + segmentationStrength * 120, 60, 180);
                const rpdSettings = {
                    inputMeshFile: params.inputMeshFile,
                    outputMeshFile: params.outputMeshFile,
                    mode: params.decimate ? "decimate-unwrap" : "unwrap",
                    unwrapMethod: params.unwrapMethod,
                    cutAngleDeg: 95,
                    chartAngleDeg,
                    mapSize: params.mapSize,
                    timeout: params.timeout
                };
                if (params.decimate) {
                    if (!params.numFaces) {
                        throw new Error("for decimation, target number of faces (numFaces) must be specified");
                    }
                    rpdSettings.numFaces = params.numFaces;
                }
                this.addTool("RapidCompact", rpdSettings);
                break;
            case "Unknit":
                const unknitSettings = {
                    inputMeshFile: params.inputMeshFile,
                    outputMeshFile: params.outputMeshFile,
                    mapSize: params.mapSize,
                    showUI: params.debug
                };
                this.addTool("Unknit", unknitSettings);
                break;
            default:
                throw new Error("unknown tool: " + params.tool);
        }
    }
}
exports.default = UnwrapMeshTask;
UnwrapMeshTask.taskName = "UnwrapMesh";
UnwrapMeshTask.description = "creates a new UV map for a mesh.";
UnwrapMeshTask.parameterSchema = {
    type: "object",
    properties: {
        inputMeshFile: { type: "string", minLength: 1 },
        outputMeshFile: { type: "string", minLength: 1 },
        saveObj: { type: "boolean", default: false },
        saveFbx: { type: "boolean", default: false },
        saveCollada: { type: "boolean", default: false },
        decimate: { type: "boolean", default: false },
        numFaces: { type: "integer", minimum: 100 },
        mapSize: { type: "integer", multipleOf: 128, default: 2048 },
        segmentationStrength: { type: "number", minimum: 0, maximum: 1, default: 0.5 },
        packEffort: { type: "number", minimum: 0, maximum: 1, default: 0.5 },
        cutHandles: { type: "boolean", default: true },
        unwrapMethod: {
            type: "string",
            enum: ["conformal", "fastConformal", "isometric", "forwardBijective", "fixedBoundary"],
            default: "forwardBijective"
        },
        debug: { type: "boolean", default: false },
        timeout: { type: "integer", minimum: 0, default: 0 },
        tool: {
            type: "string",
            enum: ["RizomUV", "Unknit", "RapidCompact"],
            default: "RizomUV"
        }
    },
    required: [
        "inputMeshFile",
        "outputMeshFile"
    ],
    additionalProperties: false
};
UnwrapMeshTask.parameterValidator = Task_1.default.jsonValidator.compile(UnwrapMeshTask.parameterSchema);
//# sourceMappingURL=UnwrapMeshTask.js.map