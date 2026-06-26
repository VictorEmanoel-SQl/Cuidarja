const alturaFixa = window.innerHeight;
document.documentElement.style.setProperty('--altura-fixa', `${alturaFixa}px`);

const telas = document.getElementById("telas"),
      indicadores = document.querySelectorAll("#paginacao span"),
      cabecalho = document.getElementById("cabecalho"),
      sobreposicao = document.getElementById("sobreposicao");

let indiceAtual = 0, posicaoXInicial = 0, posicaoYInicial = 0, menuAberto = false, emMovimento = false;

const ehInterativo = target => ['INPUT', 'BUTTON', 'A', 'SELECT'].includes(target.tagName) || target.classList.contains('botao-mostrar-senha');

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

    
    telas.ontouchstart = e => {
        if(menuAberto || ehInterativo(e.target)) return;
        posicaoXInicial = e.touches[0].clientX;
        arrastando = true;
    }

    telas.ontouchend = e => {
        if(menuAberto || ehInterativo(e.target) || !arrastando) return;
        const dist = posicaoXInicial - e.changedTouches[0].clientX;
        atualizarSlide(dist);
        arrastando = false;
    }

    
    telas.onmousedown = e => {
        if(menuAberto || ehInterativo(e.target)) return;
        posicaoXInicial = e.clientX;
        arrastando = true;
    }

    telas.onmouseup = e => {
        if(menuAberto || ehInterativo(e.target) || !arrastando) return;
        const dist = posicaoXInicial - e.clientX;
        atualizarSlide(dist);
        arrastando = false;
    }

    
    telas.ondragstart = e => {
        if(arrastando) e.preventDefault();
    }
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


document.querySelectorAll('.botao-mostrar-senha').forEach(botao => {
    const alternar = (e) => {
        e.preventDefault(); e.stopPropagation();
        const input = botao.parentElement.querySelector('.input-senha');
        if (input) {
            const esconde = input.type === 'text';
            input.type = esconde ? 'password' : 'text';
            botao.classList.toggle('oculto', esconde);
        }
    };
    botao.addEventListener('mousedown', alternar);
    botao.addEventListener('touchstart', alternar, { passive: false });
});


let last = 0;
document.addEventListener('touchstart', e => {
    if (!ehInterativo(e.target) && e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', e => {
    if(ehInterativo(e.target)) return;
    if (performance.now() - last < 300) e.preventDefault();
    last = performance.now();
});

const campos = {
    formLogin: document.querySelector('form[data-tipo-form="login"]'),
    formCadastro: document.querySelector('form[data-tipo-form="cadastro"]'),
    botaoSalvar: document.getElementById("SalvarDados"),
};

if (campos.formLogin) campos.formLogin.addEventListener("submit", salvarDados);
if (campos.formCadastro) campos.formCadastro.addEventListener("submit", salvarDados);


function montarDados(event) {
    const elementoDisparador = event?.target;
    const formDisparador = elementoDisparador?.closest('form');
    const tipoForm = formDisparador?.getAttribute('data-tipo-form');

    if (elementoDisparador?.id === "SalvarDados" || elementoDisparador?.id === "botaoSalvar") {
        return {
            tipo: "dados_completos",
            cuidador: { nome: campos.nomeC?.value || "" }
        };
    }

    
    if (tipoForm === "cadastro") {
        return {
            tipo: "cadastro",
            cadastro: {
                nome: formDisparador.querySelector('.input-nome').value,
                email: formDisparador.querySelector('.input-email').value,
                senha: formDisparador.querySelector('.input-senha').value
            }
        };
    } 
    
    
    if (tipoForm === "login") {
        return {
            tipo: "login",
            login: {
                email: formDisparador.querySelector('.input-email').value,
                senha: formDisparador.querySelector('.input-senha').value
            }
        };
    }

    
    const formLogin = document.querySelector('form[data-tipo-form="login"]');
    return {
        tipo: "login",
        login: {
            email: formLogin?.querySelector('.input-email')?.value || "",
            senha: formLogin?.querySelector('.input-senha')?.value || ""
        }
    };
}

async function salvarDados(event) {
    event.preventDefault();

    
    const dadosOriginais = montarDados(event); 
    let dadosFormatados = {};

    if (dadosOriginais.tipo === "cadastro") {
        dadosFormatados = {
            cadastroData: {
                nome: dadosOriginais.cadastro?.nome,
                email: dadosOriginais.cadastro?.email,
                senha: dadosOriginais.cadastro?.senha
            }
        };
    } else if (dadosOriginais.tipo === "login") {
        dadosFormatados = {
            cadastroData: {
                email: dadosOriginais.login?.email,
                senha: dadosOriginais.login?.senha
            }
        };
    } else {
        dadosFormatados = dadosOriginais;
    }

    console.log("Enviando dados formatados para o Java:", dadosFormatados);

    let url = "http://localhost:8080/api/";
    if (dadosOriginais.tipo === "cadastro") url += "cadastro";
    else if (dadosOriginais.tipo === "login") url += "login";
    else if (dadosOriginais.tipo === "dados_completos") url += "dados-completos";

    
    const botaoSubmit = event.target.querySelector('button[type="submit"]') || event.target;
    if (botaoSubmit && botaoSubmit.tagName === "BUTTON") botaoSubmit.disabled = true;

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosFormatados)
        });

        if (resposta.ok) {
            const textoResposta = await resposta.text();
            alert(textoResposta);
            
            if (dadosOriginais.tipo === "login") {
                window.location.href = "index.html"; 
            }
        } else {
            const textoErro = await resposta.text();
            alert("Erro: " + textoErro);
        }
    } catch (erro) {
        console.error("Erro de conexão:", erro);
        alert("O servidor Spring Boot parece estar desligado.");
    } finally {
        
        if (botaoSubmit && botaoSubmit.tagName === "BUTTON") botaoSubmit.disabled = false;
    }
}