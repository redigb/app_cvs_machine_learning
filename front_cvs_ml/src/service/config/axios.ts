import axios from "axios";
import { useAuthStore } from "../store/auth";
import { log } from "console";

// cambia segun el arranque "dev" // "prod"
//const isDev = import.meta.env.MODE === "development";

const baseURL =  process.env.NEXT_PUBLIC_API_URL;

// Aotomatic conect - backend with axios
const authApi = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// añadir token automaticamente
authApi.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Manejo automático de errores de autenticación o red
/*authApi.interceptors.response.use(
    response => response,
    error => {
        const status = error?.response?.status;

        if (status === 401 ) {
            console.warn("Token expirado o acceso denegado. Cerrando sesión...");
            useAuthStore.getState().logout();
            window.location.href = "/login";
        }

        // Si el servidor está caído o sin conexión
        if (error.code === "ECONNABORTED" || error.message === "Network Error") {
            console.warn("No hay conexión con el servidor. Cerrando sesión...");
            useAuthStore.getState().logout();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);*/

export default authApi;