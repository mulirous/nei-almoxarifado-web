<template>
  <ModalReport :id="2" :data="{
    datasets: {
      mostItemsTime: [datasets.mostItemsTime[0].slice(0, 50), datasets.mostItemsTime[1].slice(0, 15)],
      mostItemsQuantity: [itemsQuantity.slice(0, 50), itemsQuantityByMonth],
      mostItemsConsumed: [datasets.mostItemsConsumed[0].slice(0, 50), datasets.mostItemsConsumed[1].slice(0, 15)],
      mostRequestersTime: [datasets.mostRequestersTime[0].slice(0, 50), datasets.mostRequestersTime[1].slice(0, 15)]
    }, 
    labels: {
      mostItems: [labels.mostItems[0].slice(0, 50), labels.mostItems[1].slice(0, 15)], 
      mostRequesters: [labels.mostRequesters[0].slice(0, 50), labels.mostRequesters[1].slice(0, 15)]
      }}"/>
  <div class="align-items-end justify-content-between section-title pt-2 mb-2 bg-light-background-header">
        <h5 class="ps-2 fw-bold">Distribuição das solicitações</h5>
  </div>
  <div class="dropdown ms-4 d-flex" @click.stop>
      <button class="d-flex align-items-center graph-btn btn btn-transparent px-2  fw-medium text-nowrap " @click="toggleDataType">
        <IconsLoop class="me-1" width="20px" height="20px"/>
        {{ currentDataTypeLabel }}
      </button>
      <button class="d-flex align-items-center graph-btn  btn btn-transparent px-1 fw-medium dropdown-toggle mx-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <IconsTimer class="me-1" width="20px" height="20px"/>
        Período
      </button>
      <ul class="dropdown-menu large-menu p-0">
        <li @click="changeLabel(-1)" type="button" class="dropdown-item fw-bold">
          anual
        </li>
        <li>
          <div class="vue-dropdown" @click="ClicktoggleDropdown" @mouseover="toggleDropdown" @mouseout="toggleDropdown">
              <div class="filter-btn dropdown-item large-menu-btn d-flex btn align-items-center border-0 fw-bold" type="button">
                  mensal  
                </div>
              <ul class="vue-dropdown-menu" v-show="dropdownState">
                <li class="small-menu">
                  <div v-for="(month, index) in months" :key="index" @click="changeLabel(index + 1)" class="filter-btn fw-bold d-flex justify-content-between text-align-center align-items-center btn btn-transparent border-0" type="button">
                      {{ month.slice(0, 3) }}
                    </div>
                  </li>
              </ul>
          </div>
        </li>
      </ul>
      <button class="d-flex align-items-center graph-btn btn btn-transparent 91847128 px-1 fw-medium" type="button" data-bs-toggle="modal" data-bs-target="#almoReport2" ria-expanded="false">
        <IconsRequest class="me-1" width="20px" height="20px"/>
        Relatório
      </button>
  </div>
  <div class="d-flex justify-content-end">
    <div class="me-3 fw-bold opacity-75 position-absolute me-4" style="margin-top: 8px;">
      <p class="btn btn-light border fw-bold disabled" style="font-size: 13px">Período: {{ monthSelected === -1 ? 'anual' : `${months[monthSelected-1]}` }}</p>
    </div> 
  </div>
  <div :style="{'width': isLegend ? '280px' : '0px'}" class="position-absolute d-flex align-items-center text-light legend" style="border-radius: 0px 0px 0px 7px;z-index: 0;  background-color: rgba(90, 90,90,0.8);">
    <ul :style="{'opacity': isLegend ? '100%' : '0%'}" class="list-group ms-2" style="transition: opacity 0.6s ease-in-out;">
      <li v-for="(label, index) in labels[currentDataType][0].slice(0, 20)" :key="index" class="list-item bg-transparent d-flex align-items-center fw-medium text-nowrap"><input disabled class="border p-0 me-2 my-1" style="width: 25px; height: 20px;" type="color" :value="`${backgroundColor[index]}`">  {{ label }}</li>
    </ul>
  </div>
  <div class="bg-light-emphasis py-2 mx-3 mb-4" style="border: 1px solid rgba(51,51,51,0.2); border-top: 0px; border-radius: 0px 0px 8px 8px;">
    <div class="d-flex justify-content-center z-5">
      <LoadersLoading class="position-absolute p-5 mt-5 mb-0"/>
    </div>
    <div class="text-start ms-2" type="button">
      <span @click="isLegend = !isLegend" class="position-absolute btn btn-light border fw-bold text-dark-emphasis" style="font-size: 13px; z-index: 1;">Legenda</span>
    </div>
    <Chart v-if="chartData.labels.length > 0" :type="'pie'" class="chart-graph mt-5" :data="chartData" :options="chartOptions"  />
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
import { getRequests } from '../../services/requests/requestsGET.ts';
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

