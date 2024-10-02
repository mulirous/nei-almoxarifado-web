<template>
<div class="container" style="margin-left: 0px;"> 
  <div class="dashboard-section bg-light mb-4 pb-3 rounded-3 ps-2 pe-2">
      <h2 class="pb-1 pt-0 ps-2">Catálogos</h2>
        <div class="dashboard-container container-fluid d-flex px-0 justify-content-center aligm-items-center">
          <CardsImageCard class="dashboard-viewcard">
            <template v-slot:image-cap>
              <img src="/almo.png" class="card-img-top" alt="...">
            </template>
            <template v-slot:body>
              <a href="/inventario/almoxarifado-escolar" class="fs-5 fw-medium stretched-link text-dark-emphasis">Almoxarifado Escolar</a>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </template>
          </CardsImageCard>
          <CardsImageCard class="dashboard-viewcard">
            <template v-slot:image-cap>
              <img src="/almo2.png" class="card-img-top" alt="...">
            </template>
            <template v-slot:body>
              <a href="/inventario/almoxarifado-escolar" class="fs-5 fw-medium stretched-link text-dark-emphasis">Almoxarifado Escolar</a>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </template>
          </CardsImageCard>
          <CardsImageCard class="dashboard-viewcard mb-0">
            <template v-slot:image-cap>
              <img src="/almo3.png" class="card-img-top" alt="...">
            </template>
            <template v-slot:body>
              <a href="/inventario/almoxarifado-escolar" class="fs-5 fw-medium stretched-link text-dark-emphasis">Almoxarifado Escolar</a>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </template>
          </CardsImageCard>
        </div>
    </div>
    <Carousel />
</div>
</template>

<script setup>
// import { inject } from 'vue';

// const setpageTitle = inject('setpageTitle');


// const sendDataToParent = () => {
//     const data = "Catálogos";
//     setpageTitle(data);
// };
// sendDataToParent();
</script>

<style scoped>
.container{
  width: 100%;
	padding-left: 15px;
  flex-direction: column;
}
.dashboard-section{
  width: 99%;
  padding-top: 10px;
  padding-bottom: 40px;
  border: 1px #D9D9D9 solid;
  box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.2);
}
h2{
    font-weight: 300;
    color: rgb(51,51,51, 0.8);
}
.catalog-header{
    justify-content: space-between;
}
.card-img-top{
    transition: opacity 0.5s ease-in-out;
    opacity: 85%;
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
@media screen and (max-width: 962px){
  .card-text{
    font-size: 14px !important;
  }
  .stretched-link{
    font-size: 16px !important;
  }
}
@media screen and (max-width: 992px){
  .dashboard-container{
    display: block !important;
  }
  .dashboard-viewcard{
    margin-bottom: 30px;
  }
}
</style>