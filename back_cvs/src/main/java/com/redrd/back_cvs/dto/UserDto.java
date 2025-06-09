package com.redrd.back_cvs.dto;

import com.redrd.back_cvs.enums.RoleUsers;
import lombok.Data;

import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String name;
    private String email;
    private String telefono;
    private RoleUsers user_rol;
}
