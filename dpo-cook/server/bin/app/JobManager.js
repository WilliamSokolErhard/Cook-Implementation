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
const filenamify = require("filenamify");
const Ajv = require("ajv");
const jsonValidator = new Ajv({ allErrors: true, verbose: true });
jsonValidator.addFormat("file", value => true);
const Publisher_1 = require("@ff/core/Publisher");
const TaskManager_1 = require("./TaskManager");
const Job_1 = require("./Job");
const ClientManager_1 = require("./ClientManager");
const RecipeManager_1 = require("./RecipeManager");
class JobManager extends Publisher_1.default {
    constructor(dirs) {
        super();
        this.addEvent("log");
        this.onLogEvent = this.onLogEvent.bind(this);
        this.jobs = {};
        this.clientManager = new ClientManager_1.default(dirs);
        this.taskManager = new TaskManager_1.default(dirs);
        this.recipeManager = new RecipeManager_1.default(dirs);
        this.workDir = dirs.work;
        const jobOrderSchemaPath = path.resolve(dirs.schemas, "job-order.schema.json");
        const jobOrderSchema = JSON.parse(fs.readFileSync(jobOrderSchemaPath, "utf8"));
        this.jobOrderValidator = jsonValidator.compile(jobOrderSchema);
    }
    /**
     * Creates a new job.
     * Validates the job order, loads and validates the recipe, validates the job parameters against the recipe,
     * and creates a directory for temporary files. Returns the path of the temp directory if successful.
     * @param {IJobOrder} jobOrder
     * @param {string} logDir Optional directory for log files.
     * @returns {Promise<string>} Path of the temporary job directory.
     */
    createJob(jobOrder, logDir) {
        return Promise.resolve().then(() => {
            // verify client id
            if (!this.clientManager.hasClient(jobOrder.clientId)) {
                throw new Error(`client id mismatch: '${jobOrder.clientId}'`);
            }
            // validate the job order against the JobOrder schema
            if (!this.jobOrderValidator(jobOrder)) {
                throw new Error("invalid job order; " +
                    jsonValidator.errorsText(null, { separator: ", ", dataVar: "order" }));
            }
            // ensure job id is unique
            if (this.jobs[jobOrder.id]) {
                throw new Error(`job id already exists: '${jobOrder.id}'`);
            }
            // load the recipe specified in the job order
            const recipe = this.recipeManager.getRecipeByIdOrName(jobOrder.recipeId);
            if (!recipe) {
                throw new Error(`unknown recipe id or name: '${jobOrder.recipeId}'`);
            }
            jobOrder.recipe = recipe;
            // validate the job parameters against the recipe's parameter schema
            if (!jsonValidator.validate(recipe.parameterSchema, jobOrder.parameters)) {
                throw new Error("invalid parameters in job order; " +
                    jsonValidator.errorsText(null, { separator: ", ", dataVar: "parameters" }));
            }
            // create the job (which creates its temp directory)
            if (jobOrder.id !== filenamify(jobOrder.id)) {
                throw new Error(`job id contains invalid characters: '${jobOrder.id}'`);
            }
            const jobDir = path.resolve(this.workDir, jobOrder.id);
            const jobOptions = {
                jobOrder,
                jobDir,
                logDir
            };
            const job = this.jobs[jobOrder.id] = new Job_1.default(this.taskManager, jobOptions);
            job.on("log", this.onLogEvent);
        });
    }
    /**
     * Starts the job with the given id.
     * All required input files must be present in the job's temporary directory.
     * @param {string} clientId
     * @param {string} jobId
     * @returns {Promise<void>}
     */
    runJob(clientId, jobId) {
        return Promise.resolve().then(() => {
            const job = this.jobs[jobId];
            if (!job || job.clientId !== clientId) {
                throw new Error(`unknown job id: '${jobId}'`);
            }
            if (job.data.report.state !== "created") {
                throw new Error(`job already running/completed: '${jobId}'`);
            }
            return job.run();
        });
    }
    cancelJob(clientId, jobId) {
        return Promise.resolve().then(() => {
            const job = this.jobs[jobId];
            if (!job || job.clientId !== clientId) {
                throw new Error(`unknown job id: '${jobId}'`);
            }
            return job.cancel();
        });
    }
    removeJob(clientId, jobId, keepTempDir) {
        return Promise.resolve().then(() => {
            const job = this.jobs[jobId];
            if (!job || job.clientId !== clientId) {
                throw new Error(`unknown job id: '${jobId}'`);
            }
            return job.destroy(keepTempDir).then(() => {
                job.off("log", this.onLogEvent);
                delete this.jobs[jobId];
            });
        });
    }
    removeCompletedJobs(clientId) {
        return Promise.resolve().then(() => {
            if (!this.clientManager.hasClient(clientId)) {
                throw new Error(`client id mismatch: '${clientId}'`);
            }
            const runningJobs = {};
            for (let id in this.jobs) {
                const job = this.jobs[id];
                const state = job.data.report.state;
                if (job.clientId !== clientId || (state !== "done" && state !== "error")) {
                    runningJobs[id] = job;
                }
            }
            this.jobs = runningJobs;
        });
    }
    getJobReport(clientId, jobId) {
        const job = this.jobs[jobId];
        if (!job || job.clientId !== clientId) {
            return null;
        }
        return job.data.report;
    }
    getJobInfo(clientId, jobId) {
        const report = this.getJobReport(clientId, jobId);
        if (!report || report.clientId !== clientId) {
            return null;
        }
        return {
            id: report.id,
            name: report.name,
            clientId: report.clientId,
            recipe: this.recipeManager.getRecipeInfo(report.recipe.id),
            priority: report.priority,
            submission: report.submission,
            start: report.start,
            end: report.end,
            duration: report.duration,
            state: report.state,
            step: report.step,
            error: report.error
        };
    }
    getJobInfoList(clientId) {
        if (clientId && !this.clientManager.hasClient(clientId)) {
            return [];
        }
        const jobList = Object.keys(this.jobs).map(key => this.jobs[key]);
        return jobList.filter(job => {
            const report = job.data.report;
            return !clientId || report.clientId === clientId;
        })
            .map(job => {
            const report = job.data.report;
            return {
                id: report.id,
                name: report.name,
                clientId: report.clientId,
                recipe: this.recipeManager.getRecipeInfo(report.recipe.id),
                priority: report.priority,
                submission: report.submission,
                start: report.start,
                end: report.end,
                duration: report.duration,
                state: report.state,
                step: report.step,
                error: report.error
            };
        });
    }
    getRecipeByIdOrName(idOrName) {
        return this.recipeManager.getRecipeByIdOrName(idOrName);
    }
    getRecipeInfoList() {
        return this.recipeManager.getRecipeInfoList();
    }
    getState() {
        const jobInfos = this.getJobInfoList();
        const jobs = {
            total: jobInfos.length,
            created: jobInfos.filter(job => job.state === "created").length,
            waiting: jobInfos.filter(job => job.state === "waiting").length,
            running: jobInfos.filter(job => job.state === "running").length,
            done: jobInfos.filter(job => job.state === "done").length,
            error: jobInfos.filter(job => job.state === "error").length,
            cancelled: jobInfos.filter(job => job.state === "cancelled").length,
        };
        const clients = [];
        this.clientManager.getClients().forEach(client => {
            const clientJobs = jobInfos.filter(jobInfo => jobInfo.clientId === client.id);
            if (clientJobs.length > 0) {
                clients.push({
                    name: client.name,
                    idleJobs: clientJobs.filter(job => job.state !== "running").map(job => job.id),
                    runningJobs: clientJobs.filter(job => job.state === "running").map(job => job.id)
                });
            }
        });
        return {
            jobs,
            clients
        };
    }
    onLogEvent(event) {
        this.emit("log", event);
    }
}
exports.default = JobManager;
//# sourceMappingURL=JobManager.js.map