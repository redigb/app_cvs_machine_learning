package com.redrd.back_cvs.service.user;

import com.redrd.back_cvs.dto.UserDto;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.request.CreateUserRequest;
import com.redrd.back_cvs.request.LoginRequest;
import com.redrd.back_cvs.request.UserUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface IUserService {

    Usuario registrar(CreateUserRequest usuario);
    Usuario accesUser(LoginRequest login);
    List<Usuario> listUsers();
    Usuario obtenerPorId(UUID id);
    Usuario updateUser(UserUpdateRequest request, UUID userId);
    void deletUser(UUID userId);

    UserDto convertUserToDto(Usuario user);

    List<UserDto> convertUserToDtoList(List<Usuario> users);
    // Obetencion del usuario cuando no este autenticado
    Usuario getAuthemricatedUser();
}
