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
var fs = __importStar(require("fs"));
var config_1 = __importDefault(require("./config"));
var compressing_1 = __importDefault(require("compressing"));
var path_1 = __importDefault(require("path"));
var shelljs_1 = __importDefault(require("shelljs"));
var listr_1 = __importDefault(require("listr"));
var packageJson = require(path_1.default.resolve(process.cwd(), './package.json'));
var resolveTgzName = function (name, version) {
    name = name.replace(/@/g, '').replace(/\//, '-');
    return (name + "-" + version + ".tgz").replace('\n', '').replace('\t', '');
};
var resolveVersion = function (version) {
    if (version.indexOf('^') !== -1) {
        version = version.substring(1, version.length);
    }
    return version;
};
var getPackLists = function (data) {
    var result = [];
    if (data instanceof Array) {
        result = data.map(function (x) {
            var name = x;
            var version = '';
            var splitIndex = x.lastIndexOf('@');
            if (splitIndex > 0) {
                name = x.substr(0, splitIndex);
                version = x.substr(splitIndex + 1, x.length);
            }
            return {
                name: name,
                version: version
            };
        });
    }
    else {
        result = Object.keys(data).map(function (x) { return ({
            name: x,
            version: resolveVersion(data[x])
        }); });
    }
    return result;
};
/**
 * 获取包最新版本
 * @param name 包名
 */
var getPackLastVersion = function (name) {
    // const getTarball = (str: string): string => {
    //   const regex = new RegExp(/tarball: '(.*?)'/, 'g')
    //   const arr = str.match(regex)
    //   const result = arr[0].substring(10, arr[0].length - 1)
    //   console.log(result)
    //   return result
    // }
    // const getVersion = (str: string): string => {
    //   const regex = new RegExp(/version: '(.*?)'/, 'g')
    //   const arr = str.match(regex)
    //   const result = arr[0].substring(10, arr[0].length - 1)
    //   return result
    // }
    return new Promise(function (resolve, reject) {
        shelljs_1.default.exec("npm view " + name + " version", { silent: true }, function (code, data) {
            if (code === 0) {
                // const version = getVersion(data)
                resolve(data);
            }
            else {
                reject();
            }
        });
    });
};
/**
 * 写入包依赖
 * @param name 包名
 * @param version 包版本
 */
var writeDependencie = function (name, version) {
    if (packageJson.dependencies[name] &&
        packageJson.dependencies[name] === "^" + version) {
        return;
    }
    else {
        packageJson.dependencies[name] = "^" + version;
        fs.writeFileSync('../package.json', JSON.stringify(packageJson, null, 4));
    }
};
/**
 * 解压包
 * @param name 包名
 * @param version 包版本
 */
var unzipPack = function (name, version) {
    return new Promise(function (resolve, reject) {
        var filePath = path_1.default.resolve("./" + resolveTgzName(name, version));
        shelljs_1.default.rm('-rf', name + "/*");
        compressing_1.default.tgz
            .uncompress(filePath, name)
            .then(function (res) {
            shelljs_1.default.mv('-f', name + "/package/*", "" + name);
            shelljs_1.default.rm('-rf', name + "/package");
            shelljs_1.default.rm('-rf', filePath);
            resolve('unziped');
        })
            .catch(function (err) {
            reject();
        });
    });
};
/**
 * 下载包
 * @param name 包名
 * @param version 包版本
 */
var downloadPack = function (name, version) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var packageJsonPath, handleDowload, sourcePackage;
        return __generator(this, function (_a) {
            packageJsonPath = "./" + name + "/package.json";
            handleDowload = function () {
                shelljs_1.default.exec("npm pack " + name + "@" + version, { silent: true }, function (code, data) {
                    if (code === 0) {
                        resolve('downloaded');
                    }
                    else {
                        reject();
                    }
                });
            };
            if (fs.existsSync(name)) {
                shelljs_1.default.mkdir('-p', name);
            }
            // 判断是否存在
            if (fs.existsSync(packageJsonPath)) {
                sourcePackage = fs.readFileSync(packageJsonPath);
                sourcePackage = JSON.parse(sourcePackage);
                // 判断是否需要更新
                if (resolveVersion(sourcePackage.version) === version) {
                    resolve('exist');
                }
                else {
                    handleDowload();
                }
            }
            else {
                handleDowload();
            }
            return [2 /*return*/];
        });
    }); });
};
/**
 * 添加任务管道
 * @param name 包名
 * @param version 包版本
 */
