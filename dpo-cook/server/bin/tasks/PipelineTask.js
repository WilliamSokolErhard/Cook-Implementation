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
 * Executes a linear sequence of tasks.
 *
 * Parameters: [[IPipelineTaskParameters]]
 */
class PipelineTask extends Task_1.default {
    constructor(options, context) {
        super(options, context);
        this.taskQueue = options.tasks.map(entry => context.manager.createTask(entry.task, entry.parameters, context));
        this.logEvent = this.logEvent.bind(this);
    }
    scheduleTask(task) {
        this.taskQueue.push(task);
    }
    scheduleTasks(tasks) {
        this.taskQueue = this.taskQueue.concat(tasks);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = Promise.resolve();
            this.taskQueue.forEach(task => {
                promise = promise.then(() => {
                    return task.run();
                });
            });
            return promise;
        });
    }
}
exports.default = PipelineTask;
PipelineTask.taskName = "Pipeline";
PipelineTask.description = "Executes a linear sequence of tasks.";
PipelineTask.parameterSchema = {
    type: "object",
    properties: {
        tasks: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    task: {
                        type: "string",
                        minLength: 1
                    },
                    parameters: {
                        type: "object"
                    }
                }
            }
        }
    }
};
PipelineTask.parameterValidator = Task_1.default.jsonValidator.compile(PipelineTask.parameterSchema);
//# sourceMappingURL=PipelineTask.js.map