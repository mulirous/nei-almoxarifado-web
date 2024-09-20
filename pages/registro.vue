<template>
<div>
    <Head>
        <Title>NEI Almoxarifado | Registros</Title>
        <Meta name="registros" content="Página para mostrar todos os registros"/>
    </Head>
</div>
<ModalItemDetails v-if="recordsCache.length > 0" :item_index="recordIndex" :item_route="currentRoute" :item_details="currentItem"/>
<div class="table-container d-block mt-2">
  <button class="d-none searching-btn" data-bs-toggle="modal" data-bs-target="#itemDetailing"></button>
  <div class="sub-catalog bg-light my-1 ps-2 pe-2">
        <h6 class="sub-catalog-title ps-2 d-flex align-items-center opacity-75">
            <IconsInformation class="me-2"/>
            Descrição da página
        </h6>
        <p class="sub-catalog-text opacity-75">
            Nesta página temos todos os registros das operações feitas no sistema, sendo estas operações de três tipos: 
            <b>CADASTRO</b>, <b>CONSUMO</b> e <b>EXCLUSÃO</b>. 
            Registrando também o usuário, item e horário da operação.
        </p>
        <br>
        <ul class="opacity-75 list-group">
            <li class="list-group-item"><b>CADASTRO</b>: Quando um item é adicionado ao estoque.</li>
            <li class="list-group-item"><b>CONSUMO</b>: Quando um item é retirado do estoque por um usuário.</li>
            <li class="list-group-item"><b>EXCLUSÃO</b>: Quando um item é removido do almoxarifado sem ter sido consumido.</li>
        </ul>
  </div>
  <div class="table-box-title position-absolute bg-light-emphasis d-flex align-items-center">
        <IconsHistory class="me-1" width="25" height="25"/>
        <p class="box-title-text">
            Tabela de Registros
        </p>
    </div>
  <div class="table-box row d-block bg-light mx-2">
      <div class="table-actions d-flex justify-content-between aling-items-center">
        <div class="d-flex me-1">
            <ButtonsFilter v-if="uploadReloader === 1" />
        </div>
        <span v-if="recordsLoad" class="position-sticky d-flex align-items-center table-searchbar" style="margin-top: 3px;">
            <IconsSearchGlass class="search-glass"/>
            <input id="tableSearch" v-model="searchInput" @input="searchInput = $event.target.value" class="searchbar bg-transparent form-control" placeholder="Pesquisar"/>          
        </span>
      </div>
    <div v-if="recordsCache.length > 0" class="overflow-x-scroll p-0">
        <TablesTable>
            <template v-slot:header>
                <tr>
                    <th class="col-title py-2 border" scope="col">Item</th>
                    <th class="col-title py-2 border" scope="col">Autor</th>
                    <th class="col-title py-2 border" scope="col">Operação</th>
                    <th class="col-title py-2 border" scope="col">Quantidade</th>
                    <th class="col-title py-2 border" scope="col">Data e horário </th>
                    <th class="col-title py-2 border" scope="col">Ações</th>
                </tr>
            </template>
            <template v-slot:content>
            <tr v-for="(record, index) in recordsCache[cacheIndex]" :key="index" :data-index="index">
               <th class="border">
                   <span>{{ record.item.name }}</span>
               </th>
               <th class="border" scope="row">
                    <span>{{ record.user.name }}</span>
               </th>
               <th class="border">
                   <span class="text-light p-2 rounded-1 fw-bold record-operation" :class="{'bg-dark-alert': record.operation === 'EXCLUSAO', 'bg-dark-warning': record.operation === 'CONSUMO', 'bg-dark-success': record.operation === 'CADASTRO'}">{{ record.operation }}</span>
                </th>
               <th class="border">
                   <span>{{ record.quantity }}</span>
                </th>
               <th class="border">
                   <span>{{ record.creationDate.slice(0, 19) }}</span>
               </th>
               <th class="border" width="5%">
                     <button class="my-0 ms-2 details-btn position-sticky table-btn btn btn-primary"  @click="showDetails(index, record.item.id)" data-bs-toggle="modal" data-bs-target="#itemDetailing">
                          <IconsSearchGlass width="18px" height="19px"/>
                      </button>
                      <NuxtLink :to="`/perfil?userId=${record.user.id}`" :route="`/perfil/${record.user.id}`"  class="my-0 details-btn position-sticky table-btn btn btn-secondary">
                        <IconsLowProfile width="16px" height="16px"/>  
                      </NuxtLink>
                 </th>
            </tr>
              <!--
              <div v-else class="search-empty  my-5" style="padding-bottom: 300px;">
                  <p class="text-dark-emphasis fs-5 opacity-75 bg-transparent"></p>
              </div>-->
        </template>
      </TablesTable>
    </div>
    <div v-else-if="!showSearchResults && !emptyRecords" class="d-flex justify-content-center align-items-center my-5">
            <LoadersComponentLoading :isLoading="true" class="p-5 my-5"/>
        </div>
        <div v-else-if="(showSearchResults && finded.length === 0) || (!initialLoading && totalPages === 0 && recordsCache.length === 0 && !showSearchResults)" 
            class="search-empty my-5">
            <p class="text-dark-emphasis fs-3 opacity-75 bg-transparent p-5">Nenhum Registro Encontrado</p>
        </div> 
    <div class="table-footer d-flex justify-content-between align-items-center me-2 mt-2">
      <div class="d-flex justify-content-center py-2 me-3 ">
          <span v-if="recordsCache.length > 0" class="ms-2 text-light-emphasis bg-gray-light fw-bold py-2 text-center px-2 pages-info">Quantidade de registros da página: {{ recordsCache[cacheIndex].length }}</span>
          <span v-if="recordsCache.length > 0" class="ms-2 text-light-emphasis bg-gray-light fw-bold py-2 text-center px-2 pages-info">Quantidade total de registros: {{ totalElements }}</span>
      </div>
      <nav v-if="recordsCache.length > 0 && finded.length === 0 && !showSearchResults" aria-label="Page navigation" class="pagination">
            <ul class="pagination mb-2 mt-2">
                <li class="page-item">
                    <button class="page-link bg-primary text-light page-nav-radius" :class="{'bg-dark-emphasis disabled': pagination == 0}" id="backPageBtn" @click="backPage"><span aria-hidden="true">&laquo;</span></button>
                </li>
                <li v-if="totalPages > 4" class="page-item" :key="0">
                    <button class="page-link text-light" @click="page(0)" :class="{'bg-primary': !pagesFocus[0], 'bg-secondary': pagesFocus[0]}">{{ 1 }}</button>
                </li>
                <li v-show="pagination >= 3 && totalPages > 5" class="page-item">
                    <button class="page-link bg-primary text-light">...</button>
                </li>
                <li class="page-item" v-for="i in totalPages > 4 ? range(1+paginationRet, 3+paginationRet) : range(1,totalPages)" :key="i-1">
                    <button class="page-link text-light" @click="page(i-1)" :class="{'bg-primary': !pagesFocus[i-1], 'bg-secondary': pagesFocus[i-1]}">{{ i }}</button>
                </li>
                <li v-show="totalPages > 3 && paginationRet < totalPages-4" class="page-item">
                    <button class="page-link bg-primary text-light">...</button>
                </li>
                <li v-if="totalPages > 4" class="page-item" :key="totalPages-1">
                    <button class="page-link text-light" @click="page(totalPages-1)" :class="{'bg-primary': !pagesFocus[totalPages-1], 'bg-secondary': pagesFocus[totalPages-1]}">{{ totalPages }}</button>
                </li>
                <li class="page-item">
                    <button class="page-link bg-primary text-light page-nav-radius" :class="{'bg-dark-emphasis disabled': pagination == totalPages-1 || searchInput !== ''}" id="fowardPageBtn" @click="fowardPage"><span aria-hidden="true">&raquo;</span></button>
                </li>
            </ul>
        </nav>
    </div>
  </div>
