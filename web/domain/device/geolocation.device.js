import { firebaseDb, ref, set } from "../../config/firebase.config.js";

export function rastreamentoIdoso() {
  if ("geolocation" in navigator) {
    
    navigator.geolocation.watchPosition(
      (dadosGps) => {
        const lat = dadosGps.coords.latitude;
        const lng = dadosGps.coords.longitude;

        set(ref(firebaseDb, "localizacao_idoso"), {
          latitude: lat,
          longitude: lng,
          ultima_atualizacao: new Date().toISOString()
        })
        .then(() => {
          console.log(`Sucesso! GPS na nuvem: Lat ${lat} | Lng ${lng}`);
        })
        .catch((erro) => {
          console.error("Erro ao enviar para o Firebase:", erro);
        });
      },
      (erro) => {
        console.error("Erro ao ler o GPS nativo:", erro);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );

  } else {
    console.error("GPS não suportado neste aparelho.");
  }
}