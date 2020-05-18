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
const path = require("path");
const Task_1 = require("../app/Task");
const ToolTask_1 = require("../app/ToolTask");
/**
 * Converts geometric mesh data between various file formats. The task is usually executed by the MeshSmith tool,
 * Meshlab and FBX2glTF can also be used if specified explicitly, but these understand less input and output formats.
 * FBX2glTF can only be used if the input format is FBX and the output is either glTF or GLB.
 *
 * Parameters: [[IConvertMeshTaskParameters]].
 * Tools: [[MeshSmithTool]], [[FBX2glTFTool]], [[MeshlabTool]].
 */
class ConvertMeshTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        const inputMeshExt = path.extname(params.inputMeshFile);
        const outputMeshExt = path.extname(params.outputMeshFile);
        // use meshlab if explicitly asked for
        if (params.tool === "Meshlab") {
            const settings = {
                inputMeshFile: params.inputMeshFile,
                outputMeshFile: params.outputMeshFile,
                filters: [],
                timeout: params.timeout
            };
            this.addTool("Meshlab", settings);
        }
        // if conversion is from fbx to glb or gltf, use FBX2glTF
        else if (params.tool === "FBX2glTF" && inputMeshExt === "fbx"
            && (outputMeshExt === "glb" || outputMeshExt === "gltf")) {
            const settings = {
                inputMeshFile: params.inputMeshFile,
                outputMeshFile: params.outputMeshFile,
                binary: outputMeshExt === "glb",
                compress: params.useCompression,
                computeNormals: params.computeNormals,
                stripNormals: params.stripNormals,
                stripUVs: params.stripTexCoords,
                timeout: params.timeout
            };
            this.addTool("FBX2glTF", settings);
        }
        // for all other purposes, use MeshSmith
        else {
            const settings = {
                inputFile: params.inputMeshFile,
                outputFile: params.outputMeshFile,
                stripNormals: params.stripNormals,
                stripTexCoords: params.stripTexCoords,
                joinVertices: params.joinVertices,
                swizzle: params.swizzle,
                alignX: params.alignX,
                alignY: params.alignY,
                alignZ: params.alignZ,
                translateX: params.translateX,
                translateY: params.translateY,
                translateZ: params.translateZ,
                scale: params.scale,
                useCompression: params.useCompression,
                timeout: params.timeout
            };
            this.addTool("MeshSmith", settings);
        }
    }
}
exports.default = ConvertMeshTask;
ConvertMeshTask.taskName = "ConvertMesh";
ConvertMeshTask.description = "Converts geometric mesh data between various file formats.";
ConvertMeshTask.parameterSchema = {
    type: "object",
    properties: {
        inputMeshFile: { type: "string", minLength: 1 },
        outputMeshFile: { type: "string", minLength: 1 },
        stripNormals: { type: "boolean", default: false },
        stripTexCoords: { type: "boolean", default: false },
        joinVertices: { type: "boolean", default: false },
        useCompression: { type: "boolean", default: false },
        computeNormals: { type: "string", enum: ["never", "broken", "missing", "always"] },
        swizzle: { type: "string", default: undefined },
        alignX: { type: "string", enum: ["start", "end", "center"] },
        alignY: { type: "string", enum: ["start", "end", "center"] },
        alignZ: { type: "string", enum: ["start", "end", "center"] },
        translateX: { type: "number" },
        translateY: { type: "number" },
        translateZ: { type: "number" },
        scale: { type: "number", minimum: 0, default: undefined },
        timeout: { type: "integer", minimum: 0, default: 0 },
        tool: { type: "string", enum: ["MeshSmith", "FBX2glTF", "Meshlab"], default: "MeshSmith" }
    },
    required: [
        "inputMeshFile",
        "outputMeshFile"
    ],
    additionalProperties: false
};
ConvertMeshTask.parameterValidator = Task_1.default.jsonValidator.compile(ConvertMeshTask.parameterSchema);
//# sourceMappingURL=ConvertMeshTask.js.map