package com.redrd.back_cvs.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PostulacionDTO {
    private UUID id;
    private UUID usuarioId;
    private UUID vacanteId;
    private String estadoPeticion;
    private String estadoPostulacion;
    private String observacionIa;
    private LocalDateTime enviadoEl;
}
