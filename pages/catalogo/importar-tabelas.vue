<template>
    <div>
        <Head>
            <Title>NEI Almoxarifado | Importar Tabela</Title>
            <Meta name="importar tabela" content="Página para importar uma tabela de itens"/>
        </Head>
    </div>
    <LoadersPageLoading :isLoading="loading" class="loader"/>
    <div class="container-fluid mx-4">
        <div class="dashboard-section me-2 bg-light mb-4 pb-0 pt-0">
            <div class="section-title pt-2 mb-4 bg-light-background-header">
                <h5 class="header fw-bold ps-2">Importação de itens</h5>
            </div> 
            <div>
                <p class="px-3">A tabela que você deseja importar deve estar em um dos seguintes formatos: .xlsx, .xls ou .csv. É essencial que os dados estejam organizados corretamente, contendo as seguintes colunas:

<br><br>Nome do Produto: O nome completo e exato do produto.<br>
Tipo Unitário: A unidade de medida utilizada para o produto (por exemplo: unidade, caixa, pacote, etc.).<br>
Quantidade em Estoque Atual: O número total de unidades disponíveis no estoque no momento da importação.<br><br>
Certifique-se de que cada coluna esteja corretamente identificada e preenchida, sem dados faltantes ou incorretos, para garantir que o sistema consiga processar as informações corretamente.

Caso tenha dúvidas ou precise de uma referência sobre como estruturar sua planilha, disponibilizamos um <a href="/planilha_padrao.xlsx">Modelo Padrão</a> que você pode utilizar como exemplo para organizar seus dados adequadamente. </p>
                <p class="px-3"></p>
                <p class="message-alert bg-warning d-flex align-items-center mx-5">
                Aviso: Qualquer linha branca/vazia, com dados obstruídos ou qualquer item com estoque atual negativo não serão processados na importação, sendo necessário o cadastro manual.
                </p>
                <div class="d-block">
                    <input class="form-control" type="file" @change="handleFileUpload" accept=".xlsx, .xls, .csv" />
                </div>
            </div>
        </div>    
        <div class="d-flex justify-content-center mb-4 pb-4 me-3">
            <button @click="sendUploadedData" class="btn fw-bold btn-dark-success text-light me-2">Importar</button>    
            <a href="/catalogo" class="btn fw-bold btn-light-alert ms-2 text-light">Cancelar</a>
        </div>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '../../stores/user';
import { useStorageStore } from '../../stores/storage';
import { usePopupStore } from '~/stores/popup';
import { postCreateItem } from '../../services/items/itemsPOST';
import * as XLSX from 'xlsx';
import { navigateTo } from 'nuxt/app';

const store = useStorageStore();
const userStore = useUser();
const popUpStore = usePopupStore();

const loading = ref(false);


const setpageTitle = inject('setpageTitle');
const sendDataToParent = () => {
    const title = "Importar Tabelas";
    const route = `${useRoute().fullPath}`
    setpageTitle(title, route, 'spreadsheet');
};
sendDataToParent();


let tableData = [];
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const tableHeaders = jsonData[0];
        tableData = jsonData.slice(1);
    };
    reader.readAsArrayBuffer(file);
}

let itemsUploaded = 0;
const sendUploadedData = async () => {
    if(tableData.length <= 0){
        popUpStore.throwPopup('Erro: Nenhuma linha importável da tabela, confira se ela segue o modelo padrão', 'red')
        return 0;
    }
    loading.value = true;
    const concurrencyLimit = 10; // Limite de requisições simultâneas
    let index = 0;
    let response = true;
    let itemsUploaded = 0;
    const executeBatch = async () => {
        const batchPromises = [];
        while (index < tableData.length && batchPromises.length < concurrencyLimit) {
            if (tableData[index][3] > 0) {
                batchPromises.push(
                    await postCreateItem(userStore, tableData[index][1], tableData[index][0] ? tableData[index][0] : '', tableData[index][3], tableData[index][2], tableData[index][4])
                    .then(() => {
                            itemsUploaded++;
                    })
                    .catch((error) => {
                        console.error(`Erro ao importar item ${tableData[index][1]}:`, error);
                    })
                );
            }
            index++;
        }

        await Promise.all(batchPromises);
        if (index < tableData.length) {
            await executeBatch(); // Chama a si mesmo para o próximo lote
        }
    };

    await executeBatch();
    navigateTo('/catalogo');
    popUpStore.throwPopup(`Foram importados ${itemsUploaded} itens(linhas) da tabela.`, '#0B3B69');
};
</script>

<style scoped>
.container{
    width: 100%;
    padding-left: 5%;
    padding-right: 5%;
    flex-direction: column;
}
p{
    color: rgba(51, 51, 51, 0.8);
}
.btn{
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 18px !important;
    padding: 20px 20xp 13px 13px;   
}
.dashboard-section{   
    width: 99%;
    padding-top: 10px;
    padding-bottom: 0px;
    padding-left: 0;
    padding-right: 0;
    border: 1px #D9D9D9 solid;
    border-radius: 10px 10px 0px 0px;
    box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.2);
}
.section-title{
    border-radius: 8px 8px 0px 0px;
    border-bottom: 1px solid rgb(0, 0, 0, 0.2);
}
.message-alert {
  padding: 15px;
  margin: 20px 0;
  color: #212529;
  border: 1px solid #ffca2c;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  opacity: 0.9;
}
h5{
    font-weight: 300;
    color: rgb(51,51,51, 0.8);
}
.form-control{
    border-radius: 0px;
}
.form-control:hover::before {
    background: #0056b3 !important; /* Altere para a cor desejada ao passar o mouse */
}
.loader{
	top: 0px;
    width: 200% !important;
}
@media screen and (max-width: 700px){
    .container-fluid{
        margin-left: 6px !important;
        margin-right: 2px !important;
    }
    .message-alert{
        margin-left: 6px !important;
        margin-right: 6px !important;
    }
}
</style>