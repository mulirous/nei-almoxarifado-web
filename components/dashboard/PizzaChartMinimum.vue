<template>
  
  <div class="graph-header d-flex align-items-end justify-content-between section-title pt-2 mb-2 bg-light-background-header">
    <h5 class="ps-2 fw-bold">Distribuição de níveis dos itens </h5>  
  </div>

  <div class="ms-4 d-flex">
    <button @click="isListItems = !isListItems" class="btn btn-transparent graph-btn fw-medium d-flex align-items-center"><IconsOpenEye class="me-1" width="25px" height="20px"/>Lista dos itens</button>
  </div>
  
  <div class="position-relative p-0 m-0">
    <div :style="{'height': isListItems ? '120px' : '0px', 'z-index': isListItems ? '100' : '0'}" class="position-absolute d-block  text-light ms-3 items-list-legend" style="width: 94%; background-color: rgba(90, 90,90,1);">
    
      <ul v-if="itemsName.danger.length > 0" :style="{'opacity': isListItems ? '100%' : '0%'}" class="list-group ms-2" style="transition: opacity 0.4s ease-in-out;">
        <p class="fw-bold d-flex align-items-center mb-1 mt-2"><input disabled class="border p-0 me-2 my-1" style="width: 20px; height: 15px;" type="color" value="#B71C1C">Itens em estado crítico:</p>
        <div class="d-flex flex-wrap ">
          <li v-for="(itemName, index) in itemsName.danger" :key="index" class="list-item border-0 pe-2  bg-transparent d-flex align-items-center fw-medium"> {{ itemName }}</li>
        </div>
      </ul>
      <ul v-if="itemsName.warning.length > 0" :style="{'opacity': isListItems ? '100%' : '0%'}" class="list-group ms-2" style="transition: opacity 0.4s ease-in-out;">
        <p class="fw-bold d-flex align-items-center mb-1 mt-2"><input disabled class="border p-0 me-2 my-1" style="width: 20px; height: 15px;" type="color" value="#FED51E">Itens em estado de alerta:</p>
        <div class="d-flex flex-wrap pb-2">
          <li v-for="(itemName, index) in itemsName.warning" :key="index" class="list-item border-0 pe-2  bg-transparent fw-medium" > {{ itemName }}</li>
        </div>
      </ul>
    </div>
  </div>

  <div :style="{'width': isLegend ? '120px' : '0px'}" class="position-absolute text-light legend" style="border-radius: 0px 0px 0px 7px;z-index: 0; height: 388px; background-color: rgba(90, 90,90,0.8);">
    <ul :style="{'opacity': isLegend ? '100%' : '0%'}" class="list-group ms-2" style="transition: opacity 0.4s ease-in-out;">
      <li v-for="(name, index) in legend" :key="index" class="list-item border-0 bg-transparent d-flex align-items-center fw-medium"><input disabled class="border p-0 me-2 my-1" style="width: 25px; height: 20px;" type="color" :value="`${backgroundColor[index]}`">  {{ name }}</li>
    </ul>
  </div>
  <div class="bg-light-emphasis py-2 mx-3 mb-3" style="border: 1px solid rgba(51,51,51,0.2); border-top: 0px; border-radius: 0px 0px 8px 8px;">
    <div class="d-flex justify-content-center z-5">
      <LoadersLoading class="position-absolute p-5 mt-5 mb-0"/>
    </div>
    <div class="text-start ms-2" type="button">
      <span @click="isLegend = !isLegend" class="position-absolute btn btn-light border fw-bold text-dark-emphasis" style="font-size: 13px; z-index: 1;">Legenda</span>
    </div>
    <Chart v-if="1" :type="'pie'" class="chart-graph mt-5" :data="chartData" :options="chartOptions"  />
    <div v-else class="d-flex justify-content-center mb-5">
      <p class="fw-bold fs-5 opacity-75 py-5 mb-5">Nenhum dado encontrado</p>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import { useUser } from '../../stores/user.ts';
import { useSettingsStore } from '../../stores/settings.ts';
import { useStorageStore } from '../../stores/storage.ts';
import { getItems } from '../../services/items/itemsGET.ts';
import { Chart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement, 
  ArcElement,
  LineElement,
  PieController
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  PieController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement, 
  LineElement
);

