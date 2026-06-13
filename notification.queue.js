/**
 * @param {Object} notificacao 
 */
export async function adicionar_na_Fila(notificacao) {
  try {
    console.log(`[FILA - notification.queue] Adicionando novo alerta à fila de processamento...`);
    
    // SIMULAÇÃO: Coloca mensagem na fila do BD
    console.log(`/// Alerta para o destino [${notificacao.destino || 'Geral'}] guardado na fila.`);

    return { success: true, mensagem: "Notificação adicionada à fila com sucesso." };
  } catch (error) {
    console.error("Erro ao adicionar notificação na fila:", error);
    throw error;
  }
}

/**
 * @returns {Promise<Object|null>} 
 */
export async function notificacao_Fila() {
  try {
    console.log(`[FILA - notification.queue] Verificando se existem alertas pendentes na fila...`);

    // SIMULAÇÃO: Valores temporários (lembrar de conectar no BD no lugar)
    const proxima_Notificacao = {
      id: "999-fila",
      mensagem: "URGENTE: Alerta de verificação pendente enviado pela fila.",
      destino: "88888888-4444-4444-4444-121212121212" 
    };

    console.log(`/// Próxima notificação encontrada! ID: ${proxima_Notificacao.id}`);
    
    return proxima_Notificacao;
  } catch (error) {
    console.error("Erro ao processar a fila de notificações:", error);
    throw error;
  }
}