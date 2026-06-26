import { socket } from '../../domain/realtime/socket.client.js'; 

let cabecalho, sobreposicao;
let menuAberto = false;
let modalAbertoAtual = null;
let timerEmergenciaInterval = null;
let posicaoYInicial = 0;
let emMovimento = false;

export const EmergencyController = {
    view: null,
    _boundTratarAlerta: null, 

    init(wrapperElement) {
        this.view = wrapperElement || document.body;

        cabecalho = document.getElementById("cabecalho");
        sobreposicao = document.getElementById("sobreposicao");

        if (!cabecalho || !sobreposicao) return;

        this._boundTratarAlerta = this.tratarAlerta.bind(this);
        socket.on('alerta-sensor', this._boundTratarAlerta);

        
        cabecalho.addEventListener('touchstart', this.tratarTouchStart, { passive: true });
        cabecalho.addEventListener('touchmove', this.tratarTouchMove, { passive: false });
        cabecalho.addEventListener('touchend', this.tratarTouchEnd, { passive: true });

        sobreposicao.addEventListener('touchend', this.tratarFecharMenuOuModal, { passive: false });
        sobreposicao.addEventListener('click', this.tratarFecharMenuOuModal);

        
        const btnEmergencia = this.view.querySelector('[data-action="abrir-sos"]');
        if (btnEmergencia) {
            btnEmergencia.addEventListener('click', () => this.abrirModal('janela-emergencia'));
        }

        const btnChamada = this.view.querySelector('[data-action="abrir-chamada"]');
        if (btnChamada) {
            btnChamada.addEventListener('click', () => this.abrirModal('janela-chamada'));
        }

        
        const botoesFechar = this.view.querySelectorAll('.btn-fechar-modal');
        botoesFechar.forEach(botao => {
            botao.addEventListener('click', () => this.fecharModais());
        });
    },

    tratarAlerta(dados) {
        console.log('Dados do sensor recebidos via Socket.io:', dados);
        this.abrirModal('janela-emergencia'); 
    },

    tratarTouchStart(e) {
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
            document.activeElement.blur();
        }
        posicaoYInicial = e.touches[0].clientY;
        emMovimento = false;
    },

    tratarTouchMove(e) {
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
    },

    tratarTouchEnd(e) {
        if (modalAbertoAtual) return;
        emMovimento = false;
        cabecalho.style.transition = 'transform 0.6s ease';
        void cabecalho.offsetHeight; 
        
        const distY = e.changedTouches[0].clientY - posicaoYInicial;

        if (Math.abs(distY) < 15) menuAberto = !menuAberto;
        else if (!menuAberto && distY > 80) menuAberto = true;
        else if (menuAberto && distY < -80) menuAberto = false;

        EmergencyController.atualizarMenuVisuais();
    },

    atualizarMenuVisuais() {
        cabecalho.style.transform = menuAberto ? "translateY(0)" : "translateY(-60dvh)";
        if (!modalAbertoAtual) {
            sobreposicao.classList.toggle("ativa", menuAberto);
        }
    },

    abrirModal(idModal) {
        if (menuAberto) return; 
        
        const modal = document.getElementById(idModal);
        if (!modal) return;

        modalAbertoAtual = modal;
        sobreposicao.classList.add("ativa");
        modal.classList.add("aberto");

        if (idModal === 'janela-emergencia') {
            this.iniciarContadorEmergencia();
        }
    },

    fecharModais() {
        if (modalAbertoAtual) {
            modalAbertoAtual.classList.remove("aberto");
            modalAbertoAtual = null;
        }
        
        if (!menuAberto) {
            sobreposicao.classList.remove("ativa");
        }
        
        this.pararContadorEmergencia();
    },

    tratarFecharMenuOuModal(e) {
        if (e?.cancelable) e.preventDefault();
        if (modalAbertoAtual) {
            EmergencyController.fecharModais();
        } else if (menuAberto) {
            menuAberto = false;
            EmergencyController.atualizarMenuVisuais();
        }
    },

    iniciarContadorEmergencia() {
        let tempo = 6;
        const displayContador = document.getElementById("contador-emergencia");
        const estadoContador = document.getElementById("estado-contador-emergencia");
        const estadoConfirmado = document.getElementById("estado-confirmado-emergencia");

        if (!displayContador) return;

        if (estadoContador) estadoContador.classList.remove("escondido");
        if (estadoConfirmado) estadoConfirmado.classList.add("escondido");
        displayContador.textContent = "06";

        this.pararContadorEmergencia();

        timerEmergenciaInterval = setInterval(() => {
            tempo--;
            displayContador.textContent = `0${tempo}`;

            if (tempo <= 0) {
                this.pararContadorEmergencia();
                if (estadoContador) estadoContador.classList.add("escondido");
                if (estadoConfirmado) estadoConfirmado.classList.remove("escondido");
                
                
                socket.emit('disparar-alerta-emergencia', { enviadoEm: Date.now() });
            }
        }, 1000);
    },

    pararContadorEmergencia() {
        if (timerEmergenciaInterval) {
            clearInterval(timerEmergenciaInterval);
            timerEmergenciaInterval = null;
        }
    },

    destroy() {
        if (this._boundTratarAlerta) {
            socket.off('alerta-sensor', this._boundTratarAlerta);
        }
        if (cabecalho) {
            cabecalho.removeEventListener('touchstart', this.tratarTouchStart);
            cabecalho.removeEventListener('touchmove', this.tratarTouchMove);
            cabecalho.removeEventListener('touchend', this.tratarTouchEnd);
        }
        if (sobreposicao) {
            sobreposicao.removeEventListener('touchend', this.tratarFecharMenuOuModal);
            sobreposicao.removeEventListener('click', this.tratarFecharMenuOuModal);
        }
        this.pararContadorEmergencia();
    }
};

export default EmergencyController;