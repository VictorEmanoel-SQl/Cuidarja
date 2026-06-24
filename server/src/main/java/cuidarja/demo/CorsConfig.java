package cuidarja.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todas as rotas da API
                .allowedOrigins("*") // Libera o acesso de qualquer origem (ex: seu Live Server 5500)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD") // Libera todos os métodos, incluindo o OPTIONS (Preflight)
                .allowedHeaders("*"); // Libera todos os cabeçalhos
    }
}