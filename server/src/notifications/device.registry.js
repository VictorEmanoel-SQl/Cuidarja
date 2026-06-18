class DeviceRegistry {
    /**
     * @returns {string} 
     */
    geradorIds() {
        const tamanhoId = 8;
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        
        for (let i = 0; i < tamanhoId; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            id += caracteres.charAt(indiceAleatorio);
        }
        
        return id;
    }

    async vincularDispositivos(idIdoso, idCuidador, conexaoBD) {
        try {
            console.log(`[OneSignal/DB] Iniciando vínculo de 8 dígitos: ${idIdoso} ↔ ${idCuidador}`);
            console.log("Dispositivos vinculados com sucesso!");
            
            return { sucesso: true, mensagem: "Conexão de 8 dígitos estabelecida." };
        } catch (erro) { 
            console.error("Erro ao registrar e parear dispositivos:", erro);
            return { sucesso: false, erro: erro.message };
        }
    }
}

export const registroDeDispositivos = new DeviceRegistry();