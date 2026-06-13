/**
 * @param {string} idCuidador 
 * @param {string} tokenOneSignal 
 */
export async function guardar_Cuidador(idCuidador, tokenOneSignal) {
  try {
    
    console.log(`[BD - device.registry] Salvando dispositivo do Cuidador (ID: ${idCuidador})...`);
    
    return { query: "Sucesso, dispositivo salvo no Banco de Dados..." };
  } catch (error) {
    console.error("Erro, nao foi possivel salvar o dispositivo no Banco de Dados:", error);
    throw error;
  }
}
/**
 * @param {string} idIdoso 
 * @returns {Promise<Array>} 
 */
export async function buscar_Cuidador(idIdoso) {
  try {

    console.log(`[BD - device.registry] Buscando no Banco de Dados o cuidador vinculado ao idoso: ${idIdoso}`);

    // SIMULAÇÃO: Valor temporário pra testar o sistema antes de conectar ao BD original
    const dispositivo_BD = ["88888888-4444-4444-4444-121212121212"]; 
    
    return dispositivo_BD;
  } catch (error) {
    console.error("Erro ao buscar dispositivo no Banco de Dados:", error);
    throw error;
  }
}