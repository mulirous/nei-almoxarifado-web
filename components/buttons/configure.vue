<template>
    <div class="dropdown">
        <button @focusin="colorFocus" @focusout="colorUnfocus" class="filter-btn action-btn d-flex btn btn-outline-primary mx-1 px-2 mt-1 text-nowrap" 
        data-bs-toggle="dropdown" data-bs-close="outside" data-bs-offset="0,2" aria-expanded="false">
            Mais ações
            <IconsSettings class="mx-1" width="1.5em" height="1.5em"/>
        </button>
        <ul @click.stop class="dropdown-menu large-menu py-0">
            <li class="dropdown-item form-check d-flex py-2 justify-content-between align-items-center ps-2 pe-0 mb-0" style="padding-bottom: 4px;">
                <a type="button" class="text-decoration-none import-text" href="/catalogo/importar-tabelas">importar tabelas</a>
            </li>
            <li type="button" class="dropdown-item form-check d-flex py-2 justify-content-between align-items-center ps-2">
                <label type="button" class="form-check-label" for="editCheck">habilitar edição</label>
                <input v-model="store.isEditionMode" @click="store.isEditionMode = !store.isEditionMode" class="ms-2 p-2 mb-1 form-check-input" value="" id="editCheck" type="checkbox">
            </li>
        </ul>   
    </div>  
</template>

<script setup>
import { inject, onMounted} from 'vue';
import { useUser } from '../../stores/user';
import { useStorageStore } from '../../stores/storage';
import { postCreateItem } from '../../services/items/itemsPOST';
import * as XLSX from 'xlsx';


const store = useStorageStore();
const userStore = useUser();

const dropdownStates = ref([false, false, false, false]);
const toggleDropdown = (dropdown_id) => {
    
    dropdownStates.value[dropdown_id-1] = false
    dropdownStates.value[dropdown_id] = !dropdownStates.value[dropdown_id]
    dropdownStates.value[dropdown_id+1] = false
}




const setItemsFilter = inject('setItemsFilter')
const sendDataToParent = (filter, isInverted) => {
    setItemsFilter(filter, isInverted)
}


</script>

<style scoped>
.large-menu{
    width: 155px;
    min-width: 110px;
}
li{
    list-style-type: none;
}
.dropdown-item, .dropdown-item a{
    font-size: 14px;
    color: rgb(51,51,51, 0.9);
    font-weight: 600;
    margin: 0px;
}
.form-check-input{
    border: 1px solid rgb(0, 0, 0, 0.3);
}
.dropdown-menu{
    border: 1px solid rgb(0, 0, 0, 0.3)
}
.btn-transparent{
    font-size: 14px;
}
.action-btn{    
    font-weight: 500;
    font-size: 15px;
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #1F69B1;
}

.btn-outline-primary{
    box-shadow: inset 0px -12px 15px -15px rgb(18, 104, 184);
}
.form-check-input:active{
    background-color: #1F69B1 !important;
}
.form-check-input:checked{
    background-color: #1F69B1 !important;
}
.dropdown-item:hover .import-text, .dropdown-item:hover{
    color: white !important;
}
.action-btn:hover{
    opacity: 90%;
}
@media screen and (max-width: 820px){

    .action-icon{
        width: 15px;
        height: 15px;
    }
    .dropdown-item{
        font-size: 11px;
    }
}
</style>