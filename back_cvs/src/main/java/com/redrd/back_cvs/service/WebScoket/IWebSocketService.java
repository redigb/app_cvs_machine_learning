package com.redrd.back_cvs.service.WebScoket;

import com.redrd.back_cvs.dto.PostulacionDTO;
import com.redrd.back_cvs.model.Postulacion;

public interface IWebSocketService {

    void notifyPostulationEvaluada(PostulacionDTO postulacion);
}
