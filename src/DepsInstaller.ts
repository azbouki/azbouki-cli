var exec = require('child_process').exec;

export default class DepsInstaller {

    constructor() {
        //option variables
    }

    public installDeps() {
        console.log(`Installing dependencies...`);
        const dir = exec("npm install", function(err:any, stdout:any, stderr:any) {
            if (err) {
                console.error(err);
            }
            console.log(stdout);
        });

        dir.on('exit', function (code:any) {
            // exit code is code
        });
    }
}