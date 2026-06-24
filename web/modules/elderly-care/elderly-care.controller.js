import { firebaseDb, ref } from "../../config/firebase.config.js";
import { onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let monitorMapa;       
let marcadorIdoso;     

export function iniciarMonitoramentoIdoso() {
  const caminhoBanco = ref(firebaseDb, "localizacao_idoso");

  onValue(caminhoBanco, (instantaneo) => {
    const dadosGps = instantaneo.val();

    if (!dadosGps) {
      return;
    }

    const latDoIdoso = dadosGps.latitude;
    const lngDoIdoso = dadosGps.longitude;
    const posicaoAtual = { lat: latDoIdoso, lng: lngDoIdoso };

    if (!monitorMapa) {
      monitorMapa = new google.maps.Map(document.getElementById("VisorMapa"), {
        center: posicaoAtual,
        zoom: 17,
      });

      marcadorIdoso = new google.maps.Marker({
        position: posicaoAtual,
        map: monitorMapa,
        title: "Dispositivo Monitorado",
        animation: google.maps.Animation.DROP
      });
    } else {
      marcadorIdoso.setPosition(posicaoAtual);
      monitorMapa.panTo(posicaoAtual);
    }
  });
}