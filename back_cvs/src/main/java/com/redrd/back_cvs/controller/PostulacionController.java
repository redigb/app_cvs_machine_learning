package com.redrd.back_cvs.controller;


import com.redrd.back_cvs.dto.PostulacionDTO;
import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.Postulacion;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.model.Vacante;
import com.redrd.back_cvs.response.ApiResponse;
import com.redrd.back_cvs.service.postulacion.IPostulacionService;
import com.redrd.back_cvs.service.user.IUserService;
import com.redrd.back_cvs.service.vacante.IVacanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/postulacion")
public class PostulacionController {

    private final IPostulacionService postulacionService;
    private final IUserService userService;
    private final IVacanteService vacanteService;

    // si no existiera el rol de usario esto se rompe :/
    @PreAuthorize("hasRole('ROLE_POSTULANTE')")
    @PostMapping("/evaluar")
    public ResponseEntity<ApiResponse> evaluarPostulacion(@RequestParam UUID vacanteId){
        try {
            Vacante vacante = vacanteService.obtnerVacanteId(vacanteId);
            // Ya se obtiene la secion via autenticacion del usario
            Usuario postulante = userService.getAuthemricatedUser();
            // ✅ Validación: el postulante ya tiene una postulación para esta vacante
            boolean yaPostulado = postulacionService
                    .findByPersonaId(postulante)
                    .stream()
                    .anyMatch(p -> p.getVacante().getId().equals(vacanteId));
            if (yaPostulado) {
                return ResponseEntity
                        .status(BAD_REQUEST)
                        .body(new ApiResponse("Ya se ha postulado a esta vacante", null));
            }
            Postulacion postulacion = postulacionService.savePostulacionInicial(postulante, vacante);
            PostulacionDTO postulacionDTO = postulacionService.converPostulacionDto(postulacion);
            // ejecucion de evaluacion en segundo plano
            postulacionService.evaluarPostulacion(postulacion);
            return ResponseEntity.ok(new ApiResponse("Se registro su postulacion este atento a los posibles resultados", postulacionDTO));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> obtenerPorId(@PathVariable UUID id) {
        Postulacion postulacion = postulacionService.findById(id);
        return ResponseEntity.ok(new ApiResponse("Éxito", postulacion));
    }

    @GetMapping("/persona/{personaId}")
    public ResponseEntity<ApiResponse> obtenerPorPersona(@PathVariable Usuario postulanteId) {
        List<Postulacion> postulaciones = postulacionService.findByPersonaId(postulanteId);
        return ResponseEntity.ok(new ApiResponse("Succes", postulaciones));
    }

    @GetMapping("/vacante/{vacanteId}")
    public ResponseEntity<ApiResponse> obtenerPorVacante(@PathVariable Vacante vacanteId) {
        List<Postulacion> postulaciones = postulacionService.findByVacanteId(vacanteId);
        return ResponseEntity.ok(new ApiResponse("Éxito", postulaciones));
    }

    /*@PutMapping("/update")
    public ResponseEntity<ApiResponse> actualizar(@RequestBody Postulacion postulacion) {
        Postulacion actualizada = postulacionService.update(postulacion);
        return ResponseEntity.ok(new ApiResponse("Postulación actualizada correctamente", actualizada));
    }*/

    // La eliminacion solo debe ser para eliminar su postulacion de usuario
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> eliminar(@PathVariable UUID id) {
        postulacionService.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("Postulación eliminada correctamente", null));
    }
}
