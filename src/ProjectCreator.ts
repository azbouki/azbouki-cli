const path = require('path');
var AdmZip = require('adm-zip');
const fs = require('fs');

export default class ProjectCreator {

    constructor() {
        //option variables
    }

    public createProject(projectName: string) {
        if (!projectName) {
            console.error("Please specify project name!");
            return;
        }

        if (fs.existsSync(`./${projectName}`)) {
            console.error(`Directory ${projectName} already exists!`);
            return;
        }

        const tplName = 'azb-template-js-1.0.0';

        const tplPath = path.join(__dirname, '../templates/' + `${tplName}.zip`);

        var zip = new AdmZip(tplPath);

        zip.extractAllTo(`./`, false);

        fs.renameSync(`./${tplName}`, `./${projectName}`);

        console.log(`Successfully created project ${projectName}!`)

    }
}