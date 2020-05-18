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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const jsonLoader = require("../utils/jsonLoader");
const Errors_1 = require("./Errors");
////////////////////////////////////////////////////////////////////////////////
class TaskManager {
    constructor(dirs) {
        this.taskTypes = {};
        this.tools = {};
        const schemaDir = path.resolve(dirs.base, "schemas/");
        const toolsSchemaPath = path.resolve(schemaDir, "tools.schema.json");
        const toolsFilePath = path.resolve(dirs.base, "tools.json");
        this.toolConfigurations = jsonLoader.validate(toolsFilePath, toolsSchemaPath, true);
        this.loadTools(dirs.tools);
        this.loadTasks(dirs.tasks);
    }
    createTask(taskName, parameters, context) {
        const taskType = this.getTaskType(taskName);
        return new taskType(parameters, context);
    }
    createToolInstance(name, settings, jobDir) {
        const tool = this.tools[name];
        if (!tool) {
            return null;
        }
        return tool.createInstance(settings, jobDir);
    }
    getTaskType(taskName) {
        const taskType = this.taskTypes[taskName];
        if (!taskType) {
            throw new RangeError(`unknown task: ${taskName}`);
        }
        return taskType;
    }
    loadTasks(tasksDir) {
        const taskFiles = fs.readdirSync(tasksDir);
        let count = 0;
        taskFiles.forEach(taskFile => {
            if (path.extname(taskFile) === ".js") {
                const taskPath = path.resolve(tasksDir, taskFile);
                const taskType = require(taskPath).default;
                const taskName = taskType.name.substr(0, taskType.name.length - 4);
                this.taskTypes[taskName] = taskType;
                count++;
            }
        });
        console.log(`Tasks loaded: ${count}`);
    }
    loadTools(toolsDir) {
        const toolFiles = fs.readdirSync(toolsDir);
        let count = 0;
        toolFiles.forEach(toolFile => {
            if (path.extname(toolFile) === ".js") {
                const toolPath = path.resolve(toolsDir, toolFile);
                let ToolType;
                try {
                    ToolType = require(toolPath).default;
                }
                catch (error) {
                    throw new Errors_1.ConfigurationError(`failed to load/parse tool module '${toolFile}': ${error.message}`);
                }
                const toolName = ToolType.toolName;
                const config = this.toolConfigurations[toolName];
                if (config) {
                    if (!fs.existsSync(config.executable)) {
                        throw new Errors_1.ConfigurationError(`executable for tool '${toolName}' not found: '${config.executable}'`);
                    }
                    const tool = new ToolType(config);
                    this.tools[toolName] = tool;
                    count++;
                }
                else {
                    console.warn(`configuration for tool '${toolName}' not found`);
                }
            }
        });
        console.log(`Tools loaded: ${count}`);
    }
}
exports.default = TaskManager;
//# sourceMappingURL=TaskManager.js.map