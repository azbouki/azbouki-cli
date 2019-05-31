"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Git = require("nodegit");
var ProjectCreator = /** @class */ (function () {
    function ProjectCreator() {
        //option variables
    }
    ProjectCreator.prototype.createProject = function (projectName) {
        console.log("Creating project " + projectName + " from Project Creator");
        Git.Clone("https://github.com/tdermendjiev/azb-template-js.git", "./" + projectName)
            .then(function (repo) {
            // Use a known commit sha from this repository.
            console.log(repo);
        });
    };
    return ProjectCreator;
}());
exports.default = ProjectCreator;
