<template>
    <div class="d-flex profile align-items-center me-3">
          <div class="me-2 nav-item dropdown">
            <button  class="svg-button bg-primary px-0 pb-1" data-bs-toggle="dropdown" data-bs-offset="20,1" aria-expanded="false" title="Notificações">
              <IconsBell with="16px" height="16px"/>
              <span v-if="requests.length > 0" class="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                {{requests.length}}
                <span class="visually-hidden">unread messages</span>
              </span>
            </button>
            <ul class="dropdown-menu notification-menu text-center">
              <li v-for="(request, index) in requests" :key="index" class="text-end dropdown-item notification">
                <div class="text-dark-emphasis d-flex align-items-center">
                  <div>
                    <IconsWarning wdith="24px" height="26px" class="me-2 mt-0 notifications-text"/>
                  </div>
                  <p class="notification-text m-0 p-0" style="max-width: 100px;">
                    {{request.user.name}}
                  </p>
                  <p class="notification-text m-0 p-0" style="max-width: 200px;">
                    &nbsp;
                    solicitou {{ request.quantityRequested }} "{{request.item.name}}"
                  </p>
                 </div>
                <span class="notification-text ms-0 opacity-75 text-dark-emphasis">
                  Feita em {{ request.creationDate.slice(0, 19) }}
                </span>
              </li>
              <li v-show="!isNotification || requests.length === 0" class="p-2 dropdown-item fs-6 text-dark-emphasis py-2" style="background-color: white;">Nenhuma notificação enviada.</li>
            </ul>
          </div>
          <div class="nav-item dropdown">
            <button class="svg-button d-flex bg-primary align-items-center pb-1" @click="rotate" title="Perfil" data-bs-toggle="dropdown" data-bs-offset="32,0" data-bs-auto-close="inside" aria-expanded="false">
              <p class="profile-drop user-text text-light px-1 m-0 fw-light text-nowrap"> {{ user.username }} </p>
              <LoadersLoading class="small-loader text-light p-1"/>
                <IconsDownArrow class="rotate-arrow" :style="{ transform: isRoted ? 'rotate(180deg)' : 'rotate(0deg)'}" width="24px" height="24px"/>
            </button>
            <ul class="dropdown-menu" style="width: 190px !important;">
              <li>
                <a class="dropdown-item py-1 ps-2 d-flex align-items-center justify-content-between" :href="`/perfil?userId=${userStore.id}`">
                Perfil
                <IconsProfile />
                </a>
              </li>
              <li><a class="dropdown-item py-1 ps-2 d-flex align-items-center justify-content-between" href="/configuracoes">
                Configurações
                <IconsSettings />
              </a></li>  
              <li><button @click="logout()" class="btn exit-options py-1 ps-2 dropdown-item d-flex align-items-center justify-content-between">
                Sair
                <IconsExit />
              </button></li>
            </ul>
          </div>
        </div>
</template>

<script setup>
import { useUser } from '../../stores/user';
import { useStorageStore } from '../../stores/storage';
import { getUserByEmail } from '../../services/users/userGET';
import { getRequestByStatus } from '../../services/requests/requestsGET';
import { onMounted, ref } from 'vue';
const toolTip = ref([false, false])

const actualDate = new Date;
const userStore = useUser();
const pagination = ref(0);
const requests = ref([]);

const loadNotifications = async () => {
  const res = await getRequestByStatus(userStore, 'PENDENTE', pagination.value);
  res.content.map((request) => {
    requests.value.push(request)
  })

  if(res.totalPages > 1){
    for(let i = 1; i < res.totalPages; i++){
      pagination.value++;
      const res = await getRequestByStatus(userStore, 'PENDENTE', i);
      res.content.map((request) => {
          requests.value.push(request)
      })
    }
  }

}

const isNotification = ref(true)
const isRoted = ref(false);
const user = ref({username: '', name: ''});
getUsername()
function rotate(){
  isRoted.value = !isRoted.value;
}
function logout(){
  userStore.logout()
}
async function getUsername(){
  const res = await getUserByEmail(userStore, userStore.email); 
  user.value.username = res.name;
}
const totalElements = ref(0);

onMounted(async () => {
  const res = await getRequestByStatus(userStore, 'pendente', pagination.value);
  totalElements.value = res.totalElements;
  if(JSON.parse(localStorage.getItem('notifications')).length > 0){
    if(JSON.parse(localStorage.getItem('notifications-meta')).totalElements !== totalElements.value){
      await loadNotifications();
      return;
    }
    requests.value = JSON.parse(localStorage.getItem('notifications'));
  }else{
    await loadNotifications();
    localStorage.setItem('notifications', JSON.stringify(requests.value));
    localStorage.setItem('notifications-meta', JSON.stringify({totalElements: totalElements.value}));
  }
})

</script>

<style scoped>
.not-close:active{
  transform: scale(1.30);
}
.notification-menu{
  max-height: 160px;
  min-width: 300px;
  overflow-y: scroll;
}
.small-loader{
    width: 12px;
    height: 12px;
}
.rotate-arrow{
  transition: transform 0.3s ease-in-out;
}
.dropdown-menu{
  padding: 0;
}
.dropdown-item{
  font-size: 14px;
}
.rounded-pill{
  margin-top: -20px !important;
  align-items: center;
  justify-content: center;
  display: flex !important;
  text-align: center !important;
  font-size: 11px;
  width: 17px;
  height: 17px;
  z-index: 1000;
}
.notification-text{
  font-weight: bold;
  font-size: 12px;
}

.svg-button{
    height: 49px;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    transition: box-shadow 0.4s ease, border-bottom 0.4s ease-in-out;
}
.user-text {
  max-width: 200px;
  font-size: 20px;
}
.dropdown-item:hover .notification-text{
  font-weight: bold
}
p{
  white-space: nowrap;     
  overflow: hidden;        
  text-overflow: ellipsis;    
}
.svg-button:hover{
  border-bottom: solid 1px #FED51E;
  box-shadow: inset 0px -12px 15px -13px rgb(254, 213, 30, 0.7);
}
.profile-drop:hover{
  transition: filter 0.3s ease-in;
  filter: drop-shadow(0px 0px 8px rgba(254, 213, 30, 1));
}
@media screen and (max-width: 600px){
  .user-text {
    max-width: 205px;
  }
  .notification-menu{
    min-width: 200px;
  }
}
</style>