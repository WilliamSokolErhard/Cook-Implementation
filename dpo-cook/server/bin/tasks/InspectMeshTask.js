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
const MeshlabTool_1 = require("../tools/MeshlabTool");
const MeshSmithTool_1 = require("../tools/MeshSmithTool");
const Task_1 = require("../app/Task");
const ToolTask_1 = require("../app/ToolTask");
/**
 * Inspects a given mesh and provides a detailed report with
 * topological and geometric features, including
 * - manifoldness
 * - watertightness
 * - bounding box
 * - barycenter
 * - volume
 *
 * Parameters: [[IInspectMeshTaskParameters]]
 */
class InspectMeshTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        if (params.tool === "Meshlab") {
            const settings = {
                inputMeshFile: params.meshFile,
                filters: [{
                        name: "MeshReport"
                    }],
                timeout: params.timeout
            };
            this.addTool("Meshlab", settings);
        }
        else if (params.tool === "MeshSmith") {
            const settings = {
                inputFile: params.meshFile,
                //outputFile: params.reportFile,
                report: true,
                timeout: params.timeout
            };
            this.addTool("MeshSmith", settings);
        }
        else {
            throw new Error("InspectMeshTask.constructor - unknown tool: " + params.tool);
        }
    }
    instanceDidExit(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance.tool instanceof MeshlabTool_1.default || instance.tool instanceof MeshSmithTool_1.default) {
                const results = instance.report.execution.results;
                const inspection = results && results["inspection"];
                if (inspection) {
                    this.report.result["inspection"] = inspection;
                    const reportFile = this.parameters.reportFile;
                    if (reportFile) {
                        const reportFilePath = instance.getFilePath(reportFile);
                        return fs.writeFile(reportFilePath, JSON.stringify(inspection, null, 2), "utf8");
                    }
                }
            }
            return Promise.resolve();
        });
    }
}
exports.default = InspectMeshTask;
InspectMeshTask.taskName = "InspectMesh";
InspectMeshTask.description = "Inspects a given mesh and provides a detailed report " +
    "including topological and geometric features";
InspectMeshTask.parameterSchema = {
    type: "object",
    properties: {
        meshFile: { type: "string", minLength: 1 },
        reportFile: { type: "string", minLength: 1, default: undefined },
        timeout: { type: "integer", minimum: 0, default: 0 },
        tool: { type: "string", enum: ["Meshlab", "MeshSmith"], default: "Meshlab" }
    },
    required: [
        "meshFile"
    ],
    additionalProperties: false
};
InspectMeshTask.parameterValidator = Task_1.default.jsonValidator.compile(InspectMeshTask.parameterSchema);
//# sourceMappingURL=InspectMeshTask.js.map