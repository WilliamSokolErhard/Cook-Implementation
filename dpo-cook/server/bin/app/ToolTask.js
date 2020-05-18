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
const Tool_1 = require("./Tool");
exports.ToolInstance = Tool_1.ToolInstance;
const Task_1 = require("./Task");
class ToolTask extends Task_1.default {
    constructor(params, context) {
        super(params, context);
        this.instances = [];
        this.runningInstance = null;
    }
    /**
     * Adds a tool to the task's list of tools to be executed.
     * @param name Name of the tool.
     * @param settings Settings for the tool's invocation.
     */
    addTool(name, settings) {
        const instance = this.context.manager.createToolInstance(name, settings, this.context.jobDir);
        this.report.tools.push(instance.report);
        this.instances.push(instance);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = this.instances[0];
            return this.runInstance(instance);
        });
    }
    runInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            instance.on("state", this.onInstanceState, this);
            instance.on("message", this.onInstanceMessage, this);
            this.runningInstance = instance;
            return this.instanceWillStart(instance)
                .then(() => {
                return instance.run()
                    .finally(() => this.instanceDidExit(instance));
            })
                .finally(() => {
                this.runningInstance = null;
                instance.off("state", this.onInstanceState, this);
                instance.off("message", this.onInstanceMessage, this);
            });
        });
    }
    onCancel() {
        if (this.runningInstance) {
            this.runningInstance.cancel();
        }
    }
    instanceWillStart(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    instanceDidExit(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    onInstanceState(event) {
    }
    onInstanceMessage(event) {
        this.logTaskEvent(event.level, event.message, event.instance.tool.name);
    }
}
exports.default = ToolTask;
//# sourceMappingURL=ToolTask.js.map