import { navigateTo, useNuxtApp } from "nuxt/app";
import { useUser } from "../stores/user";
import { onBeforeMount } from "vue";

export default defineNuxtRouteMiddleware((to, from) => {
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
            return; 
        }
        if (to.path === '/login') {
            return;
        }
        return navigateTo('/login');
    }
});   