export const homeState = {
  indiceAtual: 0,
  posicaoXInicial: 0,
  posicaoYInicial: 0,
  menuAberto: false,
  emMovimento: false,

  reset() {
    this.indiceAtual = 0;
    this.posicaoXInicial = 0;
    this.posicaoYInicial = 0;
    this.menuAberto = false;
    this.emMovimento = false;
  }
};