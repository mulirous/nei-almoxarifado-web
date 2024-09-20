<template>
    <Modal id="NeiItemRequest" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
        <template v-slot:header>
            <p class="header-title d-flex fw-bold justify-content-start align-items-center">Confirmar Solicitação</p>
            <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
                <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
            </button>
        </template> 
        <template v-slot:body>
        <div v-if="item_details != undefined" class="d-block modal-labels">
            <div class="d-flex">
                <div class="d-block mb-2 pe-2">
                    <label for="item-name">Nome do Item</label>
                    <input readonly class="form-control bg-light-emphasis" :value="item_details.name">
                </div>
                <div class="d-block mb-2 ps-2">
                    <label for="item-name">Quantidade Disponível</label>
                    <input readonly class="form-control bg-light-emphasis" :value="item_details.quantity">
                </div>
            </div>
            <div class="d-flex">
                <div class="d-block mb-2 pe-2">
                    <label for="item-name">Tipo unitário</label>
                    <input readonly class="form-control bg-light-emphasis" :value="item_details.type">
                </div>
                <div class="d-block mb-2 ps-2">
                    <label for="item-name">Situação</label>
                    <input readonly class="form-control bg-light-emphasis" :value="item_details.available === true ? 'disponível' : 'indisponível'">
                </div>
            </div>
            <h6 class="text-dark fw-bold"> Mensagem para a solicitação </h6>
            <textarea v-model="description" class="form-control textarea"> </textarea>
            <div class="d-block mt-2">
                <label for="item-qtd">Quantidade a ser solicitada</label> 
                <input class="form-control" style="width: 225px !important;" v-model="itemQtd" type="number" pattern="[0,9]*" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
            </div>
        </div>
        </template>
        <template v-slot:footer>
            <div class="container-fluid d-flex justify-content-end align-items-center">
                <button @click="sendRequest()" data-bs-dismiss="modal" class="btn btn-secondary fw-bold mx-1"> Enviar </button>
                <button data-bs-dismiss="modal" class="btn btn-light-alert fw-bold text-light mx-1"> Cancelar </button>
            </div>
        </template> 
    </Modal>
</template>

<script>
import { useStorageStore } from '../../stores/storage';
import { usePopupStore } from '../../stores/popup';
import { inject } from 'vue';
import { useUser } from '../../stores/user';
import { getRecordByItemId } from '../../services/record/recordGET';
import { postRequest } from '../../services/requests/requestsPOST';
import { useSearch } from '../../stores/search';

export default {
    data() {
        return {
            itemQtd: 0,
            description: ''
        }
    },
    methods: {
        async sendRequest(){
            try{
                const res = await postRequest(this.userStore, this.item_details.id, this.itemQtd, this.description ? this.description : 'nenhuma')
            }catch(err){
                this.popUpStore.throwPopup('Erro: digite uma mensagem de solicitação', '#B71C1C')
                throw new Error(err);
            }
            return this.popUpStore.throwPopup('Solicitação enviada', '#0B3B69')
        }
    },
    props: {
        item_details: {
            type: Object    
        },
        item_index:{
            type: Number
        },
    },
    setup(){
        const store = useStorageStore();
        const userStore = useUser();
        const popUpStore = usePopupStore();
        return {
            store, userStore, popUpStore
        }
    },
}
</script>

<style scoped>
.btn{
    padding: 6px;
}
label{
    font-weight: bold;
    text-wrap: nowrap;
}
.mode-btn{
    font-size: 15px;
}
.close{
    position: relative;
    left: 20px;
}
.header-title{
    margin: -1px 0 -1px 0;
    padding: 0;
}
.modal-btn{
    border-radius: 5px;
}
@media screen and (max-width: 424px){
    .modal-labels{
        margin: -5px;
    }
    label{
        font-size: 14px;
    }
}
@media screen and (max-width: 360px){
    .form-label{
        font-size: 12px !important;
        font-weight: normal !important;
    }   
    .form-control{
        font-size: 12px !important;
    }
}
</style>