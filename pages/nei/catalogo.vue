<template>
<ModalItemDetails v-if="itemsCache.length > 0" :item_index="itemIndex" :item_route="currentRoute" :item_details="searchItem ? searchItem : currentItem"/>
<ModalActionConfirm>
    <template v-slot:title> Confirmar aceitação </template>
    <template v-slot:text> 
        <div v-if="itemsCache.length > 0" class="d-block">
            <div class="d-flex">
                <div class="d-block mb-2 pe-2">
                    <label for="item-name">Nome do Item</label>
                    <input readonly class="form-control bg-light-emphasis" :value="currentItem.name">
                </div>
                <div class="d-block mb-2 ps-2">
                    <label for="item-name">Quantidade Disponível</label>
                    <input readonly class="form-control bg-light-emphasis" :value="currentItem.quantity">
                </div>
            </div>
            <div class="d-flex">
                <div class="d-block mb-2 pe-2">
                    <label for="item-name">Tipo unitário</label>
                    <input readonly class="form-control bg-light-emphasis" :value="currentItem.type">
                </div>
                <div class="d-block mb-2 ps-2">
                    <label for="item-name">Situação</label>
                    <input readonly class="form-control bg-light-emphasis" :value="currentItem.available === true ? 'disponível' : 'indisponível'">
                </div>
            </div>
            <h6 class="text-dark"> Mensagem para a solicitação </h6>
            <textarea v-model="description" class="form-control textarea"> </textarea>
            <div class="d-block mt-2">
                <label for="item-qtd">Quantidade a ser solicitada</label> 
                <input class="form-control" style="width: 225px !important;" v-model="itemQtd" type="number" pattern="[0,9]*" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
            </div>
        </div>
    </template>
    <template v-slot:buttons> 
        <button data-bs-dismiss="modal" class="btn btn-light-alert text-light mx-2"> Cancelar </button>
        <button @click="sendRequest()" data-bs-dismiss="modal" class="btn btn-secondary mx-2"> Enviar </button>
    </template>
