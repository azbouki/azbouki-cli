export default class ModuleGenerator {
    sourceDir: string;
    constructor();
    generateModule(moduleName: string): void;
    copyModuleTemplate(moduleName: string): void;
    addModuleToRoutes(moduleName: string): void;
    copyAuthModuleTemplate(): void;
    generateAuth(): void;
    generate(item: string, itemName: string): void;
}
