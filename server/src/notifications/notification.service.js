import { notificationTemplates } from './notification.templates.js';
import { oneSignalClient } from './onesignal.client.js';
import { deviceRegistry } from './device.registry.js';

class NotificationService {
    async enviarChamado(idIdoso, nomeIdoso, bdConexao) {
        try {
            const buscarIdCuidador = await deviceRegistry.obterCuidadorVinculado(idIdoso, bdConexao);
            
            if (!buscarIdCuidador) {
                throw new Error("Nenhum cuidador vinculado a este dispositivo.");
            }

            const dadosNotificacao = notificationTemplates.idosoChamar(nomeIdoso);
            return await oneSignalClient.sendPush(buscarIdCuidador, dadosNotificacao);

        } catch (error) {
            console.error(`[Erro de interface] Chamado NÃO enviada. Motivo: ${error.message}`);
            throw new Error("Não foi possível enviar o chamado. Verifique sua conexão com a internet.");
        }
    }

    async enviarEmergencia(idIdoso, nomeIdoso, bdConexao) {
        try {
            const buscarIdCuidador = await deviceRegistry.obterCuidadorVinculado(idIdoso, bdConexao);
            
            if (!buscarIdCuidador) {
                throw new Error("Nenhum cuidador vinculado para emergências.");
            }

            const dadosNotificacao = notificationTemplates.idosoEmergencia(nomeIdoso);
            return await oneSignalClient.sendPush(buscarIdCuidador, dadosNotificacao);

        } catch (error) {
            console.error(`[Erro Crítico de interface] Emergência NÃO enviada. Motivo: ${error.message}`);
            throw new Error("ALERTA DE EMERGÊNCIA NÃO ENVIADO! Verifique sua conexão imediatamente!");
        }
    }
}

export const notificationService = new NotificationService();