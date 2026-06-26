document.addEventListener("DOMContentLoaded", () => {
    const botaoMapa = document.getElementById("BotaoMapa");
    const visorMapa = document.getElementById("VisorMapa");

    if (botaoMapa) {
        botaoMapa.addEventListener("click", async () => {
            if (visorMapa) {
                visorMapa.innerHTML = "Localizando dispositivo do idoso...";
            }

            try {
                const response = await fetch("/api/dispositivo/localizar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
                
                if (!response.ok) throw new Error("Erro ao solicitar localização");
                
                const coordenadasIdoso = await response.json();
                const lat = coordenadasIdoso.latitude;
                const lng = coordenadasIdoso.longitude;

                if (visorMapa && window.google && window.google.maps) {
                    const localizacao = { lat: lat, lng: lng };
                    const mapa = new google.maps.Map(visorMapa, {
                        zoom: 16,
                        center: localizacao,
                    });
                    new google.maps.Marker({
                        position: localizacao,
                        map: mapa,
                    });
                }

                const eventoCoordenadas = new CustomEvent("coordenadasIdosoProntas", {
                    detail: { lat: lat, lng: lng }
                });
                window.dispatchEvent(eventoCoordenadas);

            } catch (error) {
                console.error("Erro no fluxo de localização:", error);
                if (visorMapa) {
                    visorMapa.innerHTML = "Erro ao obter localização do idoso.";
                }
            }
        });
    }
});