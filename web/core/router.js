import { destroyHomeController } from '../modules/home/home.controller.js';

const rotas = {
    '/home': '/web/modules/home/home.view.html',
    '/elderly-care': '/web/modules/elderly-care/elderly.view.html',
    '/conta': '/web/modules/conta/conta.view.html',
    '/perfil-hospitalar': '/web/modules/perfil-hospitalar/perfil.view.html',
    '/loja': '/web/modules/loja/loja.view.html',
    '/agradecimentos': '/web/modules/agradecimentos/agradecimentos.view.html'
};

export async function navegarPara(rota) {
    const appContainer = document.getElementById('app');
    
    if (!rotas[rota]) {
        console.warn(`Rota não definida: ${rota}`);
        return;
    }

    if (typeof destroyHomeController === 'function') {
        destroyHomeController();
    }

    try {
        const response = await fetch(rotas[rota]);
        if (!response.ok) throw new Error('Falha ao carregar a página');
        
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        appContainer.innerHTML = doc.body.innerHTML;
        
        window.history.pushState({}, "", rota);
    } catch (error) {
        console.error('Erro na navegação:', error);
        appContainer.innerHTML = '<h1>Erro ao carregar página</h1>';
    }
}