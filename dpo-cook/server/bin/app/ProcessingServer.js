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
const path = require("path");
const jsonLoader = require("../utils/jsonLoader");
const ExpressServer_1 = require("./ExpressServer");
const JobManager_1 = require("./JobManager");
const ClientRouter_1 = require("./ClientRouter");
const ApiRouter_1 = require("./ApiRouter");
const AssetServer_1 = require("./AssetServer");
////////////////////////////////////////////////////////////////////////////////
class ProcessingServer {
    constructor(baseDir) {
        this.baseDir = baseDir;
        const schemaDir = path.resolve(baseDir, "schemas/");
        const configSchemaPath = path.resolve(schemaDir, "server.schema.json");
        const configFilePath = path.resolve(baseDir, "server.json");
        const config = jsonLoader.validate(configFilePath, configSchemaPath, true);
        const { work, recipes, files, tools, tasks } = config.directories;
        const ports = config.ports;
        const dirs = {
            base: baseDir,
            schemas: schemaDir,
            work: path.resolve(baseDir, work),
            recipes: path.resolve(baseDir, recipes),
            files: path.resolve(baseDir, files),
            tools: path.resolve(baseDir, tools),
            tasks: path.resolve(baseDir, tasks)
        };
        this.server = new ExpressServer_1.default({
            port: ports.server,
            enableDevMode: false,
            enableLogging: true,
            staticRoute: "/static",
            staticDir: dirs.files,
            sessionMaxAge: 15 * 24 * 3600000,
            sessionSaveUninitialized: true
        });
        this.server.setup();
        this.jobManager = new JobManager_1.default(dirs);
        this.assetServer = new AssetServer_1.default(dirs);
        this.apiRouter = new ApiRouter_1.default(this.jobManager, this.assetServer);
        this.clientRouter = new ClientRouter_1.default(this.jobManager, this.server.server, dirs);
        this.server.app.use("/", this.clientRouter.router);
        this.server.app.use("/", this.apiRouter.router);
        this.server.app.use("/", this.assetServer.router);
    }
    start() {
        this.server.start();
    }
}
exports.default = ProcessingServer;
//# sourceMappingURL=ProcessingServer.js.map