var handleAdd = function (name, version) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var status_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    if (!!version) return [3 /*break*/, 2];
                    return [4 /*yield*/, getPackLastVersion(name)];
                case 1:
                    version = _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, downloadPack(name, version)];
                case 3:
                    status_1 = _a.sent();
                    if (!(status_1 === 'downloaded')) return [3 /*break*/, 5];
                    return [4 /*yield*/, unzipPack(name, version)];
                case 4:
                    status_1 = _a.sent();
                    _a.label = 5;
                case 5:
                    writeDependencie(name, version);
                    resolve();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    reject(err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
};
var handleRemove = function (name) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            shelljs_1.default.rm('-rf', "" + name);
            if (packageJson.dependencies[name]) {
                delete packageJson.dependencies[name];
            }
            fs.writeFileSync('../package.json', JSON.stringify(packageJson, null, 4));
            resolve();
            return [2 /*return*/];
        });
    }); });
};
/**
 * 安装
 * @param list 依赖
 */
function install(list) {
    var packLists = getPackLists(list);
    if (packLists.length > 0) {
        shelljs_1.default.mkdir('-p', path_1.default.resolve(config_1.default.output));
        shelljs_1.default.cd(path_1.default.resolve(config_1.default.output));
    }
    else {
        return;
    }
    var tasks = new listr_1.default(packLists.map(function (x) {
        return {
            title: "install " + x.name,
            task: function () { return handleAdd(x.name, x.version); }
        };
    }));
    return tasks
        .run()
        .then(function () {
        console.log("  ");
        console.log("   mini-npm run success!");
    })
        .catch(function (err) {
        console.error(err);
    });
    // return Promise.all(listMap.map(async (x) => await handleAdd(x, resolveVersion(list[x])))).then(res => {
    //   console.log(`mini-npm run success!`)
    //   return res
    // })
}
exports.install = install;
/**
 * 添加
 * @param name
 */
function add(list) {
    var packLists = getPackLists(list);
    if (packLists.length > 0) {
        shelljs_1.default.mkdir('-p', path_1.default.resolve(config_1.default.output));
        shelljs_1.default.cd(path_1.default.resolve(config_1.default.output));
    }
    else {
        return;
    }
    var tasks = new listr_1.default(packLists.map(function (x) {
        return {
            title: "install " + x.name,
            task: function () { return handleAdd(x.name, x.version); }
        };
    }));
    return tasks
        .run()
        .then(function () {
        console.log("  ");
        console.log("   mini-npm run success!");
    })
        .catch(function (err) {
        console.error(err);
    });
}
exports.add = add;
function remove(list) {
    var packLists = getPackLists(list);
    if (packLists.length > 0) {
        shelljs_1.default.mkdir('-p', path_1.default.resolve(config_1.default.output));
        shelljs_1.default.cd(path_1.default.resolve(config_1.default.output));
    }
    else {
        return;
    }
    var tasks = new listr_1.default(packLists.map(function (x) {
        return {
            title: "remove " + x.name,
            task: function () { return handleRemove(x.name); }
        };
    }));
    return tasks
        .run()
        .then(function () {
        console.log("  ");
        console.log("   mini-npm run success!");
    })
        .catch(function (err) {
        console.error(err);
    });
}
exports.remove = remove;
