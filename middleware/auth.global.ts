import { navigateTo, useNuxtApp } from "nuxt/app";
import { useUser } from "../stores/user";
import { onBeforeMount } from "vue";
import { getUserByEmail, getUserId } from "../services/users/userGET";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUser();
    if(userStore.token == ''){
        if (to.path === '/login' || to.path === '/cadastro' || to.path === '/recuperar-senha' || to.path === '/atualizar-senha') {
            return;
        }
        return navigateTo('/login')
    }
    if(process.client){
        let token = localStorage.getItem("session");
        if(token){
            try{
                const res = await getUserId(userStore, userStore.id);
                return; 
            } catch(err){
                localStorage.removeItem("session");
                navigateTo('/login');
                throw new Error(`Token expirado: ${err}`)
            }
        }
        if (to.path === '/login') {
            return;
        }
        return navigateTo('/login');
    }
});   