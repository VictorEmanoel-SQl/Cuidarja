document.addEventListener("DOMContentLoaded", () => {

    const formLogin = document.querySelector('form[data-tipo-form="login"]');
    
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault(); 
            
            const email = formLogin.querySelector(".input-email").value;
            const senha = formLogin.querySelector(".input-senha").value;

            const payload = {
                cadastroData: {
                    email: email,
                    senha: senha
                }
            };

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const mensagemServidor = await response.text();

                if (response.ok) {
                    alert("Sucesso: " + mensagemServidor);
                    window.location.href = "/"; 
                } else {
                    alert("Erro no Login: " + mensagemServidor); 
                }

            } catch (error) {
                console.error("Erro na conexão:", error);
                alert("Não foi possível conectar ao core em Java. O servidor está rodando?");
            }
        });
    }


    const formCadastro = document.querySelector('form[data-tipo-form="cadastro"]');
    
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const nome = formCadastro.querySelector(".input-nome").value;
            const email = formCadastro.querySelector(".input-email").value;
            const senha = formCadastro.querySelector(".input-senha").value;

            const payload = {
                cadastroData: {
                    nome: nome,
                    email: email,
                    senha: senha
                }
            };

            try {
                const response = await fetch('/api/cadastro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const mensagemServidor = await response.text();

                if (response.ok) {
                    alert("Sucesso: " + mensagemServidor);
                    window.location.reload(); 
                } else {
                    alert("Erro no Cadastro: " + mensagemServidor);
                }

            } catch (error) {
                console.error("Erro na conexão:", error);
                alert("Não foi possível conectar ao core em Java.");
            }
        });
    }
});