 const cabecalho = document.getElementById("cabecalho"),
          sobreposicao = document.getElementById("sobreposicao");

    let menuAberto = false;
    let modalAbertoAtual = null;
    let timerEmergenciaInterval = null;
    let posicaoYInicial = 0;
    let emMovimento = false;

    cabecalho.ontouchstart = e => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') document.activeElement.blur();
      posicaoYInicial = e.touches[0].clientY;
      emMovimento = false;
    }

    cabecalho.ontouchmove = e => {
      if (modalAbertoAtual) return; 
      
      const vh = window.innerHeight;
      const distY = e.touches[0].clientY - posicaoYInicial;
      if ((!menuAberto && distY > 0) || (menuAberto && distY < 0)) {
        if (!emMovimento) { cabecalho.style.transition = 'none'; emMovimento = true; }
        
        const base = menuAberto ? 0 : (vh * -0.6);
        const posPx = Math.max(vh * -0.6, Math.min(base + distY, 0));
        
        requestAnimationFrame(() => { 
          if (emMovimento) cabecalho.style.transform = `translateY(${posPx}px)`; 
        });
      }
    }

    cabecalho.ontouchend = e => {
      if (modalAbertoAtual) return;
      emMovimento = false;
      cabecalho.style.transition = 'transform 0.6s ease';
      void cabecalho.offsetHeight; 
      
      const distY = e.changedTouches[0].clientY - posicaoYInicial;

      if (Math.abs(distY) < 15) menuAberto = !menuAberto;
      else if (!menuAberto && distY > 80) menuAberto = true;
      else if (menuAberto && distY < -80) menuAberto = false;

      atualizarMenuVisuais();
    }

    function atualizarMenuVisuais() {
      cabecalho.style.transform = menuAberto ? "translateY(0)" : "translateY(-60dvh)";
      if(!modalAbertoAtual) {
        sobreposicao.classList.toggle("ativa", menuAberto);
      }
    }

    function abrirModal(idModal) {
      if (menuAberto) return; 
      
      const modal = document.getElementById(idModal);
      if (!modal) return;

      modalAbertoAtual = modal;
      sobreposicao.classList.add("ativa");
      modal.classList.add("aberto");

      if (idModal === 'janela-emergencia') {
        iniciarContadorEmergencia();
      }
    }

    function fecharModais() {
      if (modalAbertoAtual) {
        modalAbertoAtual.classList.remove("aberto");
        modalAbertoAtual = null;
      }
      
      if (!menuAberto) {
        sobreposicao.classList.remove("ativa");
      }
      
      pararContadorEmergencia();
    }

    const fecharMenuOuModal = (e) => {
      if (e?.cancelable) e.preventDefault();
      if (modalAbertoAtual) {
        fecharModais();
      } else if (menuAberto) {
        menuAberto = false;
        atualizarMenuVisuais();
      }
    };

    sobreposicao.ontouchend = fecharMenuOuModal;
    sobreposicao.onclick = fecharMenuOuModal;

    function iniciarContadorEmergencia() {
      let tempo = 6;
      const displayContador = document.getElementById("contador-emergencia");
      const estadoContador = document.getElementById("estado-contador-emergencia");
      const estadoConfirmado = document.getElementById("estado-confirmado-emergencia");

      estadoContador.classList.remove("escondido");
      estadoConfirmado.classList.add("escondido");
      displayContador.textContent = "06";

      pararContadorEmergencia();

      timerEmergenciaInterval = setInterval(() => {
        tempo--;
        displayContador.textContent = `0${tempo}`;

        if (tempo <= 0) {
          pararContadorEmergencia();
          estadoContador.classList.add("escondido");
          estadoConfirmado.classList.remove("escondido");
        }
      }, 1000);
    }

    function pararContadorEmergencia() {
      if (timerEmergenciaInterval) {
        clearInterval(timerEmergenciaInterval);
        timerEmergenciaInterval = null;
      }
    }