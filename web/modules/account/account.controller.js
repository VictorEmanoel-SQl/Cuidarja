   
    const ALTURA_TELA = window.innerHeight;
    document.documentElement.style.setProperty('--vh-fixo', `${ALTURA_TELA}px`);

    const cabecalho = document.getElementById("cabecalho"),
          sobreposicao = document.getElementById("sobreposicao");

    let menuAberto = false;
    let posicaoYInicial = 0;
    let emMovimento = false;

    cabecalho.addEventListener('touchstart', e => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') document.activeElement.blur();
      posicaoYInicial = e.touches[0].clientY;
      emMovimento = false;
    }, { passive: true });

    cabecalho.addEventListener('touchmove', e => {
      const distY = e.touches[0].clientY - posicaoYInicial;
      if ((!menuAberto && distY > 0) || (menuAberto && distY < 0)) {
        if (!emMovimento) { cabecalho.style.transition = 'none'; emMovimento = true; }
        
        const base = menuAberto ? 0 : (ALTURA_TELA * -0.6);
        const posPx = Math.max(ALTURA_TELA * -0.6, Math.min(base + distY, 0));
        
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

    function atualizarMenuVisuais() {
      cabecalho.style.transform = menuAberto ? "translateY(0)" : "translateY(calc(var(--vh-fixo) * -0.6))";
      sobreposicao.classList.toggle("ativa", menuAberto);
    }

    const fecharMenu = (e) => {
      if (e?.cancelable) e.preventDefault();
      if (menuAberto) {
        menuAberto = false;
        atualizarMenuVisuais();
      }
    };

    sobreposicao.addEventListener('touchend', fecharMenu);
    sobreposicao.addEventListener('click', fecharMenu);

   
    document.getElementById('form-conta').addEventListener('submit', e => {
      e.preventDefault();
    });

   
    const inputUploadFoto = document.getElementById('upload-foto-conta');
    const imagemPerfil = document.getElementById('imagem-perfil-conta');

    inputUploadFoto.addEventListener('change', function(event) {
      const arquivo = event.target.files[0];
      if (arquivo) {
        if (imagemPerfil.src.startsWith('blob:')) {
          URL.revokeObjectURL(imagemPerfil.src);
        }
        
        imagemPerfil.src = URL.createObjectURL(arquivo);
      }
    });