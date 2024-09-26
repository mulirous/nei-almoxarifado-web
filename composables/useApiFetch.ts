import { navigateTo, useFetch, useRuntimeConfig } from "nuxt/app"

export const useApiFetch = (req, opts) => {
    const config = useRuntimeConfig();
    return useFetch(req, 
        {
            baseURL: config.public.baseURL, 
            ...opts,
            onResponseError({ response }) {
                if(response.status === 401){
                    navigateTo('/login')
                }
            }
        })
}