<template>
  <div>
		<Head>
			<Title>NEI Almoxarifado | Início</Title>
			<Meta name="início" content="Página inicial"/>
		</Head>
	</div>
  <div class="container-fluid" style="margin-left: 0px;">
    <div class="d-flex paralalel-section">
      <div class="dashboard-section me-2 bg-light mb-4 pb-0 pt-0 rounded-3">
        <div class="section-title pt-2 mb-4 bg-light-background-header">
          <h5 class="header ps-2 fw-bold">Sumário</h5>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="px-3 ms-3 summary-text">
            <p class="summary-text-re teste">Solicitações com status pendente</p>
            <h5 class="d-flex align-items-center justify-content-between mt-1">
              {{ requestsByStatus.totalElements || 0 }}
              <IconsRequest width="20px" height="20px" class="mb-1" />
            </h5>
          </div>
          <div class="px-3 summary-text">
            <p class="summary-text-re">Solicitações do mês aceitas</p>
            <h5 class="d-flex align-items-center justify-content-between mt-1">
              {{ acceptedRequests || 0 }}
              <IconsRequest width="20px" height="20px" class="mb-1" />
            </h5>
          </div>
          <div class="px-3 summary-text">
            <p class="summary-text-re">Solicitações do mês recusadas</p>
            <h5 class="d-flex align-items-center justify-content-between mt-1">
              {{ rejectedRequests || 0 }}
              <IconsRequest width="20px" height="20px" class="mb-1" />
            </h5>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="px-3 ms-3 summary-text">
            <p class="summary-text-re">Quantidade de itens cadastrados</p>
            <h5 class="d-flex align-items-center justify-content-between mt-1">
              {{ items.totalElements || 0 }}
              <IconsSpreadSheet width="20px" height="20px" class="mb-1 " />
            </h5>
          </div>
          <div class="px-3 summary-text">
            <p class="summary-text-re">Quantidade total de itens</p>
            <h5 class="d-flex align-items-center justify-content-between mt-1">
              {{ itemsQtd || 0 }}
              <IconsSpreadSheet width="20px" height="20px" class="mb-1" />
            </h5>
          </div>
          <div class="px-3 summary-text">
            <p class="summary-text-re">Quantidade total de usuários</p>
            <h5 class="d-flex align-items-center justify-content-between mt-1">
              {{ users.totalElements || 0 }}
              <IconsLowProfile width="20px" height="20px" class="mb-1" />
            </h5>
          </div>
        </div>
      </div>    
      <div class="dashboard-section users-management me-0 bg-light mb-4 pb-0 pt-0 rounded-3">
        <div class="section-title d-flex align-items-center justify-content-between bg-light-background-header">
          <h5 class="header ps-2 pt-2 fw-bold">Gestão de Usuários</h5>
          <div @click.stop class="dropdown decoration-none">
            <button class="btn btn-transparent border-0 m-0 p-0 text-dark-emphasis" data-bs-toggle="dropdown" aria-expanded="false">
              <IconsSettingsDots class="me-1 opacity-75" width="28" height="28"/>
            </button>
            <ul class="dropdown-menu py-0">
              <li @click="toggleAccounts()" type="button" class="dropdown-item py-2 d-flex align-items-center justify-content-between text-dark-emphasis">
                <span class="fw-medium">Mostrar contas desativas</span>
                <input type="checkbox" style="margin-bottom: 2px" class="form-check-input ms-2 border-1" v-model="showDisabledAccounts">
              </li>
              <li @click="showDisableActions = !showDisableActions" type="button" class="dropdown-item py-2 d-flex align-items-center justify-content-between text-dark-emphasis">
                <span class="fw-medium">Habilitar deleção de contas</span>
                <input type="checkbox" style="margin-bottom: 2px" class="form-check-input ms-2 border-1" v-model="showDisableActions">
              </li>
            </ul>
          </div>
        </div>
        <div class="dashboard-scroll">
          <TablesTable v-if="users.content.length > 0">
            <template v-slot:header>
              <tr class="col-line">
                <th class="col-title text-center py-2" scope="col">Usuário</th>
                <th class="col-title text-center py-2" scope="col">Email</th>
                <th class="col-title text-center py-2" scope="col">Encargo</th>
                <th class="col-title text-center py-2 justify-content-center" scope="col">Ações</th>
              </tr>
            </template>
            <template v-slot:content> 
              <tr v-for="user in users.content" :key="user.id">
                <th :class="{'user-disabled': !user.active}" class="table-cell" scope="row">
                  <div class="d-flex justify-content-start align-items-center text-nowrap">
                    <IconsPerfil class="me-3 opacity-75" width="30px" height="30px" />
                    <span class="username" style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width: 150px;">{{ user.name }}</span>
                  </div>
                </th>
                <th :class="{'user-disabled': !user.active}" class="text-center table-cell align-cell" scope="row" style="padding-top: 11px;">
                  {{ user.email }}
                </th>
                <th :class="{'user-disabled': !user.active}" class="text-center table-cell align-cell" scope="row" style="padding-top: 11px;">
                  {{ user.role === 'USER' ? 'USUÁRIO' : 'ADMIN'}}
                </th>
                <th :class="{'user-disabled': !user.active}" class="text-center table-cell user-actions pt-2" scope="row" width="5%">
                  <div class="position-sticky d-flex justify-content-center">
                    <button v-if="user.active === true && user.id !== userStore.id" title="Alterar Encargo" @click="BindUser.email = user.email" data-bs-toggle="modal" data-bs-target="#actionConfirm" class="ms-1 me-0 table-btn d-flex align-items-center justify-content-center btn btn-secondary">
                      <IconsBarFilter width="16px" height="16px"/> 
                    </button>
                    <a title="Perfil" :href="`/perfil?userId=${user.id}`" :route="`/perfil/${user.id}`" class="ms-1 me-0 table-btn d-flex align-items-center justify-content-center btn btn-primary">
                      <IconsLowProfile width="16px" height="16px"/>
                    </a>
                    <button v-if="user.active === true && showDisableActions" title="Anular Conta" @click="BindUser.id = user.id" data-bs-toggle="modal" data-bs-target="#removeUser" class="ms-1 me-0 table-btn d-flex align-items-center justify-content-center btn btn-dark-alert">
                      <IconsReject width="16px" height="16px"/>
                    </button>
                  </div>
                </th>
              </tr>
            </template>
          </TablesTable>
        </div>
        <div v-if="loadContent && users.content.length === 0" class="d-flex justify-content-center mb-5">
          <p class="fw-bold fs-5 opacity-75 py-5 my-5">Nenhum dado encontrado</p>
        </div>
        <div v-if="!loadContent"class="d-flex justify-content-center">
          <LoadersLoading class="p-5 m-5" style="margin-top: 30px;"/>
        </div>
      </div>
    </div>
    <div class="dashboard-section recent-records bg-light mb-4 pb-0 pt-0 rounded-3 overflow-hidden">
      <div class="section-title pt-2  bg-light-background-header">
        <h5 class="header ps-2  fw-bold">Movimentações mais recentes</h5>
      </div>
      <div class="dashboard-scroll">
        <TablesTable v-if="records.content && records.content.length">
          <template v-slot:header>
            <tr class="col-line">
              <th class="col-title table-col text-center py-2" scope="col">Usuário</th>
              <th class="col-title table-col text-center py-2" scope="col">Movimentação</th>
              <th class="col-title table-col text-center py-2" scope="col">Item</th>
              <th class="col-title table-col text-center py-2" scope="col">Tipo unitário</th>
              <th class="col-title table-col text-center py-2" scope="col">Quantidade</th>
              <th class="col-title table-col text-center py-2" scope="col">Data e horário</th>
              <th class="col-title table-col text-center py-2" scope="col">Ações</th>
            </tr>
          </template>
          <template v-slot:content>
            <tr v-for="(record, index) in records.content" :key="record.id" class="text-center"> 
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-center " style="padding-top: 0px;">
                  <IconsPerfil class="me-3 mb-0 opacity-75" width="30px" height="30px" />
                  {{ record.user.name }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ record.operation }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ record.item.name }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ record.item.type }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ record.quantity }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ record.creationDate.slice(0, 19) }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text justify-content-center">
                  <button @click="showDetails(index, record.item.id)" title="Detalhes" class="table-btn d-flex align-items-center justify-content-center btn btn-secondary">
                    <IconsSearchGlass width="16px" height="16px"/>
                  </button>
                  <a title="Perfil" :href="`/perfil?userId=${record.user.id}`" :route="`/perfil/${record.user.id}`" class="m-0 table-btn d-flex align-items-center justify-content-center btn btn-primary">
                    <IconsLowProfile width="16px" height="16px"/>
                  </a>
                </div>
              </th>
            </tr>
          </template>
        </TablesTable>
      </div>
      <div v-if="loadContent && records.content.length === 0" class="d-flex justify-content-center mb-5">
        <p class="fw-bold fs-5 opacity-75 py-5 my-5">Nenhuma movimentação encontrada</p>
      </div>
      <div class="d-flex justify-content-center mt-5" v-else>
        <LoadersLoading class="p-5 mt-4"/>
      </div>
    </div>  
    <div class="dashboard-section bg-light mb-4 pb-0 pt-0 rounded-3">
      <DashboardBarChartItems />
    </div> 
    <div class="dashboard-section bg-light mb-4 pb-0 pt-0 rounded-3">
      <DashboardBarChartUtils />
    </div>

    <button id="modalToggle" data-bs-toggle="modal" data-bs-target="#itemDetailing" class="disabled d-none"></button>
    <ModalItemDetails v-if="currentItem" :item_index="itemIndex" :item_details="currentItem" />
    <Modal id="removeUser" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
      <template v-slot:header>
        <h6 class="header-title d-flex fw-medium justify-content-start align-items-center fw-bold fs-5">Desativar conta</h6>
        <button class="btn btn-transparent text-light border-0 close-btn" type="button" data-bs-dismiss="modal">
          <IconsClose class="close ms-5" width="1.3em" height="1.3em"/>
        </button>
      </template>
      <template v-slot:body>
        <p class="fw-bold text-center fs-5">Deseja realmente desativar essa conta?</p>
        <p class="fw-bold text-dark-emphasis text-center">Como administrador você tem permissões especiais para desativar a conta de qualquer usuário comum, esta ação não pode ser desfeita e o usuário não terá mais acesso ao sistema.</p>
      </template>
      <template v-slot:footer>
        <div class="container-fluid d-flex justify-content-end align-items-center">
          <button type="button" @click="deleteAccount()" class="btn btn-dark-success inset-shadow text-light mx-1 fw-bold" data-bs-dismiss="modal">Confirmar</button>
          <button type="button" class="btn btn-light-alert inset-shadow text-light mx-1 fw-bold" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </template>
    </Modal>
    <ModalActionConfirm>
      <template v-slot:text>
        <div class="d-flex align-items-center justify-content-center">
          <p class="fw-bold text-dark-emphasis text-center">Para alterar o Encargo do usuário você deve selecionar o seu novo encargo e confirmar a ação. </p>
        </div>
        <select v-model="BindUser.role" class="form-select" aria-label="Default select">
          <option disabled selected>Selecione o Encargo</option>
          <option value="ADMIN">Administrador</option>
          <option value="USER">Usuário</option>
        </select>
      </template>
      <template v-slot:buttons>
        <div class="d-flex align-items-center justify-content-center">
          <button data-bs-dismiss="modal" @click="patchAccountRole()" class="btn btn-dark-success text-light me-3  fw-bold">Confirmar</button>
          <button data-bs-dismiss="modal" class="btn text-light btn-light-alert fw-bold">Cancelar</button>
        </div>
      </template>
    </ModalActionConfirm>
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import { getItem, getItems } from '../services/items/itemsGET.ts';
import { getRequests } from '../services/requests/requestsGET.ts';
import { getUsers } from '../services/users/userGET.ts';
import { getRecords } from '../services/record/recordGET.ts';
import { getRequestByStatus } from '../services/requests/requestsGET.ts';
import { useUser } from '../stores/user';
import { useSearch } from '../stores/search.ts';
import { deleteUser } from '../services/users/userDELETE';
import { usePopupStore } from '../stores/popup.ts';
import { patchUSER } from '../services/users/userPATCH.ts';

