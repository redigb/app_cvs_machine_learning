package com.redrd.back_cvs.repository;

import com.redrd.back_cvs.model.Vacante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VacanteRepository extends JpaRepository<Vacante, UUID> {
    List<Vacante> findByEstado(String estado);

    List<Vacante> findByArea(String area);

    @Query("SELECT v FROM Vacante v JOIN FETCH v.requisitos WHERE v.id = :id")
    Optional<Vacante> findByIdFetchRequisitos(@Param("id") UUID id);

    @Query("SELECT v FROM Vacante v LEFT JOIN FETCH v.requisitos")
    List<Vacante> findAllWithRequisitos();
}
