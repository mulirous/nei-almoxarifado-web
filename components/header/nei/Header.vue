<template>
    <div class="header container-fluid d-flex justify-content-between align-items-center bg-primary p-0">  
      <IconsMenu @click="expandSidebar()" class="d-none menu-color mx-3" :class="{'show-menu': settingsStore.isMobile}"/>
      <div class="d-flex align-items-center" :class="{'d-none': settingsStore.isMobile}">
        <Brand title="Página incial" />
        <nav v-if="!settingsStore.isMobile" class="navbar navbar-expand py-0 ps-0">
          <div class="container-fluid">
            <ul class="navbar-nav d-flex justify-content-center">
                  <a :class="{'navbar-active': currentRoute.fullPath === '/nei/'}" class="px-1 nav-item nav-link text-light mx-2" href="/nei/" type="button">Início</a>
                  <a :class="{'navbar-active': currentRoute.fullPath === '/nei/catalogo'}" class="px-1 nav-item nav-link text-light mx-2" href="/nei/catalogo" type="button">Catálogo</a>
                  <a :class="{'navbar-active': currentRoute.fullPath === '/nei/solicitacoes'}" class="px-1 nav-item nav-link text-light mx-2" href="/nei/solicitacoes" type="button">Solicitações</a>
                  <a :class="{'navbar-active': currentRoute.fullPath === '/nei/configuracoes'}" class="px-1 nav-item nav-link text-light mx-2" href="/nei/configuracoes" type="button">Configurações</a>
                  <a :class="{'navbar-active': currentRoute.fullPath === '/nei/sobre'}" class="px-1 nav-item nav-link text-light mx-2" href="/nei/sobre" type="button">Sobre</a>  
              </ul>
            </div>
          </nav>
        </div> 
        <div class="d-flex justify-content-end align-items-center pb-0">
        <SearchBar :class="{'d-none': settingsStore.isMobile}"  class="pb-1"/>
        <div :class="{'d-none': !settingsStore.isMobile}" class="d-flex align-items-center text-light me-1" type="button" tabindex="-1" data-bs-target="#neiSearchModal" data-bs-toggle="modal">
          <IconsSearchGlass class="mobile-search text-light" height="26px" style="margin-bottom: 2px;"/>
        </div>
        <Profile />
      </div>     
    </div>
    <UtilsSearch />
</template>
  
<script>
import Brand from './Brand.vue'
import Profile from './Profile.vue'
import SearchBar from './SearchBar.vue';
import { useStorageStore } from "../../../stores/storage";
import { useRoute } from 'vue-router';
import ThemeSwitch from '../ThemeSwitch.vue';
import { useSettingsStore } from '../../../stores/settings';
export default{
    data(){
      return{
        responsive: true,
        smallSearch: false
      }
    },
    components: { Profile, Brand, ThemeSwitch, SearchBar },
    mounted(){
      window.addEventListener('resize', this.mobileMode)
      this.mobileMode()
    },
    methods: {
      mobileMode(){
          this.settingsStore.isMobile = window.innerWidth <= 988;
          if(window.innerWidth === 988){
            this.store.responsive = false
          }
      },
      expandSidebar(){
        this.store.isMobileMenu = !this.store.isMobileMenu;
      }
    },
    setup(){
      const currentRoute = useRoute();
      const settingsStore = useSettingsStore();
      const store = useStorageStore();
      return{
        store,
        currentRoute,
        settingsStore
      }
    }
}

</script>

<style scoped>
.menu-color{
  color: white !important;
}
.show-menu{
  margin: 11px 0px 11px 0px;
  width: 28px;
  height: 28px;
  display: block !important;
}
.header{
  position: fixed;
  z-index: 1050;
}
.nav-link{
  font-weight: bold;
}
.nav-item{
  padding-top: 12px;
  padding-bottom: 13px;
  transition: padding 0.2s ease-in-out,box-shadow 0.4s ease, border-bottom 0.4s ease-in-out;
}
.nav-item:hover{
  padding-top: 6px !important;
  padding-bottom: 19px !important;
  border-bottom: solid 1px #FED51E;
  box-shadow: inset 0px -12px 15px -13px rgb(254, 213, 30, 0.7);
  padding: 0px 0px 0px 0px;
}
.navbar-active{
  border-bottom: solid 1px #D9D9D9;
  box-shadow: inset 0px -12px 15px -13px rgb(217, 217, 217, 0.7);
}
.mobile-search{
  margin-top: 2.9px;
}

</style>
