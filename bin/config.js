"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var packageJson = __importStar(require("../package.json"));
var config = {
    output: "mini_node_modules/"
};
if (packageJson["mini-npm-config"]) {
    Object.assign(config, packageJson["mini-npm-config"]);
}
exports.default = config;
