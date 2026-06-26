const LAT_CEDRO = -6.6074;
const LNG_CEDRO = -39.0622;

document.addEventListener('DOMContentLoaded', () => {
    configurarFluxoMonitoramento();
});

function configurarFluxoMonitoramento() {
    const botaoMapa = document.getElementById('BotaoMapa');
    const visorMapa = document.getElementById('VisorMapa');
    const visorTemp = document.getElementById('VisorTemp');

    if (botaoMapa) {
        botaoMapa.addEventListener('click', async () => {
            
            if (visorMapa) {
                visorMapa.innerHTML = "<div style='padding: 15px; color: white; text-align: center; font-weight: bold;'>Carregando mapa...</div>";
            }
            if (visorTemp) {
                visorTemp.value = "32°C";
            }

            try {
                if (visorMapa) {
                    visorMapa.innerHTML = `
                        <iframe 
                            width="100%" 
                            height="100%" 
                            style="border:0; display:block; border-radius: 4px;" 
                            loading="lazy" 
                            allowfullscreen 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15854.0!2d${LNG_CEDRO}!3d${LAT_CEDRO}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1700000000000">
                        </iframe>
                    `;
                }
            } catch (error) {
                console.error("Erro na exibição:", error);
                if (visorTemp) {
                    visorTemp.value = "--°C";
                }
            }
        });
    }
}