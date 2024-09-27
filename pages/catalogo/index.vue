<template>
    <div>
        <Head>
            <Title>NEI Almoxarifado | Catálogo</Title>
            <Meta name="catálogo" content="Página para mostrar os itens existentes"/>
        </Head>
    </div>
    <ModalItemRegister />
    <ModalItemDetails v-if="itemsCache.length > 0" :item_index="itemIndex" :item_route="currentRoute" 
        :item_details="showSearchItem && showSearchModal ? searchItem : store.itemDetails" />
    <ModalItemHistory v-if="itemsCache.length > 0"/>
    <ModalItemMinimumStock :items="itemsCheck" v-if="minimumStockVars.showTable && itemsCache.length > 0"/>
<div class="table-container d-block mt-2">
    <button v-if="!searchStore.itemSearch.searching" class="d-none searching-btn" data-bs-toggle="modal" data-bs-target="#itemDetailing"></button>
    <div class="sub-catalog bg-light mt-2 ps-2 pe-2">
        <h6 class="sub-catalog-title ps-2 d-flex align-items-center opacity-75">
            <IconsInformation class="me-2"/>
            Descrição da página {{store.isReloadItems}}
        </h6>
        <p class="sub-catalog-text opacity-75">
            Nesta página temos todos os itens disponíveis do almoxarifado(itens esgotados devem ser cadastrados novamente). 
            Ademais, o cadastro de novos itens e reposição da quantidade de algum item já existente é feito pelo botão 
            <span class="border-bottom border-dark-success pb-1 text-nowrap">
                Adicionar <IconsPlus style="margin-bottom: 0px;"  width="18px" height="18px"/>
            </span>
        </p>
        <br>
        <p class="sub-catalog-text opacity-75">
            O botão
            <span class="border-bottom border-primary pb-1">
                Filtro <IconsFilter style="margin-bottom: 0px;"  width="18px" height="18px"/>
            </span>
            permite alterar a forma como os itens são exibidos. 
            Com ele, você pode ordenar os itens por diferentes critérios, 
            como data de criação (do mais recente ao mais antigo ou vice-versa), 
            nome e quantidade de itens em estoque 
            (é possível escolher se deseja visualizar primeiro os itens com menor ou maior quantidade disponível).
        </p>
    </div>
    <div class="table-titles position-absolute d-flex">
        <div style="margin-left: 8px" class="table-box-title d-flex align-items-center px-2" type="button" @click="changePanel('items')" :class="minimumStockVars.showPanel ? 'bg-primary opacity-50 text-light' : 'bg-light-emphasis'">
            <p class="d-flex align-items-center box-title-text">
                <IconsBox class="me-1" width="25" height="25"/>
                Itens do almoxarifado
            </p>
        </div>
        <div style="margin-left: 15px" class="table-box-title alt-table-title d-flex align-items-center px-2" type="button" @click="changePanel('minimumstock')" :class="!minimumStockVars.showPanel ? 'bg-primary opacity-50 text-light' : 'bg-light-emphasis'">
            <p class="d-flex align-items-center box-title-text">
                <IconsSpreadSheet class="me-1" width="25" height="25"/>
                Níveis do almoxarifado
            </p>
        </div>
    </div>
    <div class="table-box row d-block bg-light mx-2">
        <div class="table-actions d-flex justify-content-between aling-items-center">
            <div class="d-flex align-items-center actions-btns bg-emphasis">
                <ButtonsResponsiveNewItem class="res-action-btn mt-1" v-if="uploadReloader === 1 && !minimumStockVars.showPanel" />
                <ButtonsResponsiveFilter class="res-action-btn mt-1"/>
                <ButtonsEdition title="Selecione um item" :class="{'disabled opacity-50': itemsCheck.length === 0}"  class="res-action-btn mt-0" v-if="minimumStockVars.showPanel"/>
                <ButtonsResponsiveConfigure class="res-action-btn mt-1" v-if="!minimumStockVars.showPanel"/>
            </div>
            <span v-if="itemsLoad" class="position-sticky d-flex align-items-center table-searchbar" style="margin-top: 7px;">
                <IconsSearchGlass class="search-glass"/>
                <input id="tableSearch" v-model="searchInput" @input="searchInput = $event.target.value" class="searchbar bg-transparent form-control" placeholder="Pesquisar"/>          
            </span>   
        </div>
        <div v-if="itemsCache.length > 0" class="overflow-x-scroll p-0">
            <TablesTable v-if="!minimumStockVars.showPanel">
                <template v-slot:header>
                    <tr >
                        <th class="col-title py-2 border" scope="col">Nome</th>
                        <th class="col-title py-2 border" scope="col">Código Sipac</th>
                        <th class="col-title py-2 border" scope="col">Tipo Unitário</th>
                        <th class="col-title py-2 border" scope="col">Quantidade</th>
                        <th class="col-title py-2 border" scope="col">Última atualização</th>
                        <th class="col-title py-2 border" scope="col">Ações</th>
                    </tr>
                </template>
                <template v-slot:content>
                <tr v-if="itemsCache.length > 0" v-for="(item, index) in itemsCache[cacheIndex]" :key="index" :data-index="index">
                    <th class="border" scope="row">
                        <div class="cell-text">
                            <span>{{ item.name }}</span>
                        </div>
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
                        <div class="cell-text">
                            <span>{{ item.lastRecord.operation }} {{  item.lastRecord.creationDate.slice(0, 16) }} {{ item.lastRecord.user.name }}</span>
                        </div>
                    </th>
                    <th class="border" width="5%">
                        <button title="Detalhes" class="my-0 ms-2 details-btn position-sticky table-btn btn btn-primary" @click="showDetails(index)" data-bs-toggle="modal" data-bs-target="#itemDetailing">
                            <IconsSearchGlass width="18px" height="19px"/>
                        </button>
                        <button title="Histórico" class="my-0 position-sticky table-btn btn btn-secondary"   @click="showHistory(item.id)" data-bs-toggle="modal" data-bs-target="#itemHistory">
                            <IconsHistory width="18px" height="19px"/>
                        </button>
                    </th>
                </tr>
            </template>
            </TablesTable>
            <TablesTable class="minimumStockTable" v-if="minimumStockVars.showPanel">
                <template v-slot:header>
                    <tr>
                        <th class="col-title py-2 border-top" scope="col"> <input @change="toggleSelectAll($event)" 
                        :checked="selectedAllIndex[cacheIndex]"  value="" type="checkbox" class="form-check-input"> </th>
                        <th class="col-title py-2 border-top" scope="col">Item</th>
                        <th class="col-title py-2 border-top" scope="col">Tipo Unitário</th>
                        <th class="col-title py-2 border-top" scope="col">Status</th>
                        <th class="col-title py-2 border-top" scope="col">Quantidade Mínima de Estoque</th>
                        <th class="col-title py-2 border-top" scope="col">Ações</th>
                    </tr>
                </template>
                <template v-slot:content>
                <tr v-if="itemsCache.length > 0" v-for="(item, index) in itemsCache[cacheIndex]" :key="index" :data-index="index" :style="{'background-color': isSelected(item.id) ? 'rgb(31, 105, 177, 0.2)' : ''}">
                    <th class="border bg-transparent" width="2%">
                        <div class="d-flex align-items-center justify-content-center">
                            <input :checked="isSelected(item.id)" 
                            @change="setCheckItemId(item.id)"  :value="item.id" :id="`check-${index}`" class="form-check-input mt-2" style="width: 15px; height: 15px" type="checkbox">
                        </div>
                    </th>
                    <th class="border bg-transparent" scope="row">
                        <div class="cell-text">
                            <span>{{ item.name }}</span>
                        </div>
                    </th>
                    <th class="border bg-transparent">
                        <span>{{ item.type }}</span>
                    </th>
                    <th class="border bg-transparent" scope="row">
                        <span class="p-2 fw-bold text-light rounded-1" :class="item.quantity > item.minimumStockLevel ? 'bg-secondary' : item.quantity === item.minimumStockLevel ? 'bg-dark-warning' : 'bg-dark-alert'">
                            <IconsWarning class="mb-1" v-if="item.quantity <= item.minimumStockLevel"/>
                            <IconsConfirm class="mb-1" v-else width="20px" height="20px"/>
                            {{ item.quantity > item.minimumStockLevel ? 'Estável' : item.quantity === item.minimumStockLevel ? 'Atenção' : 'Crítico' }}</span>
                    </th>
                    <th class="border bg-transparent">
                        <div class="progress mt-2 mx-2 text-end d-flex justify-content-between overflow-visible" title="quantidade atual" style="border: 1px solid rgba(0,0,0,0.3); background-color: rgba(31, 105, 177, 0.1);" role="progressbar" aria-label="quantidade mínima" :aria-valuenow="`${item.minimumStockLevel}`" aria-valuemin="0" :aria-valuemax="`${item.quantity}`" :style="{width: minimumStockVars.showTable ? `92%` : '0%'}">
                            <div v-if="item.quantity < item.minimumStockLevel" title="quantidade atual" class="progress-bar overflow-visible text-end" style="background-color: rgba(255, 0, 0, 0.5);" :style="{width: minimumStockVars.showTable ? `${(450*item.quantity)/item.minimumStockLevel}%` : '0%'}">
                                <div v-if="item.quantity < item.minimumStockLevel" class="position-relative mb-1" >
                                    <span class="position-absolute" style="left: -5px; margin-top: 10px;">0</span>
                                    <div>
                                        <span v-if="minimumStockVars.showTable" class="position-absolute" style="bottom: 7px; margin-left: -2px;">{{item.quantity}}</span>
                                    </div>
                                    <div>
                                        <span title="quantidade atual" class="position-absolute bg-dark-alert" style="width: 3px; height: 20px; bottom: -12px;"></span>
                                    </div>
                                </div>
                            </div>
                            <div title="quantidade mínima" class="progress-bar text-end overflow-visible" style="background-color: rgba(254, 213, 30, 0.5);" :style="{width: minimumStockVars.showTable ? `${(100*item.minimumStockLevel)/item.quantity}%` : '0%'}">
                                <div class="position-relative" style="margin-right: 2px">
                                    <span v-if="item.quantity >= item.minimumStockLevel" class="position-absolute mt-2" style="left: -5px;">0</span>
                                    <div v-if="item.minimumStockLevel && minimumStockVars.showTable" style="margin-right: 8px;">
                                        <span class="position-absolute" style="margin-top: -27px;">{{item.minimumStockLevel}}</span>
                                    </div>
                                    <div v-if="item.minimumStockLevel">
                                        <span class="position-absolute bg-dark-warning" style="width: 3px; height: 20px; bottom: -10px;"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="position-relative" v-if="item.minimumStockLevel < item.quantity" style="margin-right: 2px;">
                                <div>
                                    <span class="position-absolute" style="margin-top: 14px; right: -10px;">{{item.quantity}}</span>
                                </div>
                                <div>        
                                    <span class="position-absolute bg-secondary" style="width: 3px; height: 20px; bottom: -5px;"></span>
                                </div>
                            </div>
                        </div>
                    </th>
                    <th class="border bg-transparent" width="5%">
                        <button title="Detalhes" class="my-0 ms-2 details-btn position-sticky table-btn btn btn-primary" @click="showDetails(index)" data-bs-toggle="modal" data-bs-target="#itemDetailing">
                            <IconsSearchGlass width="18px" height="19px"/>
                        </button>
                    </th>
                </tr>
            </template>
            </TablesTable>
        </div>
        <div v-else-if="!showSearchResults && !emptyItems" class="d-flex justify-content-center align-items-center my-5">
            <LoadersComponentLoading :isLoading="true" class="p-5 my-5"/>
        </div>
        <div v-else-if="(showSearchResults && finded.length === 0) || (!initialLoading && totalPages === 0 && itemsCache.length === 0 && !showSearchResults)" 
            class="search-empty my-5">
            <p class="text-dark-emphasis fs-3 opacity-75 bg-transparent p-5">Nenhum item Encontrado</p>
        </div> 
        <div class="table-footer d-flex justify-content-between align-items-center  mt-2">
            <div class="d-flex justify-content-center py-2 me-3 ">
                <span v-if="itemsCache.length > 0" class="ms-2 text-light-emphasis bg-gray-light fw-bold py-2 text-center px-2 pages-info">Quantidade de itens da página: {{ itemsCache[cacheIndex].length }}</span>
                <span v-if="itemsCache.length > 0 && finded.length === 0" class="ms-2 text-light-emphasis bg-gray-light fw-bold py-2 text-center px-2 pages-info">Quantidade total de itens: {{ totalElements }}</span>
            </div>
            <nav v-if="itemsCache.length > 0 && searchInput === '' && !showSearchResults" aria-label="Page navigation" class="pagination">
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
import { ref, computed, onMounted, onUpdated, inject, watch } from 'vue';
import { getItem, getItems } from '../../services/items/itemsGET.ts';
import { useUser } from '../../stores/user.ts'
import { getRecordByItemId } from '../../services/record/recordGET.ts';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '../../stores/settings';
import { patchItem } from '../../services/items/itemsPATCH.ts';
/*SETANDO STORES*/
const userStore = useUser()
const store = useStorageStore();
const searchStore = useSearch();
const settingsStore = useSettingsStore();
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

