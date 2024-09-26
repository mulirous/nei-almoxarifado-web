<template>
    <div class="error-container">
        <h1 class="text-warning">{{error.statusCode}}</h1>
        <h2>{{ errorTitle }}</h2>
        <p>{{ errorDescription }}</p>
        <p v-if="errorFlag" class="p-2 rounded-2 bg-primary text-light" type="text">Contato do suporte: suportealmoxarifado@nei.ufrn.br</p>
        <a v-if="!errorFlag" class="btn btn-primary rounded-1" href="/">Voltar para a Página Inicial</a>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { navigateTo } from 'nuxt/app';
import { onMounted, ref } from 'vue';

definePageMeta({
    layout: 'error'
})
const props = defineProps({
  error: Object as () => NuxtError
})

const errorFlag = ref(false);
const errorTitle = ref('');
const errorDescription = ref('');
switch(props.error.statusCode){
    case 401:
        errorTitle.value = 'Acesso Proibido';
        errorDescription.value = 'Você não tem permissão para acessar esta página.';
        break;
    case 403:
        errorTitle.value = 'A página que você está procurando não existe.';
        errorDescription.value = 'Você não está autorizado a acessar esta página.';
        break;
    case 404:
        errorTitle.value = 'Página Não Encontrada';
        errorDescription.value = 'A página pesquisada não existe.';
        break;
    case 500:
        errorTitle.value = 'Sistema Fora do Ar';
        errorFlag.value = true;
        errorDescription.value = 'Ajustes estão sendo feitos no servidor. Por favor, tente novamente mais tarde.';
        break;
    case 503:
        errorTitle.value = 'Serviço Indisponível';
        errorFlag.value = true;
        errorDescription.value = 'O serviço está temporariamente indisponível. Por favor, tente novamente mais tarde.';
        break;
    default:
        errorTitle.value = 'Erro Interno do Sistema';
        errorFlag.value = true;
        errorDescription.value = 'Algum erro ocorreu, contate o suporte.';
        break;
}
onMounted(() => {
    let token = localStorage.getItem("session");
    if((props.error.statusCode === 500 && token) || (props.error.statusCode === 401 && token)){
        navigateTo('/login')
    }
})
</script>

<style scoped>
.error-container {
    text-align: center;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: auto;
}

.error-container h1 {
    font-size: 6em;
    margin: 0;
    color: #dc3545;
}

.error-container h2 {
    font-size: 1.5em;
    margin: 10px 0;
    color: #333;
}

.error-container p {
    margin: 20px 0;
    color: #666;
}

.error-container button {
    padding: 10px 20px;
    font-size: 1em;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.error-container button:hover {
    background-color: #0056b3;
}
</style>