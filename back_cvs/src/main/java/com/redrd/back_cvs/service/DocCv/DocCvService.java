package com.redrd.back_cvs.service.DocCv;

import com.redrd.back_cvs.model.DocumentoCv;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public class DocCvService implements IDocCvService{
    @Override
    public DocumentoCv subirDocumento(UUID usuarioId, MultipartFile archivo) throws IOException {
        return null;
    }

    @Override
    public DocumentoCv obtenerDocumentoPorUsuario(UUID usuarioId) {
        return null;
    }

    @Override
    public void eliminarDocumento(UUID usuarioId) {

    }

    @Override
    public DocumentoCv actualizarDocumento(UUID usuarioId, MultipartFile archivo) throws IOException {
        return null;
    }
}
