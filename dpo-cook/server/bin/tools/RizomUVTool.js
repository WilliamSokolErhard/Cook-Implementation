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
const path = require("path");
const uniqueId_1 = require("../utils/uniqueId");
const Tool_1 = require("../app/Tool");
class RizomUVTool extends Tool_1.default {
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
            const outputFileExt = path.extname(outputFilePath);
            const outputFileBase = outputFilePath.substring(0, outputFilePath.length - outputFileExt.length);
            const saveOperations = [];
            if (outputFileExt === ".obj" || settings.saveObj) {
                saveOperations.push(`ZomSave({File={Path=${JSON.stringify(outputFileBase + ".obj")}, UVWProps=true, FBX={FormatDescriptor="Alias OBJ (*.obj)"}}, __UpdateUIObjFileName=true})`);
            }
            if (outputFileExt === ".fbx" || settings.saveFbx) {
                saveOperations.push(`ZomSave({File={Path=${JSON.stringify(outputFileBase + ".fbx")}, UVWProps=true, FBX={FormatDescriptor="FBX binary (*.fbx)"}}, __UpdateUIObjFileName=true})`);
            }
            if (outputFileExt === ".dae" || settings.saveCollada) {
                saveOperations.push(`ZomSave({File={Path=${JSON.stringify(outputFileBase + ".dae")}, UVWProps=true, FBX={FormatDescriptor="Collada DAE (*.dae)"}}, __UpdateUIObjFileName=true})`);
            }
            if (saveOperations.length === 0) {
                throw new Error("no save operation specified, result won't be saved");
            }
            const content = [
                `ZomResetPrefs(none)`,
                `ZomLoad({File={Path=${JSON.stringify(inputFilePath)}, ImportGroups=true, XYZ=true}, NormalizeUVW=true})`,
                `-- auto-select seams using mosaic algorithm --`,
                `ZomSelect({PrimType="Edge", Select=true, ResetBefore=true, WorkingSetPrimType="Island", ProtectMapName="Protect", FilterIslandVisible=true, Auto={QuasiDevelopable={Developability=${settings.cutSegmentationStrength}, IslandPolyNBMin=2, FitCones=false, Straighten=true}, HandleCutter=true, StretchLimiter=true, SkeletonUnoverlap={SegLevel=1, FromRoot=true, Smooth=2}, FlatteningMode=0, SQS=0.0357143, SQP=0.5, AQS=0.000178571, AQP=0.5}})`,
                //`ZomSelect({PrimType="Edge", Select=true, ResetBefore=true, WorkingSetPrimType="Island", ProtectMapName="Protect", FilterIslandVisible=true, Auto={QuasiDevelopable={Developability=${options.cutSegmentationStrength}, IslandPolyNBMin=1, FitCones=false, Straighten=true}, HandleCutter=${options.cutHandles}}})`,
                `ZomCut({PrimType="Edge"})`,
                `-- unwrap --`,
                `ZomUnfold({PrimType="Edge", MinAngle=1e-05, Mix=1, Iterations=5, PreIterations=5, StopIfOutOFDomain=false, RoomSpace=0, PinMapName="Pin", ProcessNonFlats=true, ProcessSelection=true, ProcessAllIfNoneSelected=true, ProcessJustCut=true, BorderIntersections=true, TriangleFlips=true})`,
                `-- pack --`,
                `ZomIslandGroups({Mode="DistributeInTilesByBBox", MergingPolicy=8322})`,
                `ZomIslandGroups({Mode="DistributeInTilesEvenly", MergingPolicy=8322, UseTileLocks=true, UseIslandLocks=true})`,
                `ZomPack({ProcessTileSelection=false, RootGroup="RootGroup", RecursionDepth=1, MaxMutations=1, Resolution=500, MarginSize=2/1024, SpacingSize=4/1024, Scaling={Mode=2}, Rotate={Min=0, Max=180, Step=30}, Translate=true, LayoutScalingMode=2})`,
                `-- save mesh --`,
                saveOperations.join("\n"),
                `ZomQuit()`
            ].join("\n");
            const fileName = "_rizomuv_" + uniqueId_1.default() + ".lua";
            const command = `"${this.configuration.executable}" -cfi "${instance.getFilePath(fileName)}"`;
            return instance.writeFile(fileName, content).then(() => ({
                command,
                script: { fileName, content }
            }));
        });
    }
}
exports.default = RizomUVTool;
RizomUVTool.toolName = "RizomUV";
RizomUVTool.defaultOptions = {
    cutSegmentationStrength: 0.65,
    cutHandles: false,
    rizomIterations: 5,
    rizomNoTriangleFlips: true,
    rizomNoBorderIntersections: true,
    packResolution: 500,
    packMutations: 1,
    packMargin: 2 / 1024,
    packSpacing: 4 / 1024,
    packRotateMin: 0,
    packRotateMax: 180,
    packRotateStep: 30
};
//# sourceMappingURL=RizomUVTool.js.map