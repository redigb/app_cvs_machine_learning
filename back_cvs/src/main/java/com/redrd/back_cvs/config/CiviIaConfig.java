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
            "/cv/**",
            "/api/v2/users/**",
            "/api/v2/doc-cv/**",
            "/api/v1/orders/**");

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers(SECURE_URLS.toArray(String[]::new)).authenticated()
                        .anyRequest().permitAll());

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
