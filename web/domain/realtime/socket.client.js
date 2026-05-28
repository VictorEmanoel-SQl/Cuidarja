// web/domain/realtime/socket.client.js
import { io } from './socket.io.js'; // Importando o arquivo local baixado

// Altere para o IP do seu servidor node.js
export const socket = io('http://192.168.1.100:3000', {
    autoConnect: true,
    reconnection: true
});
