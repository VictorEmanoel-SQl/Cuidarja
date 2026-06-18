//templates de notificação
class NotificationTemplates {
    idosoChamar(nomeIdoso) {
        return {
            headings: { pt: "Aviso do Idoso" },
            contents: { pt: `${nomeIdoso} precisa de sua ajuda neste momento.` },
            priority: 5, 
            android_sound: "nil", 
            ios_sound: "nil"
        };
    }

    idosoEmergencia(nomeIdoso) {
        return {
            headings: { pt: "ALERTA DE EMERGÊNCIA!!!" },
            contents: { pt: `ATENÇÃO: ${nomeIdoso} DISPAROU O BOTÃO DE EMERGÊNCIA!!!` },
            priority: 10, 
            android_sound: "alarme_urgente", 
            ios_sound: "alarme_urgente.wav",
            android_vibration_pattern: [0, 1000, 500, 2000, 500, 3000],
            android_lockscreen_visibility: 1
        };
    }
}

export const modelosDeNotificacao = new NotificationTemplates();