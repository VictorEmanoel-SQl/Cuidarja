// web/core/module-loader.js
import { ComponentRegistry } from './component-registry.js';

export const ModuleLoader = {
    currentController: null,

    async load(moduleName, containerId = 'view-viewport') {
        const viewport = document.getElementById(containerId);
        if (!viewport) return;

        const component = ComponentRegistry[moduleName];
        if (!component) return console.error(`[Loader]: Módulo ${moduleName} não registrado.`);

        // 1. Limpeza de memória (Evita duplicar eventos do Socket.io)
        if (this.currentController && typeof this.currentController.destroy === 'function') {
            this.currentController.destroy();
        }

        // 2. Cria o Wrapper com o atributo de escopo de CSS do Natan
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-module', moduleName);
        wrapper.className = 'module-wrapper';
        wrapper.innerHTML = `<style>${component.css}</style>${component.html}`;

        // 3. Injeção instantânea no DOM (Sem Lag de renderização no Capacitor)
        viewport.innerHTML = '';
        viewport.appendChild(wrapper);

        // 4. Carrega a lógica de forma assíncrona (Lazy Loading)
        const controllerMod = await component.controller();
        this.currentController = controllerMod.default || controllerMod;

        // 5. Inicializa o Controller passando o elemento HTML correspondente
        if (typeof this.currentController.init === 'function') {
            this.currentController.init(wrapper);
        }
    }
};