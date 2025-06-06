package com.redrd.back_cvs.controller;

import com.redrd.back_cvs.Dto.UserDto;
import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.response.ApiResponse;
import com.redrd.back_cvs.service.DocCv.IDocCvService;
import com.redrd.back_cvs.service.User.IUserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/users")
public class UserController {


    private final IUserService userService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse> getUserbyId() {
        List<Usuario> users = userService.listUsers();
        List<UserDto> userDtos = userService.convertUserToDtoList(users);
        return ResponseEntity.ok(new ApiResponse("Succes", userDtos));
    }

    // solo usuario segun id
    @GetMapping("/{userId}/user")
    public ResponseEntity<ApiResponse> obtenerUsuarioId(@PathVariable UUID userId){
        try {
            Usuario user = userService.obtenerPorId(userId);
            return ResponseEntity.ok(new ApiResponse("Succes", user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    // listado de usuarios postulado (Rol evaluador)

    // traer cv del postulante - solo postulante


    // traer documento de tramite - solo ciudadano

    // eliminar usuario - solo evaluador

}