<template>
    <div class="page-title bg-light row d-block ms-0">
        <div class="catalog-header">
            <div class="me-3 d-flex align-items-end justify-content-between flex-wrap">
                <h3 class="title-text mt-2">
                        <slot name="titulo" />
                </h3>
                <nav class="title-link" v-show="textLoading" aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li><a href="/">início</a></li>
                    <slot name="rota" />
                    </ol>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
const textLoading = ref(false);
onBeforeMount(() => {
    textLoading.value = true;
})
</script>


<style scoped>
.small-loader{
    width: 12px;
    height: 12px;
}
.title-link{
    height: 34px;
}
.route-link{
    color: rgba(51, 51, 51, 1)
}
.icons{
    width: 25px;
    height: 25px;
}
.page-title{
	width: 100%;
	border-bottom: 1px ridge #D9D9D9;
	margin-bottom: 20px;
}
h3{
    font-weight: 500;
    color: rgb(51,51,51, 0.8);
}
.catalog-header{
    color: rgb(51,51,51, 0.8);
    justify-content: space-between;
}
.route-link:hover{
  color: rgba(51, 51, 51, 0.6)
}

</style>