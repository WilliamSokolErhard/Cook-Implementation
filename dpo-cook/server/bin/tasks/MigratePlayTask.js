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
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const filenamify = require("filenamify");
const deepEqual = require("deep-equal");
const htmlparser2_1 = require("htmlparser2");
const THREE = require("three");
const uniqueId_1 = require("@ff/core/uniqueId");
const Task_1 = require("../app/Task");
const DocumentBuilder_1 = require("../utils/DocumentBuilder");
const unitTools_1 = require("../utils/unitTools");
const fetch_1 = require("../utils/fetch");
////////////////////////////////////////////////////////////////////////////////
const curves = [
    "Linear",
    "EaseQuad",
    "EaseInQuad",
    "EaseOutQuad",
    "EaseCubic",
    "EaseInCubic",
    "EaseOutCubic",
    "EaseQuart",
    "EaseInQuart",
    "EaseOutQuart",
    "EaseQuint",
    "EaseInQuint",
    "EaseOutQuint",
    "EaseSine",
    "EaseInSine",
    "EaseOutSine",
];
/**
 * Fetches Play box content including models, maps, annotations
 * and articles, and converts it to Voyager items/presentations.
 *
 * Generated assets, keys in result.files
 * - `document`: Voyager document
 *
 * Parameters: [[IMigratePlayTaskParameters]].
 */
