class RouteEngine {
    constructor() {
        this.rotas = {};
    }

    init() {
        console.log("RouteEngine: Motor de rotas inicializado.");
        
        window.addEventListener('hashchange', () => this.gerenciarRoteamento());
        
        this.gerenciarRoteamento();
    }

    async gerenciarRoteamento() {
        const caminho = window.location.hash || '#/home'; 
        console.log(`Rota requisitada: ${caminho}`);
        
        const containerApp = document.getElementById('app');
        if (!containerApp) {
            console.error("Erro: Elemento container '#app' não foi encontrado no HTML.");
            return;
        }

        if (caminho === '#/home' || caminho === '#/') {
            console.log("Conectando o núcleo à pasta 'home'...");
            try {
                const moduloHome = await import('../modules/home/home.routes.js');
            } catch (error) {
                console.error("Erro ao renderizar o front da pasta home:", error);
                containerApp.innerHTML = `<p style="color: red;">Erro ao carregar a página inicial.</p>`;
            }
        }
    }

    navegar(caminho) {
        window.location.hash = caminho;
    }
}

export const motorDeRotas = new RouteEngine();
