<template>
    <Modal id="itemDetailing" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
        <template v-slot:header>
            <p class="header-title d-flex fw-bold justify-content-start align-items-center">Detalhes do item</p>
            <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
                <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
            </button>
        </template> 
        <template v-slot:body>
            <div v-if="item_details != undefined" class="row">
				<div class="col-6">
                    <div class="mb-3"> 
                        <label class="form-label fw-bold"> Nome </label>
						<input readonly class="form-control edit-control" :class="{'bg-light-emphasis': !editionActive, 'bg-light': editionActive}" type="text" :value="item_details.name">
					</div>	
					<div class="mb-3"> 
                        <label class="form-label fw-bold"> Código Sipac </label>
						<input readonly class="form-control edit-control" :class="{'bg-light-emphasis': !editionActive, 'bg-light': editionActive}" :value="item_details.sipacCode ? item_details.sipacCode : 'nenhum'"> 
					</div>	
					<div class="mb-3"> 
						<label class="form-label fw-bold"> Tipo </label>
						<input readonly class="form-control edit-control" :class="{'bg-light-emphasis': !editionActive, 'bg-light': editionActive}" :value="item_details.type"> 
					</div>
                    <div class="mb-3"> 
                        <label class="form-label fw-bold"> Quantidade </label>
						<input readonly class="form-control edit-control" :class="{'bg-light-emphasis': !editionActive, 'bg-light': editionActive}" :value="item_details.quantity"> 
					</div>	
				</div>
				<div class="col-6">
                    <!--
                    <div class="mb-3"> 
                        <label class="form-label fw-bold"> Inventário </label>
						<input readonly class="form-control bg-light-emphasis" :value="item_route"> 
					</div>
                    -->	
					<div v-if="item_details.createdAt != undefined" class="mb-3"> 
                        <label class="form-label fw-bold"> Data de Registro </label>
						<input readonly class="form-control bg-light-emphasis" :value="item_details.createdAt.slice(0,19)"> 
					</div>	
                    <div v-if="item_details.createdBy != undefined" class="mb-3"> 
						<label class="form-label fw-bold"> Criador </label>
						<input readonly class="form-control bg-light-emphasis" :value="item_details.createdBy.name"> 
					</div>
                    <div v-if="item_details.lastRecord != undefined" class="mb-3">
                        <label class="form-label fw-bold"> Última atualização </label>
                        <input readonly class="form-control bg-light-emphasis" id="expansible-form" :value="`${item_details.lastRecord.operation} ${item_details.lastRecord.creationDate === undefined? item_details.lastRecord.data.slice(0, 19) : item_details.lastRecord.creationDate.slice(0, 19)} ${item_details.lastRecord.user.name}`">
                    </div>	
                    <div class="mb-3"> 
                        <label class="form-label fw-bold"> Disponibilidade </label>
						<input readonly class="form-control bg-light-emphasis" :value="item_details.available === true ? 'disponível' : 'esgotado'"> 
					</div>	
				</div>
			</div>
        </template>
        <template v-slot:footer>
            <div class="d-flex">
                <div v-if="userStore.role === 'ADMIN' && item_route !== 'registro'" class="d-flex align-items-center justify-content-start">
                    <div v-if="userStore.role === 'ADMIN' && store.isEditionMode" class="container-fluid d-flex justify-content-center align-items-center px-0 mx-0">
                        <button class="btn mode-btn inset-shadow btn-dark-alert mx-1 fw-bold" :class="{'d-none': editionActive, 'd-block': !editionActive}" @click="deleteItem" id="itemDelete" data-bs-dismiss="modal">Deletar</button>
                        <button class="btn modal-btn fw-bold inset-shadow mode-btn btn-dark-success text-light fw-bold mx-1" id="fetch-inputs" :class="{'d-none': !editionActive, 'd-block': editionActive}" @click="fetchNewData" data-bs-dismiss="modal">Confirmar</button>
                        <button class="btn modal-btn fw-bold inset-shadow mode-btn btn-primary fw-bold mx-1" @click="setEdition">{{ editionActive ? 'Voltar' : 'Editar' }}</button>
                    </div>
                    <button title="Reposição da quantidade do item" class="btn modal-btn fw-bold inset-shadow mode-btn btn-secondary fw-bold ms-1 me-2" :class="{'d-none': editionActive, 'd-block': !editionActive}" data-bs-toggle="modal" data-bs-target="#itemReposition">
                        Reposição
                    </button>
                </div>
                <div v-if="userStore.role === 'USER'" class="d-flex align-items-center justify-content-center">
                    <button class="btn btn-secondary fw-bold text-light mx-1" data-bs-toggle="modal" data-bs-target="#actionConfirm">Solicitar</button>
                    <button class="btn btn-light-alert fw-bold text-light mx-1" data-bs-dismiss="modal">Fechar</button>
                </div>
                <div v-if="userStore.role === 'ADMIN'" @click="getRecord" data-bs-target="#itemHistory" data-bs-toggle="modal" title="Histórico" type="button" class="btn btn-primary  my-1 bg-primary rounded-2 p-1 d-flex justify-content-end text-light">
                    <IconsHistory width="25px" height="25px"/>
                </div>
            </div>
        </template> 
    </Modal>
    <ModalItemHistory v-if="toggleHistory"/>
    <ModalItemReposition v-if="item_details != undefined" :itemName="item_details.name ? item_details.name: ''" :itemSipac="item_details.sipacCode ? item_details.sipacCode : 0" :itemType="item_details.type ? item_details.type : ''" :itemIndex="item_index"/>
