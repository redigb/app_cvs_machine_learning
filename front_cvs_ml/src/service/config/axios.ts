import axios from "axios";
import { useAuthStore } from "../store/auth";

// cambia segun el arranque "dev" // "prod"
//const isDev = import.meta.env.MODE === "development";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
// Aotomatic conect - backend with axios
export const authApi = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// api autenticada
authApi.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


// Interceptor de RESPUESTA para manejar errores como 401 Unauthorized
authApi.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa, simplemente la devolvemos
        return response;
    },
    (error) => {
        // Captura el estado HTTP de la respuesta de error
        const status = error.response?.status;

        // Si el error es 401 Unauthorized y no es una solicitud de login (para evitar bucles)
        // También puedes añadir 403 Forbidden si tu backend lo usa para "no autorizado"
        if (status === 401) {
            console.warn("Se recibió un 401 Unauthorized. Cerrando sesión...");
            // Cierra la sesión en tu store de Zustand
            useAuthStore.getState().logout();

            // Redirige al usuario a la página de login
            // Es una buena práctica verificar la ruta actual para evitar redirecciones redundantes
            if (typeof window !== 'undefined' && window.location.pathname !== "/login") {
                window.location.href = "/login"; // Redirige a la página de login
            }
            // Opcional: También puedes usar el router de Next.js si estás en un componente de React.
            // import { useRouter } from 'next/router';
            // const router = useRouter();
            // router.push('/login');
        }
        // Puedes añadir manejo para otros errores si lo deseas, por ejemplo, "Network Error"
        else if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
            console.error("Error de red: No se pudo conectar al servidor.");
            // Opcional: Mostrar una notificación al usuario
        }
        // Siempre rechaza la promesa para que el error pueda ser capturado por el código que hizo la llamada
        return Promise.reject(error);
    }
);

// api sin auytenticaion
export const publicApi = axios.create({
    baseURL: baseURL,
});