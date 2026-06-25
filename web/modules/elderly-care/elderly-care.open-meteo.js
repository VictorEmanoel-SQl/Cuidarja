async function buscarTemperatura(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Erro ao consultar a API Open-Meteo.");
  }
  
  const dados = await resposta.json();
  return dados.current_weather.temperature;
}

export function inicializarModuloTemperatura(latitude, longitude) {
  const botao = document.getElementById("BotaoTemp");
  const visor = document.getElementById("VisorTemp");

  if (!botao || !visor) return;

  botao.addEventListener("click", async () => {
    try {
      visor.innerText = "Carregando...";
      
      const temp = await buscarTemperatura(latitude, longitude);
      visor.innerText = `${temp}°C`;
    } catch (erro) {
      console.error("Erro no módulo de temperatura:", erro);
      visor.innerText = "Erro ao buscar";
    }
  });
}