</ModalActionConfirm>
<div class="table-container d-block mt-2">
    <button class="d-none searching-btn" data-bs-toggle="modal" data-bs-target="#itemDetailing"></button>
    <div class="sub-catalog bg-light mb-4 ps-2 pe-2">
        <h6 class="sub-catalog-title ps-2 d-flex align-items-center opacity-75">
            <IconsInformation class="me-2"/>
            Descrição da página
        </h6>
        <p class="sub-catalog-text opacity-75">Nesta página temos todos os itens disponíveis do almoxarifado(itens esgotados devem ser cadastrados novamente). 
            Ademais, o cadastro de novos itens e reposição da quantidade de algum item já existente é feito pelo botão 
        <span class="border-bottom border-dark-success pb-1">Adicionar <IconsPlus style="margin-bottom: 0px;"  width="18px" height="18px"/></span></p>
    </div>
    <div class="table-box row d-block">
        <div class="table-actions d-flex justify-content-between aling-items-center" style="margin-bottom: -1px !important;">
            <div class="d-flex">
                <ButtonsFilter v-if="uploadReloader === 1" style="margin-top: 3px;" />
            </div>
            <span v-if="itemsLoad" class="position-sticky d-flex align-items-center bg-primary table-searchbar">
                <input id="tableSearch" v-model="searchInput" class="searchbar bg-light form-control" placeholder="Pesquisar"/>          
                <IconsSearchGlass class="bg-primary text-light search-glass"/>
            </span>
        </div>
        <TablesTable>
            <template v-slot:header>
                <tr style="border: 1px #D9D9D9 solid;">
                    <th class="col-title py-2 border" scope="col">Nome</th>
                    <th class="col-title py-2 border" scope="col">Código Sipac</th>
                    <th class="col-title py-2 border" scope="col">Tipo Unitário</th>
                    <th class="col-title py-2 border" scope="col">Quantidade</th>
                    <th class="col-title py-2" scope="col">Última atualização</th>
                    <th class="col-title py-2" scope="col">Ações</th>
                </tr>
            </template>
            <template v-slot:content>
            <tr v-if="itemsCache.length > 0" v-for="(item, index) in itemsCache[cacheIndex]" :key="index" :data-index="index">
               <th class="border" scope="row">
                    <span>{{ item.name }}</span>
               </th>
               <th class="border">
                   <span v-if="item.sipacCode">{{ item.sipacCode }}</span>
                   <span v-else>nenhum</span>
                </th>
                <th class="border">
                    <span>{{ item.type }}</span>
                </th>
               <th class="border">
                   <span>{{ item.quantity }}</span>
                </th>
               <th class="border">
                   <span>{{ item.lastRecord.operation }} {{  item.lastRecord.creationDate.slice(0, 16) }} {{ item.lastRecord.user.name }}</span>
               </th>
               <th class="border" width="5%">
                   <TooltipsRectangular class="toolTip" style=" right: 7.4%; margin-top: -50px;" :toolTipState="toolTipState[0][index] ? toolTipState[0][index] : false" :toolTipText="'Detalhes'"/>
                   <TooltipsRectangular class="toolTip" style=" right: 6%; margin-top: -50px;" :toolTipState="toolTipState[1][index] ? toolTipState[1][index] : false" :toolTipText="'Solicitar'"/>
                   <button @mouseover="toolTipState[0][index] = true" @mouseout="toolTipState[0][index] = false" class="my-0 ms-2 details-btn position-sticky table-btn btn btn-primary" :class="{'d-none': store.isMobile}"  @click="showDetails(index)" data-bs-toggle="modal" data-bs-target="#itemDetailing">
                       <IconsSearchGlass width="18px" height="19px"/>
                   </button>
                   <button @mouseover="toolTipState[1][index] = true" @mouseout="toolTipState[1][index] = false" class="my-0 details-btn position-sticky table-btn btn btn-secondary" :class="{'d-none': store.isMobile}"  @click="showConfirm(index)" data-bs-toggle="modal" data-bs-target="#actionConfirm">
                        <IconsSolicitation width="16px" height="16px"/>
                    </button>
               </th>
            </tr>
            <div v-else-if="itemsCache.length === 0 && !initialLoading" class="search-empty position-absolute mt-5">
                <p class="text-dark-emphasis fs-5 opacity-50">Nenhum item Encontrado.</p>
            </div>
        </template>
        </TablesTable>
    </div>
    <div class="d-flex justify-content-between me-2 mt-2">
        <span v-if="itemsCache.length > 0" class="ms-2 pages-info">Quantidade de itens da página: {{ itemsCache[cacheIndex].length }}</span>
        
        <nav v-if="itemsCache.length > 0 && finded.length === 0" aria-label="Page navigation" class="pagination">
            <ul class="pagination">
                <li class="page-item">
                    <button class="page-link bg-primary text-light" :class="{'bg-dark-emphasis disabled': pagination == 0}" id="backPageBtn" @click="backPage"><span aria-hidden="true">&laquo;</span></button>
                </li>
                <li class="page-item" :key="0">
                    <button class="page-link text-light" @click="page(0)" :class="{'bg-primary': !pagesFocus[0], 'bg-secondary': pagesFocus[0]}">{{ 1 }}</button>
                </li>
                <li v-show="pagination > 1" class="page-item">
                    <button class="page-link bg-primary text-light">...</button>
                </li>
                <li class="page-item" v-for="i in totalPages >= 3 ? range(1+paginationRet, 3+paginationRet) : range(1,totalPages)" :key="i-1">
                    <button class="page-link text-light" @click="page(i-1)" :class="{'bg-primary': !pagesFocus[i-1], 'bg-secondary': pagesFocus[i-1]}">{{ i }}</button>
                </li>
                <li v-show="totalPages > 3 && paginationRet < totalPages-4" class="page-item">
                    <button class="page-link bg-primary text-light">...</button>
                </li>
                <li class="page-item" :key="totalPages-1">
                    <button class="page-link text-light" @click="page(totalPages-1)" :class="{'bg-primary': !pagesFocus[totalPages-1], 'bg-secondary': pagesFocus[totalPages-1]}">{{ totalPages }}</button>
                </li>
                <li class="page-item">
                    <button class="page-link bg-primary text-light" :class="{'bg-dark-emphasis disabled': pagination == totalPages-1 || searchInput !== ''}" id="fowardPageBtn" @click="fowardPage"><span aria-hidden="true">&raquo;</span></button>
                </li>
            </ul>
        </nav>
    </div>
</div>
</template>

