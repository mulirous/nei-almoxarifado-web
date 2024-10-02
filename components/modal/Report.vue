<template>
    <Modal :id="`almoReport${props.id}`" tabindex="-1" aria-labelledby="scrollableModalLabel" aria-hidden="true" data-bs-backdrop="true">
        <template v-slot:header> 
            <p class="header-title d-flex justify-content-start align-items-center fw-bold">Gerar Relatório</p>
            <button class="btn btn-transparent text-light close-btn" type="button" data-bs-dismiss="modal">
                <IconsClose class="close ms-5 s-5" width="1.3em" height="1.3em"/>
            </button>
        </template>
        <template v-slot:body>
            <form @submit.prevent="generateReport">
                <div class="d-block mb-3">
                    <div>
                        <p class="fw-bold text-dark-emphasis">
                            Selecione os dados e período temporal que serão formatados na geração do relatório
                        </p>
                    </div>
                    <div v-if="props.id === 1">
                        <label class="report-subtitle fw-bold" for="item-qtd">Dados:</label>
                        <div class="d-flex align-items-center justify-content-between my-2">
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="allRequests" v-model="reportOptions.dataset[0]">
                                <label class="form-check-label " for="allRequests">
                                    Todas as solicitações 
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="acceptRequests" v-model="reportOptions.dataset[1]">
                                <label class="form-check-label" for="acceptRequests">
                                    Solicitações aceitas
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="rejectRequests" v-model="reportOptions.dataset[2]">
                                <label class="form-check-label" for="rejectRequests">
                                    Solicitações recusadas
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="props.id === 2">
                        <label class="report-subtitle fw-bold" for="item-qtd">Dados</label>
                        <div class="d-flex align-items-center justify-content-start my-2">
                            <div class="form-check mb-3 me-4">
                                <input class="form-check-input" type="checkbox" id="itemsMost" v-model="reportOptions.dataset[0]">
                                <label class="form-check-label" for="itemsMost">
                                    Itens
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="usersMost" v-model="reportOptions.dataset[1]">
                                <label class="form-check-label" for="usersMost">
                                    Usuários
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label for="item-qtd" class="fw-bold">Período:</label>
                        <div class="d-flex my-2">
                            <div class="form-check me-3">
                                <input class="form-check-input" type="radio" name="period" id="allPeriod" value="all" v-model="reportPeriod">
                                <label class="form-check-label" for="allPeriod">
                                    Anual
                                </label>
                            </div>
                            <div class="form-check mx-2">
                                <input class="form-check-input" type="radio" name="period" id="monthlyPeriod" value="monthly" v-model="reportPeriod">
                                <label class="form-check-label" for="monthlyPeriod">
                                    Mensal
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="reportPeriod === 'monthly'" class="d-flex flex-wrap align-items-center">
                        <div v-for="(month, index) in months" :key="index" class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'check'+index" :value="index" v-model="selectedMonths[index]">
                            <label class="form-check-label mx-2" :for="'check'+index">
                                {{ month.slice(0, 3) }}
                            </label>
                        </div>
                    </div>
                    
                    <div v-if="reportPeriod === 'weekly'" class="d-flex flex-wrap align-items-center">
                        <div v-for="(week, index) in weeks" :key="index" class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'checkWeek'+index" :value="week" v-model="selectedWeeks">
                            <label class="form-check-label mx-2" :for="'checkWeek'+index">
                                {{ week }}
                            </label>
                        </div>
                    </div>
                </div>
                <!--
                <div v-if="props.id === 2" class="d-block mb-3">
                    <label for="type">Tipo de Item</label>
                    <select class="form-select me-5" aria-label="Default select" v-model="reportType">
                        <option disabled selected>Selecione o tipo</option>
                        <option value="todos">Todos</option>
                        <option value="unidade">Unidade</option>
                        <option value="sacola">Sacola</option>
                        <option value="caixa">Caixa</option>
                    </select>
                </div>

                <div v-if="props.id === 2" class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="monthlyAverage" v-model="includeMonthlyAverage">
                    <label class="form-check-label" for="monthlyAverage">
                        Incluir média mensal das solicitações por item
                    </label>
                </div>-->

                <div v-if="includeUsers" class="d-block mb-3">
                    <label for="userType">Tipo de Usuário</label>
                    <select class="form-select me-5" aria-label="Default select" v-model="userType">
                        <option disabled selected>Selecione o tipo</option>
                        <option value="admin">Administrador</option>
                        <option value="regular">Regular</option>
                    </select>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <div class="container-fluid d-flex justify-content-end align-items-center">
                <button type="submit" class="btn btn-dark-success fw-bold inset-shadow text-light mx-1" @click="generateReport">Confirmar</button>
                <button type="button" class="btn btn-light-alert fw-bold inset-shadow text-light mx-1" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';
