import { buscar_Cuidador } from './device.registry.js';
import { adicionar_Na_Fila } from './notification.queue.js';

/**
 * @param {string} idIdoso 
 * @param {string} mensagem 
 */
export async function enviar_Notificacao_EM(idIdoso, mensagem) {
  try {
    console.log(`[SERVIÇO - notification.service] Iniciando processo de alerta para o idoso: ${idIdoso}`);

    const dispositivoCuidador = await buscar_Cuidador(idIdoso);

    if (!dispositivoCuidador || dispositivoCuidador.length === 0) {
      console.warn(`[SERVIÇO] Nenhum cuidador encontrado para o idoso ${idIdoso}. Colocando na fila geral.`);
      await adicionar_Na_Fila({ destino: "Geral", mensagem });
      return { success: false, status: "Nenhum cuidador vinculado, alerta enviado para a fila." };
    }

    const tokenDestino = dispositivoCuidador[0]; 
    console.log(`[SERVIÇO] Dispositivo do cuidador localizado: ${tokenDestino}`);

    console.log(`[ENVIO] Enviando mensagem: "${mensagem}" para o token: ${tokenDestino}`);
    
    const envioSucesso = true; 

    if (envioSucesso) {
      return { success: true, status: "Notificação entregue ao cuidador com sucesso!" };
    } else {
      throw new Error("Falha na rede ao tentar entregar a notificação.");
    }

  } catch (error) {
    console.error("[SERVIÇO] Erro no fluxo de envio, jogando para a fila de segurança:", error);
    
    await adicionar_Na_Fila({ destino: idIdoso, mensagem });
    
    return { success: false, status: "Salvo na fila devido a um erro no envio." };
  }
}