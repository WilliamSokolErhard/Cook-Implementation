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
 * Converts image files between different formats.
 * Applies scaling and gamma correction during conversion.
 *
 * Parameters: [[IConvertImageTaskParameters]].
 * Tool: [[ImageMagickTool]].
 */
class ConvertImageTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        const settings = {
            inputImageFile: params.inputImageFile,
            outputImageFile: params.outputImageFile,
            quality: params.quality,
            normalize: params.normalize,
            gamma: params.gamma,
            resize: params.resize
        };
        this.addTool("ImageMagick", settings);
    }
}
exports.default = ConvertImageTask;
ConvertImageTask.taskName = "ConvertImage";
ConvertImageTask.description = "Converts image files between different formats. " +
    "Applies scaling and gamma correction during conversion.";
ConvertImageTask.parameterSchema = {
    type: "object",
    properties: {
        inputImageFile: { type: "string", minLength: 1 },
        outputImageFile: { type: "string", minLength: 1 },
        quality: { type: "integer", minimum: 0, maximum: 100, default: 70 },
        normalize: { type: "boolean", default: false },
        gamma: { type: "number", default: undefined },
        resize: { type: "number", default: undefined }
    },
    required: [
        "inputImageFile",
        "outputImageFile"
    ],
    additionalParameters: false
};
ConvertImageTask.parameterValidator = Task_1.default.jsonValidator.compile(ConvertImageTask.parameterSchema);
//# sourceMappingURL=ConvertImageTask.js.map