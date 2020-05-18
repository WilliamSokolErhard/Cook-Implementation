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
const moment = require("moment");
class TaskLogger {
    constructor(logDir) {
        this.logDir = logDir;
        this.logToConsole = true;
        this.logFileName = "";
        this.markerFileName = "";
        this.reportFileName = "";
        this.logStream = null;
    }
    logEvent(event) {
        if (!this.logToConsole && !this.logStream) {
            return;
        }
        const time = moment(event.time).format("YYYY-MM-DD HH:mm:ss");
        const level = (event.level.toUpperCase() + " ").substring(0, 5);
        const module = event.module[0].toUpperCase() + event.module.substring(1);
        const sender = event.sender ? `'${event.sender}' ` : "";
        const message = `${time} ${level} ${module} ${sender}${event.message}`;
        if (this.logToConsole) {
            if (event.level === "debug") {
                console.debug(message);
            }
            else if (event.level === "error") {
                console.error(message);
            }
            else {
                console.info(message);
            }
        }
        if (this.logStream) {
            this.logStream.write(message + "\n");
        }
    }
    taskDone(report, error) {
        this.writeReportFile(report);
        this.writeMarkerFile(error);
        this.enableConsoleLog(false);
        this.enableReportFile(false);
        this.enableMarkerFile(false);
        return this.enableLogFile(false);
    }
    enableConsoleLog(state) {
        this.logToConsole = state;
    }
    enableReportFile(reportFileName) {
        if (reportFileName) {
            this.reportFileName = reportFileName;
        }
        else {
            this.reportFileName = "";
        }
    }
    enableMarkerFile(markerFileName) {
        if (markerFileName) {
            this.markerFileName = markerFileName;
        }
        else {
            this.markerFileName = "";
        }
    }
    enableLogFile(logFileName) {
        return new Promise((resolve, reject) => {
            if (this.logStream) {
                this.logStream.end(() => {
                    this.createLogFile(logFileName);
                    resolve();
                });
            }
            else {
                this.createLogFile(logFileName);
                resolve();
            }
        });
    }
    createLogFile(logFileName) {
        if (logFileName) {
            this.logFileName = logFileName;
            const logFilePath = path.resolve(this.logDir, logFileName);
            this.logStream = fs.createWriteStream(logFilePath);
        }
        else {
            this.logFileName = "";
            this.logStream = null;
        }
    }
    writeReportFile(report) {
        if (!report) {
            console.warn("TaskLogger.writeReportFile - no report available to write.");
            return;
        }
        if (this.reportFileName) {
            const jsonReport = JSON.stringify(report);
            const reportFilePath = path.resolve(this.logDir, this.reportFileName);
            fs.writeFileSync(reportFilePath, jsonReport);
        }
    }
    writeMarkerFile(error) {
        if (this.markerFileName) {
            const mfp = path.resolve(this.logDir, this.markerFileName);
            const filePath = path.resolve(path.dirname(mfp), path.basename(mfp, path.extname(mfp)) + (error ? "_FAILURE" : "_SUCCESS") + path.extname(mfp));
            fs.writeFileSync(filePath, error ? JSON.stringify(error) : "");
        }
    }
}
exports.default = TaskLogger;
//# sourceMappingURL=TaskLogger.js.map