//Aqui faço a requisição em si, também possui parâmetros de filtros, sendo o padrão o de últimos atualizados(como está no banco de dados)
const itemsCheck = ref([]);
const itemsCache = ref([]);
const searchCache = ref([])
const cacheIndex = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const isSearching = ref(false);
let finded = [];
const itemsReq = async (sort, isInverted, pagination_, loadRequest, paginationInverted) => {
    if (searchInput.value !== '') {
        cacheIndex.value = 0;
        itemsCache.value = [];
        reqsIndexCache = [0];
        pagination.value = 0;
        paginationRet.value = 1;
        initialLoading.value = false;
        pagesFocus.value[count] = false;
        count = 0;
        pagesFocus.value[0] = true;

        let finded = [];

        if (searchCache.value.length >= totalPages.value) {
            for (let i = 0; i < searchCache.value.length; i++) {
                for (let j = 0; j < searchCache.value[i].length; j++) {
                    const normalizedItemName = searchCache.value[i][j].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const normalizedSearchQuery = searchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                    if (normalizedItemName.includes(normalizedSearchQuery)) {
                        finded.push(searchCache.value[i][j]);
                    }

                    if (finded.length >= 20) {
                        itemsCache.value.push(finded);
                        return 0;
                    }
                }

                if (finded.length >= 20) {
                    itemsCache.value.push(finded);
                    return 0;
                }
            }

            if (finded.length === 0) {
                itemsCache.value = [];
                showSearchResults.value = true;
                return 0;
            }

            itemsCache.value.push(finded);
            showSearchResults.value = true;
            return 0;
        }

        for (let i = 0; i < totalPages.value; i++) {
            const res = await getItems(userStore, i, sort);
            searchCache.value.push(res.content);

            for (let j = 0; j < res.content.length; j++) {
                const normalizedItemName = res.content[j].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const normalizedSearchQuery = searchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                if (normalizedItemName.includes(normalizedSearchQuery)) {
                    finded.push(res.content[j]);
                }

                if (finded.length >= 20) {
                    itemsCache.value.push(finded);
                    return 0;
                }
            }

            if (finded.length >= 20) {
                itemsCache.value.push(finded);
                return 0;
            }
        }

        if (finded.length === 0) {
            itemsCache.value = [];
            showSearchResults.value = true;
            return 0;
        }

        itemsCache.value.push(finded);
        showSearchResults.value = true;
        return 0;
    }

    const res = await getItems(userStore, pagination_, sort);
    totalPages.value = res.totalPages;
    totalElements.value = res.totalElements;
    invertedPagination.value = totalPages.value - 1;
    loadRequest ? cacheIndex.value++ : 0;
    res.content.length === 0 ? emptyItems.value = true : itemsCache.value.push(res.content);
    
};



