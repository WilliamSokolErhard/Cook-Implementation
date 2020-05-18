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
const uniqueId_1 = require("../utils/uniqueId");
const Tool_1 = require("../app/Tool");
class MeshlabTool extends Tool_1.default {
    constructor() {
        super(...arguments);
        this.inspectionReport = null;
    }
    setupInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = instance.settings;
            const inputMeshPath = instance.getFilePath(settings.inputMeshFile);
            if (!inputMeshPath) {
                throw new Error("missing input mesh file");
            }
            const outputMeshPath = instance.getFilePath(settings.outputMeshFile);
            return this.writeFilterScript(instance)
                .then(script => {
                let command = `"${this.configuration.executable}" -i "${inputMeshPath}"`;
                if (outputMeshPath) {
                    command += ` -o "${outputMeshPath}"`;
                    if (settings.writeNormals || settings.writeTexCoords) {
                        command += " -m";
                        if (settings.writeNormals) {
                            command += " vn";
                        }
                        if (settings.writeTexCoords) {
                            command += " wt";
                        }
                    }
                }
                command += ` -s "${instance.getFilePath(script.fileName)}"`;
                return {
                    command,
                    script
                };
            });
        });
    }
    onInstanceMessage(event) {
        const { instance, message } = event;
        // only handle JSON report data
        if (!message.startsWith("JSON={")) {
            return false;
        }
        const report = instance.report.execution;
        const results = report.results = report.results || {};
        try {
            results["inspection"] = JSON.parse(message.substr(5));
        }
        catch (e) {
            const error = "failed to parse mesh inspection report";
            results["inspection"] = { error };
        }
        return true;
    }
    writeFilterScript(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptLines = [
                `<!DOCTYPE FilterScript>`,
                `<FilterScript>`
            ];
            instance.settings.filters.forEach(filter => {
                let filterSteps = MeshlabTool.filters[filter.name];
                if (!filterSteps) {
                    return Promise.reject(`unknown filter: ${filter.name}`);
                }
                filterSteps = Array.isArray(filterSteps) ? filterSteps : [filterSteps];
                filterSteps.forEach(filterDef => {
                    const filterType = filterDef.type === "xml" ? "xmlfilter" : "filter";
                    if (filter.params) {
                        scriptLines.push(`<${filterType} name="${filterDef.name}">`);
                        for (const paramName in filter.params) {
                            const paramValue = filter.params[paramName];
                            if (paramValue === undefined) {
                                return Promise.reject(`value for parameter ${paramName} is undefined`);
                            }
                            scriptLines.push(this.getParameter(paramName, paramValue));
                        }
                        scriptLines.push(`</${filterType}>`);
                    }
                    else {
                        scriptLines.push(`<${filterType} name="${filterDef.name}"/>`);
                    }
                });
            });
            scriptLines.push("</FilterScript>");
            const script = {
                fileName: "_meshlab_" + uniqueId_1.default() + ".mlx",
                content: scriptLines.join("\n"),
            };
            return instance.writeFile(script.fileName, script.content).then(() => script);
        });
    }
    getParameter(name, value, type) {
        if (typeof value === "string") {
            const parsedValue = parseFloat(value) || 0;
            if (value.indexOf("%") > -1) {
                return `<Param value="${parsedValue}" min="0" max="100" type="RichAbsPerc" name="${name}"/>`;
            }
            value = parsedValue;
        }
        const text = value.toString();
        if (type === undefined) {
            if (typeof value === "number") {
                if (text.indexOf(".") > -1) {
                    type = "RichFloat";
                }
                else {
                    type = "RichInt";
                }
            }
            else if (typeof value === "boolean") {
                type = "RichBool";
            }
        }
        return `<Param value="${value}" type="${type}" name="${name}"/>`;
    }
}
exports.default = MeshlabTool;
MeshlabTool.toolName = "Meshlab";
MeshlabTool.filters = {
    "Simplification": { name: "Simplification: Quadric Edge Collapse Decimation" },
    "RemoveUnreferencedVertices": { name: "Remove Unreferenced Vertices" },
    "RemoveDuplicateVertices": { name: "Remove Duplicate Vertices" },
    "RemoveZeroAreaFaces": { name: "Remove Zero Area Faces" },
    "RemoveDuplicateFaces": { name: "Remove Duplicate Faces" },
    "RemoveIsolatedFoldedFaces": { name: "Remove Isolated Folded Faces by Edge Flip" },
    "RemoveIsolatedPieces": { name: "Remove Isolated pieces (wrt Diameter)" },
    "ComputeFaceNormals": { name: "Re-Compute Face Normals" },
    "ComputeVertexNormals": { name: "Re-Compute Vertex Normals" },
    "MeshReport": { name: "Generate JSON Report", type: "xml" }
};
//# sourceMappingURL=MeshlabTool.js.map