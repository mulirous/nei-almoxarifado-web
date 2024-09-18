import axios from 'axios';
import { useUser } from '../stores/user';
export const useApi = () => {
    const userStore = useUser()
    const api = axios.create({
        //baseURL: 'https://almoxarifado.nei.ufrn.br/api/api/v1/',
        baseURL: 'http://192.168.0.5:8080/api/v1/',
    });
    return api
}
