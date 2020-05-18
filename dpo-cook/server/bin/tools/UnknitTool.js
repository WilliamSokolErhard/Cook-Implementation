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
const uniqueId_1 = require("../utils/uniqueId");
const Tool_1 = require("../app/Tool");
class UnknitTool extends Tool_1.default {
    setupInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = instance.settings;
            const inputFilePath = instance.getFilePath(settings.inputMeshFile);
            if (!inputFilePath) {
                throw new Error("missing input mesh file");
            }
            const outputFilePath = instance.getFilePath(settings.outputMeshFile);
            if (!outputFilePath) {
                throw new Error("missing output mesh file");
            }
            // stringify puts strings in quotes and escapes special characters
            const inputFileString = JSON.stringify(inputFilePath);
            const outputFileString = JSON.stringify(outputFilePath);
            // MaxScript automation for Autodesk 3ds Max
            const script = {
                fileName: "_3dsmax_unknit_" + uniqueId_1.default() + ".ms",
                content: [
                    "resetMaxFile #noprompt",
                    `importFile ${inputFileString} #noPrompt`,
                    "completeRedraw()",
                    "rollout automation \"Automation Script\"",
                    "(",
                    "  timer clock \"my\" interval:1000",
                    "  on clock tick do",
                    "  (",
                    "    clock.active = false",
                    "    setCommandPanelTaskMode #modify",
                    "    unknitModifier = UVW_Unknit()",
                    "    modPanel.addModToSelection (unknitModifier) ui:on",
                    "    $.modifiers[#UVW_Unknit].packUVs = 1",
                    `    $.modifiers[#UVW_Unknit].stretchValue = ${settings.stretchValue}`,
                    "    $.modifiers[#UVW_Unknit].UVChannel = 1",
                    `    $.modifiers[#UVW_Unknit].packSize = ${settings.mapSize}`,
                    `    $.modifiers[#UVW_Unknit].packIterations = ${settings.packIterations}`,
                    `    $.modifiers[#UVW_Unknit].packRotations = ${settings.packRotations}`,
                    `    $.modifiers[#UVW_Unknit].packAllowFlip = ${settings.packAllowFlip ? "on" : "off"}`,
                    `    $.modifiers[#UVW_Unknit].packExtend = ${settings.packExtend ? "on" : "off"}`,
                    "    completeRedraw()",
                    "    $.modifiers[#UVW_Unknit].Apply()",
                    `    exportFile ${outputFileString} #noPrompt`,
                    "    quitMax #noPrompt",
                    "  )",
                    ")",
                    "createDialog automation"
                ].join("\n")
            };
            const silentOptions = settings.showUI ? "" : "-q -silent -mip";
            const scriptFilePath = instance.getFilePath(script.fileName);
            const command = `"${this.configuration.executable}" ${silentOptions} -U MAXScript "${scriptFilePath}"`;
            return instance.writeFile(script.fileName, script.content).then(() => ({ command, script }));
        });
    }
}
exports.default = UnknitTool;
UnknitTool.toolName = "Unknit";
UnknitTool.defaultOptions = {
    mapSize: 2048,
    stretchValue: 1,
    packIterations: 40,
    packRotations: 8,
    packAllowFlip: true,
    packExtend: true,
    showUI: false
};
//# sourceMappingURL=UnknitTool.js.map