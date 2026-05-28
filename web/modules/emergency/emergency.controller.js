import { socket } from '../../domain/realtime/socket.client.js'; 

export const EmergencyController = {
    view: null,

    init(wrapperElement) {
        this.view = wrapperElement;

        // Ativa o ouvinte para esta tela específica
        socket.on('alerta-sensor', this.tratarAlerta);
    },

    tratarAlerta(dados) {
        console.log('Dados do sensor recebidos via Socket.io:', dados);
    },

    destroy() {
        
        socket.off('alerta-sensor', this.tratarAlerta);
    }
};

export default EmergencyController;