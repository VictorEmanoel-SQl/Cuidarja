package cuidarja.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CuidadorRepository extends JpaRepository<Cuidador, Integer> {
}