import logo from '../../assets/svg/logo.svg';
import jsPDF from 'jspdf';
import { useStorageStore } from '../../stores/storage';
// Convertendo logo svg para um formato compativel ao jsPDF
const svgToDataUri = (svgPath) => {
    return new Promise((resolve, reject) => {
        fetch(svgPath)
            .then(response => response.text())
            .then(svg => {
                const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(svgBlob);
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataUri = canvas.toDataURL('image/png');
                    URL.revokeObjectURL(url);
                    resolve(dataUri);
                };
                img.onerror = (err) => {
                    URL.revokeObjectURL(url);
                    reject(err);
                };
                img.src = url;
            })
            .catch(err => reject(err));
    });
};
const props = defineProps({
    id:{
        type: Number,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
});
const store = useStorageStore();
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const weeks = ['1ª semana', '2ª semana', '3ª semana', '4ª semana'];
const reportOptions = ref({
    dataset: [false, false, false]
});
const reportPeriod = ref('all');
const selectedMonths = ref([]);
const selectedWeeks = ref([]);
const reportType = ref('');
const includeMonthlyAverage = ref(false);
const includeUsers = ref(false);
const userType = ref('');
let initialQtd = 0;
const generateReport = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const date = new Date();
    const title = 'RELATÓRIO';
    // Adicionar um cabeçalho com fundo colorido
    doc.setFillColor(220, 220, 220);
    doc.rect(0, 0, pageWidth, 20, 'F');
    // Logo
    const logoDataUri = await svgToDataUri(logo);
    doc.addImage(logoDataUri, 'PNG', 10, 5, 10, 10);
    
    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 10);
    // Data e hora atual
    doc.setFontSize(11);
    doc.text('Data:', titleX + 50, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`, titleX + 62, 10);
    doc.setDrawColor(0, 51, 102);
    doc.line(20, 13, 200, 13);
    doc.line(20, 13, 200, 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    // Função de adição de seção
    const addSectionTitle = (text, y) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 51, 102);
        doc.rect(5, y - 4, pageWidth - 10, 8, 'F');
        doc.text(text, 7, y);
    };
    // Logica de dados
    if (reportPeriod.value === 'all') {
        if (props.id === 1) {
            addSectionTitle('Tipo de Relatório', 20);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Relatório de Solicitações:', 7, 30);
            doc.setFont('helvetica', 'normal');
            doc.text('Registra todas as solicitações e separa entre as aceitas e recusadas', titleX-20, 30);
            addSectionTitle('Tipo de Dados', 40);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Total de Solicitações:', 7, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[0] === true ? 'Sim' : 'Não'}`, titleX-20, 50);
            doc.setFont('helvetica', 'bold');
            doc.text('Solicitações Aceitas:', 7, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[1] === true ? 'Sim' : 'Não'}`, titleX-20, 60);
            doc.setFont('helvetica', 'bold');
            doc.text('Solicitações Recusadas:', titleX+20, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[2] === true ? 'Sim' : 'Não'}`, titleX+80, 50);
            addSectionTitle('Período', 70);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Todo Período:', 7, 80);
            doc.setFont('helvetica', 'normal');
            doc.text('Consiste no tempo anual completo', titleX-20, 80);
            let currentY = 90;
            let currentX = 7;
            if (reportOptions.value.dataset[0]) {
                addSectionTitle('Total de Solicitações por Mês', currentY);
                currentY += 10; 
                for (let i = 0; i < months.length; i++) {
                    currentX += 15;
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${months[i].slice(0, 3)}`, currentX-3, currentY);
                    doc.setDrawColor(0, 51, 102);
                    doc.line(currentX-4, currentY+4, currentX+4, currentY+4);
                    doc.text(`${props.data.requests[0][i]}`, currentX-`${props.data.requests[0][i]}`.length, currentY+10);
                }
                currentY += 20;
                currentX = 7;
            }
            if (reportOptions.value.dataset[1]) {
                addSectionTitle('Total de Solicitações Aceitas por Mês', currentY);
                currentY += 10; 
                for (let i = 0; i < months.length; i++) {
                    currentX += 15;
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${months[i].slice(0, 3)}`, currentX-3, currentY);
                    doc.setDrawColor(0, 51, 102);
                    doc.line(currentX-4, currentY+4, currentX+4, currentY+4);
                    doc.text(`${props.data.requestsAccepted[0][i]}`, currentX-`${props.data.requestsAccepted[0][i]}`.length, currentY+10);
                }
                currentY += 20;
                currentX = 7;
            }
            if (reportOptions.value.dataset[2]) {
                addSectionTitle('Total de Solicitações Recusadas por Mês', currentY);
                currentY += 10; 
                for (let i = 0; i < months.length; i++) {
                    currentX += 15;
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${months[i].slice(0, 3)}`, currentX-3, currentY);
                    doc.setDrawColor(0, 51, 102);
                    doc.line(currentX-4, currentY+4, currentX+4, currentY+4);
                    doc.text(`${props.data.requestsRejected[0][i]}`, currentX-`${props.data.requestsRejected[0][i]}`.length, currentY+10);
                }
                currentY += 20;
                currentX = 7;
            }
        } else if (props.id === 2) {
            addSectionTitle('Tipo de Relatório', 20);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Relatório de Itens e Usuários:', 7, 30);
            doc.setFont('helvetica', 'normal');
            doc.text('Calcula métricas de uso e consumo nos itens e usuários respectivamente ', titleX-20, 30);
            addSectionTitle('Tipo de Dados', 40);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Itens:', 7, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[0] === true ? 'Sim' : 'Não'}`, titleX-20, 50);
            doc.setFont('helvetica', 'bold');
            doc.text('Usuários:', 7, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[1] === true ? 'Sim' : 'Não'}`, titleX-20, 60);
            addSectionTitle('Período', 70);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Todo Período:', 7, 80);
            doc.setFont('helvetica', 'normal');
            doc.text('Consiste no tempo anual completo', titleX-20, 80);
            let currentY = 90;
            let currentX = 7;
            if (reportOptions.value.dataset[0]) {
                addSectionTitle('Itens com Mais Solicitações', currentY);
                doc.setTextColor(0, 0, 0);
                for(let i = 0; i < props.data.labels.mostItems[0].length; i++){ 
                    currentX = 7;   
                    i % 2 === 1 ? currentX = 110 : currentY += 10;  
                    if(currentY > pageHeight-18){
                        doc.addPage();
                        currentY = 10;
                    } 
                    //doc.text(`${i+1}º`, ((i+1)*7), currentY+10);  
                    doc.setFont('helvetica', 'bold')         
                    doc.text(`${i+1}º posição: `, currentX, currentY);  
                    doc.setFont('helvetica', 'normal')
                    doc.text(`${props.data.labels.mostItems[0][i]}`, currentX+22, currentY);
                    initialQtd = parseInt(props.data.datasets.mostItemsQuantity[0][i])+parseInt(props.data.datasets.mostItemsConsumed[0][i])
                    doc.text(`Quantidade Inicial: ${initialQtd}`, currentX, currentY+5);
                    doc.text(`Quantidade de Solicitações: ${props.data.datasets.mostItemsTime[0][i]}`, currentX, currentY+10);
                    doc.text(`Quantidade Consumida: ${props.data.datasets.mostItemsConsumed[0][i]}`, currentX, currentY+15);
                    doc.text(`Saldo Final: ${props.data.datasets.mostItemsQuantity[0][i]}`, currentX, currentY+20);
                    i % 2 === 0 ? 0 : currentY += 20; 
                    //doc.text(`${props.data.datasets.mostItemsTime[0][i]}`, 10*(i+1), currentY+30);
                }
                currentY += 15
            }
            if (reportOptions.value.dataset[1]) {
                addSectionTitle('Usuários com Mais Solicitações', currentY);
                doc.setTextColor(0, 0, 0);
                for(let i = 0; i < props.data.labels.mostRequesters[0].length; i++){
                    currentX = 7;   
                    i % 2 === 1 ? currentX = 110 : currentY += 10;
                    if(currentY > pageHeight-10){
                        doc.addPage();
                        currentY = 10;
                    }
                    doc.setFont('helvetica', 'bold')         
                    doc.text(`${i+1}º posição: `, currentX, currentY);  
                    doc.setFont('helvetica', 'normal')
                    doc.text(`${props.data.labels.mostRequesters[0][i]}`, currentX+22, currentY);
                    doc.text(`Saldo de solicitações: ${props.data.datasets.mostRequestersTime[0][i]}`, currentX, currentY+5);
                }
            }
        }
    } else if (reportPeriod.value === 'monthly') {
        if (props.id === 1) {
            addSectionTitle('Tipo de Relatório', 20);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Relatório de Itens e Usuários:', 7, 30);
            doc.setFont('helvetica', 'normal');
            doc.text('Calcula métricas de uso e consumo nos itens e usuários respectivamente ', titleX-20, 30);
            addSectionTitle('Tipo de Dados', 40);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Itens:', 7, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[0] === true ? 'Sim' : 'Não'}`, titleX-20, 50);
            doc.setFont('helvetica', 'bold');
            doc.text('Usuários:', 7, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[1] === true ? 'Sim' : 'Não'}`, titleX-20, 60);
            addSectionTitle('Período', 70);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Todo Período:', 7, 80);
            doc.setFont('helvetica', 'normal');
            doc.text('Consiste no tempo anual completo', titleX-20, 80);
            let currentY = 90;
            let currentX = 7;
            if (reportOptions.value.dataset[0]) {
                for (let i = 0; i < selectedMonths.value.length; i++) {
                    if(selectedMonths.value[i] === true){
                        addSectionTitle(`Total de Solicitações de ${months[i]}`, currentY);
                        currentY += 10; 
                        for(let j = 0; j < 4; j++){
                            doc.setTextColor(0, 0, 0);
                            currentX += 38;
                            doc.text(`${j+1}º semana:`, currentX-3, currentY);
                            doc.text(`${props.data.requests[1][i][j]}`, currentX-`${props.data.requests[1][i][j]}`.length+7, currentY+10);
                            doc.setDrawColor(0, 51, 102);
                            doc.line(currentX-4, currentY+4, currentX+18, currentY+4);
                        }
                        currentX = 7;
                        currentY += 20
                    }
                    else if(props.data.requests[1][i] == undefined && selectedMonths.value[i] === true){
                        addSectionTitle(`Total de Solicitações de ${months[i]}`, currentY);
                        currentY += 10;
                        doc.setTextColor(0, 0, 0);
                        doc.setFont('helvetica', 'bold')  
                        doc.text("Nenhuma dado encontrado para esse período especificado", titleX-35, currentY);
                        currentY += 15;
                    }
                    if(currentY > pageHeight-15){
                        doc.addPage();
                        currentY = 10;
                    }
                }
            }
            if (reportOptions.value.dataset[1]) {
                for (let i = 0; i < selectedMonths.value.length; i++) {
                    if(selectedMonths.value[i] === true){
                        addSectionTitle(`Total de Solicitações Aceitas de ${months[i]}`, currentY);
                        currentY += 10; 
                        for(let j = 0; j < 4; j++){
                            doc.setTextColor(0, 0, 0);
                            currentX += 38;
                            doc.text(`${j+1}º semana:`, currentX-3, currentY);
                            doc.text(`${props.data.requestsAccepted[1][i][j]}`, currentX-`${props.data.requestsAccepted[1][i][j]}`.length+7, currentY+10);
                            doc.setDrawColor(0, 51, 102);
                            doc.line(currentX-4, currentY+4, currentX+18, currentY+4);
                        }
                        currentX = 7;
                        currentY += 20
                    }
                    else if(props.data.requestsAccepted[1][i] == undefined && selectedMonths.value[i] === true){
                        addSectionTitle(`Total de Solicitações Aceitas de ${months[i]}`, currentY);
                        currentY += 10;
                        doc.setTextColor(0, 0, 0);
                        doc.setFont('helvetica', 'bold')  
                        doc.text("Nenhuma dado encontrado para esse período especificado", titleX-35, currentY);
                        currentY += 15;
                    }
                    if(currentY > pageHeight-15){
                        doc.addPage();
                        currentY = 10;
                    }
                }
            }
            if (reportOptions.value.dataset[2]) {
                for (let i = 0; i < selectedMonths.value.length; i++) {
                    if(selectedMonths.value[i] === true){
                        addSectionTitle(`Total de Solicitações Recusadas de ${months[i]}`, currentY);
                        currentY += 10; 
                        for(let j = 0; j < 4; j++){
                            doc.setTextColor(0, 0, 0);
                            currentX += 38;
                            doc.text(`${j+1}º semana:`, currentX-3, currentY);
                            doc.text(`${props.data.requestsRejected[1][i][j]}`, currentX-`${props.data.requestsRejected[1][i][j]}`.length+7, currentY+10);
                            doc.setDrawColor(0, 51, 102);
                            doc.line(currentX-4, currentY+4, currentX+18, currentY+4);
                        }
                        currentX = 7;
                        currentY += 20
                    }
                    else if(props.data.requestsRejected[1][i] == undefined && selectedMonths.value[i] === true){
                        addSectionTitle(`Total de Solicitações Recusadas de ${months[i]}`, currentY);
                        currentY += 10;
                        doc.setTextColor(0, 0, 0);
                        doc.setFont('helvetica', 'bold')  
                        doc.text("Nenhuma dado encontrado para esse período especificado", titleX-35, currentY);
                        currentY += 15;
                    }
                    if(currentY > pageHeight-15){
                        doc.addPage();
                        currentY = 10;
                    }
                }
            }
        } else if (props.id === 2) {
            addSectionTitle('Tipo de Relatório', 20);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Relatório de Itens e Usuários:', 7, 30);
            doc.setFont('helvetica', 'normal');
            doc.text('Calcula métricas de uso e consumo nos itens e usuários respectivamente ', titleX-20, 30);
            addSectionTitle('Tipo de Dados', 40);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Itens:', 7, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[0] === true ? 'Sim' : 'Não'}`, titleX-20, 50);
            doc.setFont('helvetica', 'bold');
            doc.text('Usuários:', 7, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportOptions.value.dataset[1] === true ? 'Sim' : 'Não'}`, titleX-20, 60);
            addSectionTitle('Período', 70);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Todo Período:', 7, 80);
            doc.setFont('helvetica', 'normal');
            doc.text('Consiste no tempo anual completo', titleX-20, 80);
            let currentY = 90;
            let currentX = 7;
            if (reportOptions.value.dataset[0]) {
                for (let i = 0; i < selectedMonths.value.length; i++) {
                    if (props.data.datasets.mostItemsTime[1][i] != undefined) {
                        addSectionTitle(`Itens Mais Solicitações de ${months[i]}`, currentY);
                        for(let j = 0; j < props.data.labels.mostItems[1][i].slice(0, 15).length; j++){
                            currentX = 7;   
                            j % 2 === 1 ? currentX = 110 : currentY += 10;   
                            if(currentY > pageHeight-18){
                                doc.addPage();
                                currentY = 10;
                            } 
                            doc.setTextColor(0, 0, 0);
                            doc.setFont('helvetica', 'bold')         
                            doc.text(`${j+1}º posição: `, currentX, currentY);  
                            doc.setFont('helvetica', 'normal')
                            doc.text(`${props.data.labels.mostItems[1][i][j]}`, currentX+22, currentY);
                            initialQtd = parseInt(props.data.datasets.mostItemsQuantity[1][i][j])+parseInt(props.data.datasets.mostItemsConsumed[1][i][j])
                            doc.text(`Quantidade Inicial: ${initialQtd}`, currentX, currentY+5);
                            doc.text(`Quantidade de Solicitações: ${props.data.datasets.mostItemsTime[1][i][j]}`, currentX, currentY+10);
                            doc.text(`Quantidade Consumida: ${props.data.datasets.mostItemsConsumed[1][i][j]}`, currentX, currentY+15);
                            doc.text(`Saldo Final: ${props.data.datasets.mostItemsQuantity[1][i][j]}`, currentX, currentY+20);
                            j % 2 === 0 ? 0 : currentY += 20; 
                        }
                        currentY += 30;
                    }
                    else if(props.data.labels.mostItems[1][i] == undefined && selectedMonths.value[i] === true){
                        addSectionTitle(`Itens com Mais Solicitações de ${months[i]}`, currentY);
                        currentY += 10;
                        doc.setTextColor(0, 0, 0);
                        doc.setFont('helvetica', 'bold')  
                        doc.text("Nenhuma dado encontrado para esse período especificado", titleX-35, currentY);
                        currentY += 15;
                    }
                    if(currentY > pageHeight-15){
                        doc.addPage();
                        currentY = 10;
                    }
                }
            }
            if (reportOptions.value.dataset[1]) {
                for (let i = 0; i < selectedMonths.value.length; i++) {
                    if (props.data.datasets.mostRequestersTime[1][i] != undefined) {
                        addSectionTitle(`Usuários com Mais Solicitações de ${months[i]}`, currentY);
                        for(let j = 0; j < props.data.labels.mostRequesters[1][i].slice(0, 15).length; j++){
                            currentX = 7;   
                            j % 2 === 1 ? currentX = 110 : currentY += 10;   
                            if(currentY > pageHeight-10){
                                doc.addPage();
                                currentY = 10;
                            } 
                            doc.setTextColor(0, 0, 0);
                            doc.setFont('helvetica', 'bold')         
                            doc.text(`${j+1}º posição: `, currentX, currentY);  
                            doc.setFont('helvetica', 'normal')
                            doc.text(`${props.data.labels.mostRequesters[1][i][j]}`, currentX+22, currentY);
                            doc.text(`Saldo de Solicitações: ${props.data.datasets.mostRequestersTime[1][i][j]}`, currentX, currentY+5);
                        }
                        currentY += 15;
                    }
                    else if(props.data.labels.mostRequesters[1][i] == undefined && selectedMonths.value[i] === true){
                        addSectionTitle(`Usuários com Mais Solicitações de ${months[i]}`, currentY);
                        currentY += 10;
                        doc.setTextColor(0, 0, 0);
                        doc.setFont('helvetica', 'bold')  
                        doc.text("Nenhuma dado encontrado para esse período especificado", titleX-35, currentY);
                        currentY += 15;
                    }
                    if(currentY > pageHeight-15){
                        doc.addPage();
                        currentY = 10;
                    }
                }
            }
        }
    }
    doc.save('relatorio.pdf');  
};
</script>

<style scoped>
.form-check-input {
    border-color: #aeaeae;
}
.form-check-input:checked {
    background-color: #FED51E;
    box-shadow: none;
}
.form-check-label{
    font-size: 13px;
    color: rgba(51,51,51,1);
    font-weight: bold;
}
.close {
    position: relative;
    left: 20px;
}
.header-title {
    font-weight: 300;
    margin: -1px 0 -1px 0;
    padding: 0;
}
.inset-shadow {
    padding: 5px;
}
.close-btn {
    border: none;
}
.sipac-container:hover {
    opacity: 100% !important;
}
.sipac-container:active {
    opacity: 100% !important;
}
</style>
