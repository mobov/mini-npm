#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var packageJson = __importStar(require("../package.json"));
var fetch_packs_1 = __importDefault(require("./fetch-packs"));
fetch_packs_1.default(packageJson.dependencies);
console.log(packageJson);
// console.log(packageJson)
// program
// .version('0.0.1')
// .commnad()
