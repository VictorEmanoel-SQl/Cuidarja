class OneSignalClient {
    constructor() {
        // Credenciais do projeto no OneSignal (A equipe vai preencher com as chaves reais do painel)
        this.appId = "SEU_ONESIGNAL_APP_ID_AQUI"; 
        this.apiKey = "SUA_REST_API_KEY_AQUI";
        this.apiUrl = "https://onesignal.com/api/v1/notifications";
    }

    /**
     * @param {string} idCuidador 
     * @param {object} dadosNotificacao 
     */
    async sendPush(idCuidador, dadosNotificacao) {
        const requisicao = {
            app_id: this.appId,
            include_player_ids: [idCuidador], 
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

export const oneSignalClient = new OneSignalClient();