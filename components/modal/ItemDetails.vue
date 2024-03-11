<template>
    <Modal id="itemDetailing" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
        <template v-slot:header>
            <h5 class="header-title d-flex justify-content-start align-items-center">Detalhes do Item</h5>
            <button class="btn btn-transparent text-light" type="button" data-bs-dismiss="modal">
                <IconsClose class="close mt-1 ms-5 s-5" width="1.7em" height="1.7em"/>
            </button>
        </template>
        <template v-slot:body>
            <div class="row">
				<div class="col-6">
					<div class="mb-3"> 
						<label class="form-label fw-bold"> Nome </label>
						<input readonly class="form-control" type="text" :value="item.itemName">
					</div>	
					<div class="mb-3"> 
						<label class="form-label fw-bold"> Código Sipac </label>
						<input readonly class="form-control" :value="item.itemTagging"> 
					</div>	
					<div class="mb-3"> 
						<label class="form-label fw-bold"> Tipo </label>
						<input readonly class="form-control" :value="item.type"> 
					</div>
                    <div class="mb-3"> 
						<label class="form-label fw-bold"> Quantidade </label>
						<input readonly class="form-control" :value="item.quantity"> 
					</div>	
				</div>
				<div class="col-6">
					<div class="mb-3"> 
						<label class="form-label fw-bold"> Inventário </label>
						<input readonly class="form-control" :value="item.catalog"> 
					</div>	
					<div class="mb-4">
                        <label class="form-label fw-bold"> Última atualização </label>
                        <input readonly id="expansible-form" class="form-control" @mouseover="inputExpand" @mouseleave="inputContract" :value="item.lastUpdate">
                    </div>
					<div class="mb-3"> 
						<label class="form fw-bold"> Data de Registro </label>
						<input readonly class="form-control" :value="item.registerData"> 
					</div>	
                    <div class="mb-4"> 
						<label class="form-label fw-bold"> Criador </label>
						<input readonly class="form-control" :value="item.creator"> 
					</div>	
				</div>
			</div>
        </template>
        <template v-slot:footer>
            <div class="container-fluid d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-warning mx-3" data-bs-dismiss="modal">Voltar</button>
            </div>
        </template> 
    </Modal>
</template>background-color: red;

<script>
export default {
    data() {
        return {
            expansibleContainer: null,
            expansibleInput: null, 
            shadowInput: null,
            mouseOverFlag: false,
            item: {
                itemName: "Lapiseira",
                itemTagging: 5737829,
                type: "Unitário",
                quantity: 5,
                catalog: "Almoxarifado escolar",
                lastUpdate: "26/02/2024 16:04:01 - Consumo",
                registerData: "03/12/2023 13:04:00",
                creator: "Luciana Almeida"
            }
        }
    },
    methods: {
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
                this.expansibleInput.style.width = "230px";
            }
        }
    }
}
</script>



<style scoped>
.modal-header{
    background-color: red;
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
.btn{
    border-radius: 10px;
}


</style>