//processo de identificar o idoso e achar o cuidador vinculdo

import { modelosDeNotificacao } from './notification.templates.js';
import { clienteOneSignal } from './onesignal.client.js';
import { registroDeDispositivos } from './device.registry.js';

class NotificationService {
    async enviarChamado(idIdoso, nomeIdoso, bdConexao) {
        try {
            const buscarIdCuidador = await registroDeDispositivos.obterCuidadorVinculado(idIdoso, bdConexao);
            
            if (!buscarIdCuidador) {
                throw new Error("Nenhum cuidador vinculado a este dispositivo.");
            }

            const dadosNotificacao = modelosDeNotificacao.idosoChamar(nomeIdoso);
            return await clienteOneSignal.enviarPush(buscarIdCuidador, dadosNotificacao);

        } catch (erro) {
            console.error(`[Erro de interface] Chamado NÃO enviada. Motivo: ${erro.message}`);
            throw new Error("Não foi possível enviar o chamado. Verifique sua conexão com a internet.");
        }
    }

    async enviarEmergencia(idIdoso, nomeIdoso, bdConexao) {
        try {
            const buscarIdCuidador = await registroDeDispositivos.obterCuidadorVinculado(idIdoso, bdConexao);
            
            if (!buscarIdCuidador) {
                throw new Error("Nenhum cuidador vinculado para emergências.");
            }

            const dadosNotificacao = modelosDeNotificacao.idosoEmergencia(nomeIdoso);
            return await clienteOneSignal.enviarPush(buscarIdCuidador, dadosNotificacao);

        } catch (erro) {
            console.error(`[Erro Crítico de interface] Emergência NÃO enviada. Motivo: ${erro.message}`);
            throw new Error("ALERTA DE EMERGÊNCIA NÃO ENVIADO! Verifique sua conexão imediatamente!");
        }
    }
}

export const servicoNotificacao = new NotificationService();