const setpageTitle = inject('setpageTitle');
const sendDataToParent = () => {
  const title = "Painel Geral";
  const route = `${useRoute().fullPath}`
  setpageTitle(title, route, 'home');
};
sendDataToParent();

const userStore = useUser();
const searchStore = useSearch();
const route = useRouter();
const popUpStore = usePopupStore();

const BindUser = ref({
  id: null,
  email: null,
  role: null
});
const showDisabledAccounts = ref(false);
const showDisableActions = ref(false);

const users = ref({ content: [], totalElements: 0}); 
const records = ref({ content: [] });
const requestsByStatus = ref({ totalElements: 0 });
const acceptedRequests = ref(0);
const rejectedRequests = ref(0);
const items = ref({ content: [] }); 
const itemsQtd = ref(0);

const currentItem = ref(undefined);
const itemIndex = ref(0);
const isShowDetails = ref(false);

const loadContent = ref(false);
const toggleAccounts = async () => {
  showDisabledAccounts.value = !showDisabledAccounts.value;
  fetchUsers();
}

const fetchUsers = async () => {
    users.value.content = [];
    let res = await getUsers(userStore, 0);
    users.value.totalElements = res.totalElements;
      for(let i = 1; i <= res.totalPages; i++){
        for(let j = 0; j < res.pageElements; j++){
          if (res.content[j].id == userStore.id) {
            res.content[j].name = "Eu";
            users.value.content.unshift(res.content[j])
          }
          else if(res.content[j].active === true || (res.content[j].active === false && showDisabledAccounts.value === true)){
            users.value.content.push(res.content[j]);
          }
        }
        res = await getUsers(userStore, i);
    }
}
const fetchRequests = async () => {
  let requestsData = await getRequests(userStore, 0);
  let data = new Date();
  let actualMonth = data.getMonth() + 1;
  for (let i = 1; i <= requestsData.totalPages; i++) {
    for (let j = 0; j < requestsData.content.length; j++) {
      if (requestsData.content[j].updatedDate.slice(5, 7) == actualMonth) {
        if (requestsData.content[j].status == 'ACEITO') {
          acceptedRequests.value++;
        }
        if (requestsData.content[j].status == 'RECUSADO') {
          rejectedRequests.value++;
        }
      }
    }
    requestsData = await getRequests(userStore, i);
  }
}
const fetchItems = async () => {
  items.value = await getItems(userStore, 0);
    for (let i = 1; i <= items.value.totalPages; i++) {
      for (let j = 0; j < items.value.pageElements; j++) {
        if(items.value.content[j].available === true){
          itemsQtd.value += items.value.content[j].quantity;
        }
      }
      items.value = await getItems(userStore, i);
    }
}
const fetchData = async () => {
  try {
    fetchUsers();
    records.value = await getRecords(userStore, 0, 'id,desc');
    requestsByStatus.value = await getRequestByStatus(userStore, 'pendente');
    
    fetchRequests();
    fetchItems();
     
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};


onMounted(() => {
  fetchData().finally(() => {
    loadContent.value = true;
  });
});

const showDetails = async (index, itemId) => {
  const modalToggleDom = document.getElementById('modalToggle');
  itemIndex.value = index;
  try {
    currentItem.value = await getItem(userStore, itemId);
    setTimeout((() => modalToggleDom.click()), 200)

  } catch (err) {
    console.error(err);
    return 0;
  }
};

const patchAccountRole = async() => {
    const res = await patchUSER(userStore, BindUser.value.email, BindUser.value.role);
    if(res === true){
      popUpStore.throwPopup('Encargo alterado com sucesso', 'blue');
      fetchUsers();
    } else if(res === false){
      popUpStore.throwPopup('ERRO: Algum problema interno do sistema ocorreu, contate o suporte', 'red')
    }
}
const deleteAccount = async () => {
  try {
    await deleteUser(userStore, BindUser.value.id);
    popUpStore.throwPopup('Conta desativada com sucesso', 'blue');
    fetchUsers();
  } catch (err) {
    popUpStore.throwPopup('ERRO: Algum problema interno do sistema ocorreu, contate o suporte', 'red');
  }
};
</script>

<style scoped>
.dashboard-scroll{
  position: static !important;
  text-wrap: nowrap !important;
  max-height: 247px !important;
  overflow-x: scroll;
}
.users-management{
  position: static !important;
  text-wrap: nowrap !important;
  width: 60%;
}
.recent-records{
  height: 290px;
  overflow-y: scroll;
}
.container{
  width: 100%;
	padding-left: 15px;
  flex-direction: column;
}

.record-btn{
  text-wrap: nowrap;
}
.container-fluid{
  margin: 0;
  min-width: 83%;
}
.dashboard-section{   
  padding-top: 10px;
  padding-bottom: 0px;
  padding-left: 0;
  padding-right: 0;
  border: 1px #D9D9D9 solid;
  box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.2);
}
.section-title{
  border-radius: 8px 8px 0px 0px;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
}
h5{
  font-weight: 300;
  color: rgb(51,51,51, 0.8);
}
.summary-text{
  width: 50%;
  text-overflow: ellipsis;
  font-size: 14px;
  color: rgb(51,51,51, 0.8);
  border-left: 3px solid #FED51E;
}
.table-btn{
    border-radius: 4px;
    top: 0px;
    padding: 4px 3px 4px 3px;
    z-index: 0;
    font-size: 13px;
    margin-right: 10px;
    margin-left: 10px;
}
.table-cell{
  z-index: 1000 !important;
  font-size: 14px;
  font-weight: 400;
  color: rgb(51,51,51, 0.9);
}
.catalog-header{
    justify-content: space-between;
  }
