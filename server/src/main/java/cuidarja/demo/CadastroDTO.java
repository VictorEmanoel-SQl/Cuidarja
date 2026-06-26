package cuidarja.demo;

public class CadastroDTO {
    private CadastroData cadastroData;

    public CadastroDTO() {}

    public CadastroData getCadastroData() {
        return cadastroData;
    }

    public void setCadastroData(CadastroData cadastroData) {
        this.cadastroData = cadastroData;
    }

    public static class CadastroData {
        private String nome;
        private String email;
        private String senha;

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }
}