<script setup>
import { useStorageStore } from '../../stores/storage.ts';
import { useSearch } from '../../stores/search.ts';
import { ref, computed, onMounted, onUpdated, inject } from 'vue';
import { getItem, getItems } from '../../services/items/itemsGET.ts';
import { useUser } from '../../stores/user.ts';
import { usePopupStore } from '../../stores/popup.ts';
import { postRequest } from '../../services/requests/requestsPOST.ts';
definePageMeta({
    layout: 'client'
})
/*SETANDO STORES*/
const userStore = useUser()
const store = useStorageStore();
const searchStore = useSearch();
const popUpStore = usePopupStore();
/*VARIÁVEIS ÚTEIS PARA REQUISITAR OS ITENS E FILTRÁ-LOS*/ 
const paginationRet = ref(1)
function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

let pagination = ref(0); //paginação padrão
let invertedPagination = ref(0); //paginação invertida para filtro
let queryParams = ref({ 
    sort: 'id,desc', 
    isInverted: false
});

const itemQtd = ref(0);
//Aqui faço a requisição em si, também possui parâmetros de filtros, sendo o padrão o de últimos atualizados(como está no banco de dados)
const itemsCache = ref([]);
const searchCache = ref([])
const cacheIndex = ref(0);
const totalPages = ref(0);
const isSearching = ref(false);
let finded = [];
const itemsReq = async (sort, isInverted, pagination, loadRequest, paginationInverted) => {
    if(searchInput.value != ''){
        finded = [];
        store.isReloadItems = true;
        if(searchCache.value.length >= totalPages.value){
            for(let i = 0; i < searchCache.value.length; i++){
                for(let j = 0; j < searchCache.value[i].length; j++){
                    if(searchCache.value[i][j].name.includes(searchInput.value)){
                        finded.push(searchCache.value[i][j]);
                    }
                    if(finded.length >= 20){ 
                        itemsCache.value.push(finded);
                        return 0
                    };
                }
                if(finded.length >= 20){ 
                        itemsCache.value.push(finded);
                        return 0
                };
            }
            if(finded.length === 0){
                itemsCache.value = [];
                return 0;
            }
            itemsCache.value.push(finded);
            return 0;
        }
        for(let i = 0; i < totalPages.value; i++){
            const res = await getItems(userStore, i, sort);
            searchCache.value.push(res.content);
            for(let j = 0; j < res.content.length; j++){
                if(res.content[j].name.includes(searchInput.value)){
                    finded.push(res.content[j]);
                }
                if(finded.length >= 20){ 
                    itemsCache.value.push(finded);
                    return 0
                };
            }
            if(finded.length >= 20){ 
                itemsCache.value.push(finded);
                return 0
            };
        }
        if(finded.length === 0){
            itemsCache.value = [];
            return 0;
        }
        itemsCache.value.push(finded);
        return 0;
    }
    if(isInverted){
        const res = await getItems(userStore, paginationInverted, sort)
        totalPages.value = res.totalPages
        invertedPagination.value = totalPages-1;
        itemsCache.value.push(res.content);
        return res.totalPages
    } 
    const res = await getItems(userStore, pagination, sort)
    totalPages.value = res.totalPages
    invertedPagination.value = totalPages-1;
    loadRequest ? cacheIndex.value++ : 0;
    itemsCache.value.push(res.content);
    return res.totalPages
};


const searchInput = ref("");
const initialLoading = ref(true);
let reqsIndexCache = [0];
let typingTimer; 
const debounceTime = 1000; 
const itemsLoad = computed(async() => {
    if(initialLoading.value === true){
        await itemsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted);
        return 0;
    }
    if(searchInput.value != ''){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            itemsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted)
        }, debounceTime);
        isSearching.value = true;
    }
    if(searchInput.value === ''){
        if(isSearching.value === true){
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                store.isReloadItems = true;
                isSearching.value = false;
            }, debounceTime-500);
            finded = [];
        }
    }
    for(let i = 0; i < reqsIndexCache.length; i++){
        if(pagination.value === reqsIndexCache[i]){
            cacheIndex.value = i;        
            return 0;
        }
    }
    itemsReq(queryParams.value.sort, false, pagination.value, true, queryParams.value.isInverted);
    reqsIndexCache.push(pagination.value)
})


