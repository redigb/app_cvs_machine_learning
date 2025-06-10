package com.redrd.back_cvs.service.postulacion;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.redrd.back_cvs.dto.PostulacionDTO;
import com.redrd.back_cvs.dto.UserDto;
import com.redrd.back_cvs.enums.EstadoPeticion;
import com.redrd.back_cvs.enums.EstadoPostulacion;
import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.DocumentoCv;
import com.redrd.back_cvs.model.Postulacion;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.model.Vacante;
import com.redrd.back_cvs.repository.DocCvRepository;
import com.redrd.back_cvs.repository.PostulacionRepository;
import com.redrd.back_cvs.repository.VacanteRepository;
import com.redrd.back_cvs.service.DocCv.IDocCvService;
import com.redrd.back_cvs.service.WebScoket.IWebSocketService;
import com.redrd.back_cvs.service.vacante.IVacanteService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostulacionService implements IPostulacionService {

    // Repository
    private final PostulacionRepository postulacionRepository;
    private final VacanteRepository vacanteRepository;
    private final ModelMapper modelMapper;

    // Service
    private final IDocCvService docCvService;
    private final IWebSocketService webSocketService;

    @Override
    public Postulacion savePostulacionInicial(Usuario postulante, Vacante vacante){
        Postulacion postulacion = new Postulacion();
        postulacion.setUsuario(postulante);
        postulacion.setVacante(vacante);
        postulacion.setEstadoPeticion(EstadoPeticion.EN_REVISION);
        postulacion.setEstadoPostulacion(EstadoPostulacion.PENDIENTE);
        postulacion.setEnviadoEl(LocalDateTime.now());
        return postulacionRepository.save(postulacion);
    }

    /// El proseso corre en un diferente HI LO
    @Override
    @Async
    public void evaluarPostulacion(Postulacion postulacion) {
        try {
            // 1. Buscar el documento CV del usuario
            DocumentoCv docCv = docCvService.obtenerDocumentoPorUsuario(postulacion.getUsuario().getId());
            // 2. Cargar el archivo desde el disco
            File cvFile = new File(docCv.getArchivoUrl());
            if(!cvFile.exists()) {
                throw new RuntimeException("Archivo CV no encontrado: " + cvFile.getAbsolutePath());
            }
            // 3. Convertir la vacante a Json
            Vacante vacanteFull = vacanteRepository.findByIdFetchRequisitos(postulacion.getVacante().getId())
                    .orElseThrow(() -> new RuntimeException("Vacante no encontrada"));
            postulacion.setVacante(vacanteFull);
            ObjectMapper objectMapper = new ObjectMapper();
            String vacanteJsonStr = objectMapper.writeValueAsString(vacanteFull);
            // 4. Crear `MultiPart` request para enviar a la API externa
            MultiValueMap<String, Object> bodySend = new LinkedMultiValueMap<>();
            bodySend.add("file", new FileSystemResource(cvFile));
            bodySend.add("vacante_json", vacanteJsonStr);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(bodySend, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(
              "http://localhost:8000/evaluar_postulacion_cv",
                    requestEntity,
                    Map.class
            );
            Map<String, Object> result = response.getBody();
            String estadoStr = ((String) result.get("estado")).toUpperCase();
            // 5. Guardar la postulación con los datos de la respuesta
            postulacion.setEstadoPeticion(EstadoPeticion.OBSERVADO);
            postulacion.setEstadoPostulacion(EstadoPostulacion.valueOf(estadoStr));
            postulacion.setObservacionIa((String) result.get("observacion"));
            update(postulacion);
            PostulacionDTO postulacionDTO = converPostulacionDto(postulacion);
            // 6. Enviar notificación vía WebSocket al usuario
            webSocketService.notifyPostulationEvaluada(postulacionDTO);
        }catch (RuntimeException e){
            e.printStackTrace(); // error en Consola O usa logger
            throw new RuntimeException("Error al procesar la postulación: " + e.getMessage());
        } catch (Exception e){
            e.printStackTrace(); // error en Consola O usa logger
        }
    }

    @Override
    public Postulacion update(Postulacion postulacion) {
        if (!postulacionRepository.existsById(postulacion.getId())) {
            throw new RuntimeException("Postulacion no encontrada para actualizar");
        }
        return postulacionRepository.save(postulacion);
    }

    @Override
    public void deleteById(UUID id) {
        postulacionRepository.deleteById(id);
    }

    @Override
    public Postulacion findById(UUID id) {
        return postulacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulacion no encontrada"));
    }

    @Override
    public List<Postulacion> findAll() {
        return postulacionRepository.findAll();
    }

    @Override
    public List<Postulacion> findByPersonaId(Usuario persona) {
        return postulacionRepository.findByUsuarioId(persona.getId());
    }

    @Override
    public List<Postulacion> findByVacanteId(Vacante vacanteId) {
        return postulacionRepository.findByVacanteId(vacanteId);
    }

    @Override
    public PostulacionDTO converPostulacionDto(Postulacion postulacion) {
        return modelMapper.map(postulacion, PostulacionDTO.class);
    }

    @Override
    public List<PostulacionDTO> convertPostulacionDtoList(List<Postulacion> postulaciones) {
        return postulaciones.stream()
                .map(this::converPostulacionDto) // Esto produce PostulacionDTO
                .collect(Collectors.toList());    // Esto recolecta List<PostulacionDTO>
    }
}
