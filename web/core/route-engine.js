class RouteEngine {
    constructor() {
        this.routes = {};
    }

    init() {
        console.log("RouteEngine: Motor de rotas inicializado.");
        window.addEventListener('hashchange', () => this.handleRouting());
        this.handleRouting();
    }

    async handleRouting() {
        const path = window.location.hash || '#/home'; 
        console.log(`Rota requisitada: ${path}`);
        
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error("Erro: Elemento container '#app' não foi encontrado no HTML.");
            return;
        }

        if (path === '#/home' || path === '#/') {
            console.log("Conectando o núcleo à pasta 'home'...");
            try {
                const moduloHome = await import('../modules/home/home.routes.js');
            } catch (error) {
                console.error("Erro ao renderizar o front da pasta home:", error);
                appContainer.innerHTML = `<p style="color: red;">Erro ao carregar a página inicial.</p>`;
            }
        }
    }

    navigate(path) {
        window.location.hash = path;
    }
}

export const routeEngine = new RouteEngine();