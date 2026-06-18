let last = 0;
document.addEventListener('touchstart', e => e.touches.length > 1 && e.preventDefault(), { passive: false });
document.addEventListener('touchend', e => (performance.now() - last < 300) ? e.preventDefault() : last = performance.now());

import { startupManager } from './startup-manager.js';
import { carregadorDosModulos } from './module-loader.js'; 
import { motorDeRotas } from './route-engine.js'; 

class Application {
    async init() {
        try {
            console.log("CuidarJá: Inicializando o sistema...");

            if (startupManager && typeof startupManager.init === 'function') {
                await startupManager.init();
            }

            if (carregadorDosModulos && typeof carregadorDosModulos.carregarModulos === 'function') {
                await carregadorDosModulos.carregarModulos();
            }

            if (motorDeRotas && typeof motorDeRotas.init === 'function') {
                motorDeRotas.init();
            }

            console.log("CuidarJá: Sistema rodando com sucesso!");
        } catch (error) {
            console.error("Erro crítico ao iniciar a aplicação:", error);
        }
    }
}

const app = new Application();
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});