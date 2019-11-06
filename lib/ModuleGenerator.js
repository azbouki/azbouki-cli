"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var ncp = require('ncp').ncp;
var ModuleGenerator = /** @class */ (function () {
    function ModuleGenerator() {
        //option variables
        this.generate = this.generate.bind(this);
        this.sourceDir = path.join(__dirname, '../source');
    }
    ModuleGenerator.prototype.generateModule = function (moduleName) {
        console.log("Generating module " + moduleName + "...");
        this.copyModuleTemplate(moduleName);
        this.addModuleToRoutes(moduleName);
    };
    ModuleGenerator.prototype.copyModuleTemplate = function (moduleName) {
        var sources = [
            { path: path.join(this.sourceDir, 'Controller.js'), name: moduleName + "Controller.js" },
            { path: path.join(this.sourceDir, 'index.js'), name: "index.js" },
            { path: path.join(this.sourceDir, 'Repository.js'), name: moduleName + "Repository.js" },
            { path: path.join(this.sourceDir, 'Routes.js'), name: moduleName + "Routes.js" },
        ];
        var newDirPath = path.join('./', moduleName);
        if (!fs.existsSync(newDirPath)) {
            fs.mkdirSync(newDirPath);
        }
        sources.forEach(function (source) {
            fs.readFile(source.path, 'utf8', function (err, tpl) {
                if (err) {
                    console.error(err);
                }
                var newContent = tpl.replace(/Placeholder/g, moduleName);
                // TODO: folder name should be capital
                fs.writeFile(path.join(newDirPath, source.name), newContent, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("created " + source.name);
                });
            });
        });
    };
    ModuleGenerator.prototype.addModuleToRoutes = function (moduleName) {
        var routesIndex = path.join('./routes', 'index.js');
        fs.readFile(routesIndex, 'utf8', function (err, content) {
            if (err) {
                console.error(err);
            }
            var str = "MODULES \n const " + moduleName.toLowerCase() + " = require(pathServer + '" + moduleName + "')(); \n router.use(config.apiPrefix + '/" + moduleName.toLowerCase() + "', " + moduleName.toLowerCase() + ");\n";
            var newContent = content.replace(/MODULES/g, str);
            fs.writeFile(routesIndex, newContent, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("routes added for module " + moduleName);
            });
        });
    };
    ModuleGenerator.prototype.copyAuthModuleTemplate = function () {
        var moduleName = "User";
        var newDirPath = path.join('./', moduleName);
        if (!fs.existsSync(newDirPath)) {
            fs.mkdirSync(newDirPath);
        }
        ncp(path.join(this.sourceDir, "User"), newDirPath, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
        });
    };
    ModuleGenerator.prototype.generateAuth = function () {
        console.log("Generating basic auth...");
        this.copyAuthModuleTemplate();
        this.addModuleToRoutes("User");
    };
    ModuleGenerator.prototype.generate = function (item, itemName) {
        if (item === "module") {
            this.generateModule(itemName);
        }
        else if (item === "auth") {
            this.generateAuth();
        }
    };
    return ModuleGenerator;
}());
exports.default = ModuleGenerator;
