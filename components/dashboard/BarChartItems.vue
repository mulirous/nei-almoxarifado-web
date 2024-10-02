<template>
  <ModalReport :id="1" :data="datasets"/>
  <div class="graph-header d-flex align-items-end justify-content-between section-title pt-2  bg-light-background-header">
        <h5 class="ps-2 fw-bold">Gráfico das solicitações de itens</h5>
          <div class="dropdown mb-1 mx-2 d-flex" @click.stop>
            <button class="d-flex align-items-center graph-btn btn btn-transparent fw-bold px-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <IconsTimer class="me-1" width="20px" height="20px"/>
              Período
            </button>
            <button class="d-flex align-items-center ms-2 graph-btn btn btn-transparent px-2 fw-bold" type="button" data-bs-toggle="modal" data-bs-target="#almoReport1" ria-expanded="false">
              <IconsRequest class="me-1" width="20px" height="20px"/>
              Relatório
            </button>
            <ul class="dropdown-menu large-menu p-0">
              <li @click="changeLabel('month')" type="button" class="dropdown-item fw-bold">
                anual
              </li>
              <li>
                <div class="vue-dropdown" @click="ClicktoggleDropdown" @mouseover="toggleDropdown" @mouseout="toggleDropdown">
                    <div class="filter-btn dropdown-item large-menu-btn fw-bold d-flex btn align-items-center border-0" type="button">
                        mensal   
                    </div>
                    <ul class="vue-dropdown-menu" v-show="dropdownState">
                        <li class="small-menu" :class="{'mobile-small-menu': store.isMobile}">
                          <div v-for="(month, index) in labels.month" :key="index" @click="changeLabel('week', index)" class="filter-btn d-flex fw-bold justify-content-between text-align-center align-items-center btn btn-transparent border-0" type="button">
                            {{ month.slice(0,3) }}
                          </div>
                        </li>
                    </ul>
                </div>
              </li>
            </ul>
      </div>
  </div>
  <div class="d-flex justify-content-end position-absolute me-3 mt-3 fw-bold opacity-75" style="right: 2%;">
    <p>Período: {{ monthSelected === -1 ? 'anual' : `${labels.month[monthSelected]}` }}</p>
  </div>
  <div>
    <div class="d-flex justify-content-center z-5 loader">
      <LoadersLoading class="position-absolute graph-loader p-5"/>
    </div>
    <Bar v-if="chartData.datasets[0].data.reduce((acc, current) => acc+current) > 0" class="chart-graph " :data="chartData" :options="chartOptions" />
    <div v-else class="d-flex justify-content-center mb-5">
      <p class="fw-bold fs-5 opacity-75 py-5 my-5">Nenhum dado encontrado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useUser } from '../../stores/user.ts';
import { useStorageStore } from '../../stores/storage.ts';
import { getRequests } from '../../services/requests/requestsGET.ts';
import { Bar, Line, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineController,
  Legend,
  Filler,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarElement,
  CategoryScale,
  LinearScale
);

const userStore = useUser();
const store = useStorageStore();

const dropdownState = ref(false);
const toggleDropdown = () => {
    if(!store.isMobile){
      dropdownState.value = !dropdownState.value
    }
}

const ClicktoggleDropdown = () => {
    if(store.isMobile){
        dropdownState.value = !dropdownState.value
    }
}

const qtdRequestedByMonths = [];
const qtdRequestsAcceptByMonths = [];
const qtdRequestsRejectByMonths = [];

