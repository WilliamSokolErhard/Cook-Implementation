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
 * Combines mesh and map data into a GLTF web asset. The asset can be written in JSON or binary format,
 * with optionally embedded maps and DRACO-compressed mesh data.
 *
 * Parameters: [[IWebAssetTaskParameters]].
 * Tool: [[MeshSmithTool]].
 */
class WebAssetTask extends ToolTask_1.default {
    constructor(options, context) {
        super(options, context);
        const settings = {
            inputFile: options.meshFile,
            outputFile: options.outputFile,
            format: options.writeBinary ? "glbx" : "gltfx",
            metallicFactor: options.metallicFactor,
            roughnessFactor: options.roughnessFactor,
            diffuseMapFile: options.diffuseMapFile,
            occlusionMapFile: options.occlusionMapFile,
            emissiveMapFile: options.emissiveMapFile,
            metallicRoughnessMapFile: options.metallicRoughnessMapFile,
            normalMapFile: options.normalMapFile,
            zoneMapFile: options.zoneMapFile,
            objectSpaceNormals: options.objectSpaceNormals,
            useCompression: options.useCompression,
            compressionLevel: options.compressionLevel,
            embedMaps: options.embedMaps
        };
        if (options.alignCenter) {
            settings.alignX = "center";
            settings.alignY = "center";
            settings.alignZ = "center";
        }
        if (options.alignFloor) {
            settings.alignX = "center";
            settings.alignY = "start";
            settings.alignZ = "center";
        }
        this.addTool("MeshSmith", settings);
    }
}
exports.default = WebAssetTask;
WebAssetTask.taskName = "WebAsset";
WebAssetTask.description = "Creates glTF/glb web assets including mesh and textures.";
WebAssetTask.parameterSchema = {
    type: "object",
    properties: {
        outputFile: { type: "string", minLength: 1 },
        meshFile: { type: "string", minLength: 1 },
        diffuseMapFile: { type: "string", default: "" },
        occlusionMapFile: { type: "string", default: "" },
        emissiveMapFile: { type: "string", default: "" },
        metallicRoughnessMapFile: { type: "string", default: "" },
        normalMapFile: { type: "string", default: "" },
        zoneMapFile: { type: "string", default: "" },
        metallicFactor: { type: "number", default: 0.1 },
        roughnessFactor: { type: "number", default: 0.8 },
        alignCenter: { type: "boolean", default: false },
        alignFloor: { type: "boolean", default: false },
        objectSpaceNormals: { type: "boolean", default: false },
        useCompression: { type: "boolean", default: false },
        compressionLevel: { type: "integer", minimum: 0, maximum: 10, default: 10 },
        embedMaps: { type: "boolean", default: false },
        writeBinary: { type: "boolean", default: false }
    },
    required: [
        "outputFile",
        "meshFile"
    ],
    additionalProperties: false
};
WebAssetTask.parameterValidator = Task_1.default.jsonValidator.compile(WebAssetTask.parameterSchema);
//# sourceMappingURL=WebAssetTask.js.map