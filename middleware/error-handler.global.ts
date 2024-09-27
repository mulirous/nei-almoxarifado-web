import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useUser } from "../stores/user";
import { getItems } from "../services/items/itemsGET";
import { getRoles } from "../services/roles/rolesGET";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if(to.path === '/login' || to.path === '/cadastro' || to.path === '/recuperar-senha' || to.path === '/atualizar-senha'){
        return
    }
    const userStore = useUser();
    try{
        const res = await getRoles(userStore);
    } catch(err){
        return navigateTo('/login')
    }
    if(userStore.role === 'USER'){
        if(userStore.token == ''){
            return navigateTo('/login')
        }
        if(to.path.includes('/nei')){
            return 
        }
        return navigateTo('/nei/')
    }
})
