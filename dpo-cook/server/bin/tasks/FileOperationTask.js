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
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const Task_1 = require("../app/Task");
/**
 * Executes file operations including delete, rename, create folder,
 * and delete folder.
 *
 * Parameters: [[IFileOperationTaskParameters]].
 */
class FileOperationTask extends Task_1.default {
    constructor(params, context) {
        super(params, context);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const params = this.parameters;
                const filePath = path.resolve(this.context.jobDir, params.name);
                switch (params.operation) {
                    case "DeleteFile":
                        fs.unlink(filePath, err => {
                            if (err) {
                                err = new Error(`Delete file "${filePath}" failed: ${err.toString()}`);
                                return reject(err);
                            }
                            this.logTaskEvent("debug", `Successfully deleted file "${filePath}"`);
                            return resolve();
                        });
                        break;
                    case "RenameFile":
                        if (!params.newName) {
                            return reject("Rename file operation requires 'newName' parameter to be set.");
                        }
                        const newFilePath = path.resolve(this.context.jobDir, params.newName);
                        mkdirp(path.dirname(newFilePath), err => {
                            if (err) {
                                err = new Error(`Rename file "${filePath}" failed: ${err.toString()}`);
                                return reject(err);
                            }
                            fs.rename(filePath, newFilePath, err => {
                                if (err) {
                                    err = new Error(`Rename file "${filePath}" failed: ${err.toString()}`);
                                    return reject(err);
                                }
                                this.logTaskEvent("debug", `Successfully renamed file "${filePath}" to "${newFilePath}"`);
                                return resolve();
                            });
                        });
                        break;
                    case "CreateFolder":
                        mkdirp(filePath, err => {
                            if (err) {
                                err = new Error(`Create folder "${filePath}" failed: ${err.toString()}`);
                                return reject(err);
                            }
                            this.logTaskEvent("debug", `Successfully created folder "${filePath}"`);
                            return resolve();
                        });
                        break;
                    case "DeleteFolder":
                        if (filePath.length < 4) {
                            const err = new Error(`deletion of folder "${filePath}" refused.`);
                            reject(err);
                        }
                        rimraf(filePath, err => {
                            if (err) {
                                err = `Delete folder "${filePath}" failed: ${err.toString()}`;
                                return reject(err);
                            }
                            this.logTaskEvent("debug", `Successfully deleted folder "${filePath}"`);
                            return resolve();
                        });
                        break;
                }
            });
        });
    }
}
exports.default = FileOperationTask;
FileOperationTask.taskName = "FileOperation";
FileOperationTask.description = "Executes file system operations including " +
    "delete, rename, create folder and delete folder";
FileOperationTask.parameterSchema = {
    type: "object",
    properties: {
        operation: { type: "string", enum: ["DeleteFile", "RenameFile", "CreateFolder", "DeleteFolder"] },
        name: { type: "string", minLength: 1 },
        newName: { type: "string", minLength: 1, default: "" }
    },
    required: [
        "operation",
        "name"
    ],
    additionalProperties: false
};
FileOperationTask.parameterValidator = Task_1.default.jsonValidator.compile(FileOperationTask.parameterSchema);
//# sourceMappingURL=FileOperationTask.js.map