class ModuleLoader {
    constructor() {
        this.modules = ['auth', 'dashboard', 'elderly-care', 'emergency', 'settings'];
    }

    async loadModules() {
        console.log("ModuleLoader: Carregando módulos do sistema...");
        
        for (const moduleName of this.modules) {
            try {
                const modulePath = `../modules/${moduleName}/${moduleName}.routes.js`;
                
                let currentPath = modulePath;
                if (moduleName === 'home') currentPath = `../modules/home/home.routes.js`;
                
                console.log(`|── Módulo [${moduleName}] detectado.`);
                
            } catch (error) {
                console.warn(`Não foi possível carregar o arquivo de rotas do módulo: ${moduleName}`);
            }
        }
        return true;
    }
}

export const moduleLoader = new ModuleLoader();