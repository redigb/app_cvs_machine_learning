import { authApi } from "./config/axios";
import { PostulacionDTO } from "@/components/types/postualcionUser";

export const postulacionUser = async (vacanteId: string) => {
    try {
        const response = await authApi.post(`/postulacion/evaluar`, null, {
            params: {
                vacanteId: vacanteId
            }
        });
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error("Error al postular a la vacante:", error);
        throw error; // Propagar el error para que el frontend lo maneje
    }
};

export interface APIResponse<T> {
    message: string;
    data: T;
}

export const listPostulaciones = async (): Promise<PostulacionDTO[]> => { // <-- ¡Importante! Tipo de retorno aquí es PostulacionDTO[]
    try {
        const response = await authApi.get<APIResponse<PostulacionDTO[]>>('/postulacion/persona');
        // Asegúrate de que el 'data' dentro de response.data sea lo que se devuelve.
        return response.data.data; // <-- ¡Esto es lo que resuelve el problema!
    } catch (error) {
        console.error("Error al obtener las postulaciones:", error);
        throw error;
    }
};