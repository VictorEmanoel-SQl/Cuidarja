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

        try {
            if (caminho === '#/home' || caminho === '#/') {
                console.log("Conectando o núcleo à pasta 'home'...");
                await import('../modules/home/home.routes.js');
            } 
            else if (caminho === '#/elderly-care') {
                console.log("Conectando o núcleo à pasta 'elderly-care'...");
                await import('../modules/elderly-care/elderly.routes.js');
            }
        } catch (error) {
            console.error("Erro ao renderizar o módulo:", error);
            containerApp.innerHTML = `<p style="color: red;">Erro ao carregar a página.</p>`;
        }
    }

    navegar(caminho) {
        window.location.hash = caminho;
    }
}

export const motorDeRotas = new RouteEngine();