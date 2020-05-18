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
 * Aligns a mesh file to match with the orientation found in the supplied
 * Voyager (.svx) file.
 *
 * Parameters: [[IReorientMeshTaskParameters]].
 * Tools: [[BlenderTool]]].
 */
class ReorientMeshTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        const inputMeshExt = path.extname(params.inputMeshFile);
        const inputVoyagerExt = path.extname(params.inputVoyagerFile);
        const outputMeshExt = path.extname(params.outputMeshFile);
        if (inputMeshExt != ".obj" && inputMeshExt != ".ply") {
            throw new Error("input file type not supported");
        }
        if (inputVoyagerExt != ".svx" && inputVoyagerExt != ".json") {
            throw new Error("voyager file incorrect type");
        }
        // Currently Blender is the only implementation
        if (params.tool === "Blender") {
            const settings = {
                inputMeshFile: params.inputMeshFile,
                inputVoyagerFile: params.inputVoyagerFile,
                outputMeshFile: params.outputMeshFile,
                timeout: params.timeout
            };
            this.addTool("Blender", settings);
        }
    }
}
exports.default = ReorientMeshTask;
ReorientMeshTask.taskName = "ReorientMesh";
ReorientMeshTask.description = "Aligns mesh file with Voyager orientation.";
ReorientMeshTask.parameterSchema = {
    type: "object",
    properties: {
        inputMeshFile: { type: "string", minLength: 1 },
        inputVoyagerFile: { type: "string", minLength: 1 },
        outputMeshFile: { type: "string", minLength: 1 },
        timeout: { type: "integer", minimum: 0, default: 0 },
        tool: { type: "string", enum: ["Blender"], default: "Blender" }
    },
    required: [
        "inputMeshFile",
        "inputVoyagerFile",
        "outputMeshFile"
    ],
    additionalProperties: false
};
ReorientMeshTask.parameterValidator = Task_1.default.jsonValidator.compile(ReorientMeshTask.parameterSchema);
//# sourceMappingURL=ReorientMeshTask.js.map