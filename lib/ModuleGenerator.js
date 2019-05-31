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
var ModuleGenerator = /** @class */ (function () {
    function ModuleGenerator() {
        //option variables
        this.generate = this.generate.bind(this);
    }
    ModuleGenerator.prototype.generateModule = function (moduleName) {
        console.log("Generating module " + moduleName + "...");
        var sourceDir = path.join(__dirname, '../source');
        var sources = [
            { path: path.join(sourceDir, 'Controller.js'), name: moduleName + "Controller.js" },
            { path: path.join(sourceDir, 'index.js'), name: "index.js" },
            { path: path.join(sourceDir, 'Repository.js'), name: moduleName + "Repository.js" },
            { path: path.join(sourceDir, 'Routes.js'), name: moduleName + "Routes.js" },
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
        // Adds module to routes
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
    ModuleGenerator.prototype.generate = function (item, itemName) {
        if (item === "module") {
            this.generateModule(itemName);
        }
    };
    return ModuleGenerator;
}());
exports.default = ModuleGenerator;
