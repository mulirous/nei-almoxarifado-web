<template>
    <Modal id="itemRegistration" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
        <template v-slot:header>
            <p class="header-title d-flex fw-bold justify-content-start align-items-center">Cadastro de item</p>
            <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
                <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
            </button>
        </template> 
        <template v-slot:body> 
            <div class="mb-3">
                <label class="fw-bold" for="item-name">Nome do item</label> 
                <input class="form-control" v-model="itemName" type="text">
            </div>
            <div class="mb-3 d-flex">
                <div class="d-block sipac-container" :style="{opacity: itemSipac ? '100%' : '50%'}">
                   <label class="fw-bold" for="item-sipac">Código Sipac <span :class="settingsStore.isMobile ? 'ms-0' : 'ms-3'" class="text-light-emphasis">*opcional*</span></label> 
                   <input class="form-control" v-model="itemSipac" type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                </div>
                <div class="d-block ms-3 w-50">
                    <label class="fw-bold text-nowrap" for="item-qtd">Tipo Unitário</label> 
                    <select v-model="itemType" class="form-select" aria-label="Default select">
                        <option disabled selected>Selecione o tipo</option>
                        <option v-for="(category, index) in settingsStore.categories" :key="index" :value="category">{{ category }}</option>
                    </select>
                </div>
            </div>
            <div class="mb-3 d-flex">
                <div class="d-block">
                    <label class="fw-bold" for="item-qtd">Quantidade</label> 
                    <input class="form-control" id="item-qtd" v-model="itemQtd" type="number" pattern="[0,9]*" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                </div>
                <div class="d-block ms-3">
                    <label class="fw-bold text-nowrap" for="item-minimumlevel">Quantidade Mínima de Estoque</label> 
                    <input class="form-control" id="item-minimumlevel" v-model="itemMininumQtd" type="number" pattern="[0,9]*" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="container-fluid d-flex justify-content-end align-items-center">
                <button type="button" @click="itemRegister" class="btn btn-dark-success fw-bold inset-shadow text-light mx-1" data-bs-dismiss="modal">Cadastrar</button>
                <button type="button" class="btn btn-light-alert inset-shadow text-light fw-bold mx-1" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </template>
    </Modal>

</template>

<script>
import { usePopupStore } from '~/stores/popup';
import { sipacHandeling } from '~/composables/inputHandler';
import { useStorageStore } from '~/stores/storage';
import { useSettingsStore } from '~/stores/settings';
export default{
    data() {
        return{
            itemName: '',
            itemSipac: '',
            itemType: '',
            itemQtd: '',
            itemMininumQtd: '',
        }
    },
    methods: {
        itemQtdHandler(){
            if(parseInt(this.itemQtd) == 0 || this.itemQtd == ''){
                this.popup.throwPopup("Erro: Quantidade inválida", '#B71C1C')
                return false
            }
            return true
        },
        itemTypeHandler(){
            if(this.itemType === ''){
                this.popup.throwPopup('Erro: Tipo inválido', '#B71C1C')
                return false
            }
            return true
        },
        itemNameHandler(){
            if(this.itemName === ''){
                this.popup.throwPopup('Erro: Nome inválido', '#B71C1C')
                return false
            }
            if(this.itemName.length > 46){
                this.popup.throwPopup('Erro: Nome não deve passar de 20 caracteres', '#B71C1C')
                return false
            }
            return true
        },
        itemRegister(){
            if(this.itemQtdHandler() === false || this.itemTypeHandler() === false || this.itemNameHandler() === false){
                return false
            };
            try{
                this.store.addItem({name: this.itemName, sipacCode: sipacHandeling(this.itemSipac), type: this.itemType.charAt(0).toUpperCase() + this.itemType.slice(1), /*Faltando o handler de qtd*/  quantity: this.itemQtd, history: '', minimumStock: this.itemMininumQtd})
            } catch(err){
                this.popup.throwPopup("Erro: problema interno no servidor(Contate o Suporte)", '#B71C1C')
                return false
            }
            this.popup.throwPopup("Item cadastrado", '#0B3B69');
        }
    },
    setup(){
        const store = useStorageStore();
        const popup = usePopupStore();
        const settingsStore = useSettingsStore();
        return{
            store, popup, settingsStore 
        }
    }
}
</script>

<style scoped>
.form-select{
    max-height: 100px !important;
    overflow-y: scroll;
}
.close{
    position: relative;
    left: 20px;
}
.header-title{
    font-weight: 300;
    margin: -1px 0 -1px 0;
    padding: 0;
}
.btn{
    border-radius: 5px;
    padding: 6px 10px 6px 10px;
}
.inset-shadow{
    padding: 5px;
}
.close-btn{
    border: none;
}
.sipac-container:hover{
    opacity: 100% !important;
}
.sipac-container:active {
    opacity: 100% !important;
}
@media screen and (max-width: 560px) {
    label{
        font-size: 14px;
    }
}
</style>