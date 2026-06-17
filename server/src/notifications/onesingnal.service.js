export function initOneSignalConnection() {
    const botaoGerar = document.getElementById("BotaoGerarID");
    const inputReceber = document.getElementById("InputReceberID");
    const inputEscrever = document.getElementById("InputEscreverID");
    const botaoConfirmar = document.getElementById("BotaoConfirmarID");

    if (!botaoGerar || !inputReceber || !inputEscrever || !botaoConfirmar) return;

    botaoGerar.addEventListener("click", async () => {
        try {
            await window.OneSignal.Deferred.push(async () => {
                await window.OneSignal.User.PushSubscription.optIn();
                
                const subscriptionId = window.OneSignal.User.PushSubscription.id;
                
                if (subscriptionId) {
                    inputReceber.value = subscriptionId;
                } else {
                    alert("Permissão concedida, mas o ID ainda está sendo gerado. Clique novamente em instantes.");
                }
            });
        } catch (erro) {
            console.error("Erro ao inicializar ou gerar ID do OneSignal:", erro);
        }
    });

    botaoConfirmar.addEventListener("click", async () => {
        const idDoOutroDispositivo = inputEscrever.value.trim();

        if (!idDoOutroDispositivo) {
            alert("Por favor, digite o ID do outro dispositivo antes de confirmar.");
            return;
        }

        try {
            await window.OneSignal.Deferred.push(async () => {
                await window.OneSignal.User.addTag("conectado_com", idDoOutroDispositivo);
                alert("Dispositivos vinculados com sucesso no OneSignal!");
            });
        } catch (erro) {
            console.error("Erro ao vincular dispositivos:", erro);
        }
    });
}