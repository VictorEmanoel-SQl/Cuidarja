document.addEventListener('DOMContentLoaded', () => {
  const cabecalho = document.getElementById("cabecalho");
  const sobreposicao = document.getElementById("sobreposicao");

  let posicaoYInicial = 0;
  let menuAberto = false;
  let emMovimento = false;

  cabecalho.ontouchstart = e => {
    posicaoYInicial = e.touches[0].clientY;
    emMovimento = false;
  };

  cabecalho.ontouchmove = e => {
    const distanciaY = e.touches[0].clientY - posicaoYInicial;
    
    if ((!menuAberto && distanciaY > 0) || (menuAberto && distanciaY < 0)) {
      if (!emMovimento) {
        cabecalho.style.transition = 'none'; 
        emMovimento = true;
      }
      
      const base = menuAberto ? 0 : -60;
      const deslocamentoCompleto = (distanciaY / window.innerHeight) * 100;
      const posicao = Math.max(-60, Math.min(base + deslocamentoCompleto, 0));
      
      requestAnimationFrame(() => {
        if (emMovimento) {
          cabecalho.style.transform = `translateY(${posicao}vh)`;
        }
      });
    }
  };

  cabecalho.ontouchend = e => {
    emMovimento = false;
    cabecalho.style.transition = 'transform 0.6s ease';
    void cabecalho.offsetHeight; 

    const distanciaY = e.changedTouches[0].clientY - posicaoYInicial;

    if (Math.abs(distanciaY) < 15) {
      menuAberto = !menuAberto;
    } else if (!menuAberto && distanciaY > 80) {
      menuAberto = true;
    } else if (menuAberto && distanciaY < -80) {
      menuAberto = false;
    }

    cabecalho.style.transform = menuAberto ? "translateY(0)" : "translateY(-60vh)";
    sobreposicao.classList.toggle("ativa", menuAberto);
  };

  const fecharMenu = (e) => {
    if (e && e.cancelable) e.preventDefault();
    cabecalho.style.transition = 'transform 0.6s ease';
    cabecalho.style.transform = "translateY(-60vh)";
    sobreposicao.classList.remove("ativa");
    menuAberto = false;
  };

  sobreposicao.ontouchend = fecharMenu;
  sobreposicao.onclick = fecharMenu;
});