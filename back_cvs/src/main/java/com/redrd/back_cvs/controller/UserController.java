package com.redrd.back_cvs.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/users")
public class UserController {

    @GetMapping("/{userId}/user")
    public String getUserbyId() {
        return ("Hellou user new");
    }

    // solo usuario segun id

    // listado de usuarios postulado (Rol evaluador)

    //

    // eliminar usuario


}