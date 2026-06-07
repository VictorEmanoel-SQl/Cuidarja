import { initHomeController, destroyHomeController } from './home.controller.js';

class HomeRoutes {
    constructor() {
        this.appContainer = document.getElementById('app');
    }

    async init() {
        console.log("Módulo Home: Conectando Core ao Controller...");
        
        try {
            destroyHomeController();

            const response = await fetch('/web/modules/home/home.view.html');
            if (!response.ok) throw new Error(`Erro ao carregar HTML: ${response.status}`);
            
            const htmlText = await response.text();
            this.appContainer.innerHTML = htmlText;

            if (!document.getElementById('home-style')) {
                const link = document.createElement('link');
                link.id = 'home-style';
                link.rel = 'stylesheet';
                link.href = '/web/modules/home/home.style.css';
                document.head.appendChild(link);
            }

            setTimeout(() => {
                initHomeController();
                console.log("Componentes interativos ativados com sucesso!");
            }, 50);
            
            console.log("Core conectado com sucesso à Home.");
        } catch (error) {
            console.error("Erro ao conectar o Core à estrutura da Home:", error);
        }
    }
}

const homeRoutes = new HomeRoutes();
homeRoutes.init();