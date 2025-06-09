import axios from "./config/axios"


export const listVacantes = async() =>{
    const response = await axios.get("/vacantes/list");
    return response.data.data;
}