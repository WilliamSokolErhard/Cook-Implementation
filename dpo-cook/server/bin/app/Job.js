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
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const Publisher_1 = require("@ff/core/Publisher");
const TaskLogger_1 = require("./TaskLogger");
class Job extends Publisher_1.default {
    constructor(manager, options) {
        super();
        this.addEvents("log");
        this.manager = manager;
        this.logger = new TaskLogger_1.default(options.logDir || options.jobDir);
        this.jobDir = options.jobDir;
        this.data = {
            report: this.createReport(options.jobOrder)
        };
        this.jobDirCreated = false;
        this.createJobDir();
        const params = {
            recipe: options.jobOrder.recipe,
            parameters: options.jobOrder.parameters
        };
        this.task = manager.createTask("Recipe", params, this);
    }
    get id() {
        return this.data.report.id;
    }
    get clientId() {
        return this.data.report.clientId;
    }
    run() {
        return this.task.run()
            .then(() => {
            return this.logger.taskDone(this.data.report);
        })
            .catch(error => {
            return this.logger.taskDone(this.data.report, error)
                .then(() => {
                throw error;
            });
        });
    }
    cancel() {
        return this.task.cancel()
            .then(() => {
            return this.logger.taskDone(this.data.report);
        });
    }
    destroy(keepTempDir) {
        return this.cancel()
            .then(() => {
            if (!keepTempDir) {
                this.deleteJobDir();
            }
        });
    }
    logEvent(event) {
        this.logger.logEvent(event);
        const jobEvent = Object.assign({}, event, { clientId: this.clientId });
        this.emit("log", jobEvent);
    }
    createJobDir() {
        this.jobDirCreated = false;
        if (fs.existsSync(this.jobDir)) {
            return;
        }
        mkdirp(this.jobDir, err => {
            if (err) {
                throw new Error(err);
            }
        });
        this.logger.logEvent({
            module: "runner",
            level: "debug",
            message: `Work directory created: '${this.jobDir}'`
        });
        this.jobDirCreated = true;
    }
    deleteJobDir() {
        if (this.jobDirCreated && this.jobDir) {
            rimraf.sync(this.jobDir);
            this.logger.logEvent({
                module: "runner",
                level: "debug",
                message: `Work directory deleted: '${this.jobDir}'`
            });
            this.jobDirCreated = false;
        }
    }
    createReport(order) {
        return {
            id: order.id,
            name: order.name,
            clientId: order.clientId,
            priority: order.priority || "normal",
            submission: order.submission || new Date().toISOString(),
            recipe: order.recipe,
            parameters: order.parameters,
            start: "",
            end: "",
            duration: 0,
            state: "created",
            step: "",
            error: "",
            steps: {}
        };
    }
}
exports.default = Job;
//# sourceMappingURL=Job.js.map