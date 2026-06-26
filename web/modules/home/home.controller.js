import { homeState } from './home.state.js';
import { 
  calcularProximoIndice, 
  calcularDeslocamentoCabecalho, 
  determinarEstadoFinalMenu 
} from './home.domain.js';

import { iniciarMonitoramentoIdoso } from '../elderly-care/elderly-care.controller.js';
import { inicializarModuloTemperatura } from '../elderly-care/elderly-care.open-meteo.js';

let telas, indicadores, cabecalho, sobreposicao;
let lastDoubleTapTime = 0;

const ehInterativo = target => ['INPUT', 'BUTTON', 'A', 'SELECT'].includes(target.tagName) || target.classList.contains('botao-mostrar-senha');

function gerarCodigoSeisDigitos() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

export function initHomeController() {

  const alturaFixa = window.innerHeight;
  document.documentElement.style.setProperty('--altura-fixa', `${alturaFixa}px`);

  
  telas = document.getElementById("telas");
  indicadores = document.querySelectorAll("#paginacao span");
  cabecalho = document.getElementById("cabecalho");
  sobreposicao = document.getElementById("sobreposicao");

  if (!telas || !cabecalho || !sobreposicao) return;

  
  homeState.reset();
  telas.style.transform = `translateX(-100vw)`;

  
  configurarFluxoConexaoDispositivos();
  configurarFluxoMonitoramentoIdoso();
  configurarFluxoGestaoMenu();
  configurarProtecoesDowntimeMobile();
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
  
  
  document.removeEventListener('touchstart', evitarZoomMultitouch);
  document.removeEventListener('touchend', evitarDoubleTapGlitches);
}


function configurarFluxoConexaoDispositivos() {
  const botaoGerar = document.getElementById('botao-generar-id');
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
}


function configurarFluxoMonitoramentoIdoso() {
  const botaoMapa = document.getElementById('BotaoMapa');
  const visorMapa = document.getElementById('VisorMapa');

  if (botaoMapa && visorMapa) {
    botaoMapa.addEventListener('click', () => {
      iniciarMonitoramentoIdoso();
    });
  }

  let latitudeDoIdoso; 
  let longitudeDoIdoso;
  inicializarModuloTemperatura(latitudeDoIdoso, longitudeDoIdoso);
}


function configurarFluxoGestaoMenu() {
  telas.addEventListener("touchstart", tratarTouchStartTelas, { passive: true });
  telas.addEventListener("touchend", tratarTouchEndTelas, { passive: true });

  cabecalho.addEventListener("touchstart", tratarTouchStartCabecalho, { passive: true });
  cabecalho.addEventListener("touchmove", tratarTouchMoveCabecalho, { passive: false });
  cabecalho.addEventListener("touchend", tratarTouchEndCabecalho, { passive: true });

  sobreposicao.addEventListener("touchend", fecharMenu, { passive: false });
  sobreposicao.addEventListener("click", fecharMenu);
}

function tratarTouchStartTelas(e) {
  if (homeState.menuAberto || ehInterativo(e.target)) return;
  homeState.posicaoXInicial = e.touches[0].clientX;
}

function tratarTouchEndTelas(e) {
  if (homeState.menuAberto || ehInterativo(e.target)) return;
  
  homeState.indiceAtual = calcularProximoIndice(
    homeState.posicaoXInicial, 
    e.changedTouches[0].clientX, 
    homeState.indiceAtual, 
    indicadores.length
  );
  
  telas.style.transition = 'transform 0.5s ease-out';
  telas.style.transform = `translateX(${-homeState.indiceAtual * 100}vw)`;
  
  indicadores.forEach((ind, idx) => {
    ind.classList.toggle("ativo", idx === homeState.indiceAtual);
  });
}

function tratarTouchStartCabecalho(e) {
  if (document.activeElement.tagName === 'INPUT') document.activeElement.blur();
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
    const posicaoVh = calcularDeslocamentoCabecalho(homeState.posicaoYInicial, posicaoYAtual, homeState.menuAberto, window.innerHeight);
    requestAnimationFrame(() => { 
      if (homeState.emMovimento) cabecalho.style.transform = `translateY(${posVh}vh)`; 
    });
  }
}

function tratarTouchEndCabecalho(e) {
  homeState.emMovimento = false;
  cabecalho.style.transition = 'transform 0.6s ease';
  void cabecalho.offsetHeight; 
  
  homeState.menuAberto = determinarEstadoFinalMenu(homeState.posicaoYInicial, e.changedTouches[0].clientY, homeState.menuAberto);
  cabecalho.style.transform = homeState.menuAberto ? "translateY(0)" : "translateY(calc(var(--altura-fixa) * -0.6))";
  sobreposicao.classList.toggle("ativa", homeState.menuAberto);
}

function fecharMenu(e) {
  if (e && e.cancelable) e.preventDefault();
  cabecalho.style.transition = 'transform 0.6s ease';
  cabecalho.style.transform = "translateY(calc(var(--altura-fixa) * -0.6))";
  sobreposicao.classList.remove("ativa");
  homeState.menuAberto = false;
}


function configurarProtecoesDowntimeMobile() {
  document.addEventListener('touchstart', evitarZoomMultitouch, { passive: false });
  document.addEventListener('touchend', evitarDoubleTapGlitches, { passive: false });
}

function evitarZoomMultitouch(e) {
  if (!ehInterativo(e.target) && e.touches.length > 1) {
    e.preventDefault();
  }
}

function evitarDoubleTapGlitches(e) {
  if (ehInterativo(e.target)) return;
  const agora = performance.now();
  if (agora - lastDoubleTapTime < 300) {
    e.preventDefault();
  }
  lastDoubleTapTime = agora;
}