</div>
</template>

<script setup>
import { useStorageStore } from '../../stores/storage.ts';
import { useSearch } from '../../stores/search.ts';
import { ref, computed, onMounted, onUpdated, inject } from 'vue';
import { getRecords } from '../../services/record/recordGET.ts';
import { useUser } from '../../stores/user.ts'
import { getItem } from '../services/items/itemsGET.ts';
import { useRoute } from 'vue-router';
/*SETANDO STORES*/
const userStore = useUser()
const store = useStorageStore();
const searchStore = useSearch();

const setpageTitle = inject('setpageTitle');
const sendDataToParent = () => {
    const title = "Registro";
    const route = `${useRoute().fullPath.slice(0, 9)}`
    setpageTitle(title, route, 'directory');
};
sendDataToParent();
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

const recordsCache = ref([]);
const searchCache = ref([])
const cacheIndex = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const isSearching = ref(false);
let finded = [];
const recordsReq = async (sort, isInverted, pagination_, loadRequest, paginationInverted) => {
    if(searchInput.value != ''){
        cacheIndex.value = 0;
        recordsCache.value = [];
        reqsIndexCache = [0]
        pagination.value = 0;
        paginationRet.value = 1;
        initialLoading.value = false

        pagesFocus.value[count] = false;
        count = 0;  
        pagesFocus.value[0] = true;

        finded = [];
        if(searchCache.value.length >= totalPages.value){
            for(let i = 0; i < searchCache.value.length; i++){
                for(let j = 0; j < searchCache.value[i].length; j++){
                    const normalizedItemName = searchCache.value[i][j].item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const normalizedSearchQuery = searchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                    if(normalizedItemName.includes(normalizedSearchQuery)){
                        finded.push(searchCache.value[i][j]);
                    }
                    if(finded.length >= 20){ 
                        recordsCache.value.push(finded);
                        return 0
                    };
                }
                if(finded.length >= 20){ 
                    recordsCache.value.push(finded);
                    return 0
                };
            }
            if(finded.length === 0){
                recordsCache.value = [];
                showSearchResults.value = true;
                return 0;
            }
            recordsCache.value.push(finded);
            showSearchResults.value = true;
            return 0;
        }
        for(let i = 0; i < totalPages.value; i++){
            const res = await getRecords(userStore, i, sort);1
            searchCache.value.push(res.content);
            for(let j = 0; j < res.content.length; j++){
                const normalizedItemName = searchCache.value[i][j].item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const normalizedSearchQuery = searchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                if(normalizedItemName.includes(normalizedSearchQuery)){
                    finded.push(searchCache.value[i][j]);
                }
                if(finded.length >= 20){ 
                    recordsCache.value.push(finded);
                    return 0
                };
            }
            if(finded.length >= 20){ 
                recordsCache.value.push(finded);
                return 0
            };
        }
        if(finded.length === 0){
            recordsCache.value = [];
            showSearchResults.value = true;
            return 0;
        }
        recordsCache.value.push(finded);
        showSearchResults.value = true;
        return 0;
    }
    if(isInverted){
        const res = await getRecords(userStore, paginationInverted, sort)
        totalPages.value = res.totalPages
        totalElements.value = res.totalElements;
        invertedPagination.value = totalPages-1;
        recordsCache.value.push(res.content);
        return res.totalPages
    } 
    const res = await getRecords(userStore, pagination_, sort)
    totalPages.value = res.totalPages
    totalElements.value = res.totalElements;
    invertedPagination.value = totalPages-1;
    loadRequest ? cacheIndex.value++ : 0;


    res.content.length === 0 ? emptyRecords.value = true : recordsCache.value.push(res.content);;
    return res.totalPages
};

