import { publicApi } from "./config/axios";


export const listVacantes = async() =>{
    const response = await publicApi.get("/vacantes/list");
    return response.data.data;
}

export const obtnerVacanteId = async(id: string) =>{
    const response = await publicApi.get(`/vacantes/${id}`)
    return response.data.data;
}