const userStore = useUser();
const store = useStorageStore();
const settingsStore = useSettingsStore();

const isListItems = ref(false);
const isLegend = ref(false);  
const legend = ['Estável', 'Alerta', 'Crítico']
const backgroundColor = [ "#1f69b1", "#FED51E", "#B71C1C"]

const itemsName = ref({
  stable: [],
  warning: [],
  danger: []
})
const itemsStateLevels = ref({
  stable: 0,
  warning: 0,
  danger: 0
});

const fetchMinimumQuantity = async () => {
  let res = await getItems(userStore, 0);
  let currentPage = 1;
  do{
    res = await getItems(userStore, currentPage);
    res.content.forEach((item) => {
      if(item.quantity > item.minimumStockLevel){
        itemsStateLevels.value.stable++;
      } else if(item.quantity === item.minimumStockLevel){
        itemsStateLevels.value.warning++;
        itemsName.value.warning.push(item.name);
      } else{
        itemsStateLevels.value.danger++;
        itemsName.value.danger.push(item.name);
      }
    })
    currentPage++;
  } while(currentPage < res.totalPages)
}
await fetchMinimumQuantity()

const chartData = ref({
    labels: legend,
    datasets: [
      {
        label: 'Itens neste estado',
        backgroundColor: backgroundColor,
        data: [itemsStateLevels.value.stable, itemsStateLevels.value.warning, itemsStateLevels.value.danger],
      },
    ],
});
  
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    cutout: 85,
    plugins: {
      legend: {
        display: false,
        position: 'top',
        align: 'center',
      },
    },
});
onMounted(() => {
})
</script>
<style scoped>
.graph-loader{
  height: 100px;
}
h5{
    font-weight: 300;
    color: rgb(51,51,51, 0.8);
}
.section-title{
  border-radius: 8px 8px 0px 0px;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
}
.graph-btn{
  border-bottom: 1px solid #0B3B69;
  border-radius: 10px 10px 0px 0px;
  color: rgb(0, 0, 0, 0.7);
  padding: 5px;
  font-size: 13px;
}
.chart-graph {
  height: 300px !important;
}
li{
    list-style-type: none;
}
.large-menu{
    width: 136px !important;
    min-width: 40px;
}
.small-menu{
    background-color: white;
    border-radius: 12px;
    border: 1px #D9D9D9 solid;
    position: absolute;
    margin-top: -200px;
    left: -55px;
    width: 65px;
    height: 400px;
    min-width: 40px;
}
.btn-transparent{
    font-size: 14px;
}
.items-list-legend{
  transition: height 0.8s ease-in-out, z-index 0.8s ease-in-out;
  min-height: 0px;
  overflow-y: scroll;
}
.legend{
  transition: width 0.8s ease-in-out;
  padding-top: 100px;
}
.legend ul li, .items-list-legend ul li{
  font-size: 12px;
  text-overflow: ellipsis;
}
.action-btn{
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #1F69B1;
}
.btn-outline-secondary{
  color: rgb(51,51,51, 0.9);
  background-color: transparent !important;
}
.btn-outline-secondary:hover{
  color: white !important;
  background-color: #1F69B1 !important;
}
.dropdown-item{
  font-size: 14px;
}
.btn-outline-secondary:hover{
  color: white;
}
.btn-transparent:hover {
  color: white !important; 
  background-color: #0B3B69 !important; 
}

.btn-outline-ligth:hover {
  color: white !important; 
  background-color: #0B3B69 !important; 
}

@media screen and (max-width: 820px){
  .action-btn{
      font-size: 12px;
  }
  .large-menu{
      padding: 0;
      width: 120px !important;
  }
  .action-icon{
      width: 15px;
      height: 15px;
  }
}
@media screen and (max-width: 706px){
  .graph-header{
    display: block !important;
  }
  .graph-btn{
    font-size: 11px;
  }
}
@media screen and (max-width: 380px){
  .graph-btn{
    font-size: 10px;
  }
}
  </style>
  