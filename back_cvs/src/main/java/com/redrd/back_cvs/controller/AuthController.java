package com.redrd.back_cvs.controller;

import com.redrd.back_cvs.Dto.UserDto;
import com.redrd.back_cvs.enums.RoleUsers;
import com.redrd.back_cvs.exceptions.AlreadyExistException;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.request.CreateUserRequest;
import com.redrd.back_cvs.response.ApiResponse;
import com.redrd.back_cvs.service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CONFLICT;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/auth")
public class AuthController {

    private final IUserService userService;


    @PostMapping("/register")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest req){
        if (req.getRole_user() != RoleUsers.CIUDADANO && req.getRole_user() != RoleUsers.POSTULANTE){
            return ResponseEntity.badRequest().body(
                    new ApiResponse("Tipo de Usuario no permitido. Solo se permite 'CIUDADANO' o 'POSTULANTE'", null)
            );
        }
        try {
            Usuario user = userService.registrar(req);
            UserDto userDto = userService.convertUserToDto(user);
            return ResponseEntity.ok(new ApiResponse("Usuario creado exitosamente!", userDto));
        } catch (AlreadyExistException e) {
            return ResponseEntity.status(CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    // login + envio datos del usuario
    // cerrar-secion
}
