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
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment");
const table = require("markdown-table");
const Ajv = require("ajv");
const jsonValidator = new Ajv({ useDefaults: true });
class Task {
    constructor(params, context) {
        this.context = context;
        this.parameters = params;
        this.result = {};
        this.report = {
            name: this.name,
            parameters: this.parameters,
            tools: [],
            start: "",
            end: "",
            duration: 0,
            state: "created",
            error: "",
            log: [],
            result: this.result
        };
        this._resolveCancel = null;
        let validator = this.parameterValidator;
        if (!validator) {
            const message = `parameterValidator undefined for ${this.name}`;
            this.logTaskEvent("error", message);
            throw new Error(message);
        }
        if (!validator(params)) {
            // debug output table of validated task parameters
            console.debug(`\nTask.Constructor - '${this.name}' - Parameter validation failed:\n`);
            console.debug(this.dumpProperties(params));
            const message = `parameter validation failed: ${jsonValidator.errorsText(validator.errors)}`;
            this.logTaskEvent("error", message);
            throw new Error(message);
        }
    }
    get name() {
        return this.constructor.taskName;
    }
    get description() {
        return this.constructor.description;
    }
    get parameterSchema() {
        return this.constructor.parameterSchema;
    }
    get parameterValidator() {
        return this.constructor.parameterValidator;
    }
    get state() {
        return this.report.state;
    }
    get cancelRequested() {
        return !!this._resolveCancel;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== "created") {
                return Promise.reject(new Error(`task is in '${this.report.state}' state, but can only be run in 'created' state`));
            }
            // bookkeeping, set state to "running"
            this.startTask();
            return this.willStart()
                .then(() => this.execute())
                .then(() => {
                if (this._resolveCancel) {
                    this.endTask("cancelled");
                    this._resolveCancel();
                }
                else {
                    this.endTask("done");
                }
            })
                .catch(err => {
                this.endTask("error", err);
                throw err;
            })
                .finally(() => this.didFinish());
        });
    }
    /**
     * Cancels the task. Returns a promise which is resolved when cancellation is complete and
     * the task's state has been switched to "cancelled".
     */
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this._resolveCancel) {
                    return reject("cancellation already in progress");
                }
                const report = this.report;
                // if task hasn't been started, we return immediately, setting the state to "cancelled"
                if (report.state === "created") {
                    report.state = "cancelled";
                    return resolve();
                }
                // if task has ended, we return immediately, doing nothing
                if (report.state !== "waiting" && report.state !== "running") {
                    return resolve();
                }
                // if cancellation not successful after 5 seconds, throw error
                let timeoutHandler = setTimeout(() => {
                    return reject(new Error("failed to cancel within 5 seconds"));
                }, 5000);
                this._resolveCancel = () => {
                    this._resolveCancel = null;
                    clearTimeout(timeoutHandler);
                    timeoutHandler = null;
                    resolve();
                };
                this.onCancel();
            });
        });
    }
    /**
     * Executes the task. Subclasses must override this method.
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.reject("must override");
        });
    }
    /**
     * Override to perform action to cancel the task.
     * The running task's promise must resolve within 5 seconds, otherwise the
     * cancellation promise rejects.
     */
    onCancel() {
    }
    /**
     * Will always be called before task is run.
     * Task is already in 'running' state at this point.
     */
    willStart() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    /**
     * Will always be called after the task has reached its end state.
     * The task's state is one of 'done', 'error', or 'cancelled'.
     */
    didFinish() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    logEvent(event) {
        if (event.level !== "debug" || event.module === "task") {
            this.reportEvent(event);
        }
        this.context.logEvent(event);
    }
    reportEvent(event) {
        this.report.log.push({
            time: event.time.toISOString(),
            level: event.level,
            message: event.message
        });
    }
    logTaskEvent(level, message, sender) {
        this.logEvent({
            time: new Date(),
            module: "task",
            level,
            message,
            sender: sender || this.name
        });
    }
    getFilePath(fileName) {
        if (!fileName) {
            return "";
        }
        return path.resolve(this.context.jobDir, fileName);
    }
    writeFile(fileName, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.getFilePath(fileName);
            if (typeof content === "string") {
                yield fs.writeFile(path, content, "utf8");
            }
            else {
                yield fs.writeFile(path, content);
            }
        });
    }
    dumpProperties(props, rows, propPath) {
        let isRoot = false;
        if (!rows) {
            isRoot = true;
            rows = [];
            propPath = "";
        }
        if (propPath) {
            propPath += ".";
        }
        for (let key in props) {
            const value = props[key];
            if (typeof value === "object") {
                this.dumpProperties(value, rows, propPath + key);
            }
            else {
                rows.push([propPath + key, value]);
            }
        }
        if (isRoot) {
            rows.unshift(["Name", "Value"]);
            return "\n" + table(rows) + "\n";
        }
    }
    startTask() {
        const time = new Date();
        const report = this.report;
        report.start = time.toISOString();
        report.state = "running";
        this.context.logEvent({
            time, module: "task", level: "info", message: "started", sender: this.name
        });
    }
    endTask(state, error) {
        const time = new Date();
        const report = this.report;
        report.state = state;
        report.end = time.toISOString();
        report.duration = (time.valueOf() - (new Date(report.start).valueOf())) * 0.001;
        const formattedDuration = moment.utc(moment.duration(report.duration, "seconds").asMilliseconds()).format("HH:mm:ss.SSS");
        if (state === "error") {
            report.error = error.message;
            this.context.logEvent({
                time, module: "task", level: "error", sender: this.name,
                message: `terminated with error after ${formattedDuration}`
            });
        }
        else if (state === "cancelled") {
            this.context.logEvent({
                time, module: "task", level: "warning", sender: this.name,
                message: `cancelled by user after ${formattedDuration}`
            });
        }
        else {
            this.context.logEvent({
                time, module: "task", level: "info", sender: this.name,
                message: `completed successfully after ${formattedDuration}`
            });
        }
    }
}
exports.default = Task;
Task.taskName = "Task";
Task.description = "";
Task.parameterSchema = {};
Task.parameterValidator = null;
Task.jsonValidator = jsonValidator;
//# sourceMappingURL=Task.js.map