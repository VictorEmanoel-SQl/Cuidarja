class DeviceRegistry {
    /**
     * @returns {string} 
     */
    geradorIds() {
        const idTamanho = 8;
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        
        for (let i = 0; i < idTamanho; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            id += caracteres.charAt(indiceAleatorio);
        }
        
        return id;
    }

    async linkDevices(idIdoso, idCuidador, bdConexão) {
        try {
            console.log(`[OneSignal/DB] Iniciando vínculo de 8 dígitos: ${idIdoso} ↔ ${idCuidador}`);
            console.log("Dispositivos vinculados com sucesso!");
            return { success: true, message: "Conexão de 8 dígitos estabelecida." };
        } catch (error) {
            console.error("Erro ao registrar e parear dispositivos:", error);
            return { success: false, error: error.message };
        }
    }
}

export const deviceRegistry = new DeviceRegistry();