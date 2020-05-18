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
 * Uses RealityCapture photogrammetry software to create a 3D model
 * from a set of 2D images.
 *
 * Tool: [[RealityCaptureTool]],
 * Parameters: [[IReconstructionTaskParameters]]
 */
class ReconstructionTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        const settings = {
            inputImageFolderName: params.inputImageFolderName,
            timeout: params.timeout
        };
        this.addTool("RealityCapture", settings);
    }
}
exports.default = ReconstructionTask;
ReconstructionTask.taskName = "Reconstruction";
ReconstructionTask.description = "Uses RealityCapture photogrammetry software to create a 3D model.";
ReconstructionTask.parameterSchema = {
    type: "object",
    properties: {
        inputImageFolderName: { type: "string", minLength: 1 },
        timeout: { type: "integer", minimum: 0, default: 0 }
    },
    required: [
        "inputImageFolderName"
    ],
    additionalProperties: false
};
ReconstructionTask.parameterValidator = Task_1.default.jsonValidator.compile(ReconstructionTask.parameterSchema);
//# sourceMappingURL=ReconstructionTask.js.map