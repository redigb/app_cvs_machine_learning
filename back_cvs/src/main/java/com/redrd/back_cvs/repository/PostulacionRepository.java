package com.redrd.back_cvs.repository;

import com.redrd.back_cvs.model.Postulacion;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.model.Vacante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostulacionRepository extends JpaRepository<Postulacion, UUID> {
    List<Postulacion> findByUsuarioId(Usuario personaId);

    List<Postulacion> findByVacanteId(Vacante vacanteId);
}
