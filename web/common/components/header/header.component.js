import { motorDeRotas } from '../../../core/route-engine.js'; 

document.addEventListener('DOMContentLoaded', () => {
  const cabecalho = document.getElementById("cabecalho");
  const sobreposicao = document.getElementById("sobreposicao");
  const navegacao = document.querySelector(".navegacao-principal");

  let posicaoYInicial = 0;
  let menuAberto = false;
  let emMovimento = false;

  const fecharMenu = () => {
    cabecalho.style.transition = 'transform 0.6s ease';
    cabecalho.style.transform = "translateY(-60vh)";
    sobreposicao.classList.remove("ativa");
    menuAberto = false;
  };

  navegacao.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.tagName === 'BUTTON') {
      const mapaRotas = {
        'btn-configuracoes': '#/elderly-care', 
        'btn-home': '#/home',
        'btn-conta': '#/conta',
        'btn-perfil-hospitalar': '#/perfil-hospitalar',
        'btn-loja': '#/loja',
        'btn-agradecimentos': '#/agradecimentos'
      };
      
      const destino = mapaRotas[e.target.id];
      if (destino) {
        motorDeRotas.navegar(destino); 
        fecharMenu();
      }
    }
  });

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
        if (emMovimento) cabecalho.style.transform = `translateY(${posicao}vh)`;
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

  sobreposicao.ontouchend = fecharMenu;
  sobreposicao.onclick = fecharMenu;
});