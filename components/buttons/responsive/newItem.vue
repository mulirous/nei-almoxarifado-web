<template>
   <div>
    <button @mouseover="toolTip = true" @mouseout="toolTip = false" @focusin="colorFocus" 
    @focusout="colorUnfocus" class="new-btn action-btn btn-outline-dark-success justify-content-end d-flex btn mx-1 px-2 mt-1" data-bs-toggle="modal" data-bs-target="#itemRegistration" aria-expanded="false">
        Adicionar
        <IconsPlus class="mx-1" width="1.5em" height="1.5em"/>
    </button>   
    </div>  
</template>
<!--
<template>
    <TooltipsRectangular class="d-flex justify-content-center align-items-end ms-4 mt-2" :toolTipState="toolTip" :toolTipText="'Cadastro de Novos Itens'"/>    
    <button @mouseover="toolTip = true" @mouseout="toolTip = false" @focusin="colorFocus" @focusout="colorUnfocus" class="new-btn action-btn btn-outline-ligth text-dark-emphasis justify-content-end d-flex btn mx-1 px-2" data-bs-toggle="modal" data-bs-target="#itemRegistration" aria-expanded="false">
        Adicionar
        <IconsPlus class="mx-1" width="1.5em" height="1.5em"/>
    </button>
</template>
-->

<style scoped>
.action-btn{
    font-weight: 500;
    font-size: 15px;
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #388E3C;
}
.btn-outline-dark-success{
    box-shadow: inset 0px -12px 15px -15px rgb(12, 192, 21);
    color: rgb(0, 0, 0, 0.7); 
}
.btn-outline-dark-success:hover{
    color: white; 
}
.action-btn:hover{
    opacity: 90%;
}
@media screen and (max-width: 820px){
    .action-btn{
        margin-bottom: -3px !important;
        font-size:  12px;
    }
}
@media screen and (max-width: 530px){
    .action-btn{
        border-radius: 5px 5px 5px 5px;
        background-color: #388E3C;
        color: white;
    }
}
</style>