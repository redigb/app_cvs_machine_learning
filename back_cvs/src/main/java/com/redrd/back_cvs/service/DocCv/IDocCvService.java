package com.redrd.back_cvs.service.DocCv;

import com.redrd.back_cvs.model.DocumentoCv;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface IDocCvService {
    DocumentoCv subirDocumento(UUID usuarioId, MultipartFile archivo) throws IOException;
    DocumentoCv obtenerDocumentoPorUsuario(UUID usuarioId);
    void eliminarDocumento(UUID usuarioId) throws IOException;
    DocumentoCv actualizarDocumento(UUID usuarioId, MultipartFile archivo) throws IOException;
}