</template>

<script>
import { useStorageStore } from '~/stores/storage';
import { useUser } from '~/stores/user';
import { getRecordByItemId } from '~/services/record/recordGET';
export default {
    data() {
        return {
            expansibleContainer: null,
            expansibleInput: null, 
            shadowInput: null,
            mouseOverFlag: false,
            inputs: [],
            editionActive: false,
            toggleHistory: true,
        }
    },
    methods: {
        deleteItem(){
            this.store.deleteItem(this.item_details.id);
        },
        inputExpand() { 
            if (!this.mouseOverFlag) { 
                this.mouseOverFlag = true;
                this.shadowInput = document.createElement("input");
                this.shadowInput.setAttribute("class", "form-control");
                this.shadowInput.setAttribute("value", "");
                this.shadowInput.setAttribute("readonly", "true");

                this.expansibleInput = document.getElementById("expansible-form");
                this.expansibleInput.style.position = "fixed";
                this.expansibleInput.style.width = "300px";

                this.expansibleContainer = this.expansibleInput.parentNode;
                this.expansibleContainer.appendChild(this.shadowInput);
            }
        },
        inputContract() {
            this.mouseOverFlag = false; 
            if (this.shadowInput && this.expansibleContainer) {
                this.expansibleContainer.removeChild(this.shadowInput);
                this.shadowInput = null;
                this.expansibleInput.style.position = "static";
                this.expansibleInput.style.width = "100%";
            }
        },
        setEdition(){       
            this.editionActive = !this.editionActive;
            this.inputs = document.getElementsByClassName("edit-control");
            for(let i = 0; i < this.inputs.length; i++){
                this.inputs[i].removeAttribute('readonly');
            }
        },
        revertEdition(){
            this.editionActive = false;
            this.inputs = document.getElementsByClassName("edit-control");
            for(let i = 0; i < this.inputs.length; i++){
                this.inputs[i].setAttribute('readonly', '');
            }
        },
        fetchNewData(){
            this.store.updateItems(this.item_details.id, this.inputs[0].value, this.inputs[1].value, this.inputs[2].value, this.inputs[3].value);
            this.revertEdition();
        },
        async getRecord(){
            const res = await getRecordByItemId(this.userStore,this.item_details.id);
            this.store.itemRecord = res.content;
        }
    },
    props: {
        item_details: {
            type: Object    
        },
        item_index:{
            type: Number
        },
        item_route:{
            type: String
        },
    },
    setup(){
        const store = useStorageStore();
        const userStore = useUser();
        return {
            store, userStore
        }
    },
}
</script>

<style scoped>
.btn{
    padding: 6px;
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