# azbouki-cli

Install: `npm i -g <path to cloned repo>`

Run: `azb generate <module-name>`


# Roadmap:

1. `azb create <app-name>` - generates empty Express application with all the necessary boilerplate:
	- index.js
	- main router
	- database connection(by default mysql); more on that below
	
2. `azb generate module <module-name>`, e.g. `azb generate module patient` - generates index.js, controller, repository and routes for the newly created module. If no flags provided the files will have boilerplate only. Flags can initially be:
	- --model, e.g. `azb generate module patient -- model patient name:string email:string age:number` - this will create the necessary table in the schema

3. `azb generate model <model-name>` - creates the model only. Flags:
	- --module, e.g. `azb generate model patient --module patient` generates the model within the `patient` module

**NB!** If the model is generated within a module the CLI will create the crud methods automatically otherwise it will create the db tables only.

4. `azb scaffold patient` - creates the crud methods and router endpoints for the patient model

5. **azb.config.js** the project metadata file 

6. Database flags. Initially we will support mysql only but in future there might be an option as `azb create <app-name> --db mongodb`.