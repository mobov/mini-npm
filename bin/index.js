#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var packageJson = __importStar(require("../package.json"));
var download_packs_1 = __importDefault(require("./download-packs"));
commander_1.default
    .version(packageJson["version"])
    .command('install').action(function () {
    download_packs_1.default(packageJson.dependencies);
});
commander_1.default.on('--help', function () {
    console.log('');
    console.log('    install    install packages');
    console.log('    add        add package');
    console.log('');
});
commander_1.default.parse(process.argv);
