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
 * Uses the MeshFix tool to heal a mesh using a number of heuristics.
 *
 * Tool: [[MeshfixTool]]
 * Parameters: [[IFixMeshTaskParameters]]
 */
class FixMeshTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        const settings = {
            inputMeshFile: params.inputMeshFile,
            outputMeshFile: params.outputMeshFile,
            joinComponents: false,
            timeout: params.timeout
        };
        this.addTool("Meshfix", settings);
    }
}
exports.default = FixMeshTask;
FixMeshTask.taskName = "FixMesh";
FixMeshTask.description = "Uses the MeshFix tool to heal a mesh using a number of heuristics.";
FixMeshTask.parameterSchema = {
    type: "object",
    properties: {
        inputMeshFile: { type: "string", minLength: 1 },
        outputMeshFile: { type: "string", minLength: 1 },
        timeout: { type: "integer", minimum: 0, default: 0 }
    },
    required: [
        "inputMeshFile",
        "outputMeshFile"
    ]
};
FixMeshTask.parameterValidator = Task_1.default.jsonValidator.compile(FixMeshTask.parameterSchema);
//# sourceMappingURL=FixMeshTask.js.map