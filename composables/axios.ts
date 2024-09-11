import axios from 'axios';
import { useUser } from '../stores/user';
export const useApi = () => {
    const userStore = useUser()
    const api = axios.create({
        baseURL: 'https://almoxarifado.nei.ufrn.br:8080/api/v1/',
    });
    return api
}