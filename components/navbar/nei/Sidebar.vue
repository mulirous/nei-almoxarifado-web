<template>
    <div class="modal-backdrop" :style="{'display': responsive && isMobile ? 'block' : 'none' }"></div>
    <div class="sidebar pt-0 nav bg-light d-flex offcanvas  showing" 
    :class="{ 'collapsed': isCollapsed, 'hide': responsive && !isMobile, 'mobile-spacement': responsive && isMobile, 'mobile-fixed': responsive }"
    :style="{width: responsive ? '180px' : '0px'}"
     data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
        <div class="offcanvas-body ps-0" :class="{'mobile-padding': responsive }">
            <div class="mobile-sidebar-header bg-primary m-0 p-0 text-light" :class="{'show': responsive && isMobile}" :style="{'width': responsive && isMobile ? '165px': '0px'}">
                <IconsClose @click="hideSidebar()" class="exit-btn me-3" style="width: 25px; height: 25px;"/>
            </div>
            <ul class="list-group-flush container d-block" :class="{ 'collapsed': isCollapsed }">
                <a class="text-decoration-none" href="/" aria-current="true">
                    <div class="item-bg item-top mb-2" :class="{'bg-primary text-white active': $route.path === '/nei/', 'text-dark-emphasis': $route.path !== '/nei/'}">
                        <IconsHome class="nav-icon"/>
                        <span class="list-group-item">Início</span>
                    </div>
                </a>
                <a class="text-decoration-none" href="/nei/catalogo" aria-current="true">
                    <div class="item-bg" :class="{'bg-primary text-white active': $route.path === '/nei/catalogo', 'text-dark-emphasis': $route.path !== '/nei/catalogo' }">
                        <IconsSpreadSheet class="nav-icon"/>
                        <span class="list-group-item">Catálogo</span>
                    </div>
                </a>
                <a class="text-decoration-none" href="/nei/solicitacoes" aria-current="true">
                    <div class="item-bg" :class="{'bg-primary text-white active': $route.path === '/nei/solicitacoes', 'text-dark-emphasis': $route.path !== '/nei/solicitacoes' }">
                        <IconsRequest width="20" height="21" class="nav-icon"/>
                        <span class="list-group-item text-wrap">Solicitações</span>
                    </div>
                </a>
                <!--
                <div class="item-bg" :class="{'active': $route.path === '/catalogo', 'text-dark-emphasis': $route.path !== '/catalogo'}">
                    <a class="text-decoration-none text-light" :class="{'text-dark-emphasis': $route.path !== '/catalogo'}"  href="/catalogo" aria-current="true">
                        <span class="list-group-item">Catálogo</span>
                    </a>
                    <button class="svg-button" @click="rotate">
                        <IconsDownArrow class="small-rotate-arrow" :style="{ transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)'}" :class="{'text-dark-emphasis': $route.path !== '/catalogo'}" width="24px" height="24px"/>
                    </button>
                    </div>
                -->
                <div :class="{'hidden': !isRotated}">
                    <a class="text-decoration-none" v-for="sublink in dropdwonRoutes" :href="sublink.path" aria-current="true">
                        <div class="item-bg" :class="{'bg-primary text-white active': $route.path === sublink.path, 'text-dark-emphasis': $route.path !== sublink.path }">
                            <span class="list-group-item">{{sublink.name}}</span>
                        </div>
                    </a>
                </div>
                <a class="text-decoration-none" href="/nei/configuracoes" aria-current="true">
                    <div class="item-bg" :class="{'bg-primary text-white active': $route.path === '/nei/configuracoes', 'text-dark-emphasis': $route.path !== '/nei/configuracoes'}">
                        <IconsSettings class="nav-icon"/>
                        <span class="list-group-item">Configurações</span>
                    </div>
                </a>
                <a class="text-decoration-none" href="/nei/sobre" aria-current="true">
                    <div class="item-bg text-start" :class="{'bg-primary text-white active': $route.path === '/nei/sobre', 'text-dark-emphasis': $route.path !== '/nei/sobre'}">
                        <IconsInformation class="nav-icon"/>
                        <span class="d-inline-block list-group-item">Sobre</span>
                    </div>
                </a>
            </ul>
            <div class="offcanvas-footer d-block" :class="{ 'collapsed': isCollapsed }">
                <button class="colapse-btn d-flex align-items-center justify-content-center btn bg-gray-light text-dark" @click="sidebarColapse" type="button" id="sideBareColapse" >
                    <IconsCloseArrow :style="{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }" class="rotate-arrow"/>
                </button>
            </div>
        </div>
    </div>
</template>
    
