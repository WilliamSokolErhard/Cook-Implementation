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
const fs_1 = require("fs");
const clone_1 = require("@ff/core/clone");
const uniqueId_1 = require("@ff/core/uniqueId");
////////////////////////////////////////////////////////////////////////////////
class DocumentBuilder {
    constructor(baseDir, document) {
        this.document = null;
        this.baseDir = "";
        this.baseDir = baseDir;
        this.document = document ? document : clone_1.default(DocumentBuilder.defaultDocument);
    }
    initialize() {
        this.document = clone_1.default(DocumentBuilder.defaultDocument);
    }
    getMainScene() {
        return this.document.scenes[this.document.scene];
    }
    createNode(parent) {
        const nodes = this.document.nodes = this.document.nodes || [];
        const children = parent.children = parent.children || [];
        children.push(nodes.length);
        const node = {};
        nodes.push(node);
        return node;
    }
    getOrCreateCamera(node) {
        if (node.camera !== undefined) {
            return this.document.cameras[node.camera];
        }
        const cameras = this.document.cameras = this.document.cameras || [];
        node.camera = cameras.length;
        const camera = {
            type: "perspective",
        };
        cameras.push(camera);
        return camera;
    }
    createRootNode(scene) {
        scene = scene || this.getMainScene();
        const nodes = this.document.nodes = this.document.nodes || [];
        const children = scene.nodes = scene.nodes || [];
        children.push(nodes.length);
        const node = {};
        nodes.push(node);
        return node;
    }
    getOrCreateSetup(scene) {
        if (scene.setup !== undefined) {
            return this.document.setups[scene.setup];
        }
        const setups = this.document.setups = this.document.setups || [];
        scene.setup = setups.length;
        const setup = {};
        setups.push(setup);
        return setup;
    }
    getOrCreateMeta(node) {
        if (node.meta !== undefined) {
            return this.document.metas[node.meta];
        }
        const metas = this.document.metas = this.document.metas || [];
        node.meta = metas.length;
        const meta = {};
        metas.push(meta);
        return meta;
    }
    getOrCreateModel(node) {
        if (node.model !== undefined) {
            return this.document.models[node.model];
        }
        const models = this.document.models = this.document.models || [];
        node.model = models.length;
        const model = {
            units: "cm",
            derivatives: [],
        };
        models.push(model);
        return model;
    }
    findNodesByModel(model) {
        const nodes = this.document.nodes;
        if (!nodes) {
            return [];
        }
        const models = this.document.models;
        if (!models) {
            return [];
        }
        return nodes.filter(node => models[node.model] === model);
    }
    getCamera(index) {
        return this.document.cameras ? this.document.cameras[index] : undefined;
    }
    findNodeByCamera(camera) {
        const nodes = this.document.nodes;
        if (!nodes) {
            return null;
        }
        const cameras = this.document.cameras;
        if (!cameras) {
            return null;
        }
        return nodes.find(node => cameras[node.camera] === camera);
    }
    findSceneBySetup(setup) {
        const scenes = this.document.scenes;
        if (!scenes) {
            return undefined;
        }
        const setups = this.document.setups;
        if (!setups) {
            return undefined;
        }
        return scenes.filter(scene => setups[scene.setup] === setup)[0];
    }
    createArticle(node, uri) {
        const meta = this.getOrCreateMeta(node);
        const articles = meta.articles = meta.articles || [];
        const article = {
            id: uniqueId_1.default(),
            uri
        };
        articles.push(article);
        return article;
    }
    addArticle(node, article) {
        const meta = this.getOrCreateMeta(node);
        const articles = meta.articles = meta.articles || [];
        articles.push(article);
        return article;
    }
    createAnnotation(model) {
        const annotations = model.annotations = model.annotations || [];
        const annotation = {
            id: uniqueId_1.default()
        };
        annotations.push(annotation);
        return annotation;
    }
    createTour(setup, title) {
        const scene = this.findSceneBySetup(setup);
        const sceneIndex = this.document.scenes.indexOf(scene);
        const scenePath = `scenes/${sceneIndex}/`;
        setup.snapshots = setup.snapshots || {
            features: ["reader", "viewer", "navigation"],
            targets: [
                `${scenePath}setup/reader/enabled`,
                `${scenePath}setup/reader/articleId`,
                `${scenePath}setup/navigation/orbit`,
                `${scenePath}setup/navigation/offset`,
                `${scenePath}setup/viewer/annotationsVisible`,
                `${scenePath}setup/viewer/activeAnnotation`,
                `${scenePath}setup/viewer/activeTags`,
                `${scenePath}setup/viewer/shader`,
                `${scenePath}setup/viewer/exposure`
            ],
            states: []
        };
        const tours = setup.tours = setup.tours || [];
        const tour = {
            title,
            steps: []
        };
        tours.push(tour);
        return tour;
    }
    createSnapshot(setup, tour, title) {
        const id = uniqueId_1.default(6);
        const step = { id, title };
        tour.steps.push(step);
        const state = { id, values: [], duration: 1.5, curve: "EaseOutQuad", threshold: 0.5 };
        setup.snapshots.states.push(state);
        return state;
    }
    getOrCreateDerivative(model, quality, usage = "Web3D") {
        let derivative = model.derivatives.find(derivative => derivative.usage === usage && derivative.quality === quality);
        if (!derivative) {
            derivative = {
                quality,
                usage,
                assets: [],
            };
            model.derivatives.push(derivative);
        }
        return derivative;
    }
    setModelAsset(derivative, uri, numFaces, mapSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setAsset(derivative, "Model", uri).then(asset => {
                if (numFaces > 0) {
                    asset.numFaces = numFaces;
                }
                if (mapSize > 0) {
                    asset.imageSize = mapSize;
                }
                return asset;
            });
        });
    }
    setGeometryAsset(derivative, uri, numFaces) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setAsset(derivative, "Geometry", uri).then(asset => {
                if (numFaces > 0) {
                    asset.numFaces = numFaces;
                }
                return asset;
            });
        });
    }
    setTextureAsset(derivative, uri, mapType, mapSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setAsset(derivative, "Texture", uri).then(asset => {
                asset.mapType = mapType;
                if (mapSize > 0) {
                    asset.imageSize = mapSize;
                }
                return asset;
            });
        });
    }
    setAsset(derivative, type, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetPath = path.resolve(this.baseDir, uri);
            let asset = derivative.assets.find(asset => asset.type === type);
            if (!asset) {
                asset = {
                    uri,
                    type
                };
                derivative.assets.push(asset);
            }
            else {
                asset.uri = uri;
            }
            return fs_1.promises.stat(assetPath).then(stats => {
                asset.byteSize = stats.size;
            })
                .catch(() => { })
                .then(() => asset);
        });
    }
}
exports.default = DocumentBuilder;
DocumentBuilder.defaultDocument = {
    asset: {
        "type": "application/si-dpo-3d.document+json",
        "version": "1.0",
        "generator": "Cook",
        "copyright": "(c) Smithsonian Institution. All rights reserved."
    },
    "scene": 0,
    "scenes": [{
            "name": "Scene",
            "units": "cm",
        }],
};
//# sourceMappingURL=DocumentBuilder.js.map