document.addEventListener("DOMContentLoaded", () => {

  function ajustarViewport() {
    const altura = window.innerHeight;
    document.documentElement.style.setProperty('--vh-fixo', `${altura}px`);
  }


  ajustarViewport();

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(ajustarViewport, 100);
  });

  const cabecalho = document.getElementById("cabecalho");
  const sobreposicao = document.getElementById("sobreposicao");

  let menuAberto = false;
  let posicaoYInicial = 0;
  let emMovimento = false;

  if (cabecalho && sobreposicao) {
    
    cabecalho.addEventListener('touchstart', e => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        document.activeElement.blur();
      }
      posicaoYInicial = e.touches[0].clientY;
      emMovimento = false;
    }, { passive: true });

    cabecalho.addEventListener('touchmove', e => {
      const distY = e.touches[0].clientY - posicaoYInicial;
      if ((!menuAberto && distY > 0) || (menuAberto && distY < 0)) {
        if (!emMovimento) { 
          cabecalho.style.transition = 'none'; 
          emMovimento = true; 
        }
        
        const ALTURA_ATUAL = window.innerHeight;
        const base = menuAberto ? 0 : (ALTURA_ATUAL * -0.6);
        const posPx = Math.max(ALTURA_ATUAL * -0.6, Math.min(base + distY, 0));
        
        requestAnimationFrame(() => { 
          if (emMovimento) cabecalho.style.transform = `translateY(${posPx}px)`; 
        });
      }
    }, { passive: true });

    cabecalho.addEventListener('touchend', e => {
      emMovimento = false;
      cabecalho.style.transition = 'transform 0.6s ease';
      void cabecalho.offsetHeight; 
      
      const distY = e.changedTouches[0].clientY - posicaoYInicial;

      if (Math.abs(distY) < 15) menuAberto = !menuAberto;
      else if (!menuAberto && distY > 80) menuAberto = true;
      else if (menuAberto && distY < -80) menuAberto = false;

      atualizarMenuVisuais();
    });

    sobreposicao.addEventListener('touchend', fecharMenu);
    sobreposicao.addEventListener('click', fecharMenu);
  }

  function atualizarMenuVisuais() {
    if (cabecalho && sobreposicao) {
      cabecalho.style.transform = menuAberto ? "translateY(0)" : "translateY(calc(var(--vh-fixo) * -0.6))";
      sobreposicao.classList.toggle("ativa", menuAberto);
    }
  }

  function fecharMenu(e) {
    if (e?.cancelable) e.preventDefault();
    if (menuAberto) {
      menuAberto = false;
      atualizarMenuVisuais();
    }
  }
});