const emptyRecords = ref(false);
const searchInput = ref("");
const initialLoading = ref(true);
let reqsIndexCache = [0];
let typingTimer; 
const showSearchResults = ref(false);
const debounceTime = 1000; 
const recordsLoad = computed(async() => {
    if(initialLoading.value === true){
        await recordsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted);
        return 0;
    }
    if(searchInput.value !== ''){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            recordsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted)
        }, debounceTime);
        isSearching.value = true;
        return 0;
    }
    if(searchInput.value === '' && isSearching.value === true){
        showSearchResults.value = false;
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            store.isReloadItems = true;
            isSearching.value = false;
        }, debounceTime-500);
        finded = [];
    }
    for(let i = 0; i < reqsIndexCache.length; i++){
        if(pagination.value === reqsIndexCache[i]){
            cacheIndex.value = i;        
            return 0;
        }
    }
    recordsReq(queryParams.value.sort, false, pagination.value, true, queryParams.value.isInverted);
    reqsIndexCache.push(pagination.value)
})
provide('setItemsFilter', (filter, inverted) => {
    filter = filter.replace('name', 'item.name');
    queryParams.value.sort = filter;
    queryParams.value.isInverted = inverted;
    store.isReloadItems = true;
});
//Variáveis que o front vai pegar em si
const recordIndex = ref(0);
const currentItem = ref({
    "id": 0,
    "name": "",
    "sipacCode": 0,
    "quantity": 0,
    "type": "",
    "available": false,
    "createdAt": "",
    "createdBy": {
        "id": 0,
        "name": "",
        "email": "",
        "role": "",
        "existRecord": false,
        "active": false
    },
    "lastRecord": {
        "id": 0,
        "user": {
            "id": 0,
            "name": "",
            "email": "",
            "role": ""
        },
        "item": {
            "id": 0,
            "name": "",
            "sipacCode": 0
        },
        "quantity": 0,
        "operation": "",
        "data": ""
    }
});
const currentRoute = 'registro';


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
        recordsCache.value = [];
        reqsIndexCache = [0]
    
        recordsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted);

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

