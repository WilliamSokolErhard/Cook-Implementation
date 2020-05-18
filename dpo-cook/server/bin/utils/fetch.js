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
const fetch = require("node-fetch");
exports.default = {
    json: function (url, method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data && typeof data !== "string") {
                data = JSON.stringify(data);
            }
            const params = {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                method: method,
                credentials: "include",
                body: data
            };
            return fetch(url, params).then(result => {
                if (!result.ok) {
                    const message = `fetch.json (${method} at '${url}'), error: ${result.status} - ${result.statusText}`;
                    console.warn(message);
                    throw new Error(message);
                }
                return result.json();
            }).catch(error => {
                console.warn(`fetch.json (${method} at '${url}'), error: ${error.message}`);
                throw error;
            });
        });
    },
    text: function (url, method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                headers: {
                    "Accept": "text/plain",
                    "Content-Type": "text/plain",
                },
                method: method,
                credentials: "include",
                body: data
            };
            return fetch(url, params).then(result => {
                if (!result.ok) {
                    const message = `fetch.text (${method} at '${url}'), error: ${result.status} - ${result.statusText}`;
                    console.warn(message);
                    throw new Error(message);
                }
                return result.text();
            }).catch(error => {
                console.warn(`fetch.text (${method} at '${url}'), error: ${error.message}`);
                throw error;
            });
        });
    },
    file: function (url, method, file, detectType = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                method,
                credentials: "include",
                body: file
            };
            if (!detectType) {
                params.headers = {
                    "Content-Type": "application/octet-stream"
                };
            }
            return fetch(url, params).then(result => {
                if (!result.ok) {
                    const message = `fetch.file (${method} at '${url}'), error: ${result.status} - ${result.statusText}`;
                    console.warn(message);
                    throw new Error(message);
                }
                return result;
            }).catch(error => {
                console.warn(`fetch.file (${method} at '${url}'), error: ${error.message}`);
                throw error;
            });
        });
    },
    buffer: function (url, method, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                headers: {
                    "Accept": "application/octet-stream",
                    "Content-Type": "application/octet-stream"
                },
                method,
                credentials: "include",
                body: buffer
            };
            return fetch(url, params).then(result => {
                if (!result.ok) {
                    const message = `fetch.buffer (${method} at '${url}'), error: ${result.status} - ${result.statusText}`;
                    console.warn(message);
                    throw new Error(message);
                }
                return result.buffer();
            }).catch(error => {
                console.warn(`fetch.buffer (${method} at '${url}'), error: ${error.message}`);
                throw error;
            });
        });
    }
};
//# sourceMappingURL=fetch.js.map