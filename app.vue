<template>
  <div :class="
  {
    layoutDefault: layoutBg === 0, 
    alternativeLayout: layoutBg === 1, 
    darkLayout: layoutBg === 2, 
    poppins: font === 0, 
    inter: font === 1, 
    montserrat: font === 2, 
    lora: font === 3, 
  }" id="aplication">
    <NuxtLayout>
      <Popup class="popUp" :isPopup="isPopup" :popupText="popupText" :popupBg="popupBg"/>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStorageStore } from './stores/storage';
import { usePopupStore } from './stores/popup';
import { useUser } from './stores/user';
import { navigateTo } from 'nuxt/app';
import { useSettingsStore } from './stores/settings';

const storage = useStorageStore();
const popup = usePopupStore();
const userStore = useUser();
const settingsStore = useSettingsStore();

const isPopup = computed(() => {
    return popup.popupActive
});
const popupText = computed(() => {
  return popup.message
});
const popupBg = computed(() => {
  return popup.bgColor
})
const layoutBg = computed(() => {
  return settingsStore.layout
})
const font = computed(() => {
  return settingsStore.tipography
})

onBeforeMount(() => {
  if(window.innerWidth <= 988){
    settingsStore.isMobile = true;
  } else{
    settingsStore.isMobile = false;
  }
})
onMounted(() => {
  checkIfMobile();
});
function checkIfMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['iphone', 'android', 'blackberry', 'windows phone', 'iemobile'];
  storage.isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
}
</script>

<style>
@import url('https://fontlibrary.org//face/dejavu-sans');

