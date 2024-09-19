<template>
    <div class="logo">
          <a class="navbar-brand ms-2 text-light d-flex align-items-center" href="/nei">
            <svg width="37" height="37">
              <image class="custom-logo" xlink:href="/logo.svg" width="37" height="33"/>
            </svg>
            <h5 class="fw-bold mt-2">
              NEI
            </h5>
          </a>
        </div>
</template>

<style scoped>
h5{
  font-family: 'Comic Neue', cursive;
}
.navbar-brand{
  height: 49px;
  padding-left: 2px;
  padding-right: 10px;
  transition: box-shadow 0.4s ease, border-bottom 0.4s ease-in-out, transform 0.2s ease-in-out;
}
.navbar-brand:hover{
  transform: scaleX(1.05);
  border-bottom: solid 1px #FED51E;
  box-shadow: inset 0px -12px 15px -13px rgb(254, 213, 30, 0.7);
}

</style>