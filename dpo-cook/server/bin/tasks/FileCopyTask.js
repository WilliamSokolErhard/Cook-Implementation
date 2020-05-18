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
const fs = require("fs");
const path = require("path");
const Task_1 = require("../app/Task");
/**
 * Copies files from the source directory to the destination directory.
 *
 * Parameters: [[IFileCopyTaskParameters]]
 */
class FileCopyTask extends Task_1.default {
    constructor(params, context) {
        super(params, context);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.parameters;
            return Promise.all(params.files.map(fileName => {
                const sourceFilePath = path.resolve(params.sourcePath, fileName);
                const destinationFilePath = path.resolve(params.destinationPath, fileName);
                return this.copyFile(sourceFilePath, destinationFilePath);
            }));
        });
    }
    copyFile(sourceFilePath, destinationFilePath) {
        this.logTaskEvent("debug", `Copy file: ${sourceFilePath} to: ${destinationFilePath}`);
        return new Promise((resolve, reject) => {
            fs.copyFile(sourceFilePath, destinationFilePath, err => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
}
exports.default = FileCopyTask;
FileCopyTask.taskName = "FileCopy";
FileCopyTask.description = "Copies files from the source directory to the destination directory.";
FileCopyTask.parameterSchema = {
    type: "object",
    properties: {
        "sourcePath": { type: "string", minLength: 1 },
        "destinationPath": { type: "string", minLength: 1 },
        "files": {
            type: "array",
            items: { type: "string", minLength: 1 }
        }
    },
    required: [
        "sourcePath",
        "destinationPath",
        "files"
    ],
    additionalProperties: false
};
FileCopyTask.parameterValidator = Task_1.default.jsonValidator.compile(FileCopyTask.parameterSchema);
//# sourceMappingURL=FileCopyTask.js.map