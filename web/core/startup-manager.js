import { moduleLoader } from './module-loader.js';
import { routeEngine } from './route-engine.js';

class StartupManager {
    async init() {
        console.log("StartupManager: Iniciando a engrenagem principal do CuidarJá...");
        try {
            await moduleLoader.loadModules();
            
            routeEngine.init();
            
            console.log("CuidarJá inicializado com sucesso!");
        } catch (error) {
            console.error("Falha crítica durante a inicialização do app:", error);
        }
    }
}

export const startupManager = new StartupManager();