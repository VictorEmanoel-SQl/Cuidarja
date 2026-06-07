document.addEventListener('DOMContentLoaded', () => {
  const telas = document.getElementById("telas");
  const indicadores = document.querySelectorAll("#paginacao span");

  let indiceAtual = 1;
  let posicaoXInicial = 0;

  // Inicia na tela central
  telas.style.transform = `translateX(-100vw)`;

  telas.ontouchstart = e => {
    // Checagem segura caso o menu exista e esteja aberto
    const sobreposicao = document.getElementById("sobreposicao");
    if(sobreposicao && sobreposicao.classList.contains('ativa')) return;
    
    posicaoXInicial = e.touches[0].clientX;
  };

  telas.ontouchend = e => {
    const sobreposicao = document.getElementById("sobreposicao");
    if(sobreposicao && sobreposicao.classList.contains('ativa')) return;

    const distanciaX = posicaoXInicial - e.changedTouches[0].clientX;
    
    indiceAtual += distanciaX > 50 && indiceAtual < indicadores.length - 1 ? 1 : 
                   distanciaX < -50 && indiceAtual > 0 ? -1 : 0;

    telas.style.transform = `translateX(${-indiceAtual * 100}vw)`;
    
    indicadores.forEach(indicador => indicador.classList.remove("ativo"));
    if(indicadores[indiceAtual]) {
      indicadores[indiceAtual].classList.add("ativo");
    }
  };
});