provide('setItemsFilter', (filter, inverted) => {
    queryParams.value.sort = filter;
    queryParams.value.isInverted = inverted;
    store.isReloadItems = true;
    //reloadItems(queryParams.value.sort, queryParams.value.isInverted, invertedPagination.value)
});
//Variáveis que o front vai pegar em si
const itemIndex = ref(0);
const currentItem = computed(() => itemsCache.value[cacheIndex.value][itemIndex.value]);

const currentRoute = useRoute().fullPath.split('/')[2];


/*CÓDIGO PARA PAGINAÇÃO EM SI E RENDERIZAÇÃO DOS ITENS*/
let pagesFocus = ref([true]);
for(let i = 0; i < totalPages; i++){
    pagesFocus.value.push(false);
};
let count = 0;


const uploadReloader = computed(() => {
    if(store.isReloadItems === true){
        pagination.value = 0;
        cacheIndex.value = 0;
        itemsCache.value = [];
        reqsIndexCache = [0]

        itemsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted);

        paginationRet.value = 1;
        initialLoading.value = false
        store.isReloadItems = false;

        pagesFocus.value[count] = false;
        count = 0;  
        pagesFocus.value[0] = true;
        return 1
    } 
    return 1;
})
const page = (async (index) => {
    if (index <= 1 || index > totalPages.value - 3) {
        if (index === 0) {
            paginationRet.value = index + 1;
        } else if (index === totalPages.value - 1) {
            paginationRet.value = index - 3;
        } else {
            paginationRet.value = paginationRet.value;
        }
    } else {
        paginationRet.value = index - 1;
    }
    pagination.value = index;
    if(queryParams.value.isInverted){
        if(index < invertedPagination.value){
            invertedPagination.value = (totalPages-1)-index;
        }
        else if(index > invertedPagination.value){
            invertedPagination.value = (totalPages-1)-index;
        }
    }
    pagesFocus.value[count] = false;
    count = index;  
    pagesFocus.value[count] = true;
});
const fowardPage = (async () => {
    paginationRet.value = pagination.value <= 1 || pagination.value >= totalPages.value-3 ? paginationRet.value : paginationRet.value+1  
    pagination.value++;
    if(queryParams.value.isInverted){
        invertedPagination.value--;
    }
    pagesFocus.value[count] = false;
    count++;
    pagesFocus.value[count] = true;
    const fowardBtn = document.getElementById("fowardPageBtn");
    document.getElementById("backPageBtn").classList.remove("disabled");
    document.getElementById("backPageBtn").classList.remove("bg-dark-emphasis");
});
const backPage = (async () => {
    paginationRet.value = pagination.value <= 2 || pagination.value > totalPages.value-3 ? paginationRet.value : paginationRet.value-1  
    pagination.value--;
    if(queryParams.value.isInverted){
        invertedPagination.value++;
    }
    pagesFocus.value[count] = false;
    count--;
    pagesFocus.value[count] = true; 
    const backBtn = document.getElementById("backPageBtn");
    document.getElementById("fowardPageBtn").classList.remove("disabled");
    document.getElementById("fowardPageBtn").classList.remove("bg-dark-emphasis");
});
/*FUNÇÕES PARA OS BOTÕES DE DETALHE E HISTÓRICO*/
const showDetails = (index) => {
    itemIndex.value = index;
}
const showConfirm = (index) => {
    itemIndex.value = index;
}
const description = ref('')
const sendRequest = async () => {
    try{
        const res = await postRequest(userStore, currentItem.value.id, currentItem.value.quantity, description.value)
    }catch(err){
        console.log(err)
        return popUpStore.throwPopup('Erro: digite uma mensagem de solicitação', '#B71C1C')
    }
    return popUpStore.throwPopup('Solicitação enviada', '#0B3B69')
}
const searchItem = ref(undefined);
const showSearchingDetails = async (itemId) => {
    const res = await getItem(userStore, itemId);
    searchItem.value = res;
    const searching = document.getElementsByClassName('searching-btn'); 
    searching[0].click()
}
const toolTipState = ref([[], []]);
/*HOOKS PARA RESPONSIVIDADE E MODO MOBILE*/
onMounted(async () => {
    initialLoading.value = false;
    if(searchStore.itemSearch.searching){
        showSearchingDetails(searchStore.itemSearch.itemId);
        searchStore.itemSearch.searching = false;
    }
    if(store.isMobile){
        const catalogTextElement = document.querySelector('.sub-catalog p')
        const textElements = document.querySelectorAll('tr p');
        const searchBar = document.querySelector('.searchbar');
        const searchBox = document.querySelector('.table-searchbar');
        const tableLines = document.querySelectorAll('tr');

        searchBox.style.fontSize = '8px';
        searchBar.style.width = '100%';
        searchBar.style.fontSize = '8px';
        catalogTextElement.style.fontSize = '8px';
        tableLines.forEach(element => {
            element.addEventListener('click', (() => {
                element.children[4].children[1].children[0].click()
            }))
        });
        textElements.forEach(element => element.style.fontSize = '7px');
    }
});
onUpdated(async () => {  
    if(store.isMobile){
        const catalogTextElement = document.querySelector('.sub-catalog p')
        const textElements = document.querySelectorAll('tr p');
        const searchBar = document.querySelector('.searchbar');
        const tableLines = document.querySelectorAll('tr');

        tableLines.forEach((element, index) => {
            element.addEventListener('click', (() => {
                element.children[4].children[1].children[0].click()
            }))
        });

        searchBar.style.width = '100%';
        searchBar.style.fontSize = '8px';
        catalogTextElement.style.fontSize = '8px';
        textElements.forEach(element => element.style.fontSize = '7px');
    }
});
</script>

