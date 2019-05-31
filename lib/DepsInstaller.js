"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exec = require('child_process').exec;
var DepsInstaller = /** @class */ (function () {
    function DepsInstaller() {
        //option variables
    }
    DepsInstaller.prototype.installDeps = function () {
        console.log("Installing dependencies...");
        var dir = exec("npm install", function (err, stdout, stderr) {
            if (err) {
                console.error(err);
            }
            console.log(stdout);
        });
        dir.on('exit', function (code) {
            // exit code is code
        });
    };
    return DepsInstaller;
}());
exports.default = DepsInstaller;
