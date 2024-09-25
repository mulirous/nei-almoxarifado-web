<template>
    <Modal id="itemMinimumStock" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
        <template v-slot:header>
            <p class="header-title d-flex fw-medium justify-content-start fw-bold align-items-center">Alterar quantidade mínima de estoque</p>
            <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
                <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
            </button>
        </template>
        <template v-slot:body>
            <div class="row">
                <div class="mb-3"> 
                        <label class="mb-2 fw-bold">Nova quantidade mínima</label>
						<input v-model="minimumStockLevel" class="form-control edit-control" type="number" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
				</div>
            </div>   
        </template>
        <template v-slot:footer>
            <div class="d-flex">
                <div class="container-fluid d-flex justify-content-center align-items-center">
                    <button @click="updateStockLevel" data-bs-dismiss="modal" type="button" class="btn modal-btn mx-2 fw-bold btn-dark-success inset-shadow text-light">Confirmar</button>
                    <button data-bs-dismiss="modal" type="button" class="btn modal-btn btn-light-alert fw-bold text-light inset-shadow">Cancelar</button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import { postCreateItem } from '../../services/items/itemsPOST';
import { useStorageStore } from '../../stores/storage';
import { usePopupStore } from '../../stores/popup';
import { useRoute } from 'vue-router';
import { patchItem } from '../../services/items/itemsPATCH';
import { useUser } from '../../stores/user';
const props = defineProps({
    itemIndex: {
        type: Number,
        required: true
    }
})


const minimumStockLevel = ref(0);
const store = useStorageStore();
const userStore = useUser();
const popUpStore = usePopupStore();
const updateStockLevel = async () => {
    if(minimumStockLevel.value === 0){
        popUpStore.throwPopup('Erro: Quantidade deve ser maior que 0', '#B71C1C')
        return 0
    }
    try{
        const res = await patchItem(userStore, props.itemIndex, minimumStockLevel.value);
        store.isReloadItems = true;
        popUpStore.throwPopup(`Nova quantidade mínima definida`, '#0B3B69')
    } catch(err){
        popUpStore.throwPopup('Erro: Algo de errado ocorreu, contate o suporte', '#B71C1C')
        return 0;
    }
}
</script>

<style scoped>
.inset-shadow{
    padding: 5px;
}
.close{
    position: relative;
    left: 20px;
}
.header-title{
    font-weight: semibold;
    margin: -1px 0 -1px 0;
    padding: 0;
}
.modal-btn{
    border-radius: 5px;
}
@media screen and (max-width: 424px){
    .form-label{
        font-size: 14px !important;
        font-weight: normal !important;
    }   
    .form-control{
        font-size: 12px !important;
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
