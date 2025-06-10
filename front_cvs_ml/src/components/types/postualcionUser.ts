

export interface PostulacionDTO {
    id: string; // UUID
    usuarioId: string; // UUID del usuario que realizó la postulación
    vacanteId: string; // UUID de la vacante a la que se postuló
    estadoPeticion:  string; // Ejemplos de estados posibles
    estadoPostulacion: string; // Ejemplos de estados de la postulación
    observacionIa: string; // Observaciones generadas por la IA
    enviadoEl: string; // Fecha y hora de envío de la postulación (en formato ISO 8601 string)
}