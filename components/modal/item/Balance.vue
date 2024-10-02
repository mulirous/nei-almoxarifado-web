    <template>
    <Modal id="itemBalance">
        <template v-slot:header>
                <p class="header-title d-flex justify-content-start align-items-center fs-6">Atualizar Item</p>
                <button class="btn btn-transparent border-0 text-light" type="button" data-bs-dismiss="modal">
                    <IconsClose class="close mt-1 ms-5 s-5" width="1.7em" height="1.7em"/>
                </button>
        </template>
        <template v-slot:body>
            <label class="fw-semibold" for="newQtdinput">Digite a nova quantidade:</label>
            <input v-model="qtdInput" class="form-control" id="newQtdinput">
        </template>
        <template v-slot:footer>
            <div class="container-fluid d-flex justify-content-center align-items-center">
                <button type="button" @click="store.updateItemQtd(item_index, qtdInput, `${this.$route.path.split('/')[2]}`)" class="btn btn-light-success text-light mx-3" data-bs-dismiss="modal">Atualizar</button>
                <button type="button" class="btn btn-light-alert text-light mx-3" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </template>
    </Modal>    
</template>

<script>
import { useStorageStore } from '~/stores/storage';
export default{
    data(){
        return{
            qtdInput: 0
        }
    },
    mounted() {
        const modal = document.getElementById("itemBalance");
        const modalDialog = modal.getElementsByClassName("modal-dialog");

        modal.style.backgroundColor = 'rgb(0, 0, 0, 0)'; 
        modal.style.top = '60px';

        modalDialog[0].style.width = '250px';

        modal.getElementsByClassName('modal-header')[0].style.height = '10px';
    },
    setup(){
        const store = useStorageStore();
        return{
            store
        }
    },
    props:{
        item_index: {
            type: Number,
            required: true
        }
    }
}
</script>

<style scoped>
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
</style>