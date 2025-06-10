package com.redrd.back_cvs.service.user;

import com.redrd.back_cvs.dto.UserDto;
import com.redrd.back_cvs.exceptions.AlreadyExistException;
import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.repository.UsuarioRepository;
import com.redrd.back_cvs.request.CreateUserRequest;
import com.redrd.back_cvs.request.LoginRequest;
import com.redrd.back_cvs.request.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{

    private final UsuarioRepository usuarioRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Usuario registrar(CreateUserRequest request) {
        return Optional.of(request)
                .filter(user -> !usuarioRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    Usuario user = new Usuario();
                    user.setEmail(req.getEmail());
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    user.setName(request.getName());
                    user.setTelefono(req.getTelefono());
                    user.setCreatedAt(LocalDateTime.now());
                    user.setUser_rol(req.getRole_user());
                    return usuarioRepository.save(user);
                }).orElseThrow(
                        () -> new AlreadyExistException("Oops!" + request.getEmail()+" el usuario ya existe!"));
    }

    @Override
    public Usuario accesUser(LoginRequest login) {
        return null;
    }

    @Override
    public List<Usuario> listUsers() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario obtenerPorId(UUID id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no existente"));
    }

    @Override
    public Usuario obtnerPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con el email no registrado: " + email));
    }

    @Override
    public Usuario updateUser(UserUpdateRequest request, UUID userId){
        return usuarioRepository.findById(userId).map(existingUser -> {
            existingUser.setName(request.getName());
            existingUser.setTelefono(request.getTelefono());
            return usuarioRepository.save(existingUser);
        }).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @Override
    public void deletUser(UUID userId) {
        usuarioRepository.findById(userId).ifPresentOrElse(usuarioRepository :: delete, () -> {
            throw new ResourceNotFoundException("Usuario no encontrado");
        });
    }

    @Override
    public UserDto convertUserToDto(Usuario user) {
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public List<UserDto> convertUserToDtoList(List<Usuario> users) {
        return users.stream()
                .map(this::convertUserToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Usuario getAuthemricatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return obtnerPorEmail(email);
    }
}
