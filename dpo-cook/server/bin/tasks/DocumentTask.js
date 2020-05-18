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
const fs_1 = require("fs");
const path = require("path");
const Task_1 = require("../app/Task");
const DocumentBuilder_1 = require("../utils/DocumentBuilder");
/**
 * Creates and modifies document.json descriptor files, as used by the Smithsonian Voyager 3D Explorer.
 * If the value of a parameter is an empty string, the corresponding document.json data is removed.
 *
 * Parameters: [[IDocumentTaskParameters]].
 */
class DocumentTask extends Task_1.default {
    constructor() {
        super(...arguments);
        this.builder = null;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.builder = new DocumentBuilder_1.default(this.context.jobDir);
            yield this.readDocument();
            yield this.modifyDocument();
            return this.writeDocument();
        });
    }
    readDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.parameters;
            const documentFilePath = path.resolve(this.context.jobDir, params.documentFile);
            return fs_1.promises.readFile(documentFilePath, "utf8").then(json => {
                // successfully read file: parse JSON and replace the default document
                this.builder.document = JSON.parse(json);
            })
                .catch(() => { }); // in case of an error, continue with default document
        });
    }
    modifyDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = this.builder;
            const document = this.builder.document;
            const params = this.parameters;
            const scene = builder.getMainScene();
            if (!scene) {
                throw new Error("malformed document, missing scene");
            }
            const nodes = document.nodes || (document.nodes = []);
            const models = document.models || (document.models = []);
            let modelIndex = params.modelIndex;
            let model = models[modelIndex];
            let node = null;
            if (model) {
                // if model already exists, find corresponding node
                node = document.nodes.find(node => node.model === params.modelIndex);
                if (!node) {
                    throw new Error("malformed document, model not referenced by node");
                }
            }
            else {
                // create new model
                model = { units: "cm", derivatives: [] };
                modelIndex = models.length;
                models.push(model);
                // create new node
                node = { name: "Model", model: modelIndex };
                const nodeIndex = nodes.length;
                nodes.push(node);
                // add new node to main document scene
                scene.nodes = scene.nodes || [];
                scene.nodes.push(nodeIndex);
            }
            if (params.modelName) {
                node.name = params.modelName;
            }
            // assign given units to model and scene
            if (params.units) {
                model.units = params.units;
                scene.units = params.units;
            }
            // or, if units not given, adapt model units from scene
            else if (!model.units) {
                model.units = scene.units;
            }
            const derivatives = model.derivatives;
            // derivative operations
            const hasFile = params.modelFile || params.meshFile ||
                params.diffuseMapFile || params.occlusionMapFile || params.normalMapFile;
            const usage = params.derivativeUsage || "Web3D";
            const quality = params.derivativeQuality || "Medium";
            // find a derivative based on usage and quality
            let derivative = derivatives.find(derivative => derivative.usage === usage && derivative.quality === quality);
            // derivative specified and exists, but no files given: remove derivative
            if (derivative && params.derivativeQuality && !hasFile) {
                derivatives.splice(derivatives.indexOf(derivative), 1);
                return Promise.resolve(document);
            }
            // no asset files given, no further modifications
            if (!hasFile) {
                return Promise.resolve(document);
            }
            // files given but derivative not found: create one
            if (!derivative) {
                derivative = { usage, quality, assets: [] };
                derivatives.push(derivative);
            }
            const assets = derivative.assets;
            // add/modify model file asset
            const mods = [];
            if (params.modelFile) {
                mods.push(this.updateAsset(assets, "Model", params.modelFile).then(asset => {
                    if (params.numFaces > 0) {
                        asset.numFaces = params.numFaces;
                    }
                    if (params.mapSize > 0) {
                        asset.imageSize = params.mapSize;
                    }
                }));
            }
            if (params.meshFile) {
                mods.push(this.updateAsset(assets, "Geometry", params.meshFile).then(asset => {
                    if (params.numFaces > 0) {
                        asset.numFaces = params.numFaces;
                    }
                }));
            }
            if (params.diffuseMapFile) {
                mods.push(this.updateAsset(assets, "Texture", params.diffuseMapFile).then(asset => {
                    asset.mapType = "Color";
                    if (params.mapSize > 0) {
                        asset.imageSize = params.mapSize;
                    }
                }));
            }
            if (params.occlusionMapFile) {
                mods.push(this.updateAsset(assets, "Texture", params.occlusionMapFile).then(asset => {
                    asset.mapType = "Occlusion";
                    if (params.mapSize > 0) {
                        asset.imageSize = params.mapSize;
                    }
                }));
            }
            if (params.normalMapFile) {
                mods.push(this.updateAsset(assets, "Texture", params.normalMapFile).then(asset => {
                    asset.mapType = "Normal";
                    if (params.mapSize > 0) {
                        asset.imageSize = params.mapSize;
                    }
                }));
            }
            if (params.metaDataFile) {
                const metaDataPath = path.resolve(this.context.jobDir, params.metaDataFile);
                mods.push(fs_1.promises.readFile(metaDataPath, "utf8").then(json => {
                    console.log(json);
                    const metaData = JSON.parse(json);
                    console.log(metaData);
                    const keys = Object.keys(metaData);
                    if (keys.length > 0) {
                        let meta;
                        if (isFinite(node.meta)) {
                            meta = document.metas[node.meta];
                        }
                        else {
                            meta = {};
                            document.metas = document.metas || [];
                            node.meta = document.metas.length;
                            document.metas.push(meta);
                        }
                        meta.collection = meta.collection || {};
                        keys.forEach(key => meta.collection[key] = metaData[key]);
                    }
                }));
            }
            return Promise.all(mods).then(() => document);
        });
    }
    updateAsset(assets, type, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.resolve(this.context.jobDir, fileName);
            return fs_1.promises.stat(filePath).then(stats => {
                let asset = assets.find(asset => asset.type === type);
                if (!asset) {
                    asset = { uri: "", type };
                    assets.push(asset);
                }
                asset.uri = fileName;
                asset.byteSize = stats.size;
                return asset;
            });
        });
    }
    writeDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.parameters;
            const documentFilePath = path.resolve(this.context.jobDir, params.documentFile);
            const json = JSON.stringify(this.builder.document);
            return fs_1.promises.writeFile(documentFilePath, json, "utf8");
        });
    }
}
exports.default = DocumentTask;
DocumentTask.taskName = "Document";
DocumentTask.description = "Creates and modifies document.json descriptor files.";
DocumentTask.parameterSchema = {
    type: "object",
    properties: {
        documentFile: { type: "string", minLength: 1 },
        metaDataFile: { type: "string" },
        modelIndex: { type: "integer", minimum: 0 },
        modelName: { type: "string" },
        units: { type: "string", enum: ["mm", "cm", "m", "in", "ft", "yd"] },
        derivativeUsage: { type: "string", enum: ["Web2D", "Web3D", "Print", "Editorial"] },
        derivativeQuality: { type: "string", enum: ["Thumb", "Low", "Medium", "High", "Highest", "LOD", "Stream"] },
        modelFile: { type: "string" },
        meshFile: { type: "string" },
        diffuseMapFile: { type: "string" },
        occlusionMapFile: { type: "string" },
        normalMapFile: { type: "string" },
        numFaces: { type: "integer" },
        mapSize: { type: "integer" },
    },
    required: [
        "documentFile",
    ],
    additionalProperties: false,
};
DocumentTask.parameterValidator = Task_1.default.jsonValidator.compile(DocumentTask.parameterSchema);
//# sourceMappingURL=DocumentTask.js.map