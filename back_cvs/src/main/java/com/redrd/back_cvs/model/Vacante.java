package com.redrd.back_cvs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vacantes")
public class Vacante {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotBlank
    private String titulo;
    private String area;
    private String modalidad;
    private String ubicacion;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private int puestos;

    @ElementCollection
    @CollectionTable(name = "vacante_requisitos", joinColumns = @JoinColumn(name = "vacante_id"))
    @Column(name = "requisito")
    @NotEmpty
    private List<String> requisitos;

    private String salario;
    private String estado;
}
