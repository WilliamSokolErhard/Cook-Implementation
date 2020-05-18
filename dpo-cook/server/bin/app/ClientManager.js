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
const commentJSON = require("comment-json");
class ClientManager {
    constructor(dirs) {
        this.clients = {};
        const clientFilePath = path.resolve(dirs.base, "clients.json");
        this.loadClients(clientFilePath);
    }
    hasClient(clientId) {
        return this.clients[clientId] !== undefined;
    }
    getClients() {
        return Object.keys(this.clients).map(key => this.clients[key]);
    }
    loadClients(clientFilePath) {
        let jsonClients = "";
        try {
            jsonClients = fs.readFileSync(clientFilePath, "utf8");
        }
        catch (e) {
            throw new Error(`failed to read client file from ${clientFilePath}`);
        }
        const clientDict = commentJSON.parse(jsonClients, null, true);
        if (!clientDict) {
            throw new Error("failed to parse client file");
        }
        this.clients = {};
        Object.keys(clientDict).map(id => {
            this.clients[id] = { id, name: clientDict[id].name };
        });
        console.log(`Clients loaded: ${this.getClients().length}`);
    }
}
exports.default = ClientManager;
//# sourceMappingURL=ClientManager.js.map