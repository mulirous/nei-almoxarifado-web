<template>
  <div class="container-fluid  d-block">
  <div>
		<Head>
			<Title>NEI Almoxarifado | Perfil</Title>
			<Meta name="perfil" content="Página sobre as informações do usuário"/>
		</Head>
	</div>
    <div class="profile-container" :class="{'d-flex': userData.role === 'USER' && !store.isMobile}">
      <div class="profile-sidebar bg-light rounded-3  flex-column align-items-center">
        <div class="d-flex justify-content-center mb-4 bg-light-background-header history-title">
            <h5 class="text-center mt-2 fw-bold">Informações do perfil</h5>
        </div>
        <div>
          <div class="user-info-box" :class="{'d-flex justify-content-center rounded-1 mx-5 pt-3 bg-light-background-header':userData.role === 'ADMIN'}" :style="{border: userData.role === 'ADMIN' ? '1px solid rgba(0, 0, 0, 0.2)' : ''}">
            <div class="profile-picture aspect-ratio" :class="{'mx-5 pe-5 mt-2':userData.role === 'ADMIN'}"> 
              <div class="img-container">
                <!--<img :src="user.profilePicture" class="img-top" alt="Foto de Perfil">-->
                    <img src="/profile.png" class="img-top" alt="Foto de Perfil">
              </div>
              <input type="file" @change="uploadProfilePicture" ref="fileInput" hidden>
              <!--<button @click="selectProfilePicture">Alterar Foto</button>-->
              <h3 class="text-center mt-4">{{ userData.name }}</h3>
            </div>
            <div v-if="userData.role === 'USER'" class="profile-details">
                <p class="mt-5 users-info text-dark-emphasis"><strong>Email:</strong> {{ userData.email }}</p>
                <p class="mt-3 users-info text-dark-emphasis"><strong>Encargo:</strong> {{ userData.role === 'ADMIN' ? 'Administrador' : 'Usuário' }}</p>
                <p class="mt-3 users-info text-dark-emphasis"><strong>Status da conta:</strong> {{ userData.active ? 'Ativa' : 'Desativada' }}</p>
            </div>
            <div v-else class="user-info-box d-flex align-items-center">
              <div class="d-block mobile-spacement">
                <p class="fs-5 me-5 users-info text-dark-emphasis"><strong>Email</strong><br> {{ userData.email }}</p>
                <p class="fs-5 me-5 users-info text-dark-emphasis"><strong>Encargo</strong><br> {{ userData.role === 'ADMIN' ? 'Administrador' : 'Usuário' }}</p>
              </div>
              <div class="d-block mobile-spacement">
                <p class="fs-5 me-5 users-info text-dark-emphasis"><strong>Status do perfil</strong><br> {{ userData.active ? 'Ativado' : 'Desativada' }}</p>
                <p class="fs-5 me-5 users-info text-dark-emphasis"><strong>Status dos registros</strong><br> {{ userData.existRecord ? 'Ativado' : 'Desativado' }}</p>
              </div>
            </div>
          </div>
          <div class="profile-actions mt-5">
            <button :class="{'mx-5': userData.role === 'ADMIN'}" v-if="userStore.id == route.currentRoute._rawValue.query.userId" data-bs-target="#updatePasswordModal" data-bs-toggle="modal" class="btn fs-6 fw-bold btn-secondary">Alterar Senha</button>
            <button v-else-if="userStore.role === 'ADMIN' && userStore.id !== route.currentRoute._rawValue.query.userId" data-bs-target="#updateRole" data-bs-toggle="modal" class="mx-5 btn fs-6 fw-bold btn-secondary">Alterar Encargo</button>
            <button v-if="userStore.role === 'ADMIN' && userData.active" data-bs-target="#deleteAccount" data-bs-toggle="modal" class="mx-5 btn fs-6 fw-bold btn-light-alert">Desativar Conta</button>
          </div>
        </div>
      </div>
    <div v-if="userData.role === 'USER'" >
      <div class="profile-posts bg-light mb-4 mt-0 pb-0 pt-0 rounded-3" style="margin-right: 190px !important;">
        <div class="history-title pt-2 bg-light-background-header">
          <h5 class="ms-3 fw-bold">Solicitações Pendentes</h5>
        </div>
        <div class="posts-table">
          <TablesTable>
            <template v-slot:header>
              <tr class="bg-light">
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Nome</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Tipo</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Sipac</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Quantidade</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Data e horário</th>
              </tr>
            </template>
            <template v-slot:content>
              <tr v-if="pendingRequests.length > 0" v-for="request in pendingRequests" :key="request.id" class="text-center"> 
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-center justify-content-center" style="padding-top: 0px;">
                    {{ request.item.name || 'Nome não disponível' }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-center justify-content-center">
                    {{ request.item.type || 'Tipo não disponível' }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-center justify-content-center">
                    {{ request.item.sipacCode ? request.item.sipacCode : 'nenhum' }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-center justify-content-center">
                    {{ request.quantityRequested }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-center justify-content-center">
                    {{ request.creationDate.slice(0, 19) }}
                  </div>
                </th>
              </tr>
              <tr v-else>
                <th style="width: 100vh !important; " colspan="5" class="text-center fw-bold text-dark-emphasis py-5 mt-5">
                  Nenhuma solicitação encontrada
                </th>
              </tr>
              </template>
            </TablesTable>
        </div>
      <p class="ms-2 pt-2 fw-bold posts-loader">{{reqsTotalElements.pendingRequests}} Solicitações</p>
      </div>
      <div class="profile-posts me-2 bg-light mb-4 mt-0 pb-0 pt-0 rounded-3" style="margin-right: 190px !important;">
        <div class="history-title pt-2 bg-light-background-header">
          <h5 class="ms-3 fw-bold">Solicitações Aceitas</h5>
        </div>
        <div class="posts-table">
          <TablesTable>
            <template v-slot:header>
              <tr class="bg-light">
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Nome</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Tipo</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Sipac</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Quantidade</th>
                <th class="col-title table-col fw-bold text-center py-2" scope="col">Data e horário</th>
              </tr>
            </template>
            <template v-slot:content>
              <tr v-if="acceptedRequests.length > 0" v-for="request in acceptedRequests" :key="request.id" class="text-center"> 
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-center justify-content-center" style="padding-top: 0px;">
                    {{ request.item.name || 'Nome não disponível' }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                    {{ request.item.type || 'Tipo não disponível' }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text table-text align-items-end mt-1 justify-content-center">
                    {{ request.item.sipacCode ? request.item.sipacCode : 'nenhum' }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                    {{ request.quantityRequested }}
                  </div>
                </th>
                <th class="table-cell mov-cell" scope="row">
                  <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                    {{ request.creationDate.slice(0, 19) }}
                  </div>
                </th>
              </tr>
              <tr v-else>
                <td colspan="5" class="text-center fw-bold text-dark-emphasis py-5 mt-5">Nenhuma solicitação encontrada</td>
              </tr>
              </template>
            </TablesTable>
        </div>
      <p class="ms-2 pt-2 fw-bold posts-loader">{{reqsTotalElements.acceptedRequests}} Solicitações</p>
      </div>
      </div>
    </div>
    
<div class="profile-main-content mt-2">
  <div v-if="userData.role === 'USER'"  class="profile-container" >
  <div class="profile-posts me-2 bg-light mb-4 mt-0 pb-0 pt-0 rounded-3">
    <div class="history-title pt-2 bg-light-background-header">
      <h5 class="ms-3 fw-bold">Solicitações Recusadas</h5>
    </div>
    <div class="posts-table">
      <TablesTable>
        <template v-slot:header>
          <tr class="bg-light">
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Nome</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Tipo</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Sipac</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Quantidade</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Data e horário</th>
          </tr>
        </template>
        <template v-slot:content>
          <tr v-if="rejectedRequests.length > 0" v-for="request in rejectedRequests" :key="request.id" class="text-center"> 
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-center justify-content-center" style="padding-top: 0px;">
                {{ request.item.name || 'Nome não disponível' }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                {{ request.item.type || 'Tipo não disponível' }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text table-text align-items-end mt-1 justify-content-center">
                {{ request.item.sipacCode ? request.item.sipacCode : 'nenhum' }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                {{ request.quantityRequested }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                {{ request.creationDate.slice(0, 19) }}
              </div>
            </th>
          </tr>
          <tr v-else>
            <td colspan="5" class="text-center fw-bold text-dark-emphasis py-5 mt-5">Nenhuma solicitação encontrada</td>
          </tr>
          </template>
        </TablesTable>
    </div>
  <p class="ms-2 pt-2 fw-bold posts-loader">{{reqsTotalElements.rejectedRequests}} Solicitações</p>
  </div>
  <div class="profile-posts bg-light mb-4 mt-0 pb-0 pt-0 rounded-3">
    <div class="history-title pt-2 bg-light-background-header">
      <h5 class="ms-3 fw-bold">Solicitações Canceladas</h5>
    </div>
    <div class="posts-table">
      <TablesTable>
        <template v-slot:header>
          <tr class="bg-light">
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Nome</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Tipo</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Sipac</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Quantidade</th>
            <th class="col-title table-col fw-bold text-center py-2" scope="col">Data e horário</th>
          </tr>
        </template>
        <template v-slot:content>
          <tr v-if="canceledRequests.length > 0" v-for="request in canceledRequests" :key="request.id" class="text-center"> 
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-center justify-content-center" style="padding-top: 0px;">
                {{ request.item.name || 'Nome não disponível' }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                {{ request.item.type || 'Tipo não disponível' }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text table-text align-items-end mt-1 justify-content-center">
                {{ request.item.sipacCode ? request.item.sipacCode : 'nenhum' }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                {{ request.quantityRequested }}
              </div>
            </th>
            <th class="table-cell mov-cell" scope="row">
              <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                {{ request.creationDate.slice(0, 19) }}
              </div>
            </th>
          </tr>
          <tr v-else>
            <td colspan="5" class="text-center fw-bold text-dark-emphasis py-5 mt-5">Nenhuma solicitação encontrado</td>
          </tr>
          </template>
        </TablesTable>
    </div>
    <p class="ms-2 pt-2 fw-bold posts-loader">{{reqsTotalElements.canceledRequests}} Solicitações</p>
    </div>
  </div>
  <div class="overflow-x-scroll profile-posts bg-light mb-4 mt-0 pb-0 pt-0 rounded-3">
      <div class="history-title pt-2 bg-light-background-header">
        <h5 class="ms-3 fw-bold">Histórico de Movimentações</h5>
      </div>
      <div v-if="userRecords.length > 0" class="posts-table" id="recordsTable">
        <TablesTable>
          <template v-slot:header>
            <tr class="bg-light">
              <th class="col-title table-col fw-bold text-center py-2" scope="col">Nome</th>
              <th class="col-title table-col fw-bold text-center py-2" scope="col">Tipo</th>
              <th class="col-title table-col fw-bold text-center py-2" scope="col">Sipac</th>
              <th class="col-title table-col fw-bold text-center py-2" scope="col">Operação</th>
              <th class="col-title table-col fw-bold text-center py-2" scope="col">Quantidade</th>
              <th class="col-title table-col fw-bold text-center py-2" scope="col">Data e horário</th>
            </tr>
          </template>
          <template v-slot:content>
            <tr v-for="post in userRecords" :key="post.id" class="text-center"> 
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-center justify-content-center" style="padding-top: 0px;">
                  {{ post.item.name || 'Nome não disponível' }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ post.item.type || 'Tipo não disponível' }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text table-text align-items-end mt-1 justify-content-center">
                  {{ post.item.sipacCode ? post.item.sipacCode : 'nenhum' }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-center justify-content-center" style="padding-top: 0px;">
                  {{ post.operation || 'Nome não disponível' }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ post.quantity }}
                </div>
              </th>
              <th class="table-cell mov-cell" scope="row">
                <div class="d-flex table-text align-items-end mt-1 justify-content-center">
                  {{ post.creationDate.slice(0, 19) }}
                </div>
              </th>
            </tr>
          </template>
        </TablesTable>
      </div>
      <div v-else
          class="search-empty my-5">
          <p class="text-dark-emphasis fs-4 opacity-75 bg-transparent p-3">Nenhum Registro Encontrado</p>
      </div> 
      <p class="ms-2 pt-2 fw-bold posts-loader">{{userRecords.length}} de {{recordsTotalElements}} Registros</p>
    </div>
  </div>
</div>

  <Modal id="updatePasswordModal" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
    <template v-slot:header>
      <h6 class="header-title d-flex fw-medium justify-content-start align-items-center fw-bold">Atualizar Senha</h6>
      <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
        <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
      </button>
    </template>
    <template v-slot:body>
      <div class="container-fluid">
        <p class="fw-medium text-dark-emphasis">Digite sua senha atual para prosseguir:</p>
        <label class="form-label fw-bold" for="currentPassword">Senha atual:</label>
        <div class="d-flex justify-content-end">
          <input id="currentPassword" :class="handleUpdateBtn && currentPassword ? 'bg-light-emphasis' : 'bg-light'" class="form-control mb-2 pe-5" :type="showPassword[0] ? 'text' : 'password'" v-model="currentPassword">
          <IconsOpenEye v-if="!showPassword[0]" @click="showPassword[0] = !showPassword[0]" class="position-absolute me-2 text-light-emphasis" width="25" height="40"/>
          <IconsCloseEye v-if="showPassword[0]" @click="showPassword[0] = !showPassword[0]" class="position-absolute me-2 text-light-emphasis" width="25" height="40"/>
        </div>
        <label v-if="currentPassword" class="form-label fw-bold" for="newPassword">Nova senha:</label>
        <div v-if="currentPassword" id="newPassword" class="d-flex justify-content-end">
          <input :class="newPassword === currentPassword || newPassword && newPassword.length < 6 ? 'border-light-alert' : ''" class="form-control mb-2 pe-5" :type="showPassword[1] ? 'text' : 'password'" v-model="newPassword">
          <IconsOpenEye v-if="!showPassword[1]" @click="showPassword[1] = !showPassword[1]" class="position-absolute me-2 text-light-emphasis" width="25" height="40"/>
          <IconsCloseEye v-if="showPassword[1]" @click="showPassword[1] = !showPassword[1]" class="position-absolute me-2 text-light-emphasis" width="25" height="40"/>
        </div>
        <p class="text-dark-alert fw-bold" v-if="newPassword && newPassword.length < 6">A senha deve possuir 6 caracteres ou mais.</p>
        <p class="text-dark-alert fw-bold" v-if="newPassword && newPassword === currentPassword">A nova senha deve ser diferente da atual.</p>

        <label v-if="currentPassword && newPassword != currentPassword && newPassword.length >= 6" class="form-label fw-bold" for="confirmPassword">Confirmar senha:</label>
        <div v-if="currentPassword && newPassword != currentPassword && newPassword.length >= 6" class="d-flex justify-content-end">
          <input id="confirmPassword" :class="confirmPassword && newPassword != confirmPassword ? 'border-light-alert' : ''" class="form-control mb-2 pe-5" :type="showPassword[2] ? 'text' : 'password'" v-model="confirmPassword">
          <IconsOpenEye v-if="!showPassword[2]" @click="showPassword[2] = !showPassword[2]" class="position-absolute me-2 text-light-emphasis" width="25" height="40"/>
          <IconsCloseEye v-if="showPassword[2]" @click="showPassword[2] = !showPassword[2]" class="position-absolute me-2 text-light-emphasis" width="25" height="40"/>
        </div>
        <p class="text-dark-alert fw-bold" v-if="newPassword.length >= 6 && newPassword && confirmPassword && newPassword != confirmPassword">Senhas não conferem.</p>
      </div>
    </template>
    <template v-slot:footer>
      <div class="container-fluid d-flex align-items-center justify-content-end">
        <button v-if="currentPassword && newPassword === confirmPassword && newPassword != currentPassword" @click="changePassword" data-bs-dismiss="modal" class="btn btn-dark-success me-2 text-light fw-bold px-1">Confirmar</button>
        <button @click="resetModal" class="btn btn-light-alert text-light fw-bold px-1" data-bs-dismiss="modal">Cancelar</button>
      </div>
    </template>
  </Modal>
  <Modal id="updateRole" tabindex="-1" data-bs-backdrop="true" aria-labelledby="scrollableModalLabel" aria-hidden="true">
    <template v-slot:header>
      <h6 class="header-title d-flex fw-bold justify-content-start align-items-center">Alterar Encargo</h6>
        <button class="btn btn-transparent text-light border-0 close-btn" type="button" data-bs-dismiss="modal">
            <IconsClose class="close ms-5" width="1.3em" height="1.3em"/>
        </button>
    </template>
    <template v-slot:body>
        <div class="d-flex align-items-center justify-content-center">
          <p>Para alterar o Encargo do usuário você deve selecionar o seu novo encargo e confirmar a ação. </p>
        </div>
        <select v-model="newRole" class="form-select" aria-label="Default select">
          <option disabled selected>Selecione o Encargo</option>
          <option value="ADMIN">Administrador</option>
          <option value="USER">Usuário</option>
        </select>
    </template>
    <template v-slot:footer>
      <div class="container-fluid d-flex justify-content-end align-items-center">
              <button type="button" @click="patchAccountRole()" class="btn btn-dark-success inset-shadow text-light mx-1 fw-bold" data-bs-dismiss="modal">Confirmar</button>
              <button type="button" class="btn btn-light-alert inset-shadow text-light mx-1 fw-bold" data-bs-dismiss="modal">Cancelar</button>
          </div>
    </template>
  </Modal>
  <Modal id="deleteAccount" tabindex="-1" data-bs-backdrop="true" aria-labelledby="scrollableModalLabel" aria-hidden="true">
    <template v-slot:header>
      <h6 class="header-title d-flex fw-bold justify-content-start align-items-center">Confirmar exclusão de conta</h6>
        <button class="btn btn-transparent text-light border-0 close-btn" type="button" data-bs-dismiss="modal">
            <IconsClose class="close ms-5" width="1.3em" height="1.3em"/>
        </button>
    </template>
    <template v-slot:body>
      <p class="fw-bold text-center fs-5">Deseja realmente desativar a sua conta?</p>
      <p class="fw-bold text-dark-emphasis text-center">Ao excluir você não terá mais acesso ao sistema por meio dela, porém seus dados ainda ficarão
         disponíveis para os administradores como históricos e registros.</p>
    </template>
    <template v-slot:footer>
      <div class="container-fluid d-flex justify-content-end align-items-center">
                <button type="button" @click="deleteAccount" class="btn btn-dark-success inset-shadow text-light mx-1 fw-bold" data-bs-dismiss="modal">Confirmar</button>
                <button type="button" class="btn btn-light-alert inset-shadow text-light mx-1 fw-bold" data-bs-dismiss="modal">Cancelar</button>
          </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { getUserId } from '../services/users/userGET';
import { getRecordByEmail } from '../services/record/recordGET';
import { getRequestByStatusUserId, getRequestByUser } from '../services/requests/requestsGET';
import { useUser } from '../stores/user';
import { usePopupStore } from '../stores/popup';
import { useStorageStore } from '../stores/storage'
import { updatePasswordPUT } from '../services/users/userPUT';
import { deleteUser } from '../services/users/userDELETE';
import { navigateTo, useCookie } from 'nuxt/app';
import { patchUSER } from '../services/users/userPATCH';

definePageMeta({
  layout: 'profile'
});

const userStore = useUser();
const popUpStore = usePopupStore();
const store = useStorageStore();

const route = useRouter();
const userData = await getUserId(userStore, route.currentRoute._rawValue.query.userId);
const userRequests = ref([]);
const newRole = ref();
const pendingRequests = ref([]);
const acceptedRequests = ref([]);
const rejectedRequests = ref([]);
const canceledRequests = ref([]);
const reqsTotalPages = {
  pendingRequests:  0,
  acceptedRequests: 0,
  rejectedRequests: 0,
  canceledRequests: 0,
}
const reqsTotalElements = ref({
  pendingRequests:  0,
  acceptedRequests: 0,
  rejectedRequests: 0,
  canceledRequests: 0,
});

const userRecords = ref([]);
let currentPage = ref([0, 0, 0, 0, 0]);

const requestsTotalPages = ref(0);
const requestsTotalElements = ref(0);
const recordTotalPages = ref(0);
const recordsTotalElements = ref(0);

const fetchRecords = async (page) => {
  if(userStore.role === 'USER'){
    return 0;
  }
  const response = await getRecordByEmail(userStore, userData.email, page);

  recordTotalPages.value = response.totalPages;
  recordsTotalElements.value = response.totalElements;  
  userRecords.value = [...userRecords.value, ...response.content]
};

const fetchRequests = async (page) => {
  let response = await getRequestByUser(userStore, userData.id, page);
  for(let k = 1; k <= response.totalPages; k++){
    for(let i = 0; i < response.content.length; i++){
      switch(response.content[i].status){
        case 'PENDENTE':
          pendingRequests.value.push(response.content[i]);
          reqsTotalElements.value.pendingRequests++;
          break;
        case 'ACEITO':
          acceptedRequests.value.push(response.content[i]);
          reqsTotalElements.value.acceptedRequests++;
          break;
        case 'RECUSADO':
          rejectedRequests.value.push(response.content[i]);
          reqsTotalElements.value.rejectedRequests++;
          break;
        case 'CANCELADO':
          canceledRequests.value.push(response.content[i]);
          reqsTotalElements.value.canceledRequests++;
          break;
        default:
          break;
      }
    }
    response = await getRequestByUser(userStore, userData.id, k);
  }
}



if(userStore.role === 'ADMIN'){
  await fetchRecords(currentPage.value[4]);
}

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const handleUpdateBtn = ref(false);
const showPassword = ref([false, false, false]);

const resetModal = () => {
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  handleUpdateBtn.value = false;
  showPassword.value = [false, false, false];
};

const user = ref({
  profilePicture: 'https://via.placeholder.com/150',
});

const fileInput = ref(null);

const selectProfilePicture = () => {
  fileInput.value.click();
};

const uploadProfilePicture = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const changePassword = async () => {
  if (newPassword.value === confirmPassword.value) {
    try {
      const res = await updatePasswordPUT(userStore, userStore.id, currentPassword.value, newPassword.value, confirmPassword.value);
      popUpStore.throwPopup("Senha atualizada com sucesso", "#0B3B69");
      resetModal();
    } catch (err) {
      popUpStore.throwPopup("Erro: A senha atual digitada está incorreta", "#B71C1C");
    }
  } else {
    popUpStore.throwPopup("Erro: Preencha os campos corretamente", "#B71C1C");
  }
};
const patchAccountRole = async() => {
    const res = await patchUSER(userStore, userData.email, newRole.value);
    if(res === true){
      popUpStore.throwPopup('Encargo alterado com sucesso, atualize a página', 'blue');
      window.location.reload();
    } else if(res === false){
      popUpStore.throwPopup('ERRO: Algum problema interno do sistema ocorreu, contate o suporte', 'red')
    }
}
const deleteAccount = async () => {
  try {
    await deleteUser(userStore, route.currentRoute._rawValue.query.userId);
    await route.currentRoute._rawValue.query.userId === userStore.id ? navigateTo('/login') : window.location.reload();
    popUpStore.throwPopup('Conta excluída com sucesso', 'blue');
  } catch (err) {
    popUpStore.throwPopup('ERRO: Algum problema interno do sistema ocorreu, contate o suporte', 'red');
    throw new Error(err);
  }
}
// Define o título da página
const setpageTitle = inject('setpageTitle');
const sendDataToParent = () => {
  const title = "Perfil";
  const route = `${useRoute().fullPath.slice(0, 0)}`;
  setpageTitle(title, route, 'profile');
};
sendDataToParent();

onMounted(async () => {
  if(userData.role === 'USER'){
    await fetchRequests(0);
  }

  const currentPassWordInput = document.getElementById('currentPassword');
  currentPassWordInput.addEventListener('focusout', () => {
    if (currentPassword.value) {
      handleUpdateBtn.value = true;
    }
  });
  
  if(userStore.role === 'ADMIN' && userRecords.value.length > 0){
    const postsTable = document.getElementById('recordsTable');
    if(!store.isMobile){
      postsTable.addEventListener('scroll', async () => {
        if(userRecords.value.length < recordsTotalElements.value){
          const isBottom = postsTable.scrollHeight - postsTable.scrollTop === postsTable.clientHeight;
          if (isBottom && currentPage.value[4] < recordTotalPages.value - 1) {
            currentPage.value[4]++;
            await fetchRecords(currentPage.value[4]);
          }
        }
      });
    } else{
      postsTable.addEventListener('touchmove', async () => {
        if(userRecords.value.length < recordsTotalElements.value){
          const isBottom = postsTable.scrollTop+400 >= postsTable.scrollHeight;
          if (isBottom && currentPage.value[4] < recordTotalPages.value - 1) {
            currentPage.value[4]++;
            await fetchRecords(currentPage.value[4]);
          }
        }
      });
    }
  }
});
</script>

<style scoped>
.profile{
  padding-top: 10px;
  padding-bottom: 20px;
}
h3{
  color: rgb(51,51,51, 0.9);
}
.profile-sidebar {
  flex: 1;
  margin-right: 10px;
  margin-bottom: 23px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.profile-details, .profile-actions{
  padding: 0px 20px 0px 20px;
}
.profile-main-content {
  flex: 3;
  margin-top: 0px !important;
}
.search-empty{
    margin-top: 5%;
    display: flex;
    justify-content: center;
    white-space: nowrap;
}
.profile-header {
  margin-bottom: 20px;
}
.profile-actions {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.posts-table{
  height: 200px !important;
  overflow-y: scroll;
}
.profile-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
}

.col-title{
  text-wrap: nowrap;
  font-size: 14px;
  color: rgb(51,51,51, 0.9);
  opacity: 80%;
  font-weight: 400;
  margin-top: 0;
}
.table-cell{
  font-size: 14px;
  font-weight: 400;
  color: rgb(51,51,51, 0.9);
}
.profile-history, .profile-posts{
  width: 100%;
  padding-top: 10px;
  padding-bottom: 0px;
  padding-left: 0;
  padding-right: 0;
  border: 1px #D9D9D9 solid;
  box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.2);
}
.profile-sidebar{
  border: 1px #D9D9D9 solid;
  box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.2);  
}
.users-info{
  font-size: 18px;
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
.history-title{
  border-radius: 8px 8px 0px 0px;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
}
h5{
  font-weight: 300;
  color: rgb(51,51,51, 0.8);
}
.list-group{
  overflow-y: scroll;
  height: 200px;
}
.profile-history, .profile-posts {
  margin-top: 20px;
}

.profile-history h3, .profile-posts h3 {
  margin-bottom: 10px;
}

.posts-loader{
  color: rgba(51,51,51, 0.9)
}
.profile-picture {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
}

.img-top {
  width: 100%;
  height: auto;
  display: block;
}
.profile-picture button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.profile-picture button:hover {
  background-color: #0056b3;
}
.profile-details label {
  display: block;
  margin-bottom: 10px;
}
.list-group-item:hover{
  color: black;
  background-color: rgb(254, 213, 30, 0.4);
}
.header-title{
  font-weight: semibold;
  margin: -1px 0 -1px 0;
  padding: 0;
}
.modal-btn{
  border-radius: 10px;
}

@media screen and (max-width: 975px){
  .profile{
    padding: 10px;
  }
  .user-info-box{
    text-align: center;
    background: none !important;
    border: none !important;
    display: block !important;
  }
  .mobile-spacement p{
    margin: 0px !important;
    margin-top: 10px !important;
    padding: 0px;
  }
  .profile-picture{
    margin: 0px !important;
    padding: 0px !important;
  }
  .profile-picture .img-container{
    margin: 0px !important;
    padding: 0px !important;
  }
}
@media screen and (max-width: 430px){
  .profile-sidebar{
    margin-right: 0px !important;
  }
}
</style>
