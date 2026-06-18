class ModuleLoader {
    constructor() {
        this.modulos = ['auth', 'dashboard', 'elderly-care', 'emergency', 'settings'];
    }

    async carregarModulos() {
        console.log("ModuleLoader: Carregando módulos do sistema...");
        
        for (const nomeModulo of this.modulos) {
            try {
                const caminhoModulo = `../modules/${nomeModulo}/${nomeModulo}.routes.js`;
                
                let caminhoAtual = caminhoModulo;
                if (nomeModulo === 'home') caminhoAtual = `../modules/home/home.routes.js`;
                
                console.log(`|── Módulo [${nomeModulo}] detectado.`);
                
            } catch (error) {
                console.warn(`Não foi possível carregar o arquivo de rotas do módulo: ${nomeModulo}`);
            }
        }
        return true;
    }
}

export const carregadorDosModulos = new ModuleLoader();