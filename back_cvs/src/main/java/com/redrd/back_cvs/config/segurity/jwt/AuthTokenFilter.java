package com.redrd.back_cvs.config.segurity.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redrd.back_cvs.config.segurity.user.SecionUserDetailService;
import com.redrd.back_cvs.response.ApiResponse;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final SecionUserDetailService userDetailsService;
    private final TokenBlacklist tokenBlacklist;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            String jwt = parseJwt(request);
            if (StringUtils.hasText(jwt)){
                // 1. Verificar si el token está en la blacklist (revocado)
                if (tokenBlacklist.isRevoked(jwt)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    ApiResponse apiResponse = new ApiResponse("Token inválido: sesión cerrada", null);
                    String jsonResponse = objectMapper.writeValueAsString(apiResponse);
                    response.getWriter().write(jsonResponse);
                    return;  // Termina el filtro aquí, no sigue con la autenticación
                }

                if (jwtUtils.validateToken(jwt)) {
                    String username = jwtUtils.getUsernameFromToken(jwt);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (JwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            ApiResponse apiResponse = new ApiResponse(e.getMessage() + " : Token no válido o vencido, puede iniciar sesión e intentarlo nuevamente", null);
            String jsonResponse = objectMapper.writeValueAsString(apiResponse);
            response.getWriter().write(jsonResponse);
            return;
        } catch (Exception e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    ///  Filter Token 256 -
    private String parseJwt(HttpServletRequest request){
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")){
            return headerAuth.substring(7);
        }
        return null;
    }
}