.col-title{
  font-size: 14px;
  color: rgb(51,51,51, 0.9);
  opacity: 90%;
  font-weight: bold;
  margin-top: 0;
  vertical-align: middle;
  text-wrap: nowrap !important;
}
.card-img-top{
  transition: opacity 0.5s ease-in-out;
  opacity: 85%;
}
.search-empty{
  margin-top: 7% !important;
  white-space: nowrap;
}
.col-line {
  border-bottom: 1px solid rgba(80, 76, 76, 0.174);
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
.user-disabled{
  background-color: rgb(229, 57, 53, 0.3) !important;
}
.bg-warning-op80{
    opacity: 80%;
    background-color: rgba(254, 213, 30);
}
.bg-alert-op80{
  opacity: 80%;
  background-color: rgb(231, 15, 15);
}
.bg-secondary-op80{
    opacity: 80%;
    background-color: #0052a4;
}
.warning-box{
    border: solid 1px rgba(0, 0, 0, 0.3);
    color: black;
    font-size: 15px;
    border-radius: 7px;
    width: 280px;
    transition: width 0.3s ease-in-out, box-shadow 0.4s ease-in-out;
}
.form-check-input{
    border: 1px solid rgb(0, 0, 0, 0.3);
}
.form-check-input:active{
    background-color: #1F69B1 !important;
}
.form-check-input:checked{
    background-color: #1F69B1 !important;
}
.bg-warning-op80:hover{
    box-shadow: 0px 0px 15px 4px rgb(160, 152, 2);
    width: 290px;
}
.bg-secondary-op80:hover{
    box-shadow: 0px 0px 15px 2px rgb(5, 64, 119);
    width: 290px;
}
.bg-alert-op80:hover{
  width: 290px;
  box-shadow: 0px 0px 15px 2px rgb(111, 7, 7);
}
.table-cell{
  text-wrap: nowrap;
}
.align-cell{
  padding-top: 12px !important;
}
.stretched-link{
  text-decoration: none;
}
.card:hover .stretched-link{
    color: white !important;
}
.card:hover .card-img-top{
    opacity: 100%;
}
@media screen and (max-width: 1098px) {
  .users-management{
    width: 57%;
  }
  
}
@media screen and (max-width: 1040px){
  .paralalel-section{
    display: block !important;
  }
  .username{
    max-width: 300px !important;
  }
  .users-management{
    width: 100%;
  }
  .dashboard-section{
    margin-right: 0 !important;
  }
}
@media screen and (max-width: 812px){
  .dashboard-container{
    display: block !important;
  }
}   
@media screen and (max-width: 400px){
  .summary-text{
    font-size: 14px;
  }
}
</style>