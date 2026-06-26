document.addEventListener("DOMContentLoaded", () => {
    const visorTemp = document.getElementById("VisorTemp");

    if (visorTemp) {
        visorTemp.style.display = "none";
    }

    window.addEventListener("coordenadasIdosoProntas", async (e) => {
        const lat = e.detail.lat;
        const lng = e.detail.lng;

        if (visorTemp) {
            visorTemp.style.display = "block";
            visorTemp.value = "Buscando clima...";
        }

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
            const response = await fetch(url);
            const dados = await response.json();

            if (visorTemp && dados.current_weather) {
                visorTemp.value = dados.current_weather.temperature + "°C";
            }
        } catch (error) {
            if (visorTemp) {
                visorTemp.value = "Erro";
            }
        }
    });
});

export function inicializarModuloTemperatura() {
}