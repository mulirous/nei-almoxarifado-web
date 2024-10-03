<template>
    <div class="dropdown">
        <button @mouseover="toolTip = true" @mouseout="toolTip = false" @focusin="colorFocus" @focusout="colorUnfocus" class="filter-btn action-btn d-flex align-items-center btn btn-outline-primary mx-1 px-2 mt-1 text-nowrap" 
        data-bs-toggle="dropdown" data-bs-close="outside" data-bs-offset="0,2=" aria-expanded="false">
            Mais ações
            <IconsSettings class="mx-1" width="1.3em" height="1.3em"/>
        </button>
        <ul @click.stop class="dropdown-menu large-menu py-0">
            <a class="text-decoration-none" href="/catalogo/importar-tabelas">
                <li type="button" class="dropdown-item d-flex py-2 justify-content-between align-items-center mb-0 fw-medium text-dark-emphasis" style="padding-bottom: 4px;">
                    Importar tabelas
                </li>
            </a>
            <li type="button" @click="store.isEditionMode = !store.isEditionMode" class="dropdown-item form-check d-flex py-2 mb-0 align-items-center justify-content-between">
                <span class="me-4 pe-2 fw-medium">Habilitar edição </span>
                <input v-model="store.isEditionMode" class="p-2  form-check-input" value="" id="editCheck" type="checkbox">
            </li>
        </ul>   
    </div>  
</template>

<script setup>
import { inject, onMounted} from 'vue';
import { useUser } from '../../../stores/user';
import { useStorageStore } from '../../../stores/storage';
import { postCreateItem } from '../../../services/items/itemsPOST';
import * as XLSX from 'xlsx';


const toolTip = ref(false);
const store = useStorageStore();
const userStore = useUser();

const dropdownStates = ref([false, false, false, false]);
const toggleDropdown = (dropdown_id) => {
    
    dropdownStates.value[dropdown_id-1] = false
    dropdownStates.value[dropdown_id] = !dropdownStates.value[dropdown_id]
    dropdownStates.value[dropdown_id+1] = false
}

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const tableHeaders = jsonData[0];
        const tableData = jsonData.slice(1);
        for(let i = 0; i < tableData.length; i++){
            console.log(tableData[i][1], tableData[i][2], tableData[i][4] < 0 ? 0 : tableData[i][4])
            try{
                if(tableData[i][4] > 0){
                    let res = await postCreateItem(userStore, tableData[i][1], '', tableData[i][4], tableData[i][2]);
                }
            }catch(err){
                console.log(err)
            }
        }
    };
    reader.readAsArrayBuffer(file);
    store.isReloadItems = true;
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
.dropdown-item , .dropdown-item a{
    font-size: 14px;
    color: rgb(51,51,51, 0.9);
    font-weight: 600;
    margin: 0px;
    padding: 7px !important;
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
.filter-btn{
    font-size: 14px;
    color: rgb(51,51,51, 0.9);
    font-weight: 600;
}
.action-btn{    
    font-weight: 500;
    font-size: 15px;
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #1F69B1;
    color: rgb(51,51,51, 0.9);
    background-color: transparent;
}
.action-btn:hover{
    color: white;
    background-color: #0B3B69;
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
    .large-menu{
        width: 160px;
    }
    .large-menu li{
        font-size: 13px;
    }
    .dropdown-item{
        padding: 8px !important;
    }
    .large-menu span{
        padding-right: 2px !important;
    }
    .action-btn{
        margin-bottom: -3px !important;
        font-size: 12px;
    }
    .filter-btn{
        font-size: 12px;
    }
    .action-icon{
        width: 15px;
        height: 15px;
    } 
}
@media screen and (max-width: 530px){
    .action-btn{
        border-radius: 5px 5px 5px 5px;
        background-color: #0B3B69;
        color: white;
    }
}
</style>