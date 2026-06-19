package cuidarja.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

@RestController          // 👈 ISSO AQUI DIZ AO SPRING QUE É UMA API CONTROLLER
@RequestMapping("/api")  // 👈 ISSO ATIVA O PREFIXO /api EM TODAS AS ROTAS
@CrossOrigin(origins = "*") // 👈 LIBERA O JAVASCRIPT DO SEU NAVEGADOR PARA CONECTAR
public class ConexaoController {

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/cadastro")
    public ResponseEntity<String> receberCadastro(@RequestBody CadastroDTO payload) {
        if (payload.getCadastroData() == null) {
            return ResponseEntity.badRequest().body("Dados de cadastro vazios.");
        }

        // 1. Cria e salva as credenciais na tabela 'usuario'
        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(payload.getCadastroData().getEmail());
        novoUsuario.setSenha(payload.getCadastroData().getSenha());
        novoUsuario.setTipoUsuario("cuidador"); // Identifica que este login pertence a um cuidador

        // 2. Cria o perfil do cuidador e associa ao usuário criado
        Cuidador novoCuidador = new Cuidador();
        novoCuidador.setNome(payload.getCadastroData().getNome());
        novoCuidador.setUsuario(novoUsuario); 

        // Salva o cuidador (o JPA salvará o usuário automaticamente devido ao Cascade)
        cuidadorRepository.save(novoCuidador);

        return ResponseEntity.ok("Cadastro de Cuidador realizado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> receberLogin(@RequestBody CadastroDTO payload) {
        String email = payload.getCadastroData().getEmail();
        String senha = payload.getCadastroData().getSenha();

        // Busca o usuário na tabela unificada de logins
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Valida se a senha bate (Nota: Em produção, use passwordEncoder.matches)
            if (usuario.getSenha().equals(senha)) {
                // Retorna um texto informando o sucesso e o tipo de usuário para o JS redirecionar
                return ResponseEntity.ok("Login efetuado com sucesso! Tipo: " + usuario.getTipoUsuario());
            }
        }

        return ResponseEntity.status(401).body("E-mail ou senha incorretos.");
    }
}