<template>
    <button title="Detalhes" class="filter-btn action-btn d-flex btn btn-outline-primary mx-1 px-2 mt-1 text-nowrap" data-bs-toggle="modal" data-bs-target="#itemMinimumStock">
        Editar
        <IconsEdit width="18px" height="19px"/>
    </button>
</template>

<style scoped>
li{
    list-style-type: none;
}
.large-menu{
    width: 146px;
    min-width: 40px;
}
.small-menu{
    background-color: white;
    border-radius: 12px;
    border: 1px #D9D9D9 solid;
    position: absolute;
    margin-top: -55px;
    left: 138px;
    width: 65px;
    height: 65px;
    min-width: 40px;
}
.filter-btn{
    font-size: 14px;
    color: rgb(51,51,51, 0.9);
    font-weight: 600;
}
.dropdown-item{
    width: 130px;
    padding: 0px;
    font-size: 14px;
}
.large-menu-btn{
    font-size: 14px;
}
.btn-transparent{
    font-size: 14px;
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
        margin-top: 6px !important;
        font-size: 14px;
    }
}

</style>