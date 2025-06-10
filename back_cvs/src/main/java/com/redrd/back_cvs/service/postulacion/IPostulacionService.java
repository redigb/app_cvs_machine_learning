package com.redrd.back_cvs.service.postulacion;

import com.redrd.back_cvs.dto.PostulacionDTO;
import com.redrd.back_cvs.dto.UserDto;
import com.redrd.back_cvs.model.Postulacion;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.model.Vacante;

import java.util.List;
import java.util.UUID;

public interface IPostulacionService {


    Postulacion savePostulacionInicial(Usuario postulante, Vacante vacante);
    Postulacion update(Postulacion postulacion);
    void evaluarPostulacion(Postulacion postulacion);
    void deleteById(UUID id);
    Postulacion findById(UUID id);
    List<Postulacion> findAll();

    // Opcional: buscar postulaciones por persona
    List<Postulacion> findByPersonaId(Usuario personaId);
    // Opcional: buscar postulaciones por vacante
    List<Postulacion> findByVacanteId(Vacante vacanteId);

    PostulacionDTO converPostulacionDto(Postulacion postulacion);
    List<PostulacionDTO> convertPostulacionDtoList(List<Postulacion> postulaciones);
}