const searchInput = ref("");
const emptyItems = ref(false)
const initialLoading = ref(true);
const showSearchResults = ref(false);
let reqsIndexCache = [0];
let typingTimer; 
const debounceTime = 1000; 
const itemsLoad = computed(async() => {
    if(initialLoading.value === true){
        await itemsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted);
        return 0;
    }
    if(searchInput.value !== ''){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            itemsReq(queryParams.value.sort, false, 0, false, queryParams.value.isInverted)
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

const currentItem = ref(undefined);
const currentRoute = useRoute().fullPath.split('/')[2];


const setpageTitle = inject('setpageTitle');
const sendDataToParent = () => {
    const title = "Catálogo";
    const route = `${useRoute().fullPath}`
    setpageTitle(title, route, 'spreadsheet');
};
sendDataToParent();

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
        itemsCheck.value = []; 
        selectedAllIndex.value = [];
        itemsCache.value = [];
        searchInput.value = '';
        searchCache.value = [];
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
    showSearchModal.value = false;
    itemIndex.value = index;
    store.itemDetails = itemsCache.value[cacheIndex.value][itemIndex.value];
}

const showHistory = async (itemId) => {
    showSearchModal.value = false;
    const res = await getRecordByItemId(userStore, itemId)
    store.itemRecord = res.content
}
const showSearchModal = ref(false);
const searchItem = ref(undefined)
const showSearchingDetails = async (itemId) => {
    const res = await getItem(userStore, itemId);
    searchItem.value = res;
    currentItem.value = res;
    const searching = document.getElementsByClassName('searching-btn'); 
    setTimeout(() => {
        showSearchModal.value = true;
         searching[0].click();
    }, 500)
}

const minimumStockVars = ref({
    showPanel: false,
    showTable: false,
    items: []
})
const changePanel = (panelType) => {
    if(panelType === 'minimumstock'){
        minimumStockVars.value.showPanel = true
        setTimeout(() => { minimumStockVars.value.showTable = true }, 500);
    } else{
        minimumStockVars.value.showPanel = false;
        minimumStockVars.value.showTable = false;
    }   
}
const setCheckItemId = (id, i) => {
  const index = itemsCheck.value.indexOf(id);
  if (index === -1) {
    itemsCheck.value.push(id);
  } else {
    itemsCheck.value.splice(index, 1);
  }
}
const selectedAllIndex = ref([]);
const toggleSelectAll = (event) => {
    if (event.target.checked) {
        selectedAllIndex.value[cacheIndex.value] = true;
        itemsCache.value[cacheIndex.value].forEach(item => {
            if (!itemsCheck.value.includes(item.id)) {
                itemsCheck.value.push(item.id);
            }
        });
    } else {
        selectedAllIndex.value[cacheIndex.value] = false;
        itemsCache.value[cacheIndex.value].forEach(item => {
            const index = itemsCheck.value.indexOf(item.id);
            if (index !== -1) {
                itemsCheck.value.splice(index, 1);
            }
        });
    }
};
const isSelected = (id) => itemsCheck.value.includes(id);
/*HOOKS PARA RESPONSIVIDADE E MODO MOBILE*/
onMounted(async () => {
    initialLoading.value = false;
});

const showSearchItem = computed(() => {
    if(searchStore.itemSearch.searching){
        showSearchingDetails(searchStore.itemSearch.itemId);
        searchStore.itemSearch.searching = false;
    }
    return true
})

onBeforeRouteLeave(() => {
    searchStore.itemSearch.searching = false;
})
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
    margin-top: 32px;
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
.progress-bar, .progress{
    transition: width 1.5s ease-in-out;
}
.form-check-input{
    border: 1px solid rgba(0, 0, 0,0.4)
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
        margin-top: 8px !important; 
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
    .sub-catalog{
        margin: 15px;
    }
    .table-box-title{
        margin-top: 27px;
    }
} 
@media screen and (max-width: 530px){
    .table-box{
        margin-top: 150px;
        border-radius: 0px 0px 10px 10px;
    }
    .table-titles{
        margin-top: 70px;
        width: 98%;
        display: block !important;
    }
    .alt-table-title{
        margin-left: 8px !important;
        margin-top: 0px !important;
    }
    .box-title-text{
        font-size: 18px;
    }
    .table-box-title{
        border-radius: 0px 0px 1px 0px;
        margin-top: -5px;
    }
    .table-actions{
        padding-right: 0px !important;
        display: block !important;
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