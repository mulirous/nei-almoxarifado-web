<template>
    <Modal id="itemRegistration" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
        <template v-slot:header>
            <h6 class="header-title d-flex fw-medium justify-content-start align-items-center">Cadastro de Item</h6>
            <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
                <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
            </button>
        </template> 
        <template v-slot:body> 
            <div class="mb-3">
                <label for="item-name">Nome do item</label> 
                <input class="form-control" v-model="itemName" type="text">
            </div>
            <div class="sipac-container mb-3" :style="{opacity: itemSipac ? '100%' : '50%'}">
               <label for="item-sipac">Código Sipac <span class="text-light-emphasis ms-3">*opcional*</span></label> 
               <input class="form-control" v-model="itemSipac" type="number" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
            </div>
            <div class="mb-3 d-flex">
                <div class="d-block">
                    <label for="item-qtd">Tipo Unitário</label> 
                    <select v-model="itemType" class="form-select me-5" aria-label="Default select">
                        <option disabled selected>Selecione o tipo</option>
                        <option value="unidade">unidade</option>
                        <option value="sacola">sacola</option>
                        <option value="caixa">caixa</option>
                        <option value="folha">folha</option>
                        <option value="resma">resma</option>
                        <option value="pacote">pacote</option>
                    </select>
                </div>
                <div class="d-block ms-5">
                    <label for="item-qtd">Quantidade</label> 
                    <input class="form-control" v-model="itemQtd" type="number" pattern="[0,9]*" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="container-fluid d-flex justify-content-end align-items-center">
                <button type="button" class="btn btn-light-alert inset-shadow text-light mx-1" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" @click="itemRegister" class="btn btn-light-success inset-shadow text-light mx-1" data-bs-dismiss="modal">Cadastrar</button>
            </div>
        </template>
    </Modal>

</template>

<script>
import { usePopupStore } from '~/stores/popup';
import { sipacHandeling } from '../../composables/inputHandler';
import { useStorageStore } from '../../stores/storage';
export default{
    data() {
        return{
            itemName: '',
            itemSipac: '',
            itemType: '',
            itemQtd: ''
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
            return true
        },
        itemRegister(){
            if(this.itemQtdHandler() === false || this.itemTypeHandler() === false || this.itemNameHandler() === false){
                return false
            };
            try{
                this.store.addItem({name: this.itemName, sipacCode: sipacHandeling(this.itemSipac), type: this.itemType.charAt(0).toUpperCase() + this.itemType.slice(1), /*Faltando o handler de qtd*/  quantity: this.itemQtd, history: '', storage: this.$route.path.split('/')[2]})
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
        return{
            store, popup
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
    border-radius: 9px;
}
.inset-shadow{
    padding: 5px;
    box-shadow: inset 1px 1px 15px 1px rgb(0, 0, 0, 0.2);
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
</style>