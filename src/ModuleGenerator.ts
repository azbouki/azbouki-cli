import * as fs from 'fs';
import * as path from 'path'
var ncp = require('ncp').ncp;

export default class ModuleGenerator {

    sourceDir: string;

    constructor() {
        //option variables
        this.generate = this.generate.bind(this);
        this.sourceDir = path.join(__dirname, '../source');
    }

    generateModule(moduleName: string) {
        console.log(`Generating module ${moduleName}...`);

        this.copyModuleTemplate(moduleName);
        this.addModuleToRoutes(moduleName, false);
    }

    copyModuleTemplate(moduleName: string) {

        const sources = [
            { path: path.join(this.sourceDir, 'Controller.js'), name: `${moduleName}Controller.js`},
            { path: path.join(this.sourceDir, 'index.js'), name: `index.js`},
            { path: path.join(this.sourceDir, 'Repository.js'), name: `${moduleName}Repository.js`},
            { path: path.join(this.sourceDir, 'Routes.js'), name: `${moduleName}Routes.js`},
        ];

        const newDirPath = path.join('./', moduleName);

        if (!fs.existsSync(newDirPath)){
            fs.mkdirSync(newDirPath);
        }

        sources.forEach(source => {

            fs.readFile(source.path, 'utf8', function (err:any, tpl:string) {

                if (err) {
                    console.error(err);
                }
                const newContent = tpl.replace(/Placeholder/g, moduleName);

                // TODO: folder name should be capital
                fs.writeFile(path.join(newDirPath, source.name), newContent, function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log(`created ${source.name}`);
                });

            });

        });
    }

    addModuleToRoutes(moduleName: string, withApp: boolean) {

        const routesIndex = path.join('./routes', 'index.js');
        fs.readFile(routesIndex, 'utf8', function (err:any, content:string) {

            if (err) {
                console.error(err);
            }

            const str = `MODULES \n const ${moduleName.toLowerCase()} = require(pathServer + '${moduleName}')(${withApp ? 'app' : ''}); \n router.use(config.apiPrefix + '/${moduleName.toLowerCase()}', ${moduleName.toLowerCase()});\n`;

            const newContent = content.replace(/MODULES/g, str);

            fs.writeFile(routesIndex, newContent, function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log(`routes added for module ${moduleName}`);
            });

        });

    }

    copyAuthModuleTemplate() {
        const moduleName = "User";
        const newDirPath = path.join('./', moduleName);

        if (!fs.existsSync(newDirPath)){
            fs.mkdirSync(newDirPath);
        }

        ncp(path.join(this.sourceDir, "User"), newDirPath, function (err: any) {
            if (err) {
              return console.error(err);
            }
            console.log('done!');
           });
    }

    generateAuth() {
        console.log("Generating basic auth...");

        this.copyAuthModuleTemplate();
        this.addModuleToRoutes("User", true);

    }

    public generate(item: string, itemName: string) {
        if (item === "module") {
            this.generateModule(itemName);
        } else if (item === "auth") {
            this.generateAuth();
        }
    }
}