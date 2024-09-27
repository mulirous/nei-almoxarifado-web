<template>
        <button title="Detalhes" class="filter-btn action-btn text-dark-emphasis d-flex btn btn-outline-primary mx-1 px-2 mt-2 text-nowrap" data-bs-toggle="modal" data-bs-target="#itemMinimumStock">
            Editar
            <IconsEdit class="mx-1" width="1.2em" height="1.5em"/>
        </button>
    
</template>

<style scoped>
.filter-btn{
    font-size: 14px;
    color: rgb(51,51,51, 0.9);
    font-weight: 600;
}
.action-btn{
    font-weight: 500;
    font-size: 15px;
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #1F69B1;
    color: rgb(51,51,51, 0.9);
    background-color: transparent;
}
.action-btn:hover{
    color: white;
    background-color: #0B3B69;
}
.btn-outline-primary{
    box-shadow: inset 0px -12px 15px -15px rgb(18, 104, 184);
}
.btn-transparent:hover{
    color: white;
    background-color: #FED51E;
}
.action-btn:hover{
    opacity: 90%;
}
@media screen and (max-width: 820px){
    .action-btn{
        margin-bottom: -3px !important;
        font-size: 12px;
    }
    .filter-btn{
        font-size: 12px;
    }
    .action-icon{
        width: 15px;
        height: 15px;
    } 
}

@media screen and (max-width: 700px){
    .filter-btn{
        padding-top: 10px !important;
    }
}
@media screen and (max-width: 530px){
    .action-btn{
        margin-bottom: -6px !important;
        padding-top: 7px !important;
        border-radius: 5px 5px 5px 5px !important;
        background-color: #0B3B69;
        color: white !important;
    }
}
</style>