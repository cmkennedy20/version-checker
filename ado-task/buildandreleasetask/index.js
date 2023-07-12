"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var tl = require('azure-pipelines-task-lib/task');
var request = require("request");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var language, file, result, _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    language = tl.getInput('Language', true);
                    file = tl.getInput('PackageFile', true);
                    result = new Boolean;
                    if (language == undefined) {
                        tl.setResult(tl.TaskResult.Failed, 'No language was given');
                        return [2 /*return*/];
                    }
                    if (file == undefined) {
                        tl.setResult(tl.TaskResult.Failed, 'No language was given');
                        return [2 /*return*/];
                    }
                    _a = language;
                    switch (_a) {
                        case "Dotnet": return [3 /*break*/, 1];
                        case "Node": return [3 /*break*/, 3];
                        case "Angular": return [3 /*break*/, 4];
                        case "Terraform": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 1: return [4 /*yield*/, getLatestDotnetVersion(file)];
                case 2:
                    result = _b.sent();
                    console.log("The color is red.");
                    return [3 /*break*/, 7];
                case 3:
                    console.log("The color is blue.");
                    return [3 /*break*/, 7];
                case 4:
                    console.log("The color is green.");
                    return [3 /*break*/, 7];
                case 5:
                    console.log("The color is green.");
                    return [3 /*break*/, 7];
                case 6: return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _b.sent();
                    tl.setResult(tl.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function getLatestDotnetVersion(currentVersion) {
    var upToDate = false;
    // Declare local variables
    var url = "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/releases-index.json";
    var releaseList = [{}];
    // Extract the two-digit major version (ex. 3.1, 6.0, 8.0, etc.)
    var parsedVersion = currentVersion.split(".");
    var appMajorVersion = parsedVersion[0] + "." + parsedVersion[1];
    return new Promise(function (resolve, reject) {
        // Execute HTTP GET request to pull all available versions
        request(url, function (error, response, body) {
            if (error) {
                console.error("Error:", error);
                reject(error);
                return;
            }
            var data = JSON.parse(body);
            // Parse the existing release list
            var releasesIndex = data["releases-index"];
            // Record all existing versions and their URLs
            for (var _i = 0, releasesIndex_1 = releasesIndex; _i < releasesIndex_1.length; _i++) {
                var release = releasesIndex_1[_i];
                releaseList[0][release["channel-version"]] = release["releases.json"];
            }
            // Pull the release specific information for the version in question
            request(releaseList[0][appMajorVersion], function (error, response, body) {
                if (error) {
                    console.error("Error:", error);
                    reject(error);
                    return;
                }
                var minorVersionData = JSON.parse(body);
                var latestMinorVersion = minorVersionData["latest-release"];
                // Check if the version has reached EOL
                if (minorVersionData["support-phase"] === "eol") {
                    console.log("End of Life");
                }
                else {
                    console.log("Major version in LTS");
                }
                if (parseInt(parsedVersion[2]) <= parseInt(latestMinorVersion.split(".")[2])) {
                    console.log("The minor version is outdated and should be updated. The latest version is ".concat(latestMinorVersion, " and this app is currently running ").concat(currentVersion));
                }
                else {
                    console.log("The minor version is up to date");
                    upToDate = true;
                }
                resolve(upToDate);
            });
        });
    });
}
run();
