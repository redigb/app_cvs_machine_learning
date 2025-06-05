package com.redrd.back_cvs.request;


import com.redrd.back_cvs.enums.RoleUsers;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String telefono;
    private RoleUsers role_user;
}