const backgroundColor = [
  "#0B3B69", "#9C89B8", "#C3AED6", "#1f69b1", "#FFB085",  // Roxos suaves e tons de laranja claro
  "#339e38", "#F4A261", "#E76F51", "#E9C46A", "#264653",  // Laranjas e tons de verde e azul discretos
  "#B71C1C", "#84A98C", "#CAD2C5", "#B5838D", "#6D597A",  // Verdes e violetas acinzentados, suaves
  "#FED51E", "#8FBC8F", "#A8DADC", "#457B9D", "#1D3557"   // Verdes, azuis mais frios e suaves
]
const isLegend = ref(false);
const dropdownState = ref(false);
const toggleDropdown = () => {
  if(!store.isMobile){
    dropdownState.value = !dropdownState.value;
  }
};
const ClicktoggleDropdown = () => {
    if(store.isMobile){
        dropdownState.value = !dropdownState.value
    }
}
const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const labels = {
  mostItems: [[], []],
  mostRequesters: [[], []],
};

const datasets = {
  mostItemsConsumed: [[], []],
  mostItemsSipac: [[], []],
  mostItemsTime: [[], []],
  mostRequestersTime: [[], []],
};


let dataItems = [];
const dataItemsByMonth = Array.from({ length: 12 }, () => []);

let itemsQuantity = []
let itemsQuantityByMonth = [[],[],[],[],[],[],[],[],[],[],[],[]];

let count = 0;
let allRequests = await getRequests(userStore, count);
const itemsName = [];
const itemsConsumed = [];
const itemsSipacCode = [];

const itemsNameByMonth = [[],[],[],[],[],[],[],[],[],[],[],[]];
const itemsSipacCodeByMonth = [[],[],[],[],[],[],[],[],[],[],[],[]];
const itemsConsumedByMonth = [[],[],[],[],[],[],[],[],[],[],[],[]];
do{
    for(let i = 0; i < allRequests.content.length; i++){
      //Maluquice abaixo \>
      itemsName.push(`${allRequests.content[i].item.name}§${allRequests.content[i].item.quantity}`);
      //itemsSipacCode.push(allRequests.content[i].item.sipacCode);

      itemsConsumed.push(allRequests.content[i].status === 'ACEITO' ? allRequests.content[i].quantityRequested : 0);

      const creationMonth = parseInt(allRequests.content[i].creationDate.slice(5, 7), 10) - 1;
      if (creationMonth >= 0 && creationMonth < 12){
        itemsNameByMonth[creationMonth].push(`${allRequests.content[i].item.name}§${allRequests.content[i].item.quantity}`)
        //itemsSipacCodeByMonth[creationMonth].push(allRequests.content[i].item.sipacCode)
        itemsConsumedByMonth[creationMonth].push(allRequests.content[i].status === 'ACEITO' ? allRequests.content[i].item.name : 0)
      }
    }
    const frequencyMap = itemsName.reduce((acc, item, index) => {
      acc.acumulado[item] = (acc.acumulado[item] || 0) + 1;
      acc.consumido[item] = (acc.consumido[item] || 0) + itemsConsumed[index];
      return acc;
    }, { acumulado: {}, consumido: {} });
    const resultArray = Object.keys(frequencyMap.acumulado).map(key => ({
      name: key,
      qtd: frequencyMap.acumulado[key],
      consumed: frequencyMap.consumido[key]
    }));
    dataItems = resultArray.sort((a, b) => b.qtd - a.qtd)
    for(let j = 0; j < 12; j++){
      if(itemsNameByMonth[j].length > 0){
        const frequencyMap = itemsNameByMonth[j].reduce((acc, item, index) => {
          acc.acumulado[item] = (acc.acumulado[item] || 0) + 1;
          acc.consumido[item] = (acc.consumido[item] || 0) + itemsConsumed[index];
          return acc;
        }, { acumulado: {}, consumido: {} });
        const resultArray = Object.keys(frequencyMap.acumulado).map(key => ({
          name: key,
          qtd: frequencyMap.acumulado[key],
          consumed: frequencyMap.consumido[key]
        }));
        dataItemsByMonth[j] = resultArray.sort((a, b) => b.qtd - a.qtd)
        labels.mostItems[1][j] = dataItemsByMonth[j].map(item => item.name.split('§')[0]); 
        itemsQuantityByMonth[j] = dataItemsByMonth[j].map(item => item.name.split('§')[1]);
        datasets.mostItemsTime[1][j] = dataItemsByMonth[j].map(item => item.qtd);
        datasets.mostItemsConsumed[1][j] = dataItemsByMonth[j].map(item => item.consumed);
      }
    }
    labels.mostItems[0] = dataItems.map(item => item.name.split('§')[0]);
    itemsQuantity = dataItems.map(item => item.name.split('§')[1]);
    datasets.mostItemsTime[0] = dataItems.map(item => item.qtd);
    datasets.mostItemsConsumed[0] = dataItems.map(item => item.consumed);
    count++;
    allRequests = await getRequests(userStore, count);
}while(count < allRequests.totalPages)