const showDetails = async (index, recordId) => {
    recordIndex.value = index;
    const res = await getItem(userStore, recordId);
    currentItem.value = res;
}

const toolTipState = ref([[], []]);
/*HOOKS PARA RESPONSIVIDADE E MODO MOBILE*/
onMounted(async () => {
    initialLoading.value = false;
});
</script>

<style scoped>
.container{
    width: 100%;
    display: block;
}
.table-container{
    padding-top: 6px;
    margin-bottom: 62px;
    width: 100%;
    display: block !important;
}
.table-box{
    margin-top: 80px;
    border-radius: 0px 10px 10px 10px;
    box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.5);
    border: 1px #D9D9D9 solid;
}
.table-box-title{
    margin-left: 8px;
    margin-top: 38px;
    padding: 4px;
    font-weight: 400;
    color: rgb(51,51,51, 0.8);
    border-radius: 10px 10px 0px 0px;
}
.box-title-text{
    font-size: 20px;
}
.table-actions{
    width: 100%;
}
.sub-catalog{
    border-radius: 10px;
    margin-top: -14px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 20px;
    margin-right: 10%;
    margin-left: 10%;
    border: 1px #D9D9D9 solid;
    box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.5);
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
    font-size: 14px;
    color: rgb(51,51,51, 0.9);
    opacity: 90%;
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
    height: 36px;
    border: none;
    border-bottom: solid 1px #1F69B1;
    border-radius: 10px 10px 0px 0px;
    box-shadow: inset 0px -12px 15px -15px rgb(18, 104, 184);
    color: rgb(0, 0, 0, 0.7); 
    transition: box-shadow 0.3s ease;
}
.table-searchbar:hover {
    box-shadow: inset 0px -12px 15px -18px rgba(11, 59, 105, 0.7), 0px 0px 7px 0px rgba(11, 59, 105, 0.7);
}
.table-searchbar:hover,
.table-searchbar:focus-within {
    box-shadow: inset 0px -12px 15px -18px rgba(11, 59, 105, 0.7), 0px 0px 7px rgba(11, 59, 105, 0.7); /* Sombra interna na parte inferior e contorno ao redor */
}
.searchbar{
    border: none;
    border-radius: 0;
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
    border-radius: 5px;
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
    white-space: nowrap;
}
.pagination{
    bottom: -1%; 
    display: flex !important;
    justify-content: space-around !important;
    z-index: 0;
}
.page-item{
    margin: 0px 2px 0px 2px;
}
.page-link{
    border: none;
    border-radius: 7px;
}
.page-nav-radius{
    border-radius: 5px;
}
tr:hover .table-btn{
    opacity: 100%;
}
tr:hover p{
    opacity: 50%;
}
/*RESPONSIVIDADE*/

@media screen and (max-width: 900px){
    .actions-buttons{
        justify-content: center;
        align-content: center;
    }
    .pages-info{
        text-wrap: wrap;
        text-align: center;
    }
}
@media screen and (max-width: 790px) {
    .res-action-btn{
        margin-top: 9px !important;
    }
    .col-title{
        padding: 0px 5px 0px 5px;
    }
    .table-footer{
        display: block !important;
        padding-right: 0px !important;
    }
    .searchbar{
        font-size: 14px;
    }
    .table-searchbar{
        min-width: 120px;
        margin-top: 4px !important; 
        display: block;
    }
}
@media screen and (max-width: 600px){
    .pages-info{
        font-size: 11px;
    }
    .page-link{
        font-size: 13px;
    }
    .search-glass{
        width: 25px;
        height: 25px;
    }
    .table-actions{
        width: 600px;
        padding-left: 0px;
    }
    .record-operation{
        font-size: 10px;
        padding: 7px 4px 7px 4px !important;
    }
    .sub-catalog{
        margin: 15px;
    }
} 
@media screen and (max-width: 500px){
    .box-title-text{
        font-size: 18px;
    }
    .table-box-title{
        margin-top: 41px;
    }
    .table-actions{
        padding-right: 0px !important;
        display: flex !important;
    }.actions-btns{
        padding-bottom: 9px;
        border-radius: 0px 10px 0px 0px;
        background-color: rgba(51,51,51,0.1);
        justify-content: center;
    }
    .table-searchbar{
        margin: 0px 20px 0px 20px;
    }
}
</style>