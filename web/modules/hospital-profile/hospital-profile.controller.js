  const alturaFixa = window.innerHeight;
    document.documentElement.style.setProperty('--altura-fixa', `${alturaFixa}px`);

    const telas = document.getElementById("telas"),
          indicadores = document.querySelectorAll("#paginacao span"),
          cabecalho = document.getElementById("cabecalho"),
          sobreposicao = document.getElementById("sobreposicao");

    function alternarFormularioDetails(idAlvo) {
      const idsConfig = ['detalhe-cuidador', 'detalhe-idoso'];
      
      idsConfig.forEach(id => {
        const elementoDetails = document.getElementById(id);
        const areaAnimada = elementoDetails.querySelector('.conteudo-animado');
        
        if (id === idAlvo) {
          if (!elementoDetails.hasAttribute('open')) {
            elementoDetails.setAttribute('open', '');
            elementoDetails.classList.add('girar-seta');
            setTimeout(() => {
              areaAnimada.style.maxHeight = '42vh';
              areaAnimada.style.opacity = '1';
            }, 10);
          } else {
            areaAnimada.style.maxHeight = '0';
            areaAnimada.style.opacity = '0';
            elementoDetails.classList.remove('girar-seta');
            
            setTimeout(() => {
              if (areaAnimada.style.maxHeight === '0px') {
                elementoDetails.removeAttribute('open');
              }
            }, 600);
          }
        } else {
          if (elementoDetails.hasAttribute('open')) {
            areaAnimada.style.maxHeight = '0';
            areaAnimada.style.opacity = '0';
            elementoDetails.classList.remove('girar-seta');
            setTimeout(() => {
              if (areaAnimada.style.maxHeight === '0px') {
                elementoDetails.removeAttribute('open');
              }
            }, 600);
          }
        }
      });
    }

    document.querySelectorAll('.cartao-details summary').forEach(gatilho => {
      gatilho.addEventListener('click', (evento) => {
        evento.preventDefault();
        const idDoDetails = gatilho.parentElement.id;
        alternarFormularioDetails(idDoDetails);
      });
    });

    let indiceAtual = 0; 
    let posicaoXInicial = 0;
    let posicaoYInicial = 0;
    let menuAberto = false;
    let emMovimento = false;

    const ehInterativo = target => ['INPUT', 'BUTTON', 'A', 'SUMMARY', 'SELECT'].includes(target.tagName);

    telas.style.transform = `translateX(0vw)`;

    telas.ontouchstart = e => {
      if(menuAberto || ehInterativo(e.target)) return;
      posicaoXInicial = e.touches[0].clientX;
    }

    telas.ontouchend = e => {
      if(menuAberto || ehInterativo(e.target)) return;
      
      const dist = posicaoXInicial - e.changedTouches[0].clientX;
      indiceAtual += dist > 50 && indiceAtual < indicadores.length - 1 ? 1 : dist < -50 && indiceAtual > 0 ? -1 : 0;
      
      telas.style.transition = 'transform 0.5s ease-out';
      telas.style.transform = `translateX(${-indiceAtual * 100}vw)`;
      indicadores.forEach((ind, idx) => ind.classList.toggle("ativo", idx === indiceAtual));
    }

    cabecalho.ontouchstart = e => {
      if (['INPUT', 'SELECT'].includes(document.activeElement.tagName)) document.activeElement.blur();
      posicaoYInicial = e.touches[0].clientY;
      emMovimento = false;
    }

    cabecalho.ontouchmove = e => {
      const distY = e.touches[0].clientY - posicaoYInicial;
      
      if ((!menuAberto && distY > 0) || (menuAberto && distY < 0)) {
        if (!emMovimento) { cabecalho.style.transition = 'none'; emMovimento = true; }
        
        const base = menuAberto ? 0 : (alturaFixa * -0.6);
        const posPx = Math.max(alturaFixa * -0.6, Math.min(base + distY, 0));
        
        requestAnimationFrame(() => { 
          if (emMovimento) cabecalho.style.transform = `translateY(${posPx}px)`; 
        });
      }
    }

    cabecalho.ontouchend = e => {
      emMovimento = false;
      cabecalho.style.transition = 'transform 0.6s ease';
      void cabecalho.offsetHeight; 
      
      const distY = e.changedTouches[0].clientY - posicaoYInicial;

      if (Math.abs(distY) < 15) menuAberto = !menuAberto;
      else if (!menuAberto && distY > 80) menuAberto = true;
      else if (menuAberto && distY < -80) menuAberto = false;

      cabecalho.style.transform = menuAberto ? "translateY(0)" : "translateY(calc(var(--altura-fixa) * -0.6))";
      sobreposicao.classList.toggle("ativa", menuAberto);
    }

    const fecharMenu = (e) => {
      if (e?.cancelable) e.preventDefault();
      cabecalho.style.transition = 'transform 0.6s ease';
      cabecalho.style.transform = "translateY(calc(var(--altura-fixa) * -0.6))";
      sobreposicao.classList.remove("ativa");
      menuAberto = false;
    }

    sobreposicao.ontouchend = fecharMenu;
    sobreposicao.onclick = fecharMenu;

    let last = 0;
    document.addEventListener('touchstart', e => {
      if (!ehInterativo(e.target) && e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', e => {
      if(ehInterativo(e.target)) return;
      if (performance.now() - last < 300) e.preventDefault();
      last = performance.now();
    });