let dataUsers = [];
const dataUsersByMonth = Array.from({ length: 12 }, () => []);

count = 0;
allRequests = await getRequests(userStore, count);
const usersName = [];
const usersNameByMonth = [[],[],[],[],[],[],[],[],[],[],[],[]];
do{
    for(let i = 0; i < allRequests.content.length; i++){
      usersName.push(allRequests.content[i].user.name);
      const creationMonth = parseInt(allRequests.content[i].creationDate.slice(5, 7), 10) - 1;
      if (creationMonth >= 0 && creationMonth < 12){
        usersNameByMonth[creationMonth].push(allRequests.content[i].user.name)
      }
    }
    const frequencyMap = usersName.reduce((acc, user) => {
      acc[user] = (acc[user] || 0) + 1;
      return acc;
    }, {});
    const resultArray = Object.keys(frequencyMap).map(key => ({
      name: key,
      qtd: frequencyMap[key]
    }));
    dataUsers = resultArray.sort((a, b) => b.qtd - a.qtd)
    for(let j = 0; j < 12; j++){
      if(usersNameByMonth[j].length > 0){
        const frequencyMap = usersName.reduce((acc, item) => {
          acc[item] = (acc[item] || 0) + 1;
          return acc;
        }, {});
        const resultArray = Object.keys(frequencyMap).map(key => ({
          name: key,
          qtd: frequencyMap[key]
        }));
        usersNameByMonth[j] = resultArray.sort((a, b) => b.qtd - a.qtd)
        labels.mostRequesters[1][j] = usersNameByMonth[j].map(item => item.name); 
        datasets.mostRequestersTime[1][j] = usersNameByMonth[j].map(item => item.qtd);
      }
    }
    labels.mostRequesters[0] = dataUsers.map(item => item.name);
    datasets.mostRequestersTime[0] = dataUsers.map(item => item.qtd);
    count++;
    allRequests = await getRequests(userStore, count);
}while(count < allRequests.totalPages)

const currentIndex = ref(0);
const currentLabelName = ref('Solicitações');
const currentDataType = ref('mostItems'); 
const currentDataTypeLabel = ref('Distribuição: Itens');

const chartData = ref({
  labels: labels[currentDataType.value][0].slice(0, 20),
  datasets: [
    {
      label: currentLabelName,
      backgroundColor: backgroundColor,
       data: datasets[currentDataType.value+'Time'][0].slice(0, 20),
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
      labels: {
        boxWidth: 15,
        boxHeight: 10,
      },
    },
  },
});
let monthSelected = -1;
const changeLabel = (monthIndex) => {
  monthSelected = monthIndex
  if (monthIndex === -1) {
    currentIndex.value = 0;
    chartData.value = {
      ...chartData.value,
      labels: labels[currentDataType.value][0].slice(0, 20),
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: datasets[currentDataType.value + 'Time'][0].slice(0, 20),
        },
      ],
    };
  } else {
    currentIndex.value = 1;
    chartData.value = {
      ...chartData.value,
      labels: labels[currentDataType.value][1][monthIndex - 1] === undefined ? [] : labels[currentDataType.value][1][monthIndex - 1].slice(0, 20),
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: datasets[currentDataType.value + 'Time'][1][monthIndex - 1] === undefined ? [] : datasets[currentDataType.value + 'Time'][1][monthIndex - 1].slice(0, 20),
        },
      ],
    }
  }
};

const toggleDataType = () => {
  currentDataType.value = currentDataType.value === 'mostItems' ? 'mostRequesters' : 'mostItems';
  currentDataTypeLabel.value = currentDataType.value === 'mostItems' ? 'Distribuição: Itens' : 'Distribuição: Usuários';

  changeLabel(monthSelected);
};


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
.legend{
  transition: width 0.8s ease-in-out;
  overflow-y: scroll;
  height: 389px !important;
  padding-top: 280px;
}
.legend ul li{
  font-size: 12px;
  text-overflow: ellipsis;
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
