package com.redrd.back_cvs.config;

import com.redrd.back_cvs.exceptions.CustomAccessDeniedHandler;
import com.redrd.back_cvs.config.segurity.jwt.AuthTokenFilter;
import com.redrd.back_cvs.config.segurity.jwt.JwtAuthEntry;
import com.redrd.back_cvs.config.segurity.user.SecionUserDetailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

import static org.springframework.http.HttpMethod.OPTIONS;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class CiviIaConfig {

    private final SecionUserDetailService userDetailService;
    private final JwtAuthEntry authEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    @Autowired
    private final AuthTokenFilter authTokenFilter;


    // Listado de rutas - Aseguradas
    private static final List<String> SECURE_URLS = List.of(

            "/api/v2/users/**",
            "/api/v2/doc-cv/**",
            "/api/v1/orders/**"); // "/cv/**", quitado por mientras

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                // 1. Habilitar CORS explícitamente para Spring Security
                .cors(cors -> {}) // Esto le dice a Spring Security que use tu CorsConfigurationSource (de WebConfig)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 2. Permitir explícitamente las solicitudes OPTIONS a CUALQUIER RUTA
                        // Esta es la línea CRÍTICA y debe ir PRIMERO
                        .requestMatchers(OPTIONS, "/**").permitAll()
                        // 3. Luego, tus rutas seguras (que sí requieren autenticación para los métodos reales)
                        .requestMatchers(SECURE_URLS.toArray(String[]::new)).authenticated()
                        // 4. Cualquier otra ruta que no esté en SECURE_URLS será permitida sin autenticación
                        // (por ejemplo, tus endpoints de login/registro si no están en SECURE_URLS,
                        // o tus endpoints de vacantes públicos si existen)
                        .anyRequest().permitAll()
                );

        http.authenticationProvider(daoAuthenticationProvider());
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(){
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception{
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public ModelMapper modelMapper(){ return new ModelMapper(); }

    @Bean
    public PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
}
