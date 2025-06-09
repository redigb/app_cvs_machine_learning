package com.redrd.back_cvs.controller;


import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.Vacante;
import com.redrd.back_cvs.response.ApiResponse;
import com.redrd.back_cvs.service.vacante.IVacanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/vacantes")
public class VacanteController {

    private final IVacanteService vacanteService;

    // Obtener todas las vacantes
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> listarTodas() {
        List<Vacante> lista = vacanteService.findAll();
        return ResponseEntity.ok(new ApiResponse("Lista de vacantes", lista));
    }

    // Obtener una vacante por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> obtenerPorId(@PathVariable UUID id) {
        return vacanteService.findById(id)
                .map(v -> ResponseEntity.ok(new ApiResponse("Vacante encontrada", v)))
                .orElse(ResponseEntity.status(NOT_FOUND).body(new ApiResponse("Vacante no encontrada", null)));
    }


    // Crear una vacante
    @PreAuthorize("hasRole('ROLE_EVALUADOR')")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> crear(@RequestBody Vacante vacante) {
        Vacante nueva = vacanteService.save(vacante);
        return ResponseEntity.status(CREATED).body(new ApiResponse("Vacante creada correctamente", nueva));
    }

    // Actualizar una vacante
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizar(@PathVariable UUID id, @RequestBody Vacante vacante) {
        try {
            Vacante actualizada = vacanteService.update(id, vacante);
            return ResponseEntity.ok(new ApiResponse("Vacante actualizada", actualizada));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    // Eliminar una vacante
    @PreAuthorize("hasRole('ROLE_EVALUADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> eliminar(@PathVariable UUID id) {
        try {
            vacanteService.delete(id);
            return ResponseEntity.ok(new ApiResponse("Vacante eliminada", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    // Buscar por estado (ej: Activa)
    @GetMapping("/estado/{estado}")
    public ResponseEntity<ApiResponse> buscarPorEstado(@PathVariable String estado) {
        List<Vacante> resultados = vacanteService.findByEstado(estado);
        return ResponseEntity.ok(new ApiResponse("Vacantes por estado: " + estado, resultados));
    }

    // Buscar por área (ej: Tecnología)
    @GetMapping("/area/{area}")
    public ResponseEntity<ApiResponse> buscarPorArea(@PathVariable String area) {
        List<Vacante> resultados = vacanteService.findByArea(area);
        return ResponseEntity.ok(new ApiResponse("Vacantes por área: " + area, resultados));
    }
}
