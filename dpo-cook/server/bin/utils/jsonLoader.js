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
const commentJSON = require("comment-json");
const Ajv = require("ajv");
function create(schemaOrPath, useDefaults) {
    if (typeof schemaOrPath === "string") {
        try {
            schemaOrPath = JSON.parse(fs.readFileSync(schemaOrPath, "utf8"));
        }
        catch (e) {
            throw new Error(`failed to load schema from '${schemaOrPath}': ${e.message}`);
        }
    }
    const jsonValidator = new Ajv({ useDefaults: true, allErrors: true });
    const validate = jsonValidator.compile(schemaOrPath);
    return function (filePath) {
        let json, data;
        try {
            json = fs.readFileSync(filePath, "utf8");
        }
        catch (e) {
            throw new Error(`failed to load '${filePath}': ${e.message}`);
        }
        try {
            data = commentJSON.parse(json, null, true);
        }
        catch (e) {
            throw new Error(`failed to parse '${filePath}': ${e.message}`);
        }
        if (!validate(data)) {
            const text = jsonValidator.errorsText(validate.errors, { separator: ", " });
            const errorText = `failed to validate '${filePath}': ${text}`;
            throw new Error(errorText);
        }
        return data;
    };
}
exports.create = create;
function validate(filePath, schemaOrPath, useDefaults) {
    const validate = create(schemaOrPath, useDefaults);
    return validate(filePath);
}
exports.validate = validate;
//# sourceMappingURL=jsonLoader.js.map