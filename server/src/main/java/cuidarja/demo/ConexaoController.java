package cuidarja.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.Optional; // 🟢 IMPORTANTE: Adicionado para usar o Optional do Login

@RestController 
@RequestMapping("/api")  
@CrossOrigin(origins = "*")
public class ConexaoController {
    
    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ==========================================
    // ENDPOINT DE CADASTRO
    // ==========================================
    @PostMapping("/cadastro")
    public ResponseEntity<String> receberCadastro(@RequestBody CadastroDTO payload) {
        if (payload.getCadastroData() == null) {
            return ResponseEntity.badRequest().body("Dados de cadastro vazios.");
        }

        try {
            Usuario novoUsuario = new Usuario();
            novoUsuario.setEmail(payload.getCadastroData().getEmail());
            novoUsuario.setSenha(payload.getCadastroData().getSenha());
            novoUsuario.setTipoUsuario("cuidador"); 

            novoUsuario = usuarioRepository.save(novoUsuario);

            Cuidador novoCuidador = new Cuidador();
            novoCuidador.setNome(payload.getCadastroData().getNome());
            novoCuidador.setUsuario(novoUsuario); 

            cuidadorRepository.save(novoCuidador);

            return ResponseEntity.ok("Cadastro de Cuidador realizado com sucesso!");

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            String mensagemReal = (e.getRootCause() != null) ? e.getRootCause().getMessage() : e.getMessage();
            System.out.println("ERRO REAL DO BANCO: " + mensagemReal);
            
            return ResponseEntity.status(400).body("Erro de validação no banco: " + mensagemReal);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Erro interno no servidor ao salvar dados.");
        }
    }

    // ==========================================
    // 🟢 NOVO: ENDPOINT DE LOGIN (RESOLVE O 404)
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<String> receberLogin(@RequestBody CadastroDTO payload) {
        // Validação de segurança inicial
        if (payload.getCadastroData() == null) {
            return ResponseEntity.badRequest().body("Dados de login vazios.");
        }

        String emailDigitado = payload.getCadastroData().getEmail();
        String senhaDigitada = payload.getCadastroData().getSenha();

        // Faz a busca do usuário no banco usando o e-mail vindo do JavaScript
        Optional<Usuario> usuarioBanco = usuarioRepository.findByEmail(emailDigitado);

        // Se o usuário existir e a senha for idêntica à do banco, autoriza o login
        if (usuarioBanco.isPresent() && usuarioBanco.get().getSenha().equals(senhaDigitada)) {
            return ResponseEntity.ok("Login realizado com sucesso!");
        } else {
            // Caso contrário, retorna erro 401 (Não Autorizado) protegendo o sistema
            return ResponseEntity.status(401).body("E-mail ou senha incorretos.");
        }
    }
}