// scripts/build/watcher.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const webDir = path.join(__dirname, '../../web');
const compilerScript = path.join(__dirname, 'compile-components.js');
const registryFilePath = path.normalize(path.join(webDir, 'core/component-registry.js'));

console.log('👀 [Watcher Windows 11]: Monitorando a pasta /web de perto...');

fs.watch(webDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    const fullPath = path.normalize(path.join(webDir, filename));

    // Blindagem contra loop infinito no Windows
    if (fullPath === registryFilePath) return;

    // Se o Natan salvar HTML ou CSS, dispara a compilação de interface
    if (filename.endsWith('.html') || filename.endsWith('.css')) {
        exec(`node "${compilerScript}"`, (error) => {
            if (error) console.error(`❌ Erro: ${error.message}`);
        });
    }
});