package com.redrd.back_cvs.repository;

import com.redrd.back_cvs.model.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostulacionRepository extends JpaRepository<Postulacion, UUID> {
}