<style scoped>
.container{
    width: 100%;
    display: block;
}
.table-container{
    padding: 100px 0 100px 0;
    width: 100%;
    display: block !important;
}
.table-box{
    margin: 0;
    overflow-x: scroll;
}
.table-actions{
    width: 100%;
}
.sub-catalog{
    border-radius: 13px;
    margin-top: -14px;
    padding-top: 10px;
    padding-bottom: 20px;
    margin-right: 10%;
    margin-left: 10%;
    border: 1px #D9D9D9 solid;
    box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.2);
}
.sub-catalog-text{
    padding: 0px 10px 0px 10px;
    font-size: 15px;
}
h6{
    font-weight: 400;
    color: rgb(51,51,51, 0.8);
}
th{
    background-color: white;
    padding: 12px 0 12px 0;
    text-decoration: none;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
th span{
    color: rgb(51, 51, 51, 1);
    font-weight: lighter;
    font-size: 12px;
}
.col-title{
    font-size: 13px;
    opacity: 80%;
    font-weight: 600;
    margin-top: 0;
}
p{
    padding: 0;
    margin: 0;
}
.action-btn{
    margin-right: 10px;
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #1F69B1;
}
.table-searchbar{
    border: none;
    border-radius: 10px 10px 0px 0px;
    top: 70px;
}
.searchbar{
    border-radius: 8px 0px 0px 0px;
    font-weight: 500;
}
.search-glass{
    padding-left: 0px;
}
.btn-outline-primary{
    color: rgb(51,51,51, 0.7);
}
.btn-outline-primary:hover{
    color: white !important;  
}
.end{
    text-align: end;
    padding: 0;
}
.pages-info{
    font-size: 13px;
}
.table-btn{
    border-radius: 4px;
    top: 0px;
    font-size: 12px;
    padding: 4px 3px 4px 3px;
    z-index: 00;
    font-size: 13px;
    margin-top: 8px;
    margin-right: 10px;
}
.warning-text{
    position: absolute;
    margin-top: 5%;
    margin-left: 35%;
}
.search-empty{
    margin-top: 5%;
    display: flex;
    justify-content: center;
    margin-left: 43%;    
    margin-right: 30%;
    white-space: nowrap;
}
.pagination{
    bottom: -1%; 
    display: flex !important;
    justify-content: space-around !important;
    z-index: 0;
}
tr:hover .table-btn{
    opacity: 100%;
}
tr:hover p{
    opacity: 50%;
}
/*RESPONSIVIDADE*/
@media screen and (max-width: 1030px) {
    th p, .sub-catalog p{
        font-size: 12px;
    }
}
@media screen and (max-width: 900px){
    .actions-buttons{
        justify-content: center;
        align-content: center;
    }
}
@media screen and (max-width: 851px) {
    .col-title{
        font-size: 12px;
    }
    th p, .sub-catalog p{
        font-size: 10px;
    }
    .table-searchbar, .searchbar{
        display: flex;
        font-size: 12px; 
    }
    .searchbar{
        width: 120px;
    }
    .table-searchbar{
        width: 170px;
    }
    .sub-catalog-title, .search-empty p{
        font-size: 14px;
    }
}
</style>