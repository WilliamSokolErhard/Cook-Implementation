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
 * Combines 3 separate occlusion maps into one combined map.
 * Applies individual gamma correction to each of the 3 map channels.
 * - Large scale map > red channel.
 * - Medium scale map > green channel.
 * - Small scale map > blue channel.
 *
 * Parameters: [[ICombineOcclusionTaskParameters]].
 * Tool: [[ImageMagickTool]].
 */
class CombineOcclusionTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        const settings = {
            redChannelInputFile: params.largeMapFile,
            greenChannelInputFile: params.mediumMapFile,
            blueChannelInputFile: params.smallMapFile,
            outputImageFile: params.outputMapFile,
            quality: 70,
            normalize: true,
            channelCombine: true,
            channelGamma: params.channelGamma || [1.0, 0.1, 0.05]
        };
        this.addTool("ImageMagick", settings);
    }
}
exports.default = CombineOcclusionTask;
CombineOcclusionTask.taskName = "CombineOcclusion";
CombineOcclusionTask.description = "Combines 3 separate occlusion maps into one combined map.";
CombineOcclusionTask.parameterSchema = {
    type: "object",
    properties: {
        largeMapFile: { type: "string", minLength: 1 },
        mediumMapFile: { type: "string", minLength: 1 },
        smallMapFile: { type: "string", minLength: 1 },
        outputMapFile: { type: "string", minLength: 1 },
        channelGamma: {
            type: "array",
            items: { type: "number" },
            minItems: 3,
            maxItems: 3,
            default: [1.0, 0.1, 0.05]
        }
    },
    required: [
        "largeMapFile",
        "mediumMapFile",
        "smallMapFile",
        "outputMapFile"
    ],
    additionalProperties: false
};
CombineOcclusionTask.parameterValidator = Task_1.default.jsonValidator.compile(CombineOcclusionTask.parameterSchema);
//# sourceMappingURL=CombineOcclusionTask.js.map