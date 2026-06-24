package cuidarja.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Método essencial para buscar o usuário pelo e-mail na hora do login
    Optional<Usuario> findByEmail(String email);
}