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
const io = require("socket.io");
const express_1 = require("express");
class ClientRouter {
    constructor(jobManager, httpServer, dirs) {
        this.onLogMessage = this.onLogMessage.bind(this);
        this.router = express_1.Router();
        this.jobManager = jobManager;
        this.realtimeServer = io.listen(httpServer);
        this.connections = [];
        this.staticDir = dirs.files;
        this.setupRouter();
        this.setupRealtime();
        jobManager.on("log", this.onLogMessage);
    }
    setupRouter() {
        this.router.get("/", (req, res) => {
            res.sendFile(path.resolve(this.staticDir, "index.html"));
        });
        this.router.get("/local", (req, res) => {
            res.sendFile(path.resolve(this.staticDir, "local.html"));
        });
    }
    setupRealtime() {
        const connections = this.connections;
        this.realtimeServer.on("connection", socket => {
            socket.on("hello", message => {
                const clientId = message;
                const index = connections.findIndex(conn => conn.socket === socket);
                if (index >= 0) {
                    connections.splice(index, 1);
                }
                connections.push({ socket, clientId });
            });
            socket.on("disconnect", () => {
                const index = connections.findIndex(conn => conn.socket === socket);
                if (index >= 0) {
                    connections.splice(index, 1);
                }
            });
        });
    }
    onLogMessage(event) {
        // do not broadcast debug messages
        if (event.level === "debug") {
            return;
        }
        const connections = this.connections.filter(conn => conn.clientId === event.clientId);
        connections.forEach(conn => {
            conn.socket.emit("log", event);
        });
    }
}
exports.default = ClientRouter;
//# sourceMappingURL=ClientRouter.js.map