
export interface User {

}

export interface RegisterUser{
    name: string;
    email: string;
    password: string;
    telefono: string;
    role_user: string;
}

export interface UserDoCv{
    id: string;
    nombreOriginal: string;
    urlPublica: string;
}