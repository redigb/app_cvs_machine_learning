package com.redrd.back_cvs.service.WebScoket;

import com.redrd.back_cvs.dto.PostulacionDTO;
import com.redrd.back_cvs.model.Postulacion;
import com.redrd.back_cvs.model.Usuario;
import com.redrd.back_cvs.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService implements IWebSocketService{

    private final SimpMessagingTemplate messagingTemplate;

    // service
    private final IUserService userService;

    @Override
    public void notifyPostulationEvaluada(PostulacionDTO postulacion){
        Usuario userPostulacion = userService.obtenerPorId(postulacion.getUsuarioId());
        String username = userPostulacion.getEmail();
        // Puedes personalizar la ruta con el ID del usuario si quieres enviar a un canal específico
        String destination = "/topic/postulacion/" + postulacion.getUsuarioId(); // via canal de entrada
        System.out.println("Enviando WS a destino: " + destination + " con postulacion: " + postulacion);
        messagingTemplate.convertAndSend(destination,postulacion);
    }
}
