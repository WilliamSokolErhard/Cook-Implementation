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
const Tool_1 = require("../app/Tool");
class InstantMeshesTool extends Tool_1.default {
    setupInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = instance.settings;
            const inputFilePath = instance.getFilePath(settings.inputMeshFile);
            if (!inputFilePath) {
                throw new Error("missing input mesh file");
            }
            const outputFilePath = instance.getFilePath(settings.outputMeshFile);
            if (!outputFilePath) {
                throw new Error("missing output mesh file");
            }
            const options = [];
            if (settings.vertexCount !== undefined) {
                options.push(`-v ${settings.vertexCount}`);
            }
            if (settings.faceCount !== undefined) {
                options.push(`-f ${settings.faceCount}`);
            }
            if (settings.smooth !== undefined) {
                options.push(`-S ${settings.smooth}`);
            }
            if (settings.rosy !== undefined) {
                options.push(`-r ${settings.rosy}`);
            }
            if (settings.posy !== undefined) {
                options.push(`-p ${settings.posy}`);
            }
            if (settings.deterministic) {
                options.push("-d");
            }
            if (settings.dominant) {
                options.push("-D");
            }
            if (settings.intrinsic) {
                options.push("-i");
            }
            const executable = this.configuration.executable;
            const command = `"${executable}" ${options.join(" ")} -o "${outputFilePath}" "${inputFilePath}"`;
            return Promise.resolve({ command });
        });
    }
}
exports.default = InstantMeshesTool;
InstantMeshesTool.toolName = "InstantMeshes";
InstantMeshesTool.defaultOptions = {};
//# sourceMappingURL=InstantMeshesTool.js.map