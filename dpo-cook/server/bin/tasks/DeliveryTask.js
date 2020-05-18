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
const webDAV = require("webdav");
const Task_1 = require("../app/Task");
/**
 * Delivers files to a given destination. Copies the files from the current work directory.
 * Method "local" supports local file copy, "webDAV" copies files to a remote server using WebDAV.
 *
 * Parameters: [[IDeliveryTaskParameters]]
 */
class DeliveryTask extends Task_1.default {
    constructor(params, context) {
        super(params, context);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.parameters;
            const files = params.files;
            const filesToCopy = [];
            const fileMap = {};
            for (let prop in files) {
                if (files[prop]) {
                    filesToCopy.push(files[prop]);
                    fileMap[prop] = files[prop];
                }
                else {
                    this.logTaskEvent("warning", `skipping file delivery: '${prop}' is empty/undefined`);
                }
            }
            this.report.result.files = fileMap;
            if (params.method === "none") {
                this.logTaskEvent("debug", "file delivery skipped");
                return Promise.resolve();
            }
            let remoteClient;
            if (params.method === "webDAV") {
                remoteClient = webDAV(params.path, params.credentials.user, params.credentials.password);
            }
            if (filesToCopy.length === 0) {
                this.logTaskEvent("debug", "files array is empty, nothing to deliver");
            }
            return Promise.all(filesToCopy.map(fileName => {
                const sourceFilePath = path.resolve(this.context.jobDir, fileName);
                if (params.method === "local") {
                    const destinationFilePath = path.resolve(params.path, fileName);
                    return this.copyFile(sourceFilePath, destinationFilePath);
                }
                else if (params.method === "webDAV") {
                    return this.copyRemoteFile(remoteClient, params.path, fileName, sourceFilePath);
                }
                else {
                    throw new Error(`unsupported transport method: ${params.method}`);
                }
            }));
        });
    }
    copyFile(sourceFilePath, destinationFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.logTaskEvent("debug", `copy file: '${sourceFilePath}' to: '${destinationFilePath}'`);
                fs.copyFile(sourceFilePath, destinationFilePath, err => {
                    if (err) {
                        return reject(new Error(`failed to copy file: '${sourceFilePath}' ` +
                            `to '${destinationFilePath}', reason: ${err.code} (${err.errno})`));
                    }
                    return resolve();
                });
            });
        });
    }
    copyRemoteFile(remoteClient, remoteUrl, remoteFileName, sourceFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.logTaskEvent("debug", `remote copy file: '${sourceFilePath}' to: '${remoteFileName}'`);
                fs.readFile(sourceFilePath, (err, buffer) => {
                    if (err) {
                        return reject(new Error(`failed to read file: '${sourceFilePath}', reason: ${err.message}`));
                    }
                    remoteClient.putFileContents(remoteFileName, buffer)
                        .then(() => {
                        return resolve();
                    })
                        .catch(err => {
                        return reject(new Error(`failed to write remote file: '${remoteFileName}' from server '${remoteUrl}', reason: ${err.message}`));
                    });
                });
            });
        });
    }
}
exports.default = DeliveryTask;
DeliveryTask.taskName = "Delivery";
DeliveryTask.description = "Delivers files to a given destination.";
DeliveryTask.parameterSchema = {
    type: "object",
    properties: {
        "method": {
            type: "string",
            enum: ["none", "local", "webDAV", "dropbox"],
            default: "none"
        },
        "credentials": { type: "object" },
        "path": { type: "string", minLength: 1 },
        "files": { type: "object", additionalProperties: { type: "string" } }
    },
    required: [
        "method",
        "path",
        "files"
    ],
    additionalProperties: false
};
DeliveryTask.parameterValidator = Task_1.default.jsonValidator.compile(DeliveryTask.parameterSchema);
//# sourceMappingURL=DeliveryTask.js.map