const qtdRequestedByWeeks = [
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const qtdRequestsAcceptByWeeks = [
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const qtdRequestsRejectByWeeks = [
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                              [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const req = await getRequests(userStore);

const data = req.content.map((request) => {
  return {date:request.creationDate.slice(0,10),  qtd: request.quantityRequested, status: request.status}
})



for(let i = 1; i <= 12; i++){
  let requestsSum = 0;
  let requestsAcceptedSum = 0;
  let requestsRejectedSum = 0;
  
  for(let j = 0; j < data.length; j++){
    if(data[j].date.slice(5, 7) == i){
      requestsSum += data[j].qtd
      let dayOfMonth = parseInt(data[j].date.slice(8, 11))
      if (dayOfMonth <= 7) {
        qtdRequestedByWeeks[i-1][0] += data[j].qtd;
      } else if (dayOfMonth > 7 && dayOfMonth <= 14) {
        qtdRequestedByWeeks[i-1][1] += data[j].qtd;
      } else if (dayOfMonth > 14 && dayOfMonth <= 21) {
        qtdRequestedByWeeks[i-1][2] += data[j].qtd;
      } else if (dayOfMonth > 21 && dayOfMonth <= 31) {
        qtdRequestedByWeeks[i-1][3] += data[j].qtd;
      }
    }
    if(data[j].date.slice(5, 7) == i && data[j].status === "ACEITO"){
      requestsAcceptedSum += data[j].qtd
      let dayOfMonth = parseInt(data[j].date.slice(8, 11))
      if (dayOfMonth <= 7) {
        qtdRequestsAcceptByWeeks[i-1][0] += data[j].qtd;
      } else if (dayOfMonth > 7 && dayOfMonth <= 14) {
        qtdRequestsAcceptByWeeks[i-1][1] += data[j].qtd;
      } else if (dayOfMonth > 14 && dayOfMonth <= 21) {
        qtdRequestsAcceptByWeeks[i-1][2] += data[j].qtd;
      } else if (dayOfMonth > 21 && dayOfMonth <= 31) {
        qtdRequestsAcceptByWeeks[i-1][3] += data[j].qtd;
      }
    }
    if(data[j].date.slice(5, 7) == i && data[j].status === "RECUSADO"){
      requestsRejectedSum += data[j].qtd
      let dayOfMonth = parseInt(data[j].date.slice(8, 11))
      if (dayOfMonth <= 7) {
        qtdRequestsRejectByWeeks[i-1][0] += data[j].qtd;
      } else if (dayOfMonth > 7 && dayOfMonth <= 14) {
        qtdRequestsRejectByWeeks[i-1][1] += data[j].qtd;
      } else if (dayOfMonth > 14 && dayOfMonth <= 21) {
        qtdRequestsRejectByWeeks[i-1][2] += data[j].qtd;
      } else if (dayOfMonth > 21 && dayOfMonth <= 31) {
        qtdRequestsRejectByWeeks[i-1][3] += data[j].qtd;
      }
    }
  }
  qtdRequestedByMonths.push(requestsSum)
  qtdRequestsAcceptByMonths.push(requestsAcceptedSum)
  qtdRequestsRejectByMonths.push(requestsRejectedSum);
};

/*PROJEÇÕES SOBRE A QUANTIDADE DE SOLICITAÇÕES */

function projectWithSeasonality(qtdRequestedByMonths) {
  const projectedData = [...qtdRequestedByMonths];
  
  // Definimos os meses de baixa demanda (Janeiro, Fevereiro, Dezembro) e meses fortes (Julho e Agosto)
  const weakMonths = [0, 1, 9, 10,11];  // índices para Janeiro, Fevereiro e Dezembro
  const strongMonths = [6, 7];    // índices para Julho e Agosto
  
  // Encontra os índices dos meses com dados
  const nonZeroMonths = qtdRequestedByMonths
    .map((value, index) => (value !== 0 ? index : -1))
    .filter(index => index !== -1);
  
  // Verifica se há pelo menos um mês com dados
  if (nonZeroMonths.length === 0) {
    console.error("Não há dados para calcular a projeção.");
    return projectedData;
  }

  // Se houver apenas um mês com dados, mantemos o valor constante
  const lastMonthIndex = nonZeroMonths[nonZeroMonths.length - 1];
  const lastValue = qtdRequestedByMonths[lastMonthIndex];

  let growthRate = 0;
  let trend = 0;

  if (nonZeroMonths.length > 1) {
    // Calcula a taxa de crescimento entre os dois últimos meses
    const prevMonthIndex = nonZeroMonths[nonZeroMonths.length - 2];
    const prevValue = qtdRequestedByMonths[prevMonthIndex];
    growthRate = (lastValue - prevValue) / prevValue;
    
    // Calcula a tendência entre os últimos 3 meses com dados, se disponível
    if (nonZeroMonths.length > 2) {
      const prevPrevMonthIndex = nonZeroMonths[nonZeroMonths.length - 3];
      const prevPrevValue = qtdRequestedByMonths[prevPrevMonthIndex];

      // Identifica a taxa de variação ao longo do tempo e extrai a tendência
      const trend1 = (prevValue - prevPrevValue) / prevPrevValue;
      const trend2 = (lastValue - prevValue) / prevValue;
      
      // A média dos dois últimos crescimentos será usada para ajustar a tendência
      trend = (trend1 + trend2) / 4;  // Reduzido para refletir crescimento moderado
    }
  }

  // Projeta os meses subsequentes com base na taxa de crescimento e tendência
  for (let i = lastMonthIndex + 1; i < projectedData.length; i++) {
    let baseProjection = projectedData[i - 1] * (1 + growthRate + trend);
    
    // Ajusta para os meses fortes e fracos
    if (weakMonths.includes(i % 12)) {
      baseProjection *= 0.5;  // Reduz o valor para os meses fracos em 80%
    } else if (strongMonths.includes(i % 12)) {
      baseProjection *= 1.2;  // Aumenta o valor para os meses fortes em 20%
    }

    projectedData[i] = Math.max(parseInt(baseProjection), 0);  // Evita valores negativos

    // Ajusta a taxa de crescimento para seguir a tendência
    growthRate = trend;
  }

  return projectedData;
}

// Exemplo de projeção dos dados
const projectedData = projectWithSeasonality(qtdRequestedByMonths);

const labels = {
  month: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  week: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana']
};

const datasets = {
  available: [400, 400, 200, 300, 200, 150, 100, 50, 100, 200, 300, 200, 100],
  requests: [qtdRequestedByMonths, qtdRequestedByWeeks],
  requestsAccepted: [qtdRequestsAcceptByMonths, qtdRequestsAcceptByWeeks],
  requestsRejected: [qtdRequestsRejectByMonths, qtdRequestsRejectByWeeks]
};

const currentData = ref([]);
const currentLabel = ref([]);
const currentIndex = ref(0);
const currentLabelName = ref('');
currentLabel.value = labels.month;
currentData.value = datasets.requests;
currentLabelName.value = 'Quantidade Solicitada';
const chartData = ref({
  labels: currentLabel.value,
  datasets: [
    {
      type: 'bar',
      label: 'Itens solicitados',
      backgroundColor: '#0B3B69',
      data: datasets.requests[currentIndex.value]
    },
    {
      type: 'bar',
      label: 'Itens consumidos',
      backgroundColor: '#388E3C',
      data: datasets.requestsAccepted[currentIndex.value]
    },
    {
      type: 'bar',
      label: 'Itens recusados',
      backgroundColor: '#B71C1C',
      data: datasets.requestsRejected[currentIndex.value]
    },
    {
      type: 'line',
      label: 'Projeção das quantidades',
      backgroundColor: '#1F69B1',
      borderColor: '#1F69B1',
      pointBackgroundColor: '#1F69B1',
      pointBorderColor: '#1F69B1',
      data: projectedData
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          size: (context) => {
            const width = context.chart.width;
            if (width > 1000) return 14;
             if (600 < width && width < 1000) return 12;
            else if (width < 500) return 10;
            return 10;
          }
        }
      }
    }
  },
});

let monthSelected = -1;
const changeLabel = (labelType, index) => {
  currentLabel.value = labels[labelType]
  if(labelType === 'month'){
    monthSelected = -1
    currentIndex.value = 0;
    chartData.value = {
      ...chartData.value,
      labels: currentLabel.value,
      
      datasets: [
        {
          ...chartData.value.datasets[0], 
          type: 'bar',
          label: 'Itens solicitados',
          backgroundColor: '#0B3B69',
          data: datasets.requests[currentIndex.value]
        },
        {
          ...chartData.value.datasets[1],
          type: 'bar',
          label: 'Itens consumidos',
          backgroundColor: '#388E3C',
          data: datasets.requestsAccepted[currentIndex.value]
        },
        {
          ...chartData.value.datasets[2],
          type: 'bar',
          label: 'Itens recusados',
          backgroundColor: '#B71C1C',
          data: datasets.requestsRejected[currentIndex.value]
        },
        {
              type: 'line',
          label: 'Projeção das quantidades',
          backgroundColor: '#1F69B1',
          borderColor: '#1F69B1',
          pointBackgroundColor: '#1F69B1',
          pointBorderColor: '#1F69B1',
          data: projectedData
        },
      ]
    }
  } else if(labelType === 'week'){
    monthSelected = index
    currentIndex.value = 1;
    chartData.value = {
      ...chartData.value,
      labels: currentLabel.value,
      datasets: [
        {
          ...chartData.value.datasets[0], 
          type: 'bar',
          label: 'Quantidade de itens solicitados',
          backgroundColor: '#0B3B69',
          data: datasets.requests[currentIndex.value][index]
        },
        {
          ...chartData.value.datasets[1],
          type: 'bar',
          label: 'Quantidade de itens consumidos',
          backgroundColor: '#388E3C',
          data: datasets.requestsAccepted[currentIndex.value][index]
        },
        {
          ...chartData.value.datasets[2],
          type: 'bar',
          label: 'Quantidade de itens recusados',
          backgroundColor: '#B71C1C',
          data: datasets.requestsRejected[currentIndex.value][index]
        },
      ]
    }
  }
};
onMounted(() => {
  /*
  if(store.isMobile){
      const btnText = document.querySelectorAll('.filter-btn');
      const dropdownToggle = document.querySelector('.dropdown-principal');
      dropdownToggle.removeAttribute('data-bs-auto-close')
      dropdownToggle.setAttribute('data-bs-auto-close', 'outside')
      btnText.forEach(element => element.style.fontSize = '9px');
  }
  */
})
</script>

<style scoped>
.graph-loader{
  margin-top: 100px !important;
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
  color: rgb(0, 0, 0, 0.7);
  padding: 5px;
  font-size: 13px;
}
.chart-graph {
  height: 350px;
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
.mobile-small-menu{
  left: 100px;
}
.btn-transparent{
    font-size: 14px;
}
.action-btn{
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #1F69B1;
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
@media screen and (max-width: 583px){
  .chart-graph {
    height: 350px !important;
    
  }
  .graph-header{
    display: block !important;
  }
}
</style>
