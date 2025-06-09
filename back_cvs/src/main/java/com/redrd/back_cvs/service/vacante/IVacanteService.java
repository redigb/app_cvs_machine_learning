package com.redrd.back_cvs.service.vacante;

import com.redrd.back_cvs.model.Vacante;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IVacanteService {
    List<Vacante> findAll();
    Vacante obtnerVacanteId(UUID vacanteId);
    Optional<Vacante> findById(UUID id);
    Vacante save(Vacante vacante);
    Vacante update(UUID id, Vacante vacante);
    void delete(UUID id);
    List<Vacante> findByEstado(String estado);
    List<Vacante> findByArea(String area);
}
