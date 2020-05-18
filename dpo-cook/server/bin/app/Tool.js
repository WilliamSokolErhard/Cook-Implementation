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
const ToolInstance_1 = require("./ToolInstance");
exports.ToolInstance = ToolInstance_1.default;
class Tool {
    constructor(config) {
        this.configuration = Object.assign({}, config);
        this._waitingInstances = [];
        this._runningInstances = [];
    }
    get name() {
        return this.constructor.toolName;
    }
    get waitingInstanceCount() {
        return this._waitingInstances.length;
    }
    get runningInstanceCount() {
        return this._runningInstances.length;
    }
    /**
     * Creates and returns an instance for this tool. The instance object keeps track of the
     * tool instance's state and settings.
     * @param settings The settings to be used for instance invocation.
     * @param workDir The path to the directory to be used for work files.
     */
    createInstance(settings, workDir) {
        settings = this.conformSettings(settings);
        const tool = this;
        return new ToolInstance_1.default(tool, settings, workDir);
    }
    /**
     * Returns true if this tool can run additional instances. The maximum number of instances
     * is defined in the tool configuration.
     */
    canRunInstance() {
        return this.runningInstanceCount < this.configuration.maxInstances;
    }
    /**
     * Called when the state of a tool instance changes.
     * @param event
     */
    onInstanceState(event) {
        const { instance, state } = event;
        const waitIndex = this._waitingInstances.indexOf(instance);
        if (waitIndex >= 0) {
            this._waitingInstances.splice(waitIndex, 1);
        }
        const runIndex = this._runningInstances.indexOf(instance);
        if (runIndex >= 0) {
            this._runningInstances.splice(runIndex, 1);
        }
        switch (state) {
            case "running":
                this._runningInstances.push(instance);
                break;
            case "waiting":
                this._waitingInstances.push(instance);
                break;
        }
    }
    /**
     * Called with messages from running tool instances.
     * @param event
     * @returns true if message should be discarded.
     */
    onInstanceMessage(event) {
        return false;
    }
    /**
     * Subclasses must override.
     * Called before the tool instance is started. Must return an [IToolSetup]
     * with a command to be executed and optionally a generated script file.
     * @param instance
     */
    setupInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.reject("must override");
        });
    }
    /**
     * Called before the tool instance is executed.
     * Override to perform setup tasks.
     * @param instance The tool instance about to be executed.
     */
    instanceWillExecute(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    /**
     * Called after the tool instance exited.
     * Override to perform cleanup tasks.
     * @param instance The tool instance that exited.
     */
    instanceDidExit(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    conformSettings(settings) {
        // merges given settings with the default settings. Omits setting props with a value of 'undefined'.
        const defaultSettings = this.constructor.defaultSettings;
        const mergedSettings = Object.assign({}, defaultSettings);
        const settingsKeys = Object.getOwnPropertyNames(settings);
        for (const key of settingsKeys) {
            if (settings[key] !== undefined) {
                mergedSettings[key] = settings[key];
            }
        }
        return mergedSettings;
    }
}
exports.default = Tool;
Tool.toolName = "Tool";
Tool.defaultSettings = {};
//# sourceMappingURL=Tool.js.map