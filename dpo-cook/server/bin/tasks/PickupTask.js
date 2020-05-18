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
 * Picks files from a given location and copies them into the current work directory.
 * Method "local" supports local file copy, "webDAV" copies files from a remote server using WebDAV.
 *
 * Parameters: [[IPickupTaskParameters]]
 */
class PickupTask extends Task_1.default {
    constructor(params, context) {
        super(params, context);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.parameters;
            const files = options.files;
            const filesToCopy = [];
            for (let prop in files) {
                if (prop !== "method" && prop !== "path") {
                    if (files[prop]) {
                        filesToCopy.push(files[prop]);
                    }
                    else {
                        this.logTaskEvent("warning", `skipping file pickup: '${prop}' is empty/undefined`);
                    }
                }
            }
            if (options.method === "none") {
                this.logTaskEvent("debug", "file pickup skipped");
                return Promise.resolve();
            }
            let remoteClient;
            if (options.method === "webDAV") {
                remoteClient = webDAV(options.path, options.credentials.user, options.credentials.password);
            }
            return Promise.all(filesToCopy.map(fileName => {
                const destinationFilePath = path.resolve(this.context.jobDir, fileName);
                if (options.method === "local") {
                    const sourceFilePath = path.resolve(options.path, fileName);
                    return this.copyFile(sourceFilePath, destinationFilePath);
                }
                else if (options.method === "webDAV") {
                    return this.copyRemoteFile(remoteClient, options.path, fileName, destinationFilePath);
                }
                else {
                    throw new Error(`unsupported transport method: ${options.method}`);
                }
            }));
        });
    }
    copyFile(sourceFilePath, destinationFilePath) {
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
    }
    copyRemoteFile(remoteClient, remoteUrl, remoteFileName, destinationFilePath) {
        this.logTaskEvent("debug", `remote copy file: '${remoteFileName}' to: '${destinationFilePath}'`);
        return remoteClient.getFileContents(remoteFileName)
            .then(buffer => {
            return new Promise((resolve, reject) => {
                fs.writeFile(destinationFilePath, buffer, err => {
                    if (err) {
                        return reject(new Error(`failed to write file: '${destinationFilePath}', reason: ${err.message}`));
                    }
                    return resolve();
                });
            });
        })
            .catch(err => {
            throw new Error(`failed to read remote file: '${remoteFileName}' from server '${remoteUrl}', reason: ${err.message}`);
        });
    }
}
exports.default = PickupTask;
PickupTask.taskName = "Pickup";
PickupTask.description = "Picks files from a given location and copies them into the current work directory.";
PickupTask.parameterSchema = {
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
PickupTask.parameterValidator = Task_1.default.jsonValidator.compile(PickupTask.parameterSchema);
//# sourceMappingURL=PickupTask.js.map