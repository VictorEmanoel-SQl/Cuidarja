import { initHomeController, destroyHomeController } from './home.controller.js';

class HomeRoutes {
    constructor() {
        this.appContainer = document.getElementById('app');
    }

    async init() {
        try {
            destroyHomeController();

            const response = await fetch('/web/modules/home/home.view.html');
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            
            const htmlText = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const conteudo = doc.body.innerHTML;
            this.appContainer.innerHTML = conteudo;

            const estiloExistente = document.getElementById('home-style');
            if (estiloExistente) estiloExistente.remove();

            const link = document.createElement('link');
            link.id = 'home-style';
            link.rel = 'stylesheet';
            link.href = '/web/modules/home/home.style.css';
            document.head.appendChild(link);

            setTimeout(() => {
                initHomeController();
            }, 50);
        } catch (error) {
            console.error("Erro na rota Home:", error);
        }
    }
}

const homeRoutes = new HomeRoutes();
homeRoutes.init();