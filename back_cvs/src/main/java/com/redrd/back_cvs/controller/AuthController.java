package com.redrd.back_cvs.controller;

import com.redrd.back_cvs.dto.UserDto;
import com.redrd.back_cvs.enums.RoleUsers;
import com.redrd.back_cvs.exceptions.AlreadyExistException;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.request.CreateUserRequest;
import com.redrd.back_cvs.request.LoginRequest;
import com.redrd.back_cvs.response.ApiResponse;
import com.redrd.back_cvs.response.JwtResponse;
import com.redrd.back_cvs.config.segurity.jwt.JwtUtils;
import com.redrd.back_cvs.config.segurity.jwt.TokenBlacklist;
import com.redrd.back_cvs.config.segurity.user.SecionUserDetails;
import com.redrd.back_cvs.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/auth")
public class AuthController {

    private final IUserService userService;
    // solo login
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private  final TokenBlacklist tokenBlacklist;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request){
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateTokenForUSer(authentication);
            SecionUserDetails userDetails = (SecionUserDetails) authentication.getPrincipal();
            JwtResponse jwtResponse = new JwtResponse(userDetails.getId(), jwt);
            return ResponseEntity.ok(new ApiResponse("Inicio de secion exitoso.", jwtResponse));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(UNAUTHORIZED).body(new ApiResponse(e.getMessage(), null));
        }
    }

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
            return ResponseEntity.ok(new ApiResponse("Usuario creado exitosament, inicie secion en login", userDto));
        } catch (AlreadyExistException e) {
            return ResponseEntity.status(CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    // cerrar-secion
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        tokenBlacklist.revoke(token);
        return ResponseEntity.ok(new ApiResponse("Sesión cerrada correctamente", null));
    }
}
