package com.redrd.back_cvs.data;


import com.redrd.back_cvs.enums.RoleUsers;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.model.Vacante;
import com.redrd.back_cvs.repository.UsuarioRepository;
import com.redrd.back_cvs.repository.VacanteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Transactional
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private final VacanteRepository vacanteRepository; // crear 12 vacantes, Tecnología, Finanzas, Desarrollo Social ->  relacioanda a estas areas.
    private final UsuarioRepository usuarioRepository; // Crear usuario con el rol "EVALUADOR" solo 2
    private final PasswordEncoder passwordEncoder;


    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        crearUsuariosEvaluadores();
        crearVacantes();
    }


    private void crearVacantes() {
        String[] areas = {"Tecnología", "Finanzas", "Desarrollo Social"};

        // Requisitos por área
        Map<String, List<String>> requisitosPorArea = Map.of(
                "Tecnología", List.of(
                        "Conocimiento en Java",
                        "Experiencia con bases de datos",
                        "Manejo de APIs REST"
                ),
                "Finanzas", List.of(
                        "Conocimiento en contabilidad",
                        "Análisis financiero",
                        "Manejo de Excel avanzado"
                ),
                "Desarrollo Social", List.of(
                        "Experiencia en trabajo comunitario",
                        "Capacidad de liderazgo",
                        "Conocimiento en políticas sociales"
                )
        );

        for (String area : areas) {
            List<String> requisitos = requisitosPorArea.get(area);

            for (int i = 1; i <= 4; i++) { // 4 vacantes por área
                Vacante vacante = new Vacante();
                vacante.setTitulo(area + " Vacante " + i);
                vacante.setArea(area);
                vacante.setModalidad("Presencial");
                vacante.setUbicacion("Ciudad X");
                vacante.setPuestos(1);

                // Asignar 3 requisitos distintos por vacante, rotando la lista para variar
                List<String> requisitosVacante = List.of(
                        requisitos.get((i - 1) % requisitos.size()),
                        requisitos.get((i) % requisitos.size()),
                        requisitos.get((i + 1) % requisitos.size())
                );
                vacante.setRequisitos(requisitosVacante);

                vacante.setSalario("S/. 3000");
                vacante.setEstado("Activo");

                vacanteRepository.save(vacante);
            }
        }
    }


    private void crearUsuariosEvaluadores() {
        String rolEvaluador = "EVALUADOR";
        for (int i = 1; i <= 2; i++) {
            Usuario usuario = new Usuario();
            usuario.setName("Evaluador " + i);
            usuario.setEmail("evaluador" + i + "@empresa.com");
            usuario.setPassword(passwordEncoder.encode("password123"));
            usuario.setUser_rol(RoleUsers.EVALUADOR);
            usuarioRepository.save(usuario);
        }
    }
}
