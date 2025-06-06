package com.redrd.back_cvs.controller;


import com.redrd.back_cvs.Dto.DocumentoCvDto;
import com.redrd.back_cvs.exceptions.AlreadyExistException;
import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.DocumentoCv;
import com.redrd.back_cvs.response.ApiResponse;
import com.redrd.back_cvs.service.DocCv.IDocCvService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/doc-cv")
public class CvsController {

    private final IDocCvService docCvService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> subirCv(@RequestParam UUID usuarioId,
                                               @RequestParam MultipartFile archivo) {
        try {
            DocumentoCv doc = docCvService.subirDocumento(usuarioId, archivo);
            return ResponseEntity.ok(new ApiResponse("Archivo subido exitosamente!", doc));
        } catch (AlreadyExistException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse("CV ya registrado. Usa actualizar.", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Formato no permitido. Solo PDF o Word.", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse("Error al subir el archivo: " + e.getMessage(), null));
        }
    }

    @GetMapping("/view/{usuarioId}/cv")
    public ResponseEntity<ApiResponse> obtenerCv(@PathVariable UUID usuarioId, HttpServletRequest request) {
        try {
            DocumentoCv doc = docCvService.obtenerDocumentoPorUsuario(usuarioId);

            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            String archivoNombre = Paths.get(doc.getArchivoUrl()).getFileName().toString();
            String urlPublica = baseUrl + "/cv/" + archivoNombre;

            DocumentoCvDto DtoDocCv = new DocumentoCvDto( doc.getId(), doc.getNombreOriginal(), urlPublica);
            return ResponseEntity.ok(new ApiResponse("CV encontrado", DtoDocCv));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body( new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{usuarioId}/delete")
    public ResponseEntity<ApiResponse> eliminarCv(@PathVariable UUID usuarioId) {
        try {
            docCvService.eliminarDocumento(usuarioId);
            return ResponseEntity.ok(new ApiResponse("CV eliminado correctamente", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }catch (IOException e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error al eliminar el archivo del disco: " + e.getMessage(), null));
        }
    }

    @PutMapping("/update/{usuarioId}")
    public ResponseEntity<ApiResponse> actualizarCv(@PathVariable UUID usuarioId,
                                          @RequestParam MultipartFile archivo) {
        try {
            DocumentoCv documento = docCvService.actualizarDocumento(usuarioId, archivo);
            return ResponseEntity.ok(new ApiResponse("Su cv se actualizo correctamente", documento));
        } catch (Exception e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
