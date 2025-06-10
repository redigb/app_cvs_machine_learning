import {authApi as axios, publicApi} from "./config/axios";


export const loginRequest = async (email: String, password: String) => {
    return publicApi.post('/auth/login', {
        email,
        password
    });
}


export const logoutRequest = async () => {
    return axios.post('/auth/logout');
};


export const registerUserRequest = async (data: {
    name: string;
    email: string;
    telefono: string;
    password: string;
    role_user: string;  // solo : POSTULANTE o CIUDADANO
}) => {
    return await publicApi.post('/auth/register', data);
};
