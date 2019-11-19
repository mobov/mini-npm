#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var commander_1 = __importDefault(require("commander"));
var core_1 = require("./core");
var packageJson = require('../package.json');
commander_1.default.version(packageJson['version'])
    .command('install')
    .description('安装依赖(install packages)')
    .action(function () {
    var targetPackage = require(path_1.default.resolve(process.cwd(), './package.json'));
    core_1.install(targetPackage.dependencies);
});
commander_1.default.version(packageJson['version'])
    .command('add <pack...>')
    .description('添加依赖(add packages)')
    .action(function (pack) {
    core_1.add(pack);
});
commander_1.default.version(packageJson['version'])
    .command('remove <pack...>')
    .description('移除依赖(remove packages)')
    .action(function (pack) {
    core_1.remove(pack);
});
// todo://添加新增包命令和操作
// .on('--help', function () {
//   console.log('')
//   console.log('    install    install packages')
//   console.log('    add        add package')
//   console.log('')
// })
commander_1.default.parse(process.argv);
