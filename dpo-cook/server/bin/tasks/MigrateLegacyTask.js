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
const fetch_1 = require("../utils/fetch");
const Task_1 = require("../app/Task");
/**
 * Fetches Legacy Viewer content including models, maps, annotations
 * and articles, and converts it to Voyager items/presentations.
 *
 * Parameters: [[IMigrateLegacyTaskParameters]].
 */
class MigrateLegacyTask extends Task_1.default {
    constructor(params, context) {
        super(params, context);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.parameters;
            const modelId = params.modelId;
            const modelInfoURL = `${MigrateLegacyTask.legacyViewerUrl}/modelinfo/${modelId}`;
            const modelInfo = yield fetch_1.default.json(modelInfoURL, "GET");
            this.logTaskEvent("info", modelInfo);
            return Promise.resolve();
        });
    }
}
exports.default = MigrateLegacyTask;
MigrateLegacyTask.taskName = "MigrateLegacy";
MigrateLegacyTask.description = "Fetches Legacy Viewer content including models, maps, annotations " +
    "and articles, and converts it to Voyager items/presentations.";
MigrateLegacyTask.parameterSchema = {
    type: "object",
    properties: {
        modelId: { type: "string", minLength: 1 }
    },
    required: [
        "modelId"
    ],
    additionalProperties: false
};
MigrateLegacyTask.parameterValidator = Task_1.default.jsonValidator.compile(MigrateLegacyTask.parameterSchema);
MigrateLegacyTask.legacyViewerUrl = "https://legacy.3d.si.edu";
//# sourceMappingURL=MigrateLegacyTask.js.map