<script >
import { useStorageStore } from '../../../stores/storage';
import { ref } from 'vue';
export default {
    data() {
        return {
            isCollapsed: false,
            dropdwonRoutes: [],
            responsive: false,
            mobileResponsive: false
        }
    },
    mounted() {
        window.addEventListener('resize', this.mobileMode)
        this.mobileMode()
    },
    computed: {
        isRotated() {
            return useStorageStore().isRotated;
        },
        isMobile(){
            return useStorageStore().isMobileMenu
        }
    },
    methods: {
        sidebarColapse() {
          useStorageStore().isRotated = false;
          this.isCollapsed = !this.isCollapsed;

        },
        rotate() {
            useStorageStore().setRotated();
        },
        mobileMode(){
            this.responsive = window.innerWidth < 988;
            this.store.isMobileMenu = window.innerWidth >= 988;
        },
        hideSidebar(){
            this.store.isMobileMenu = false;
        }
      },
    created(){
        const store = useStorageStore();
        const routes  = useRoutes();
        let tempSublinks = [];
        for(let i = 0; i < 1; i++){
            tempSublinks[i] = {path:'/catalogo/almoxarifado', name: 'almoxarifado'}
        }
        store.setSublink(tempSublinks);
        this.dropdwonRoutes = store.sidebarSublinks;
    },
    beforeUnmount(){
        window.removeEventListener('resize', this.mobileMode)
    },
    setup(){
        const store = useStorageStore();
        return{
            store
        }
    }
}
</script>

<style scoped>
.modal-backdrop{
    z-index: 1000;
    position: fixed;
    background-color: rgb(0, 0, 0, 0.2);
    width: 100% !important;
    height: 100% !important;
}
.exit-btn{
    transition: transform 0.3s ease-in-out;
}
.exit-btn:hover{
    transform: scale(1.3);
}
.mobile-sidebar-header{
    margin-top: -16px !important;
    height: 50px !important;
    display: flex !important;
    align-items: center;
    justify-content: end;
}
.hide{
    width: 0px !important;
}
.mobile-spacement{
    padding-top: 0px !important;
}
.mobile-fixed{
    position: fixed !important;
    margin-top: 50px !important;
    z-index: 1000;
}
.mobile-padding{
    margin-top: -50px !important;
}
.sidebar{
    overflow-y: auto;
}
.nav{   
    margin: 0px;
    position: sticky;
    display: flex;
    transition: width 0.6s ease-in-out;
}
.offcanvas{
    border: none;
    width: 11em;
    height: 100vh;  
    top: 0%;
    padding-top: 20px;
    overflow-x: hidden;
    transition: width 0.6s ease-in-out;
    border-right: 1px ridge #D9D9D9;
}
.offcanvas-body{
    bottom: 0;
    margin-right: 0px;
    padding-right: 0px;
}
.offcanvas-footer{
    position: absolute;
    z-index: 1000;
    bottom: 0px;
}
.svg-button{
    border: none;
    padding: 0;
    margin: 0;
    background: none;
}
.list-group-flush{
    margin-bottom: 50px;
    margin-left: -5px;
}
.list-group-item{
    display: flex;
    font-size: 13px;
    margin-left: 7px;
    margin-right: 0px;
    margin-top: 1px;
    text-decoration: none;
    text-align: start;
    white-space: nowrap;
    transition: opacity 1.5s ease-in-out;
}
.item-top{
    margin-bottom: -9px;
}
.item-bg{
    transition: width 0.6s ease-in-out;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    margin-top: 30px;
    padding-left: 7px;
    height: 42px;
    width: 160px;
}
.item-bg a{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
}
.collapsed {
    width: 50px; 
}
.colapse-btn{
    width: 175px;
    border-radius: 0;
    bottom: 0;
    height: 40px;
    transition: width 0.6s ease-in-out;
    overflow: hidden;
}
.collapsed .colapse-btn{
    width: 50px;
    height: 40px;
}
.collapsed .list-group-item{
    visibility: hidden;
    opacity: 0;
}
.collapsed .item-bg{
    width: 35px;
}
.collapsed .small-rotate-arrow{
    opacity: 0;
}
.rotate-arrow{
    transition: transform 0.6s ease-in-out;
}
.small-rotate-arrow{
  transition: transform 0.3s ease-in-out, opacity 0.1s ease-in-out;
  margin-left: 35px;
}
.nav-icon{
    flex-shrink: 0; 
}
.active{
    border-radius: 9px;
}
.hidden{
    display: none;
}
.item-bg:hover{
    background: #D9D9D9;
    border-radius: 9px;
}
</style>