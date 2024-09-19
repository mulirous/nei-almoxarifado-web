<template>
	<Modal id="itemHistory" class="px-1 pb-5" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
		<template v-slot:header>
            <p class="header-title d-flex fw-bold justify-content-start align-items-center">Histórico do item</p>
            <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
                <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
            </button>
        </template> 
	    <template v-slot:body>
			<table class="table text-center"> 
				<thead>
					<tr>
						<th class="col-title" scope="col"> Data </th> 
						<th class="col-title" scope="col"> Operação </th> 
						<th class="col-title" scope="col"> Quantidade </th> 
						<th class="col-title" scope="col"> Autor </th> 
					</tr>
				 </thead>
				<tbody>
					<tr v-for="history in store.itemRecord" :key="history.id"> 
						<td scope="row" class="p-2 mb-3"> {{history.creationDate.slice(0, 19)}} </td>
						<td class="fw-bolder p-2 mb-3" style="--bs-bg-opacity: .99" :class="{'text-light bg-success border-0': isCreate(history.operation), 'text-light bg-danger border-0': isDelete(history.operation), 'text-light bg-warning border-0': isRequest(history.operation)}"> {{ history.operation }} </td>
						<td> {{ history.quantity }} </td>
						<td> {{ history.user.name }} </td>
					</tr>
				</tbody>
			</table>
		</template>
		<template v-slot:footer>
			<div class="container-fluid d-flex justify-content-center align-items-center my-3">
            </div>
			<div @click="getItemDetails" title="Detalhes" data-bs-target="#itemDetailing" data-bs-toggle="modal" type="button" class=" btn btn-primary position-absolute bg-primary rounded-2 p-1 d-flex justify-content-end text-light">
                <IconsInformation width="23px" height="23px"/>
            </div>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { getRecordByItemId } from '../../services/record/recordGET';
import { useUser } from '../../stores/user';
import { useStorageStore } from '../../stores/storage';
import { ref, computed, onUpdated, onMounted, defineProps } from 'vue';
import { getItem } from '../../services/items/itemsGET';

const store = useStorageStore();
const userStore = useUser();
const itemHistory = ref(store.itemRecord)

const toggleHistory = ref(false);
async function getItemDetails(){
	const res = await getItem(userStore, store.itemRecord[0].item.id);
	store.itemDetails = res;
}

function isCreate(operation){
	if(operation.includes('CADASTRO')){
		return true; 
	}
}
function isRequest(operation){
	if(operation.includes('CONSUMO')){
		return true; 
	}
}
function isDelete(operation){
	if(operation.includes('Excluido')){
		return true; 
	}
}

</script>

<style scoped>
td{
	vertical-align: middle;
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
    border-radius: 10px;
}
@media screen and (max-width: 700px){
	table{
		overflow-x: hidden;
		margin: 0px 0px 0px -20px;
		width: 108%;
	}
}
</style>
