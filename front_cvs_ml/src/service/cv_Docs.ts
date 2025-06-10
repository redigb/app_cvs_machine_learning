import { authApi as axios } from "./config/axios"

export const obtnerCvIdUsuario = async () => {
    const response = await axios.get(`/doc-cv/view/cv`)
    return response.data.data; 
}

export const uploadCv = async (filePdf: File) => {
    const formData = new FormData();
    // 'file' debe coincidir con el nombre que tu backend espera para el archivo
    formData.append('archivo', filePdf);

    return axios.post('/doc-cv/upload', formData, {
        headers: {
            // Este encabezado es crucial para la subida de archivos
            'Content-Type': 'multipart/form-data',
        },
        // Opcional: podrías incluir un callback de progreso si lo necesitas
        // onUploadProgress: (progressEvent) => {
        //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //   console.log(`Progreso de subida: ${percentCompleted}%`);
        // },
    });
};

export const updateCVIdUsuario = async (id: string, filePdf: File) => {
    const formData = new FormData();
    formData.append('archivo', filePdf)

    return axios.put(`/doc-cv/update/${id}`, formData, {
        headers: {
            // Este encabezado es crucial para la subida de archivos
            'Content-Type': 'multipart/form-data',
        }
    });
}

// falta: useAuth: true
export const deleteCVusuario = async (id: string) => {
    try {
        const response = await axios.delete(`/doc-cv/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el CV:", error);
        throw error;
    }
};