/* Para Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) white; 
}

*::-moz-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3); 
}


.poppins{
  font-family: system-ui, 'Poppins', sans-serif;
}
.inter{
  font-family: 'Inter', sans-serif !important;
}
.montserrat{
  font-family: 'Montserrat', sans-serif;
}
.lora{
  font-family: 'Lora', sans-serif;
}

.darkLayout *{
  scrollbar-color: rgba(255, 255, 255, 0.3) #1A1A1A  !important;  
}
.darkLayout .bg-fade{
  background: #111318 !important;
}
.darkLayout .btn-outline-primary{
  border-color: #0054a7;
}
.darkLayout .btn-outline-primary:hover{
  background-color: #010e23 !important;
}
.darkLayout .bg-primary{
  background-color: #000000 !important;
}
.darkLayout .btn-primary{
  background-color: #020b15 !important;
}
.darkLayout .bg-light{
  background-color: #1A1A1A !important;
  border-color: #333333 !important;
}
.darkLayout .btn-outline-dark-success:hover{
  background-color: #011e02 !important;
}
.darkLayout .btn-outline-warning:hover{
  background-color: #786200 !important;
}
.darkLayout .bg-warning{
  background-color: #786200 !important;
}
.darkLayout .btn-outline-secondary{
  border-color: #2072c3 !important;
  color: white !important;
}
.darkLayout .btn-outline-secondary:hover{
  background-color: #113a62 !important;
}
.darkLayout .btn-secondary{
  background-color: #113a62 !important;
}
.darkLayout .bg-success{
  background-color: #238a27  !important;
}
.darkLayout .btn-light-success{
  background-color: #238a27  !important;
}
.darkLayout .btn-dark-success{
  background-color: #238a27 !important;
}
.darkLayout .bg-dark-success{
  border: 1px solid #00ff51 !important;
}
.darkLayout .btn-dark-alert{
  background-color: rgb(98, 17, 17) !important;
}
.darkLayout .btn-light-alert{
  background-color: rgb(139, 16, 16) !important;
}
.darkLayout .bg-degrade{
  background: linear-gradient(to bottom, rgb(0, 0, 0, 0.9) 20%, rgb(255, 255, 255, 0.9) 150%) !important;
}
.darkLayout .modal-body{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout .card{
  border: none !important;
}
.darkLayout .card-header{
  border: solid 1px #333333 !important;
}
.darkLayout .card-body{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout .card-footer{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout tbody{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout .modal-footer{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout .modal-header{
  background-color: #020b15 !important;
  border: solid 1px #333333 !important;
}
.darkLayout .spinner-border{
  color: white;
}
.darkLayout input{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A;
  border: solid 1px #333333;
}
.darkLayout textarea{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A;
  border: solid 1px #333333;
}
.darkLayout textarea:focus{
  background-color: #1A1A1A;
}
.darkLayout input:focus{
  background-color: #1A1A1A;
}
.darkLayout input::placeholder{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout .NavigateToItem input:focus{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A;
  border: solid 1px #333333;
  border-left: none;
}
.darkLayout .item-bg:hover{
  background-color: #333333 !important; 
}
.darkLayout label{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A !important;
}
.darkLayout .search-icon{
  border: 1px solid rgb(51, 51, 51, 1) !important; 
  border-right: none !important; 
}
.darkLayout .requests-box{
  border: 1px solid rgb(255, 255, 255, 0.2) !important;
}
.darkLayout img{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout th{
  color: rgb(255,255,255,0.8) !important;
  background-color: transparent !important;
  border: solid 1px #333333 !important;
}
.darkLayout .border-2{
  border-color: #333333;
}
.darkLayout .section-title{
  border-bottom: 1px solid #333333 !important;
}
.darkLayout td{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A;
  border: solid 1px #333333 !important;
}
.darkLayout p{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout h1{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout h2{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout h3{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout h4{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout h5{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout h6{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout a{
  color: rgba(255, 255, 255, 1) !important;
}
.darkLayout ol li:hover{
  background: none !important;
}
.darkLayout .page-item:hover{
  background: none !important;
}

.darkLayout nav li{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A !important;
  border: none !important;
}
.darkLayout li{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout li:hover{
  background-color: #786200 !important;
}
.darkLayout .btn-search:hover{
  background-color: #786200 !important;
}
.darkLayout li::before{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout .small-menu{
  background: #1A1A1A !important;
}
.darkLayout .small-menu:hover{
  background: #1A1A1A !important;
}

.darkLayout .form-check-label{
  background: none !important;
}
.darkLayout .form-check-input{
  background-color: #2f2e2e !important;
  border: solid 1px rgb(255,255,255,0.2) !important;
}
.darkLayout select{
  color: rgb(255,255,255,0.8) !important;
  background-color: #1A1A1A !important;
  border: solid 1px rgb(255,255,255,0.2) !important;
}
.darkLayout select:focus{
  box-shadow: none;
}
.darkLayout label{
  background: #1A1A1A !important;
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout span{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout svg{
  color: rgb(255,255,255,0.8);
}
.darkLayout .btn{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout .light-background{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout .btn-light{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout .new-gray{
  background-color: #1A1A1A !important;
  border: solid 1px #333333 !important;
}
.darkLayout .bg-gray-light{
  background-color: #2f2e2e !important;
  border: solid 1px #333333 !important;
}
.darkLayout .bg-light-background-header{
  background-color: #2f2e2e !important;
  border: solid 1px #333333 !important;
}
.darkLayout .bg-light-emphasis{
  background-color: #2f2e2e !important;
  border: solid 1px #333333 !important;
}
.darkLayout [class*='dark']{
  color: rgb(255,255,255,0.8) ;
}
.darkLayout [class*='dark-emphasis']{
  color: rgb(255,255,255,0.8) !important;
}
.darkLayout li .disabled{
  background-color: rgb(62, 58, 58) !important;
}


:root {
  --alternativelayout-bg-color-primary: #2C3E50; 
  --alternativelayout-bg-color-light: #ECF0F1; 
  --alternativelayout-bg-color-dark-emphasis: #34495E; 
}

.alternativeLayout .bg-primary {
  background-color: var(--alternativelayout-bg-color-primary) !important; 
}
.alternativeLayout .bg-dark{
  background-color: var(--alternativelayout-bg-color-primary) !important; 
}
.alternativeLayout .bg-light {
  background-color: var(--alternativelayout-bg-color-light) !important; 
}
.alternativeLayout .bg-dark-emphasis {
  background-color: var(--alternativelayout-bg-color-dark-emphasis) !important; 
}

/* Tava esquisito com essas propriedades, verificar depois
.alternativeLayout [class*="light-alert"] {
  background-color: #E74C3C !important; 
}
.alternativeLayout [class*="light-emphasis"] {
  background-color: #BDC3C7 !important; 
}
.alternativeLayout [class*="light-background"] {
  background-color: #ECF0F1 !important; 
}

.alternativeLayout [class*="gray-light"] {
  background-color: #AAB7B8 !important; 
}
.alternativeLayout [class*="new-gray"] {
  background-color: #566573 !important; 
} 
*/

.alternativeLayout [class*="light-background-header"] {
  background-color: #D0D3D4 !important; 
}

.alternativeLayout .license {
  background-color: var(--alternativelayout-bg-color-primary) !important; 
}

.bg-fade {
  background: radial-gradient(ellipse at bottom left, rgba(11, 59, 105, 0.5), transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(11, 59, 105, 0.5), transparent 50%),
              radial-gradient(ellipse at top left, rgba(11, 59, 105, 0.5), transparent 50%),
              radial-gradient(ellipse at top right, rgba(11, 59, 105, 0.5), transparent 50%),
              radial-gradient(ellipse at center left, rgba(255, 255, 255, 1), transparent 50%),
              radial-gradient(ellipse at center left, rgba(255, 255, 255, 1), transparent 50%);
}
</style>