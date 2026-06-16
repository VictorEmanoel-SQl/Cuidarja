export function calcularProximoIndice(posicaoXInicial, posicaoXFinal, indiceAtual, totalIndicadores) {
    const distanciaX = posicaoXInicial - posicaoXFinal;
    
    if (distanciaX > 50 && indiceAtual < totalIndicadores - 1) {
        return indiceAtual + 1;
    }
    if (distanciaX < -50 && indiceAtual > 0) {
        return indiceAtual - 1;
    }
    
    return indiceAtual;
}

export function calcularDeslocamentoCabecalho(posicaoYInicial, posicaoYAtual, menuAberto, alturaJanela) {
    const distanciaY = posicaoYAtual - posicaoYInicial;
    const deslocamentoVh = (distanciaY / alturaJanela) * 100;

    if (menuAberto) {
        return Math.max(-60, Math.min(0, deslocamentoVh));
    } else {
        return Math.max(-60, Math.min(0, -60 + deslocamentoVh));
    }
}

export function determinarEstadoFinalMenu(posicaoYInicial, posicaoYFinal, menuAberto) {
    const distanciaY = posicaoYFinal - posicaoYInicial;

    if (!menuAberto && distanciaY > 100) {
        return true;
    }
    if (menuAberto && distanciaY < -100) {
        return false;
    }

    return menuAberto;
}