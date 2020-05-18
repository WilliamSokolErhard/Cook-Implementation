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
const fs = require("fs-extra");
const MeshlabTool_1 = require("../tools/MeshlabTool");
const Task_1 = require("../app/Task");
const ToolTask_1 = require("../app/ToolTask");
/**
 * Reduces the complexity of a geometric mesh by reducing the number of vertices.
 *
 * Parameters: [[IDecimateMeshTaskParameters]]
 * Tools: [[MeshlabTool]], [[RapidCompactTool]]
 */
class DecimateMeshTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        if (params.tool === "Meshlab") {
            const settings = {
                inputMeshFile: params.inputMeshFile,
                outputMeshFile: params.outputMeshFile,
                writeTexCoords: params.preserveTexCoords,
                writeNormals: params.computeVertexNormals,
                timeout: params.timeout,
                filters: [{
                        name: "Simplification",
                        params: {
                            "TargetFaceNum": params.numFaces,
                            "QualityThr": 0.4,
                            "PreserveTopology": params.preserveTopology,
                            "PreserveBoundary": params.preserveBoundaries,
                            "PreserveNormal": false,
                            "OptimalPlacement": true,
                            "PlanarQuadric": false,
                            "QualityWeight": false,
                            "AutoClean": true
                        }
                    }]
            };
            if (params.computeVertexNormals) {
                settings.filters.push({
                    name: "ComputeVertexNormals",
                    params: {
                        "weightMode": 2 // area weighted
                    }
                });
            }
            if (params.minComponentSize) {
                let size = params.minComponentSize;
                if (typeof size === "number") {
                    size = size.toString() + "%";
                }
                console.log("MINCOMPONENTSIZE", size);
                settings.filters.unshift({
                    name: "RemoveIsolatedPieces",
                    params: {
                        "MinComponentDiag": size,
                        "removeUnref": true
                    }
                });
            }
            if (params.cleanup) {
                settings.filters.unshift({ name: "RemoveUnreferencedVertices" }, { name: "RemoveDuplicateVertices" }, { name: "RemoveDuplicateFaces" }, { name: "RemoveZeroAreaFaces" });
            }
            if (params.inspectMesh) {
                settings.filters.unshift({
                    name: "MeshReport"
                });
            }
            this.addTool("Meshlab", settings);
        }
        else if (params.tool === "RapidCompact") {
            const toolOptions = {
                inputMeshFile: params.inputMeshFile,
                outputMeshFile: params.outputMeshFile,
                mode: "decimate",
                numFaces: params.numFaces,
                removeDuplicateVertices: params.cleanup,
                preserveTopology: params.preserveTopology,
                preserveBoundaries: params.preserveBoundaries,
                timeout: params.timeout
            };
            this.addTool("RapidCompact", toolOptions);
        }
        else {
            throw new Error("DecimateMeshTask.constructor - unknown tool: " + params.tool);
        }
    }
    /**
     * Watch instance messages for a JSON formatted inspection report.
     * @param event
     */
    onInstanceMessage(event) {
        const { instance, message } = event;
        const inspectMesh = this.parameters.inspectMesh;
        if (inspectMesh && instance.tool instanceof MeshlabTool_1.default && message.startsWith("JSON={")) {
            let inspectionReport = null;
            try {
                inspectionReport = JSON.parse(message.substr(5));
                this.report.result["inspection"] = inspectionReport;
                if (typeof inspectMesh === "string") {
                    const reportFilePath = instance.getFilePath(inspectMesh);
                    fs.writeFileSync(reportFilePath, JSON.stringify(inspectionReport), "utf8");
                }
            }
            catch (e) {
                this.logTaskEvent("warning", "failed to parse mesh inspection report");
            }
        }
        else {
            super.onInstanceMessage(event);
        }
    }
}
exports.default = DecimateMeshTask;
DecimateMeshTask.taskName = "DecimateMesh";
DecimateMeshTask.description = "Reduces the complexity of a geometric mesh by reducing the number of vertices.";
DecimateMeshTask.parameterSchema = {
    type: "object",
    properties: {
        inputMeshFile: { type: "string", minLength: 1 },
        outputMeshFile: { type: "string", minLength: 1 },
        numFaces: { type: "integer", minimum: 100 },
        cleanup: { type: "boolean", default: false },
        preserveTopology: { type: "boolean", default: true },
        preserveBoundaries: { type: "boolean", default: true },
        minComponentSize: { oneOf: [{ type: "string" }, { type: "number" }] },
        preserveTexCoords: { type: "boolean", default: false },
        computeVertexNormals: { type: "boolean", default: false },
        inspectMesh: { oneOf: [{ type: "string" }, { type: "boolean" }] },
        timeout: { type: "integer", default: 0 },
        tool: { type: "string", enum: ["Meshlab", "RapidCompact"], default: "Meshlab" }
    },
    required: [
        "inputMeshFile",
        "outputMeshFile",
        "numFaces"
    ],
    additionalProperties: false
};
DecimateMeshTask.parameterValidator = Task_1.default.jsonValidator.compile(DecimateMeshTask.parameterSchema);
//# sourceMappingURL=DecimateMeshTask.js.map