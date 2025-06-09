package com.redrd.back_cvs.model;


import com.redrd.back_cvs.enums.EstadoPeticion;
import com.redrd.back_cvs.enums.EstadoPostulacion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Postulacion {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vacante_id", nullable = false)
    private Vacante vacante;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_peticion")
    private EstadoPeticion estadoPeticion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_postulacion")
    private EstadoPostulacion estadoPostulacion;

    @Column(name = "observacion_ia", columnDefinition = "TEXT")
    private String observacionIa;

    @Column(name = "enviado_el")
    private LocalDateTime enviadoEl;
}

