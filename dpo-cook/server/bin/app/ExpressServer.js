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
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const uniqueId_1 = require("../utils/uniqueId");
/**
 * Basic infrastructure for an Express Server.
 */
class ExpressServer {
    constructor(config) {
        this.config = Object.assign({}, ExpressServer.defaultConfiguration, config);
        this.app = express();
        this.app.disable('x-powered-by');
        this.server = new http.Server(this.app);
    }
    setup() {
        const app = this.app;
        const config = this.config;
        if (config.enableLogging) {
            this.app.use(morgan("tiny"));
        }
        if (config.staticDir) {
            this.app.use(config.staticRoute, express.static(config.staticDir));
        }
        // parse cookies
        app.use(cookieParser(this.config.secret));
        // parse json and urlencoded request bodies into req.body
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }
    start() {
        this.addErrorHandling();
        //this.server.on("request", this.app);
        const port = this.config.port;
        this.server.listen(port, () => {
            console.info(`\nServer ready and listening on port ${port}`);
        });
    }
    addSessions() {
        const config = this.config;
        if (!config.sessionMaxAge || !config.secret) {
            console.warn("ExpressServer.setupSessions - sessions not enabled");
            return;
        }
        const sessionOptions = {
            name: "sessionId",
            secret: config.secret,
            genid: () => uniqueId_1.default(),
            resave: false,
            saveUninitialized: config.sessionSaveUninitialized,
            cookie: {
                maxAge: config.sessionMaxAge,
                httpOnly: true
            }
        };
        this.app.use(session(sessionOptions));
    }
    addErrorHandling() {
        this.app.use((error, req, res, next) => {
            console.error(error);
            if (res.headersSent) {
                return next(error);
            }
            if (req.accepts("json")) {
                // send JSON formatted error
                res.status(500).send({ status: "error", error: `${error.name}: ${error.message}` });
            }
            else {
                // send error page
                res.status(500).render("errors/500", { error });
            }
        });
    }
}
exports.default = ExpressServer;
ExpressServer.defaultConfiguration = {
    port: 8000,
    enableDevMode: false,
    enableLogging: true,
    staticRoute: "/static",
    sessionMaxAge: 15 * 24 * 3600000,
    sessionSaveUninitialized: true
};
//# sourceMappingURL=ExpressServer.js.map