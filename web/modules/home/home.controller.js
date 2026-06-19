import { homeState } from './home.state.js';
import { 
  calcularProximoIndice, 
  calcularDeslocamentoCabecalho, 
  determinarEstadoFinalMenu 
} from './home.domain.js';

let telas, indicadores, cabecalho, sobreposicao;

function gerarCodigoSeisDigitos() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

export function initHomeController() {
  telas = document.getElementById("telas");
  indicadores = document.querySelectorAll("#paginacao span");
  cabecalho = document.getElementById("cabecalho");
  sobreposicao = document.getElementById("sobreposicao");

  if (!telas || !cabecalho || !sobreposicao) return;

  homeState.reset();
  telas.style.transform = `translateX(-100vw)`;

  const botaoGerar = document.getElementById('botao-gerar-id');
  const caixaOutputId = document.getElementById('input-receber-id');

  if (botaoGerar && caixaOutputId) {
    botaoGerar.addEventListener('click', () => {
      const novoId = gerarCodigoSeisDigitos();
      caixaOutputId.textContent = novoId;
      botaoGerar.disabled = true;
      botaoGerar.style.opacity = "0.5";
      botaoGerar.style.cursor = "not-allowed";
    });
  }

  const botaoConectar = document.getElementById('botao-confirmar-id');
  const inputId = document.getElementById('input-escrever-id');

  if (botaoConectar && inputId) {
    botaoConectar.addEventListener('click', () => {
      const idDigitado = inputId.value.trim();

      if (!idDigitado || idDigitado.length !== 6) {
        alert("Por favor, insira um código de identificação válido com 6 caracteres!");
        return;
      }

      alert("Erro: Usuário não encontrado!");
    });
  }

  telas.addEventListener("touchstart", tratarTouchStartTelas, { passive: true });
  telas.addEventListener("touchend", tratarTouchEndTelas, { passive: true });

  cabecalho.addEventListener("touchstart", tratarTouchStartCabecalho, { passive: true });
  cabecalho.addEventListener("touchmove", tratarTouchMoveCabecalho, { passive: false });
  cabecalho.addEventListener("touchend", tratarTouchEndCabecalho, { passive: true });

  sobreposicao.addEventListener("touchend", fecharMenu, { passive: false });
  sobreposicao.addEventListener("click", fecharMenu);
}

export function destroyHomeController() {
  if (telas) {
    telas.removeEventListener("touchstart", tratarTouchStartTelas);
    telas.removeEventListener("touchend", tratarTouchEndTelas);
  }
  if (cabecalho) {
    cabecalho.removeEventListener("touchstart", tratarTouchStartCabecalho);
    cabecalho.removeEventListener("touchmove", tratarTouchMoveCabecalho);
    cabecalho.removeEventListener("touchend", tratarTouchEndCabecalho);
  }
  if (sobreposicao) {
    sobreposicao.removeEventListener("touchend", fecharMenu);
    sobreposicao.removeEventListener("click", fecharMenu);
  }
}

function tratarTouchStartTelas(e) {
  if (homeState.menuAberto) return;
  homeState.posicaoXInicial = e.touches[0].clientX;
}

function tratarTouchEndTelas(e) {
  if (homeState.menuAberto) return;

  homeState.indiceAtual = calcularProximoIndice(
    homeState.posicaoXInicial,
    e.changedTouches[0].clientX,
    homeState.indiceAtual,
    indicadores.length
  );

  telas.style.transform = `translateX(${-homeState.indiceAtual * 100}vw)`;
  
  indicadores.forEach(ind => ind.classList.remove("ativo"));
  if (indicadores[homeState.indiceAtual]) {
    indicadores[homeState.indiceAtual].classList.add("ativo");
  }
}

function tratarTouchStartCabecalho(e) {
  homeState.posicaoYInicial = e.touches[0].clientY;
  homeState.emMovimento = false;
}

function tratarTouchMoveCabecalho(e) {
  const posicaoYAtual = e.touches[0].clientY;
  const distanciaY = posicaoYAtual - homeState.posicaoYInicial;

  if ((!homeState.menuAberto && distanciaY > 0) || (homeState.menuAberto && distanciaY < 0)) {
    if (!homeState.emMovimento) {
      cabecalho.style.transition = 'none'; 
      homeState.emMovimento = true;
    }

    const posicaoVh = calcularDeslocamentoCabecalho(
      homeState.posicaoYInicial,
      posicaoYAtual,
      homeState.menuAberto,
      window.innerHeight
    );
    
    requestAnimationFrame(() => {
      if (homeState.emMovimento) {
        cabecalho.style.transform = `translateY(${posicaoVh}vh)`;
      }
    });
  }
}

function tratarTouchEndCabecalho(e) {
  homeState.emMovimento = false;
  cabecalho.style.transition = 'transform 0.6s ease';
  void cabecalho.offsetHeight; 

  homeState.menuAberto = determinarEstadoFinalMenu(
    homeState.posicaoYInicial,
    e.changedTouches[0].clientY,
    homeState.menuAberto
  );

  cabecalho.style.transform = homeState.menuAberto ? "translateY(0)" : "translateY(-60vh)";
  sobreposicao.classList.toggle("ativa", homeState.menuAberto);
}

function fecharMenu(e) {
  if (e && e.cancelable) e.preventDefault();
  cabecalho.style.transition = 'transform 0.6s ease';
  cabecalho.style.transform = "translateY(-60vh)";
  sobreposicao.classList.remove("ativa");
  homeState.menuAberto = false;
}