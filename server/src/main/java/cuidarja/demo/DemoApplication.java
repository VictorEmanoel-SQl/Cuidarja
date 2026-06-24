package cuidarja.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        // ESSE é o comando que liga o servidor real, não o System.out.println
        SpringApplication.run(DemoApplication.class, args);
    }
}