package com.redrd.back_cvs.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.redrd.back_cvs.enums.RoleUsers;
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
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    private String name;
    private String email;
    private String password;
    private String telefono;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private DocumentoCv documentoCv;

    @Enumerated(EnumType.STRING)
    private RoleUsers user_rol; // postulante, evaluador, ciudadano

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
