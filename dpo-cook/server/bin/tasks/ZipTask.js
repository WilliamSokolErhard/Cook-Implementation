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
 * Executes zip operation on a set of up to 5 files.
 *
 * Parameters: [[IZipTaskParameters]].
 */
class ZipTask extends ToolTask_1.default {
    constructor(params, context) {
        super(params, context);
        if (params.tool === "SevenZip") {
            const settings = {
                inputFile1: params.inputFile1,
                inputFile2: params.inputFile2,
                inputFile3: params.inputFile3,
                inputFile4: params.inputFile4,
                inputFile5: params.inputFile5,
                outputFile: params.outputFile,
                timeout: params.timeout
            };
            this.addTool("SevenZip", settings);
        }
    }
}
exports.default = ZipTask;
ZipTask.taskName = "Zip";
ZipTask.description = "Executes zip operations on a set of up to 5 files.";
ZipTask.parameterSchema = {
    type: "object",
    properties: {
        inputFile1: { type: "string", minLength: 1 },
        inputFile2: { type: "string", minLength: 1 },
        inputFile3: { type: "string", minLength: 1 },
        inputFile4: { type: "string", minLength: 1 },
        inputFile5: { type: "string", minLength: 1 },
        outputFile: { type: "string", minLength: 1, default: "CookArchive.zip" },
        timeout: { type: "integer", minimum: 0, default: 0 },
        tool: { type: "string", enum: ["SevenZip"], default: "SevenZip" }
    },
    required: [
        "inputFile1"
    ],
    additionalProperties: false
};
ZipTask.parameterValidator = Task_1.default.jsonValidator.compile(ZipTask.parameterSchema);
//# sourceMappingURL=ZipTask.js.map