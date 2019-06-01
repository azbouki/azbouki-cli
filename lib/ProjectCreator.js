"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var AdmZip = require('adm-zip');
var fs = require('fs');
var ProjectCreator = /** @class */ (function () {
    function ProjectCreator() {
        //option variables
    }
    ProjectCreator.prototype.createProject = function (projectName) {
        if (!projectName) {
            console.error("Please specify project name!");
            return;
        }
        if (fs.existsSync("./" + projectName)) {
            console.error("Directory " + projectName + " already exists!");
            return;
        }
        var tplName = 'azb-template-js-1.0.0';
        var tplPath = path.join(__dirname, '../templates/' + (tplName + ".zip"));
        var zip = new AdmZip(tplPath);
        zip.extractAllTo("./", false);
        fs.renameSync("./" + tplName, "./" + projectName);
        console.log("Successfully created project " + projectName + "!");
    };
    return ProjectCreator;
}());
exports.default = ProjectCreator;
