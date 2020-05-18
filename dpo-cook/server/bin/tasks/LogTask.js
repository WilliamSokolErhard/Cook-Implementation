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
const Task_1 = require("../app/Task");
/**
 * Provides logging facilities (log to console, log to file, write report to file).
 *
 * Log files can't be delivered to the client using the delivery task since they are
 * incomplete at the time the delivery task runs.
 *
 * Parameters: [[ILogTaskParameters]]
 */
class LogTask extends Task_1.default {
    constructor(options, context) {
        super(options, context);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.parameters;
            const logger = this.context.logger;
            logger.enableConsoleLog(params.logToConsole);
            logger.enableLogFile(params.logFile);
            logger.enableReportFile(params.reportFile);
            logger.enableMarkerFile(params.markerFile);
            // mention output files in report result, so they can be picked up later
            const result = this.report.result;
            const files = result.files = (result.files || {});
            if (params.logFile) {
                files["log"] = params.logFile;
            }
            if (params.reportFile) {
                files["report"] = params.reportFile;
            }
            if (params.markerFile) {
                files["marker"] = params.markerFile;
            }
            return Promise.resolve();
        });
    }
}
exports.default = LogTask;
LogTask.taskName = "Log";
LogTask.description = "Provides logging facilities (log to console, log to file, write report to file).";
LogTask.parameterSchema = {
    type: "object",
    properties: {
        logToConsole: {
            type: "boolean",
            default: true
        },
        logFile: {
            type: "string"
        },
        reportFile: {
            type: "string"
        },
        markerFile: {
            type: "string"
        }
    }
};
LogTask.parameterValidator = Task_1.default.jsonValidator.compile(LogTask.parameterSchema);
//# sourceMappingURL=LogTask.js.map