const alturaFixa = window.innerHeight;
document.documentElement.style.setProperty('--altura-fixa', `${alturaFixa}px`);

const ehInterativo = target => ['INPUT', 'BUTTON', 'A', 'SELECT'].includes(target.tagName) || target.classList.contains('botao-mostrar-senha');

let last = 0;
document.addEventListener('touchstart', e => {
    if (!ehInterativo(e.target) && e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', e => {
    if(ehInterativo(e.target)) return;
    if (performance.now() - last < 300) e.preventDefault();
    last = performance.now();
});

export function inicializarAnimacoesAuth() {
    const telas = document.getElementById("telas"),
          indicadores = document.querySelectorAll("#paginacao span"),
          cabecalho = document.getElementById("cabecalho"),
          sobreposicao = document.getElementById("sobreposicao");

    let indiceAtual = 0, posicaoXInicial = 0, posicaoYInicial = 0, menuAberto = false, emMovimento = false;
    const alturaFixa = window.innerHeight;

    if (telas) {
        telas.style.transform = `translateX(0vw)`;
        let arrastando = false;

        const atualizarSlide = (distancia) => {
            if (indicadores.length > 0) {
                indiceAtual += distancia > 50 && indiceAtual < indicadores.length - 1 ? 1 : distancia < -50 && indiceAtual > 0 ? -1 : 0;
                telas.style.transform = `translateX(${-indiceAtual * 100}vw)`;
                indicadores.forEach((ind, idx) => ind.classList.toggle("ativo", idx === indiceAtual));
            }
        };

        telas.ontouchstart = e => { if(menuAberto || ehInterativo(e.target)) return; posicaoXInicial = e.touches[0].clientX; arrastando = true; }
        telas.ontouchend = e => { if(menuAberto || ehInterativo(e.target) || !arrastando) return; const dist = posicaoXInicial - e.changedTouches[0].clientX; atualizarSlide(dist); arrastando = false; }
        telas.onmousedown = e => { if(menuAberto || ehInterativo(e.target)) return; posicaoXInicial = e.clientX; arrastando = true; }
        telas.onmouseup = e => { if(menuAberto || ehInterativo(e.target) || !arrastando) return; const dist = posicaoXInicial - e.clientX; atualizarSlide(dist); arrastando = false; }
        telas.ondragstart = e => { if(arrastando) e.preventDefault(); }
    }

    if (cabecalho) {
        cabecalho.ontouchstart = e => {
            if (document.activeElement.tagName === 'INPUT') document.activeElement.blur();
            posicaoYInicial = e.touches[0].clientY;
            emMovimento = false;
        }
        cabecalho.ontouchmove = e => {
            const distY = e.touches[0].clientY - posicaoYInicial;
            if ((!menuAberto && distY > 0) || (menuAberto && distY < 0)) {
                if (!emMovimento) { cabecalho.style.transition = 'none'; emMovimento = true; }
                const base = menuAberto ? 0 : (alturaFixa * -0.6);
                const posPx = Math.max(alturaFixa * -0.6, Math.min(base + distY, 0));
                requestAnimationFrame(() => { if (emMovimento) cabecalho.style.transform = `translateY(${posPx}px)`; });
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
            if (sobreposicao) sobreposicao.classList.toggle("ativa", menuAberto);
        }
    }

    if (sobreposicao) {
        const fecharMenu = (e) => {
            if (e?.cancelable) e.preventDefault();
            if (cabecalho) {
                cabecalho.style.transition = 'transform 0.6s ease';
                cabecalho.style.transform = "translateY(calc(var(--altura-fixa) * -0.6))";
            }
            sobreposicao.classList.remove("ativa");
            menuAberto = false;
        }
        sobreposicao.ontouchend = fecharMenu;
        sobreposicao.onclick = fecharMenu;
    }
}