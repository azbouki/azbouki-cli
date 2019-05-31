const Git = require("nodegit");

export default class ProjectCreator {

    constructor() {
        //option variables
    }

    public createProject(projectName: string) {
        if (!projectName) {
            console.error("Please specify project name!");
            return;
        }
        console.log(`Creating project ${projectName} from Project Creator`);
        Git.Clone("https://github.com/tdermendjiev/azb-template-js.git", `./${projectName}`)
            .then(function(repo:any) {
                // Use a known commit sha from this repository.
                console.log(repo);
            })
    }
}