package com.redrd.back_cvs.service.User;

import com.redrd.back_cvs.Dto.UserDto;
import com.redrd.back_cvs.enums.RoleUsers;
import com.redrd.back_cvs.model.DocumentoCv;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.request.CreateUserRequest;
import com.redrd.back_cvs.request.UserUpdateRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUserService {

    Usuario registrar(CreateUserRequest usuario);
    List<Usuario> listUsers();
    Usuario obtenerPorId(UUID id);
    Usuario updateUser(UserUpdateRequest request, UUID userId);
    void deletUser(UUID userId);

    UserDto convertUserToDto(Usuario user);

    List<UserDto> convertUserToDtoList(List<Usuario> users);
}