class MigratePlayTask extends Task_1.default {
    constructor(params, context) {
        super(params, context);
    }
    get boxDir() {
        return MigratePlayTask.boxDir;
    }
    get articlesDir() {
        return MigratePlayTask.articlesDir;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.result.files = {};
            this.result.warnings = [];
            const params = this.parameters;
            // create subdirectories for assets and articles
            this.logTaskEvent("debug", "creating subdirectories for assets and articles");
            mkdirp(this.getFilePath(this.boxDir));
            mkdirp(this.getFilePath(this.articlesDir));
            // fetch play box assets and articles
            this.logTaskEvent("debug", `fetching assets for Play box #${params.boxId}`);
            const info = yield this.fetchPlayBox(params.boxId);
            if (this.cancelRequested) {
                return;
            }
            // create document, fetch article HTML files and images
            this.logTaskEvent("debug", `creating SVX document for Play box #${params.boxId}`);
            const document = yield this.createDocument(info);
            const documentFileName = "scene.svx.json";
            this.logTaskEvent("debug", `writing document to ${documentFileName}`);
            this.result.files["scene_document"] = documentFileName;
            return fs.writeFile(this.getFilePath(documentFileName), JSON.stringify(document, null, 2));
        });
    }
    ////////////////////////////////////////////////////////////////////////////////
    // FETCH BOX ASSETS
    /**
     * Fetches all assets from the given play box, excluding articles. Writes and returns
     * an 'info.json' aggregated object containing the box id, payload, bake, descriptor, and config info.
     * @param boxId The ID of the play box to fetch.
     */
    fetchPlayBox(boxId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield this.fetchPayload(boxId);
            const bake = yield this.fetchBake(boxId);
            const { config, descriptor } = yield this.fetchAssets(boxId, bake);
            const info = {
                id: boxId,
                payload,
                bake,
                descriptor,
                config
            };
            const infoFileName = this.result.files["box_info.json"] = this.boxDir + "/info.json";
            const infoFilePath = this.getFilePath(infoFileName);
            return fs.writeFile(infoFilePath, JSON.stringify(info, null, 2))
                .then(() => info);
        });
    }
    /**
     * Fetches and writes the 'bake.json' file for the given play box ID.
     * @param boxId The ID of the play box to fetch.
     */
    fetchBake(boxId) {
        return __awaiter(this, void 0, void 0, function* () {
            const boxBaseUrl = `${this.parameters.cdnBaseUrl}/boxes/${boxId}/`;
            // fetch and write bake.json
            const bakeUrl = boxBaseUrl + "bake.json";
            const bakeContent = yield fetch_1.default.json(bakeUrl, "GET");
            const bakeFileName = this.result.files["box_bake.json"] = this.boxDir + "/bake.json";
            const bakeFilePath = this.getFilePath(bakeFileName);
            return fs.writeFile(bakeFilePath, JSON.stringify(bakeContent, null, 2))
                .then(() => bakeContent);
        });
    }
    /**
     * Fetches payload.json and the associated thumbnail and preview images.
     * @param boxId The ID of the play box to fetch.
     */
    fetchPayload(boxId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payloadUrl = `${this.parameters.payloadBaseUrl}/${boxId}_payload.json`;
            const payloadContent = yield fetch_1.default.json(payloadUrl, "GET");
            const payloadFileName = this.result.files["box_payload.json"] = this.boxDir + "/payload.json";
            const payloadFilePath = this.getFilePath(payloadFileName);
            yield fs.writeFile(payloadFilePath, JSON.stringify(payloadContent, null, 2));
            // fetch and write thumbnail image
            try {
                const thumbImage = yield fetch_1.default.buffer(payloadContent.message.pubThumb, "GET");
                const thumbFileName = this.boxDir + "/image-thumb.jpg";
                const thumbFilePath = this.getFilePath(thumbFileName);
                yield fs.writeFile(thumbFilePath, Buffer.from(thumbImage));
                this.result.files["box_image-thumb.jpg"] = thumbFileName;
            }
            catch (error) {
                this.result.warnings.push(`error while fetching thumbnail image: ${error.message}`);
            }
            // fetch and write preview image
            try {
                const previewImage = yield fetch_1.default.buffer(payloadContent.message.pubPreview, "GET");
                const previewFileName = this.boxDir + "/image-preview.jpg";
                const previewFilePath = this.getFilePath(previewFileName);
                yield fs.writeFile(previewFilePath, Buffer.from(previewImage));
                this.result.files["box_image-preview.jpg"] = previewFileName;
            }
            catch (error) {
                this.result.warnings.push(`error while fetching preview image: ${error.message}`);
            }
            return payloadContent;
        });
    }
    /**
     * Fetches all assets described in the 'bake.json' of a given Play box.
     * @param boxId The ID of the play box to fetch.
     * @param bake The bake file content
     */
    fetchAssets(boxId, bake) {
        return __awaiter(this, void 0, void 0, function* () {
            let playConfig = null;
            let playDescriptor = null;
            // fetch and write all assets
            const assetPaths = Object.keys(bake.assets);
            const fetchAssets = assetPaths.map(assetPath => {
                const asset = bake.assets[assetPath];
                const assetUrl = `${this.parameters.cdnBaseUrl}/${asset.files["original"]}`;
                const assetFileName = `${this.boxDir}/${asset.name}`;
                const assetFilePath = this.getFilePath(assetFileName);
                this.result.files[`box_${assetFileName}`] = assetFileName;
                if (asset.type === "json") {
                    return fetch_1.default.json(assetUrl, "GET").then(data => {
                        if (asset.name === "config.json") {
                            playConfig = data;
                        }
                        if (asset.name === "descriptor.json") {
                            playDescriptor = data;
                        }
                        return fs.writeFile(assetFilePath, JSON.stringify(data, null, 2));
                    });
                }
                else {
                    return fetch_1.default.buffer(assetUrl, "GET")
                        .then(data => fs.writeFile(assetFilePath, Buffer.from(data)));
                }
            });
            // additionally fetch 'nodeData.json' from 'config.json' asset
            const configFiles = bake.assets["config.json"].files;
            const nodeDataUrl = `${this.parameters.cdnBaseUrl}/${configFiles["nodeData"]}`;
            fetchAssets.push(fetch_1.default.json(nodeDataUrl, "GET").then(data => {
                const nodeDataFileName = `${this.boxDir}/nodeData.json`;
                this.result.files["box_nodeData.json"] = nodeDataFileName;
                const nodeDataFilePath = this.getFilePath(nodeDataFileName);
                return fs.writeFile(nodeDataFilePath, JSON.stringify(data, null, 2));
            }));
            return Promise.all(fetchAssets)
                .then(() => ({
                config: playConfig,
                descriptor: playDescriptor
            }));
        });
    }
    ////////////////////////////////////////////////////////////////////////////////
    // DOCUMENT, SCENE, SETUP
    createDocument(info) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = new DocumentBuilder_1.default(this.context.jobDir);
            builder.document.asset["migration"] = `Play Box #${info.id}`;
            const scene = builder.getMainScene();
            const sceneSetup = builder.getOrCreateSetup(scene);
            // determine annotation scale factor from scene dimensions
            const modelBoundingBox = yield this.createModels(info, builder.document);
            const size = new THREE.Vector3();
            modelBoundingBox.getSize(size);
            const modelRadius = size.length() * 0.5;
            const annotationScale = modelRadius / 18;
            // get first model
            const model = builder.document.models[0];
            const modelNode = builder.findNodesByModel(model)[0];
            // factor to convert from PLAY magic space (radius = 8) to Voyager scene units
            const playScaleFactor = unitTools_1.convertUnits(modelRadius / 8, model.units, scene.units);
            // bookkeeping for HTML article conversion and annotations
            let articleIndex = 0;
            const articleByUrl = {};
            const tasks = [];
            const annotationIds = {};
            // convert all annotations and assign to first model
            const playAnnotations = info.payload.message.annotations[0].annotations;
            console.log(`createDocument - converting ${playAnnotations.length} annotations`);
            playAnnotations.forEach(playAnnotation => {
                const annotation = builder.createAnnotation(model);
                this.convertAnnotation(playAnnotation, annotation, annotationScale);
                annotationIds[playAnnotation.index] = annotation.id;
                // offset the annotation by the model's translation
                const p = annotation.position;
                const t = model.translation;
                p[0] += t[0];
                p[1] += t[1];
                p[2] += t[2];
                const articleUrl = playAnnotation.Link;
                if (articleUrl) {
                    let article = articleByUrl[articleUrl];
                    if (!article) {
                        article = articleByUrl[articleUrl] = this.createArticle(articleIndex);
                        tasks.push(this.fetchArticleSafe(article, articleUrl, articleIndex++));
                        builder.addArticle(modelNode, article);
                    }
                    annotation.articleId = article.id;
                }
            });
            // convert scene settings (camera, etc.)
            this.convertScene(info, builder, playScaleFactor);
            // tours
            const playTours = info.payload.message.tours;
            console.log(`createDocument - converting ${playTours.length} tours`);
            const tourTasks = playTours.map((tour, index) => this.findAnimatedTourProps(tour, index));
            yield Promise.all(tourTasks);
            playTours.filter(playTour => playTour.snapshots.length > 0).forEach((playTour, tourIndex) => {
                const tour = builder.createTour(sceneSetup, playTour.name);
                this.convertTour(playTour, tour);
                playTour.snapshots.forEach(playSnapshot => {
                    const articleUrl = playSnapshot.data["Sidebar Store"]["Sidebar.URL"];
                    let article = null;
                    if (articleUrl) {
                        article = articleByUrl[articleUrl];
                        if (!article) {
                            article = articleByUrl[articleUrl] = this.createArticle(articleIndex);
                            tasks.push(this.fetchArticleSafe(article, articleUrl, articleIndex++));
                        }
                        builder.addArticle(scene, article);
                    }
                    const state = builder.createSnapshot(sceneSetup, tour, playSnapshot.name);
                    const articleId = article ? article.id : "";
                    this.convertSnapshot(playSnapshot, annotationIds, articleId, tour, state, playScaleFactor, false);
                    if (articleUrl && this.parameters.createReadingSteps) {
                        state.threshold = 0;
                        const extraState = builder.createSnapshot(sceneSetup, tour, playSnapshot.name);
                        const articleId = article ? article.id : "";
                        this.convertSnapshot(playSnapshot, annotationIds, articleId, tour, extraState, playScaleFactor, true);
                        extraState.threshold = 0;
                        extraState.duration = 0.5;
                    }
                });
            });
            // default article, add to scene
            const sidebar = info.config["Default Sidebar"];
            const articleUrl = sidebar && sidebar.URL;
            if (articleUrl) {
                let article = articleByUrl[articleUrl];
                if (!article) {
                    article = articleByUrl[articleUrl] = this.createArticle(articleIndex);
                    tasks.push(this.fetchArticleSafe(article, articleUrl, articleIndex++));
                    builder.addArticle(scene, article);
                }
            }
            console.log(`createDocument - fetching ${tasks.length} articles`);
            return Promise.all(tasks)
                .then(() => builder.document);
        });
    }
    convertScene(info, builder, playScaleFactor) {
        const scene = builder.getMainScene();
        const meta = builder.getOrCreateMeta(scene);
        const setup = builder.getOrCreateSetup(scene);
        // get EDAN entry
        const edanJson = this.parameters.edanEntry;
        const edanEntry = edanJson ? JSON.parse(edanJson) : null;
        // set title of experience
        meta.collection = meta.collection || {};
        if (edanEntry) {
            meta.collection["edanRecordId"] = edanEntry.url;
            meta.collection["edanEntry"] = edanJson;
            meta.collection["title"] = edanEntry.title;
        }
        else {
            meta.collection["title"] = info.descriptor.name;
        }
        // create camera
        // TODO: Disabled - needs updated merge strategy in Voyager
        // let camera: ICamera = builder.getCamera(0);
        //
        // if (!camera) {
        //     const cameraNode = builder.createRootNode(scene);
        //     camera = builder.getOrCreateCamera(cameraNode);
        // }
        //
        // camera.type = "perspective";
        // camera.perspective = {
        //     yfov: 45,
        //     znear: 0.1,
        //     zfar: 100000
        // };
        const cam = info.config["Camera - Curator Settings"];
        const offset = cam["Camera.Offset"];
        const distance = cam["Camera.Distance"];
        const orbitX = cam["Camera.Orientation.Y"];
        const orbitY = cam["Camera.Orientation.X"];
        setup.navigation = {
            autoZoom: true,
            enabled: true,
            type: "Orbit",
            orbit: {
                offset: [offset[0] * playScaleFactor, offset[1] * playScaleFactor, (offset[2] + distance) * playScaleFactor],
                orbit: [orbitX, orbitY, 0],
                "minOrbit": [-90, null, null],
                "maxOrbit": [90, null, null],
                "minOffset": [null, null, 0.1],
                "maxOffset": [null, null, 10000]
            },
        };
    }
    ////////////////////////////////////////////////////////////////////////////////
    // ANNOTATIONS, TOURS
    convertAnnotation(playAnnotation, annotation, scale) {
        annotation.marker = (playAnnotation.index + 1).toString();
        annotation.title = playAnnotation.Title;
        annotation.lead = playAnnotation.Body;
        annotation.style = this.parameters.annotationStyle || "Circle";
        if (this.parameters.migrateAnnotationColor) {
            annotation.color = playAnnotation["Stem.Color"];
        }
        annotation.scale = annotation.style === "Circle" ? 10 : scale;
        //annotation.scale = annotation.style === "Circle" ? 1.0 : scale;
        annotation.position = playAnnotation["Transform.Position"];
        const rotation = new THREE.Vector3();
        rotation.fromArray(playAnnotation["Transform.Rotation"]);
        rotation.multiplyScalar(THREE.Math.DEG2RAD);
        const euler = new THREE.Euler();
        euler.setFromVector3(rotation, "YXZ"); // in Play: ZXY
        const direction = new THREE.Vector3(0, 1, 0);
        direction.applyEuler(euler);
        annotation.direction = direction.toArray();
    }
    findAnimatedTourProps(tour, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshots = tour.snapshots;
            const first = snapshots[0];
            if (!first) {
                return Promise.resolve();
            }
            const firstStoreKeys = Object.keys(first.data);
            const components = {};
            for (let i = 1; i < snapshots.length; ++i) {
                const snapshot = snapshots[i];
                firstStoreKeys.forEach(storeKey => {
                    const propKeys = Object.keys(first.data[storeKey]);
                    propKeys.forEach(propKey => {
                        if (!deepEqual(snapshot.data[storeKey][propKey], first.data[storeKey][propKey])) {
                            const props = components[storeKey] = components[storeKey] || {};
                            props[propKey] = true;
                        }
                    });
                });
            }
            console.log(`\n---------- TOUR: ${tour.name}: ANIMATED KEYS/PROPS ----------`);
            firstStoreKeys.forEach(storeKey => {
                if (components[storeKey]) {
                    const animatedProps = Object.keys(components[storeKey]);
                    if (animatedProps.length > 0) {
                        console.log(storeKey);
                        animatedProps.forEach(prop => console.log(`    ${prop}`));
                    }
                }
            });
            const tourPropsFileName = `t${index}-${filenamify(tour.name)}-animated-props.json`;
            return fs.writeFile(this.getFilePath(tourPropsFileName), JSON.stringify(components, null, 2));
        });
    }
    convertTour(playTour, tour) {
        tour.title = playTour.name;
        tour.lead = playTour.description;
    }
    convertSnapshot(playSnapshot, annotationIds, articleId, tour, state, playScaleFactor, readerEnabled) {
        state.duration = playSnapshot.transition.duration;
        state.threshold = playSnapshot.transition.switch;
        state.curve = curves[playSnapshot.transition.curve];
        const camera = playSnapshot.data["Camera Store"];
        const annotations = playSnapshot.data["Annotation Store"];
        const activeAnnotationId = annotationIds[annotations["Annotation.WhichOpen"]] || "";
        const orbit = [
            camera["Camera.Orientation"][1],
            camera["Camera.Orientation"][0],
            camera["Camera.Orientation"][2],
        ];
        const offset = [
            camera["Camera.Offset"][0] * playScaleFactor,
            camera["Camera.Offset"][1] * playScaleFactor,
            (camera["Camera.Offset"][2] + camera["Camera.Distance"]) * playScaleFactor,
        ];
        const annotationsVisible = annotations["Annotation.On"];
        const activeAnnotation = activeAnnotationId;
        const activeTags = "";
        const shader = 0;
        const exposure = 1;
        state.values = [
            readerEnabled,
            articleId,
            orbit,
            offset,
            annotationsVisible,
            activeAnnotation,
            activeTags,
            shader,
            exposure,
        ];
    }
    ////////////////////////////////////////////////////////////////////////////////
    // ARTICLES
    /**
     * Creates and returns an IArticle object.
     * @param index The index to be used for the local article and image files.
     */
    createArticle(index) {
        const articleIndex = index.toString().padStart(2, "0");
        const articleFileName = `${this.articlesDir}/article-${articleIndex}.html`;
        return {
            id: uniqueId_1.default(),
            uri: articleFileName
        };
    }
    fetchArticleSafe(article, url, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchArticle(article, url, index)
                .catch(error => {
                this.result.warnings.push(`error while fetching article '${url}': ${error.message}`);
                const articleIndex = index.toString().padStart(2, "0");
                const articleFileName = `${this.articlesDir}/article-${articleIndex}.html`;
                this.result.files[`scene_${articleFileName}`] = articleFileName;
                const articleFilePath = this.getFilePath(articleFileName);
                const contentHtml = `<h1>Failed to migrate article from '${url}'</h1>`;
                return fs.writeFile(articleFilePath, contentHtml);
            });
        });
    }
    /**
     * Fetches the HTML document from the given url and transforms/rewrites it to the article folder.
     * Also fetches and writes all images referenced in the article.
     * @param article The article to augment with title and lead.
     * @param url The URL of the article to be fetched.
     * @param index The index to be used for naming the article.
     * @returns file path of the fetched article.
     */
    fetchArticle(article, url, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleIndex = index.toString().padStart(2, "0");
            console.log(`fetchArticle - fetching HTML from ${url}`);
            const pageHtml = yield fetch_1.default.text(url, "GET");
            // parse the article's HTML content
            const handler = new htmlparser2_1.DomHandler();
            const parser = new htmlparser2_1.Parser(handler);
            parser.write(pageHtml);
            parser.done();
            const dom = handler.dom;
            // find parent of article content
            const contentDiv = htmlparser2_1.DomUtils.findOne(elem => elem.attribs && elem.attribs.class && elem.attribs.class.indexOf("region-content") >= 0, dom, true);
            if (!contentDiv) {
                throw new Error("Article content not found (no 'region-content' class)");
            }
            // remove article body-enclosing div (class "threed-sidebar-article-body"), then re-parent children
            const bodyDiv = htmlparser2_1.DomUtils.findOne(elem => elem.attribs && elem.attribs.class && elem.attribs.class.indexOf("threed-sidebar-article-body") >= 0, contentDiv.children, true);
            if (bodyDiv) {
                const parent = bodyDiv.parent;
                bodyDiv.children.forEach(child => htmlparser2_1.DomUtils.appendChild(parent, child));
                htmlparser2_1.DomUtils.removeElement(bodyDiv);
            }
            const title = htmlparser2_1.DomUtils.findOne(elem => elem.name === "h1", contentDiv.children, true);
            const titleText = title && htmlparser2_1.DomUtils.getText(title);
            article.title = titleText || `Article No. ${index + 1}`;
            let imageIndex = 0;
            const imageUrls = {};
            htmlparser2_1.DomUtils.findOne(elem => {
                // download images
                if (elem.name === "img" && elem.attribs && elem.attribs.src) {
                    const src = elem.attribs.src;
                    const imageUrl = src.startsWith("http") ? src : this.parameters.drupalBaseUrl + src;
                    const imageName = filenamify(decodeURIComponent(src.split("/").pop()));
                    const imageFileName = `article-${articleIndex}-${imageName}`;
                    const imageAssetPath = `${this.articlesDir}/${imageFileName}`;
                    this.result.files[`scene_${imageAssetPath}`] = imageAssetPath;
                    elem.attribs.src = imageFileName; // relative to location of html file
                    imageUrls[imageUrl] = imageAssetPath;
                    imageIndex++;
                }
                // remove additional classes from all nodes
                if (elem.attribs && elem.attribs.class) {
                    delete elem.attribs.class;
                }
                return false;
            }, contentDiv.children, true);
            // fetch all images
            const urls = Object.keys(imageUrls);
            const promises = urls.map(url => {
                console.log(`fetchArticle - fetching image from ${url}`);
                return fetch_1.default.buffer(url, "GET").then(image => {
                    const imageFileName = imageUrls[url];
                    const imageFilePath = this.getFilePath(imageFileName);
                    console.log(`fetchArticle - writing image to ${imageFilePath}`);
                    return fs.writeFile(imageFilePath, Buffer.from(image));
                });
            });
            // write article HTML content
            const contentHtml = htmlparser2_1.DomUtils.getInnerHTML(contentDiv);
            const articleFileName = `${this.articlesDir}/article-${articleIndex}.html`;
            this.result.files[`scene_${articleFileName}`] = articleFileName;
            const articleFilePath = this.getFilePath(articleFileName);
            promises.push(fs.writeFile(articleFilePath, contentHtml));
            return Promise.all(promises);
        });
    }
    ////////////////////////////////////////////////////////////////////////////////
    // MODELS
    createModels(info, document) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = new DocumentBuilder_1.default(this.context.jobDir, document);
            const scene = builder.getMainScene();
            const models = [];
            const corner = new THREE.Vector3();
            const sceneBoundingBox = new THREE.Box3();
            sceneBoundingBox.makeEmpty();
            const tasks = info.descriptor.parts.map((part, index) => {
                const node = builder.createRootNode(scene);
                node.name = part.name;
                const model = builder.getOrCreateModel(node);
                models.push(model);
                model.units = unitTools_1.playToUnitType(info.descriptor.units);
                let inspection = null;
                return this.getBoundingBox(part)
                    .then(_inspection => {
                    inspection = _inspection;
                    model.boundingBox = inspection.scene.geometry.boundingBox;
                    corner.fromArray(model.boundingBox.min);
                    sceneBoundingBox.expandByPoint(corner);
                    corner.fromArray(model.boundingBox.max);
                    sceneBoundingBox.expandByPoint(corner);
                    // TODO: debug only, write inspection report
                    return fs.writeFile(this.getFilePath(`p${index}-inspection.json`), JSON.stringify(inspection, null, 2));
                })
                    // create thumb quality web asset
                    .then(() => this.reduceMaps(part, index, inspection, 512))
                    .then(marker => this.createWebAsset(part, index, marker))
                    .then(modelAssetPath => {
                    const derivative = builder.getOrCreateDerivative(model, "Thumb", "Web3D");
                    return builder.setAsset(derivative, "Model", modelAssetPath);
                })
                    .then(asset => {
                    asset.numFaces = inspection.scene.statistics.numFaces;
                })
                    // create low quality web asset
                    .then(() => this.reduceMaps(part, index, inspection, 1024))
                    .then(marker => this.createWebAsset(part, index, marker))
                    .then(modelAssetPath => {
                    const derivative = builder.getOrCreateDerivative(model, "Low", "Web3D");
                    return builder.setAsset(derivative, "Model", modelAssetPath);
                })
                    .then(asset => {
                    asset.numFaces = inspection.scene.statistics.numFaces;
                })
                    // create medium quality web asset
                    .then(() => this.reduceMaps(part, index, inspection, 2048))
                    .then(marker => this.createWebAsset(part, index, marker))
                    .then(modelAssetPath => {
                    const derivative = builder.getOrCreateDerivative(model, "Medium", "Web3D");
                    return builder.setAsset(derivative, "Model", modelAssetPath);
                })
                    .then(asset => {
                    asset.numFaces = inspection.scene.statistics.numFaces;
                })
                    // create high quality web asset
                    .then(() => this.reduceMaps(part, index, inspection, 4096))
                    .then(marker => this.createWebAsset(part, index, marker))
                    .then(modelAssetPath => {
                    const derivative = builder.getOrCreateDerivative(model, "High", "Web3D");
                    return builder.setAsset(derivative, "Model", modelAssetPath);
                })
                    .then(asset => {
                    asset.numFaces = inspection.scene.statistics.numFaces;
                });
            });
            return Promise.all(tasks).then(() => {
                const center = new THREE.Vector3();
                sceneBoundingBox.getCenter(center);
                center.multiplyScalar(-1);
                models.forEach(model => model.translation = center.toArray());
                return sceneBoundingBox;
            });
        });
    }
    getBoundingBox(part) {
        return __awaiter(this, void 0, void 0, function* () {
            const inspectMeshParams = {
                meshFile: `${this.boxDir}/${part.files.mesh}`,
                tool: "MeshSmith"
            };
            const inspectionTask = this.context.manager.createTask("InspectMesh", inspectMeshParams, this.context);
            return inspectionTask.run()
                .then(() => inspectionTask.report.result["inspection"]);
        });
    }
    reduceMaps(part, index, stats, mapSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const numFaces = stats.scene.statistics.numFaces;
            const kFaces = (numFaces / 1000).toFixed(0) + "k";
            const marker = `${kFaces}-${mapSize}`;
            const files = part.files;
            const srcImages = [];
            files.diffuse && srcImages.push({ quality: 79, name: files.diffuse });
            files.occlusion && srcImages.push({ quality: 59, name: files.occlusion });
            files.normal && srcImages.push({ quality: 89, name: files.normal });
            const tasks = srcImages.map(srcImage => {
                // compose source and destination image path
                const srcImagePath = `${this.boxDir}/${srcImage.name}`;
                const { base, extension } = this.splitFileName(srcImagePath);
                const dstImagePath = `p${index}-${base}-${marker}.${extension}`;
                this.result.files[`temp_${dstImagePath}`] = dstImagePath;
                // parameters for image conversion/size reduction
                const params = {
                    inputImageFile: srcImagePath,
                    outputImageFile: dstImagePath,
                    quality: srcImage.quality,
                    resize: mapSize
                };
                // execute conversion job
                return this.context.manager.createTask("ConvertImage", params, this.context).run();
            });
            return Promise.all(tasks).then(() => marker);
        });
    }
    createWebAsset(part, index, marker) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelAssetPath = `p${index}-${filenamify(part.name)}-${marker}.glb`;
            this.result.files[`scene_${modelAssetPath}`] = modelAssetPath;
            const webAssetTaskParams = {
                outputFile: modelAssetPath,
                meshFile: `${this.boxDir}/${part.files.mesh}`,
                objectSpaceNormals: true,
                useCompression: true,
                compressionLevel: 6,
                embedMaps: true,
                writeBinary: true
            };
            if (part.files.diffuse) {
                const { path, base, extension } = this.splitFileName(part.files.diffuse);
                webAssetTaskParams.diffuseMapFile = `${path}p${index}-${base}-${marker}.${extension}`;
            }
            if (part.files.occlusion) {
                const { path, base, extension } = this.splitFileName(part.files.occlusion);
                webAssetTaskParams.occlusionMapFile = `${path}p${index}-${base}-${marker}.${extension}`;
            }
            if (part.files.normal) {
                const { path, base, extension } = this.splitFileName(part.files.normal);
                webAssetTaskParams.normalMapFile = `${path}p${index}-${base}-${marker}.${extension}`;
            }
            const webAssetTask = this.context.manager.createTask("WebAsset", webAssetTaskParams, this.context);
            return webAssetTask.run().then(() => modelAssetPath);
        });
    }
    splitFileName(fileName) {
        const pathParts = fileName.split("/");
        const name = pathParts.pop();
        let path = pathParts.join("/");
        if (path) {
            path += "/";
        }
        const nameParts = name.split(".");
        const extension = nameParts.pop();
        const base = nameParts.join(".");
        return { path, base, extension };
    }
}
exports.default = MigratePlayTask;
MigratePlayTask.taskName = "MigratePlay";
MigratePlayTask.description = "Fetches Play box content including models, maps, annotations, " +
    "and articles, and converts it to a Voyager experience.";
