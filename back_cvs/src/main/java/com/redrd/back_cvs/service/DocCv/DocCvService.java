package com.redrd.back_cvs.service.DocCv;

import com.redrd.back_cvs.exceptions.AlreadyExistException;
import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.DocumentoCv;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.repository.DocCvRepository;
import com.redrd.back_cvs.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;



@Service
@RequiredArgsConstructor
public class DocCvService implements IDocCvService{

    private final DocCvRepository docCvRepository;
    private final UsuarioRepository usuarioRepository;

    @Value("${spring.application.directorio-cv}")
    private String directorioCv;
    @PostConstruct
    public void init() {
        File dir = new File(directorioCv);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    @Override
    public DocumentoCv subirDocumento(UUID usuarioId, MultipartFile archivo) throws IOException {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (docCvRepository.findByUsuarioId(usuarioId).isPresent()) throw new AlreadyExistException("El usuario ya tiene un CV registrado. Use actualizar en su lugar.");
        validarFormato(archivo);
        // armado de ruta para el archivo
        Path path = Paths.get(directorioCv, archivo.getOriginalFilename());
        Files.copy(archivo.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        DocumentoCv doc = new DocumentoCv();
        doc.setUsuario(usuario);
        doc.setArchivoUrl(path.toString());
        doc.setNombreOriginal(archivo.getOriginalFilename());

        return docCvRepository.save(doc);
    }

    @Override
    public DocumentoCv obtenerDocumentoPorUsuario(UUID usuarioId) {
        Usuario userDoc = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no existente"));;
        return docCvRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("CV no encontrado para el usuario " + userDoc.getEmail()));
    }

    @Override
    @Transactional
    public void eliminarDocumento(UUID usuarioId) throws IOException{
        DocumentoCv doc = obtenerDocumentoPorUsuario(usuarioId);
        // Romper la relación
        Usuario usuario = doc.getUsuario();
        usuario.setDocumentoCv(null);
        usuarioRepository.save(usuario);
        // Eliminar archivo del disco
        Path path = Paths.get(doc.getArchivoUrl());
        Files.deleteIfExists(path);
        docCvRepository.delete(doc);
    }

    @Override
    public DocumentoCv actualizarDocumento(UUID usuarioId, MultipartFile archivo) throws IOException {
        DocumentoCv existente = obtenerDocumentoPorUsuario(usuarioId);
        validarFormato(archivo);

        // Eliminar el archivo anterior si existe
        Path antiguoPath = Paths.get(existente.getArchivoUrl());
        Files.deleteIfExists(antiguoPath);

        // Guardar el nuevo archivo
        Path nuevoPath = Paths.get(directorioCv, archivo.getOriginalFilename());
        Files.copy(archivo.getInputStream(), nuevoPath, StandardCopyOption.REPLACE_EXISTING);

        // Actualizar campos
        existente.setArchivoUrl(nuevoPath.toString());
        existente.setNombreOriginal(archivo.getOriginalFilename());

        return docCvRepository.save(existente);
    }

    private void validarFormato(MultipartFile archivo) {
        String tipo = archivo.getContentType();
        List<String> permitidos = List.of(
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/msword"
        );
        if (!permitidos.contains(tipo)) {
            throw new IllegalArgumentException("Formato de archivo no permitido: " + tipo);
        }
    }

    // nesesitamos un DTO que devuelva solo la ruta - del cv
}
