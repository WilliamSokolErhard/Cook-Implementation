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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const uniqueId_1 = require("../utils/uniqueId");
const Tool_1 = require("../app/Tool");
class MeshSmithTool extends Tool_1.default {
    setupInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = instance.settings;
            const inputFilePath = instance.getFilePath(settings.inputFile);
            if (!inputFilePath) {
                throw new Error("missing input mesh file");
            }
            const outputFilePath = instance.getFilePath(settings.outputFile);
            const config = {
                input: inputFilePath,
                output: outputFilePath,
                format: settings.format,
                report: settings.report,
                joinVertices: settings.joinVertices,
                stripNormals: settings.stripNormals,
                stripTexCoords: settings.stripTexCoords,
                gltfx: {
                    metallicFactor: settings.metallicFactor,
                    roughnessFactor: settings.roughnessFactor,
                    useCompression: settings.useCompression,
                    objectSpaceNormals: settings.objectSpaceNormals,
                    embedMaps: settings.embedMaps
                },
                "compression": {
                    positionQuantizationBits: settings.positionQuantizationBits,
                    texCoordsQuantizationBits: settings.texCoordsQuantizationBits,
                    normalsQuantizationBits: settings.normalsQuantizationBits,
                    genericQuantizationBits: settings.genericQuantizationBits,
                    compressionLevel: settings.compressionLevel
                }
            };
            if (settings.swizzle) {
                config.swizzle = settings.swizzle;
            }
            if (settings.alignX) {
                config.alignX = settings.alignX === "start" ? -1 : (settings.alignX === "end" ? 1 : 0);
            }
            if (settings.alignY) {
                config.alignY = settings.alignY === "start" ? -1 : (settings.alignY === "end" ? 1 : 0);
            }
            if (settings.alignZ) {
                config.alignZ = settings.alignZ === "start" ? -1 : (settings.alignZ === "end" ? 1 : 0);
            }
            if (settings.translateX || settings.translateY || settings.translateZ) {
                config.translate = [
                    settings.translateX || 0,
                    settings.translateY || 0,
                    settings.translateZ || 0,
                ];
            }
            if (settings.scale !== undefined && settings.scale !== 1.0) {
                config.scale = settings.scale;
            }
            if (settings.matrix) {
                config.matrix = settings.matrix;
            }
            if (settings.diffuseMapFile) {
                config.gltfx.diffuseMap = instance.getFilePath(settings.diffuseMapFile);
            }
            if (settings.occlusionMapFile) {
                config.gltfx.occlusionMap = instance.getFilePath(settings.occlusionMapFile);
            }
            if (settings.emissiveMapFile) {
                config.gltfx.emissiveMap = instance.getFilePath(settings.emissiveMapFile);
            }
            if (settings.metallicRoughnessMapFile) {
                config.gltfx.metallicRoughnessMap = instance.getFilePath(settings.metallicRoughnessMapFile);
            }
            if (settings.normalMapFile) {
                config.gltfx.normalMap = instance.getFilePath(settings.normalMapFile);
            }
            if (settings.zoneMapFile) {
                config.gltfx.zoneMap = instance.getFilePath(settings.zoneMapFile);
            }
            if (!settings.format && outputFilePath) {
                const extension = path.extname(outputFilePath).toLowerCase();
                switch (extension) {
                    case ".dae":
                        config.format = "collada";
                        break;
                    case ".ply":
                        config.format = "plyb";
                        break;
                    case ".stl":
                        config.format = "stlb";
                        break;
                    case ".3ds":
                        config.format = "3ds";
                        break;
                    case ".gltf":
                        config.format = "gltfx";
                        break;
                    case ".glb":
                        config.format = "glbx";
                        break;
                    case ".obj":
                        config.format = "objnomtl";
                        break;
                }
            }
            const fileName = "_meshsmith_" + uniqueId_1.default() + ".json";
            const content = JSON.stringify(config, null, 2);
            return instance.writeFile(fileName, content).then(() => ({
                command: `"${this.configuration.executable}" -c "${instance.getFilePath(fileName)}"`,
                script: { fileName, content }
            }));
        });
    }
    onInstanceState(event) {
        super.onInstanceState(event);
        if (event.state === "error") {
            const report = event.instance.report.execution;
            if (report.results.error) {
                report.error = report.results.error;
            }
        }
    }
    onInstanceMessage(event) {
        let { instance, message } = event;
        message = message.trim();
        if (message.length < 2 || !message.startsWith("{")) {
            return false;
        }
        try {
            const parsedMessage = JSON.parse(message);
            const report = instance.report.execution;
            if (parsedMessage.type === "report") {
                const results = report.results = report.results || {};
                results["inspection"] = parsedMessage;
            }
            if (parsedMessage.type === "status" && parsedMessage.status === "error") {
                const results = report.results = report.results || {};
                results["error"] = parsedMessage.error;
            }
        }
        catch (e) {
            // discard parsing error
        }
        return true;
    }
}
exports.default = MeshSmithTool;
MeshSmithTool.toolName = "MeshSmith";
MeshSmithTool.defaultSettings = {
    metallicFactor: 0.1,
    roughnessFactor: 0.8,
    positionQuantizationBits: 14,
    texCoordsQuantizationBits: 12,
    normalsQuantizationBits: 10,
    genericQuantizationBits: 8,
    compressionLevel: 10
};
//# sourceMappingURL=MeshSmithTool.js.map