MigratePlayTask.drupalBaseUrl = "https://3d.si.edu";
MigratePlayTask.payloadBaseUrl = "https://3d.si.edu/sites/default/files/box_payloads";
MigratePlayTask.cdnBaseUrl = "https://d39fxlie76wg71.cloudfront.net";
MigratePlayTask.boxDir = "box";
MigratePlayTask.articlesDir = "articles";
MigratePlayTask.parameterSchema = {
    type: "object",
    properties: {
        boxId: { type: "integer" },
        annotationStyle: { type: "string", enum: ["Standard", "Extended", "Circle"], default: "Circle" },
        migrateAnnotationColor: { type: "boolean", default: false },
        createReadingSteps: { type: "boolean", default: false },
        edanEntry: { type: "string" },
        drupalBaseUrl: { type: "string", default: MigratePlayTask.drupalBaseUrl },
        payloadBaseUrl: { type: "string", default: MigratePlayTask.payloadBaseUrl },
        cdnBaseUrl: { type: "string", default: MigratePlayTask.cdnBaseUrl },
    },
    required: [
        "boxId"
    ],
    additionalProperties: false
};
MigratePlayTask.parameterValidator = Task_1.default.jsonValidator.compile(MigratePlayTask.parameterSchema);
//# sourceMappingURL=MigratePlayTask.js.map