<template>
    <div class="d-flex search-bar me-2 mt-1" tabindex="-1">
            <button class="d-flex btn btn-transparent border-0 text-light align-items-center ps-0" type="button" tabindex="-1" data-bs-target="#scrollableModal" data-bs-toggle="modal">
              <IconsSearchGlass />
              <span class="ms-1 fw-bold">Pesquisar</span>
            </button>
      </div>
</template>


<style scoped>
.search-bar{
  outline: none;
  height: 45px;
  transition: box-shadow 0.4s ease, border-bottom 0.4s ease-in-out;
}
.search-bar:hover{
  border-bottom: solid 1px #FED51E;
  box-shadow: inset 0px -12px 15px -13px rgb(254, 213, 30, 0.7);
}
.btn-transparent{
  border-radius: 0px !important;
  outline: none;
}
.search-icon{
  border-right: 0;
  color: #333333;
  background-color: white;
}


</style>