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
const Task_1 = require("../app/Task");
/**
 * A dummy task which does nothing. After a given duration, the task terminates
 * either successfully or it fails (throws an error).
 *
 * Parameters: [[IDummyTaskParameters]].
 */
class DummyTask extends Task_1.default {
    constructor(options, context) {
        super(options, context);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.parameters;
            return new Promise((resolve, reject) => {
                let timeoutHandler, intervalHandler;
                timeoutHandler = setTimeout(() => {
                    clearInterval(intervalHandler);
                    if (options.outcome === "success") {
                        return resolve();
                    }
                    const err = new Error("Task is set to fail");
                    return reject(err);
                }, options.duration);
                intervalHandler = setInterval(() => {
                    if (this.cancelRequested) {
                        clearTimeout(timeoutHandler);
                        clearInterval(intervalHandler);
                        return resolve();
                    }
                });
            });
        });
    }
}
exports.default = DummyTask;
DummyTask.taskName = "Dummy";
DummyTask.description = "Dummy task with predictable outcome (success/failure).";
DummyTask.parameterSchema = {
    type: "object",
    properties: {
        outcome: { type: "string", enum: ["success", "failure"] },
        duration: { title: "duration in ms", type: "integer", minimum: 1, default: 2000 }
    },
    required: [
        "outcome"
    ],
    additionalProperties: false
};
DummyTask.parameterValidator = Task_1.default.jsonValidator.compile(DummyTask.parameterSchema);
//# sourceMappingURL=DummyTask.js.map