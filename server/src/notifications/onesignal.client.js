//conexão com OneSingnal e envio de notificação
import { modelosDeNotificacao } from './notification.templates.js';

class OneSignalClient {
    constructor() {
        this.appId = "151a863e-5379-42a2-91e8-1fd7d099643f"; 
        this.apiKey = "iefw643o2e3pf4shczaccodw6";
        this.apiUrl = "https://onesignal.com/api/v1/notifications";
    }

    async enviarPush(idDestinatario, dadosNotificacao) {
        const requisicao = {
            app_id: this.appId,
            include_subscription_ids: [idDestinatario], 
            ...dadosNotificacao 
        };

        const resposta = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Basic ${this.apiKey}`
            },
            body: JSON.stringify(requisicao)
        });

        if (!resposta.ok) {
            const erroDados = await resposta.json();
            throw new Error(erroDados.errors ? erroDados.errors[0] : "Falha na comunicação com o servidor OneSignal");
        }

        return await resposta.json();
    }
}

export const clienteOneSignal = new OneSignalClient();

//BOTÕES DE NOTIFICAÇÃO
export function inicializarBotoesNotificacao() {
    const botaoChamar = document.getElementById('BotaoChamarID');
    const botaoEmergencia = document.getElementById('BotaoEmergenciaID');
    const inputIdDestinatario = document.getElementById('InputEscreverID');

    // Botão Chamar
    if (botaoChamar && inputIdDestinatario) {
        botaoChamar.addEventListener('click', async () => {
            const idDestinatario = inputIdDestinatario.value.trim();
            const nomeIdoso = "NomeDoIdoso";

            if (!idDestinatario) {
                alert("Por favor, conecte o dispositivo do parceiro primeiro!");
                return;
            }

            try {
                const modelo = modelosDeNotificacao.idosoChamar(nomeIdoso);
                await clienteOneSignal.enviarPush(idDestinatario, modelo);
                alert("Chamada enviada com sucesso!");
            } catch (erro) {
                console.error(erro);
                alert("Erro ao enviar chamada.");
            }
        });
    }

    // Botão Emergência
    if (botaoEmergencia && inputIdDestinatario) {
        botaoEmergencia.addEventListener('click', async () => {
            const idDestinatario = inputIdDestinatario.value.trim();
            const nomeIdoso = "NomeDoIdoso";

            if (!idDestinatario) {
                alert("Por favor, conecte o dispositivo do parceiro primeiro!");
                return;
            }

            try {
                const modelo = modelosDeNotificacao.idosoEmergencia(nomeIdoso);
                await clienteOneSignal.enviarPush(idDestinatario, modelo);
                alert("Alerta de emergência disparado!");
            } catch (erro) {
                console.error(erro);
                alert("Erro ao disparar emergência.");
            }
        });
    }
}