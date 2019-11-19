"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var packageJson = require(path_1.default.resolve('package.json'));
var config = {
    output: 'mini_node_modules/'
};
if (packageJson['mini-npm-config']) {
    Object.assign(config, packageJson['mini-npm-config']);
}
exports.default = config;
