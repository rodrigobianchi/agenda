package io.github.bianchi.agendaapi.model.repository;

import io.github.bianchi.agendaapi.model.entity.Contato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContatoRepository extends JpaRepository<Contato, Integer> {
}
