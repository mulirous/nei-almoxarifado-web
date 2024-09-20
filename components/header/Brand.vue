<template>
    <div class="logo">
          <a class="navbar-brand d-flex align-items-center" href="/">
            <svg class="d-flex align-items-center" width="50" height="50">
              <image class="custom-logo" xlink:href="/logo.svg" width="45" height="45"/>
            </svg>
            <h5 class="almo-title text-light m-0 ms-0 p-0 fw-bold">NEI Almoxarifado</h5>
          </a>
        </div>
</template>

<style scoped>
h5{
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.navbar-brand{
  padding-right: 20px;
  transition: box-shadow 0.4s ease, border-bottom 0.4s ease-in-out, transform 0.2s ease-in-out;
}
.navbar-brand:hover{
  transform: scaleX(1.05);
  border-bottom: solid 1px #FED51E;
  box-shadow: inset 0px -12px 15px -13px rgb(254, 213, 30, 0.7);
}

</style>