<template>
    <div>
		<Head>
			<Title>NEI Almoxarifado | Solicitações</Title>
			<Meta name="solicitações" content="Página para mostrar todas as solicitações de itens dos usuários"/>
		</Head>
	</div>
    <ModalActionConfirm>
        <template v-slot:text>
            <div class="d-flex align-items-center justify-content-center">
                <p class="fw-bold fs-5 my-3">Deseja cancelar a solicitação?</p>
            </div>
        </template>

        <template v-slot:buttons>
            <div class="d-flex align-items-center justify-content-end">
                <button data-bs-dismiss="modal" class="btn btn-dark-alert fw-bold py-2 px-1 me-2 text-light">Cancelar</button>
                <button data-bs-dismiss="modal" @click="cancelRequest(requestToCancel.id, requestToCancel.index)" class="btn btn-dark-success py-2 px-1 ms-2 fw-bold text-light">Confirmar</button>
            </div>
        </template>
    </ModalActionConfirm>
    <div class="container-fluid">
        <div class="sub-catalog bg-light mt-1 px-2">
            <h6 class="sub-catalog-title ps-2 d-flex align-items-center opacity-75">
                <IconsInformation class="me-2"/>
                Descrição da página
            </h6>
            <p class="sub-catalog-text opacity-75">
                Nessa página é possível verificar todas as solicitações feitas,
                dividindo entre as solicitações pendentes, aceitas e recusadas.
                <br>
                É possível também mudar a forma de visualização das solicitações ao clicar no botão
                <span class="border-bottom border-primary pb-1">
                    Visualização
                    <IconsMenu v-if="changeView" class="ms-1"/>
                    <IconsVerticalBars v-if="!changeView" class="ms-1"/>
                </span>
            </p>
        </div>
        <div class="table-box-title  d-flex justify-content-between align-items-center text">
            <div class="d-flex box-title align-items-center px-1 text bg-light-emphasis" style="padding-top: 5px; padding-bottom: 5px;">
                <IconsRequest class="me-1" width="25" height="25"/>
                <p class="box-title-text">
                    Histórico de Solicitações
                </p>
            </div>
            <div class="d-flex justify-content-end aling-items-center me-4 actions" style="margin-top: 2px;">
                <span v-if="!mobileView && !loadRequests" @click="changeView = !changeView" type="button" style="color: rgb(0, 0, 0, 0.7);" class=" text-dark-emphasis box-title bg-light-emphasis px-2 table-searchbar me-2 position-sticky d-flex align-items-center">
                    Vizualização
                    <IconsMenu v-if="changeView" class="ms-1"/>
                    <IconsVerticalBars v-if="!changeView" class="ms-1"/>
                </span>
                <span v-if="requestsLoad" class="box-title bg-light-emphasis position-sticky d-flex align-items-center table-searchbar" style="margin-top: 0.8px;">
                    <input id="tableSearch" v-model="searchInput" @input="searchInput = $event.target.value" class="searchbar bg-transparent form-control" placeholder="Pesquisar"/>          
                    <IconsSearchGlass class="search-glass"/>
                </span>
            </div>
        </div>
        <div class="requests-container mx-2 bg-light">
            <div :class="{'d-flex': !changeView, 'd-block': changeView}" class="justify-content-between mb-5 requests-view">
                <div class="request-container mx-2 text-dark-emphasis mt-3 rounded-2">
                    <div :class="{'box-bg-warning': requestsCache.inProgressRequests.length > 0}" class="requests-box mt-0 pt-0 z-0">
                        <div :class="{'border-warning border-bottom': requestsCache.inProgressRequests.length > 0}" class="d-flex box-title align-items-center justify-content-between px-2" >
                            <div class="d-flex align-items-center py-2">
                                <IconsClock class="me-2 text-dark-warning" width="30" height="30"/>
                                <h5 class="m-0 p-0">Pendentes
                                </h5>
                                <span>({{requestsCache.inProgressRequests.length}})</span>
                            </div>
                            <div class="dropdown" @click.stop>
                                <button title="Filtro" class="d-flex align-items-center btn btn-transparent px-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                  <IconsBarFilter class="text-dark-emphasis me-1" width="25" height="25" />
                                </button>
                                <div class="dropdown-menu p-0">
                                    <li type=button class="dropdown-item fw-bold text-dark-emphasis" 
                                         @click="ClicktoggleDropdown(1)"  @mouseover="toggleDropdown(1)" @mouseout="toggleDropdown(1)">
                                        <div class="d-flex justify-content-between align-items-center fw-bold text-dark-emphasis" type="button">
                                            <span>Data</span>
                                            <IconsClock class="action-icon"/>
                                        </div>
                                        <div v-show="dropdownStates[1]" class="sub-dropdown bg-light position-absolute">
                                            <ul @click.stop class="list-group">
                                                <li @click="applyFilter(requestsCache.inProgressRequests,'date', 'asc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">asc</span>
                                                    <IconsUpArrow width="18" height="18"/>
                                                </li>
                                                <li @click="applyFilter(requestsCache.inProgressRequests,'date', 'desc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">dec</span>
                                                    <IconsBottomArrow width="18" height="18"/>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li type=button class="dropdown-item fw-bold text-dark-emphasis" 
                                         @click="ClicktoggleDropdown(2)"  @mouseover="toggleDropdown(2)" @mouseout="toggleDropdown(2)">
                                        <div class="d-flex justify-content-between align-items-center fw-bold text-dark-emphasis" type="button">
                                            <span>Nome</span>
                                            <IconsNameSort class="action-icon"/>
                                        </div>
                                        <div v-show="dropdownStates[2]" class="sub-dropdown bg-light position-absolute mb-5">
                                            <ul @click.stop class="list-group">
                                                <li @click="applyFilter(requestsCache.inProgressRequests,'name', 'asc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">asc</span>
                                                    <IconsUpArrow width="18" height="18"/>
                                                </li>
                                                <li @click="applyFilter(requestsCache.inProgressRequests,'name', 'desc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">dec</span>
                                                    <IconsBottomArrow width="18" height="18"/>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center cards-box me-0">
                            <div :class="{'d-flex': changeView, 'd-block': !changeView, 'width-adjust': changeView}" class="requests-view">
                                    <CardsCard :class="{'card-width-adjust': changeView}" 
                                    v-if="requestsCache.inProgressRequests.length > 0" 
                                    v-for="(request, index) in requestsCache.inProgressRequests.slice(0, requestsLoaded[0])" 
                                    :key="index" class="col-6 card-container mb-3 mx-1 bg-light-background">
                                        <template v-slot:header>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <p class="justify-content-start mb-3 fw-bold">
                                                    Solicitação
                                                </p>
                                            </div>
                                            <button type="button" data-bs-toggle="modal" data-bs-target="#actionConfirm" @click="requestToCancel = {id: request.id, index: index}" class="position-absolute response-toggle btn btn-dark-alert fw-bold px-2 pb-2 rounded-0 d-flex align-items-center">
                                                Cancelar
                                                <IconsClose height="21" width="22"/>
                                            </button>
                                        </template>
                                        <template v-slot:default>
                                            <div class="row cards-row">
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Item solicitado </label>
                                                    <div class="overflow-x-auto">
                                                        <input readonly class="form-control overflow-x-auto" :value="request.item.name"> 
                                                    </div>
                                                </div>
                                                <div class="col-6 me-0">
                                                    <div class="mb-3"> 
                                                        <label class="form-label fw-semibold"> Quantidade Solicitada </label>
                                                        <input readonly class="form-control" :value="request.quantityRequested">
                                                    </div>		
                                                    <div class="mb-3"> 
                                                        <label class="form-label fw-semibold"> Código Sipac </label>
                                                        <input readonly class="form-control" :value="request.item.sipacCode ? request.item.sipacCode : 'nenhum'"> 
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <div class="mb-3"> 
                                                        <label class="form-label fw-semibold"> Quantidade Disponível </label>
                                                        <input readonly class="form-control" :value="request.item.quantity"> 
                                                    </div>		
                                                    <div class="mb-0"> 
                                                        <label class="form-label fw-semibold"> Tipo </label>
                                                        <input readonly class="form-control" :value="request.item.type">
                                                    </div>	
                                                </div>
                                                <div class="mb-0"> 
                                                    <label class="form-label fw-semibold"> Mensagem </label>
                                                    <div class="d-flex">
                                                        <textarea readonly class="form-control"> {{ request.description }} </textarea>
                                                    </div>
                                                </div>	
                                            </div>
                                        </template>
                                        <template v-slot:footer>
                                            <div class="d-flex align-items-center fw-bold text-dark-emphasis justify-content-end">
                                                Solicitação feita em: {{ request.creationDate.slice(0,19) }}
                                            </div>
                                        </template>
                                    </CardsCard>
                                    <div :class="{'d-flex align-items-center m-2': changeView}" v-if="requestsLoaded[0] < requestsCache.inProgressRequests.length">
                                            <div class="d-flex justify-content-center">
                                                <button title="Carregar Mais" @click="requestsLoaded[0] += 3" class="btn btn-dark-success text-light text-nowrap fw-bold m-2" style="padding: 3px;">
                                                    <IconsThinPlus width="30" height="30"/>
                                                </button>
                                            </div>
                                    </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-center">
                            <div v-if="requestsCache.inProgressRequests.length === 0" class="d-flex justify-content-center empty-text mt-5 pt-2 opacity-75 mx-0">
                                <h5 class="fw-bold text-nowrap">
                                    Nenhuma solicitação encontrada
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="request-container text-dark-emphasis rounded-2 mx-2" :class="{'mt-4': changeView}">
                    <div :class="{'box-bg-success': requestsCache.acceptedRequests.length > 0}" class="requests-box pt-0 mt-3">
                        <div  :class="{'border-dark-success border-bottom': requestsCache.acceptedRequests.length > 0}"  class="d-flex align-items-center justify-content-between px-2">
                            <div class="d-flex align-items-center py-2">
                                <IconsConfirm class="text-light-success me-2" width="30" height="30"/>
                                <h5 class="m-0 p-0">Aceitas
                                </h5>
                                <span>({{requestsCache.acceptedRequests.length}})</span>
                            </div>
                            <div class="dropdown" @click.stop>
                                  <button title="Filtro" class="btn btn-transparent px-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    <IconsBarFilter class="text-dark-emphasis me-1" width="25" height="25" />
                                  </button>
                                  <div class="dropdown-menu p-0">
                                    <li type=button class="dropdown-item fw-bold text-dark-emphasis" 
                                         @click="ClicktoggleDropdown(1)"  @mouseover="toggleDropdown(1)" @mouseout="toggleDropdown(1)">
                                        <div class="d-flex justify-content-between align-items-center fw-bold text-dark-emphasis" type="button">
                                            <span>Data</span>
                                            <IconsClock class="action-icon"/>
                                        </div>
                                        <div v-show="dropdownStates[1]" class="sub-dropdown bg-light position-absolute">
                                            <ul @click.stop class="list-group">
                                                <li @click="applyFilter(requestsCache.acceptedRequests,'date', 'asc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">asc</span>
                                                    <IconsUpArrow width="18" height="18"/>
                                                </li>
                                                <li @click="applyFilter(requestsCache.acceptedRequests,'date', 'desc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">dec</span>
                                                    <IconsBottomArrow width="18" height="18"/>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li type=button class="dropdown-item fw-bold text-dark-emphasis" 
                                         @click="ClicktoggleDropdown(2)"  @mouseover="toggleDropdown(2)" @mouseout="toggleDropdown(2)">
                                        <div class="d-flex justify-content-between align-items-center fw-bold text-dark-emphasis" type="button">
                                            <span>Nome</span>
                                            <IconsNameSort class="action-icon"/>
                                        </div>
                                        <div v-show="dropdownStates[2]" class="sub-dropdown bg-light position-absolute mb-5">
                                            <ul @click.stop class="list-group">
                                                <li @click="applyFilter(requestsCache.acceptedRequests,'name', 'asc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">asc</span>
                                                    <IconsUpArrow width="18" height="18"/>
                                                </li>
                                                <li @click="applyFilter(requestsCache.acceptedRequests,'name', 'desc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">dec</span>
                                                    <IconsBottomArrow width="18" height="18"/>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center cards-box me-0">
                            <div :class="{'d-flex': changeView, 'd-block': !changeView, 'width-adjust': changeView}" class="requests-view">
                                <CardsCard :class="{'card-width-adjust': changeView}" 
                                v-if="requestsCache.acceptedRequests.length > 0"
                                 v-for="(request, index) in requestsCache.acceptedRequests.slice(0, requestsLoaded[1])" 
                                 :key="index" class="col-6 card-container mb-3 mx-1 bg-light-background"
                                 >
                                    <template v-slot:header>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <p class="justify-content-start mb-3 fw-bold">
                                                Solicitação
                                            </p>
                                            <button :title="isResponseCard[0][index] ? 'Ver Solicitação' : 'Ver resposta da solicitação'"   @click="isResponseCard[0][index] = !isResponseCard[0][index]" class="d-flex align-items-center justify-content-center pb-2 response-toggle hide-toggle position-absolute text-light btn btn-secondary rounded-0 text-nowrap fw-bold">
                                                <IconsExit v-if="!isResponseCard[0][index]" class="mt-1" width="20" height="20" />
                                                <IconsRequest v-else class="mt-1" width="20" height="20" />
                                            </button>
                                        </div>
                                    </template>
                                    <template v-slot:default>
                                        <div class="row cards-row">
                                            <div class="mb-3"> 
                                                <label class="form-label fw-semibold"> Item solicitado </label>
                                                <div class="overflow-x-auto">
                                                    <input readonly class="form-control overflow-x-auto" :value="request.item.name"> 
                                                </div>
                                            </div>
                                            <div class="col-6 me-0">
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Quantidade Solicitada </label>
                                                    <input readonly class="form-control" :value="request.quantityRequested">
                                                </div>		
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Código Sipac </label>
                                                    <input readonly class="form-control" :value="request.item.sipacCode ? request.item.sipacCode : 'nenhum'">
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Quantidade Disponível </label>
                                                    <input readonly class="form-control" :value="request.item.quantity"> 
                                                </div>		
                                                <div class="mb-0"> 
                                                    <label class="form-label fw-semibold"> Tipo </label>
                                                    <input readonly class="form-control" :value="request.item.type">
                                                </div>	
                                            </div>
                                            <div class="mb-0"> 
                                                <label class="form-label fw-semibold"> Mensagem </label>
                                                <div class="d-flex">
                                                    <textarea readonly class="form-control"> {{ request.description }} </textarea>
                                                </div>
                                            </div>	
                                        </div>
                                        <div  :style="{left: isResponseCard[0][index] ? '0px' : '100%', transition: 'left 0.9s ease-in-out'}" class="response-card position-absolute bg-light">
                                            <div  class="row cards-row mx-0 text-nowrap">
                                                <div class="d-flex bg-warning text-light-emphasis justify-content-between align-items-center">
                                                    <p class="justify-content-start my-2 fw-bold">
                                                        Resposta da Solicitação
                                                    </p>
                                                </div>
                                                <div class="my-3"> 
                                                    <label class="form-label fw-semibold"> Resposta a Solicitação </label>
                                                    <input readonly class="form-control" :value="request.status"> 
                                                </div>	
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Horário da Resposta </label>
                                                    <div class="overflow-x-auto">
                                                        <input readonly class="form-control overflow-x-auto" :value="request.updatedDate.slice(0, 19)"> 
                                                    </div>
                                                </div>
                                                <div class="mb-0"> 
                                                    <label class="form-label fw-semibold"> Mensagem da Administração </label>
                                                    <div class="d-flex ">
                                                        <textarea readonly class="form-control response-textarea"> {{ request.adminComment ? request.adminComment : 'nenhuma' }} </textarea>
                                                    </div>
                                                </div>	
                                            </div>
                                        </div>
                                    </template>
                                    <template v-slot:footer>
                                        <div class="d-flex align-items-center fw-bold text-dark-emphasis justify-content-end">
                                            Solicitação feita em: {{ request.creationDate.slice(0,19) }}
                                            <!--<button class="btn btn-secondary fw-bold px-2 py-1">Ver resposta</button>-->
                                        </div>
                                    </template>
                                </CardsCard>
                                <div :class="{'d-flex align-items-center m-2': changeView}" v-if="requestsLoaded[1] < requestsCache.acceptedRequests.length">
                                    <div class="d-flex justify-content-center">
                                        <button title="Carregar Mais" @click="requestsLoaded[1] += 3" class="btn btn-dark-success text-light text-nowrap fw-bold m-2" style="padding: 3px;">
                                            <IconsThinPlus width="30" height="30"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-center">
                            <div v-if="requestsCache.acceptedRequests.length === 0" class="d-flex justify-content-center empty-text mt-5 pt-2 opacity-75 mx-0">
                                <h5 class="fw-bold text-nowrap">
                                    Nenhuma solicitação encontrada
                                </h5>
                            </div>
                        </div>
                    </div>    
                </div>
                <div class="request-container text-dark-emphasis rounded-2 mx-2" :class="{'mt-4 ': changeView}">
                <div :class="{'box-bg-alert': requestsCache.rejectedRequests.length > 0}" class="requests-box mt-3 pt-0">
                        <div :class="{'border-dark-alert border-bottom': requestsCache.rejectedRequests.length > 0}"  class="d-flex align-items-center justify-content-between px-2">
                            <div class="d-flex align-items-center py-2">
                                <IconsClose class="text-dark-alert me-2" width="30" height="30"/>
                                <h5 class="m-0 p-0">Recusadas
                                </h5>
                                <span>({{ requestsCache.rejectedRequests.length }})</span>
                            </div>
                            <div class="dropdown" @click.stop>
                                  <button class="btn btn-transparent px-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    <IconsBarFilter class="text-dark-emphasis me-1" title="Filtro" width="25" height="25" />
                                  </button>
                                  <div class="dropdown-menu p-0">
                                    <li type=button class="dropdown-item fw-bold text-dark-emphasis"
                                         @click="ClicktoggleDropdown(1)"  @mouseover="toggleDropdown(1)" @mouseout="toggleDropdown(1)">
                                        <div class="d-flex justify-content-between align-items-center fw-bold text-dark-emphasis" type="button">
                                            <span>Data</span>
                                            <IconsClock class="action-icon"/>
                                        </div>
                                        <div v-show="dropdownStates[1]" class="sub-dropdown bg-light position-absolute">
                                            <ul @click.stop class="list-group">
                                                <li @click="applyFilter(requestsCache.rejectedRequests,'date', 'asc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">asc</span>
                                                    <IconsUpArrow width="18" height="18"/>
                                                </li>
                                                <li @click="applyFilter(requestsCache.rejectedRequests,'date', 'desc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">dec</span>
                                                    <IconsBottomArrow width="18" height="18"/>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li type=button class="dropdown-item fw-bold text-dark-emphasis" 
                                         @click="ClicktoggleDropdown(2)"  @mouseover="toggleDropdown(2)" @mouseout="toggleDropdown(2)">
                                        <div class="d-flex justify-content-between align-items-center fw-bold text-dark-emphasis" type="button">
                                            <span>Nome</span>
                                            <IconsNameSort class="action-icon"/>
                                        </div>
                                        <div v-show="dropdownStates[2]" class="sub-dropdown bg-light position-absolute mb-5">
                                            <ul @click.stop class="list-group">
                                                <li @click="applyFilter(requestsCache.rejectedRequests,'name', 'asc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">asc</span>
                                                    <IconsUpArrow width="18" height="18"/>
                                                </li>
                                                <li @click="applyFilter(requestsCache.rejectedRequests,'name', 'desc')" class="sub-dropdown-item p-0 list-group-item d-flex align-items-center justify-content-between">
                                                    <span class="ps-1">dec</span>
                                                    <IconsBottomArrow width="18" height="18"/>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center cards-box me-0">
                            <div :class="{'d-flex': changeView, 'd-block': !changeView, 'width-adjust': changeView}" class="requests-view">
                                <CardsCard :class="{'card-width-adjust': changeView}" v-if="requestsCache.rejectedRequests.length > 0" 
                                    v-for="(request, index) in requestsCache.rejectedRequests.slice(0, requestsLoaded[2])" :key="index" 
                                    class="col-6 card-container mb-3 mx-1 bg-light-background">
                                    <template v-slot:header>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <p class="justify-content-start mb-3 fw-bold">
                                                Solicitação
                                            </p>
                                        <button :title="isResponseCard[1][index] ? 'Ver Solicitação' : 'Ver resposta da solicitação'"   @click="isResponseCard[1][index] = !isResponseCard[1][index]" class="d-flex align-items-center justify-content-center pb-2 response-toggle hide-toggle position-absolute text-light btn btn-secondary rounded-0 text-nowrap fw-bold">
                                                <IconsExit v-if="!isResponseCard[1][index]" class="mt-1" width="20" height="20" />
                                                <IconsRequest v-else class="mt-1" width="20" height="20" />
                                           </button>
                                        </div>
                                    </template>
                                    <template v-slot:default>
                                        <div class="row cards-row">
                                            <div class="mb-3"> 
                                                <label class="form-label fw-semibold"> Item solicitado </label>
                                                <div class="overflow-x-auto">
                                                    <input readonly class="form-control overflow-x-auto" :value="request.item.name"> 
                                                </div>
                                            </div>
                                            <div class="col-6 me-0">
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Quantidade Solicitada </label>
                                                    <input readonly class="form-control" :value="request.quantityRequested">
                                                </div>		
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Código Sipac </label>
                                                    <input readonly class="form-control" :value="request.item.sipacCode ? request.item.sipacCode : 'nenhum'">
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Quantidade Disponível </label>
                                                    <input readonly class="form-control" :value="request.item.quantity"> 
                                                </div>		
                                                <div class="mb-0"> 
                                                    <label class="form-label fw-semibold"> Tipo </label>
                                                    <input readonly class="form-control" :value="request.item.type">
                                                </div>	
                                            </div>
                                            <div class="mb-0"> 
                                                <label class="form-label fw-semibold"> Mensagem </label>
                                                <div class="d-flex">
                                                    <textarea readonly class="form-control"> {{ request.description }} </textarea>
                                                </div>
                                            </div>	
                                        </div>
                                        <div  :style="{left: isResponseCard[1][index] ? '0px' : '100%', transition: 'left 0.9s ease-in-out'}" class="response-card position-absolute bg-light">
                                            <div  class="row cards-row mx-0 text-nowrap">
                                                <div class="d-flex bg-warning text-light-emphasis justify-content-between align-items-center">
                                                    <p class="justify-content-start my-2 fw-bold">
                                                        Resposta da Solicitação
                                                    </p>
                                                </div>
                                                <div class="mb-3 mt-3"> 
                                                    <label class="form-label fw-semibold"> Horário da Resposta </label>
                                                    <div class="overflow-x-auto">
                                                        <input readonly class="form-control overflow-x-auto" :value="request.updatedDate.slice(0, 19)"> 
                                                    </div>
                                                </div>
                                                <div class="mb-3"> 
                                                    <label class="form-label fw-semibold"> Resposta a Solicitação </label>
                                                    <input readonly class="form-control" :value="request.status"> 
                                                </div>	
                                                <div class="mb-0"> 
                                                    <label class="form-label fw-semibold"> Mensagem da Administração </label>
                                                    <div class="d-flex ">
                                                        <textarea readonly class="form-control response-textarea"> {{ request.adminComment ? request.adminComment : 'nenhuma' }} </textarea>
                                                    </div>
                                                </div>	
                                            </div>
                                        </div>
                                    </template>
                                    <template v-slot:footer>
                                        <div class="d-flex align-items-center justify-content-center fw-bold text-dark-emphasis ">
                                            Solicitação feita em: {{ request.creationDate.slice(0,19) }}
                                            <!--<button class="btn btn-secondary fw-bold px-2 py-1">Ver resposta</button>-->
                                        </div>
                                    </template>
                                </CardsCard>
                            <div :class="{'d-flex align-items-center m-2': changeView}" v-if="requestsLoaded[2] < requestsCache.rejectedRequests.length">
                                <div class="d-flex justify-content-center">
                                    <button title="Carregar Mais" @click="requestsLoaded[2] += 3" class="btn btn-dark-success text-light text-nowrap fw-bold m-2" style="padding: 3px;">
                                        <IconsThinPlus width="30" height="30"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <div v-if="requestsCache.rejectedRequests.length === 0" class="d-flex justify-content-center empty-text mt-5 pt-2 opacity-75 mx-0">
                            <h5 class="fw-bold text-nowrap">
                                Nenhuma solicitação encontrada
                            </h5>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import { getRequestByUser } from '../../services/requests/requestsGET';
import { useUser } from '../../stores/user';
import { requestCancel, requestDecline } from '../../services/requests/requestsPATCH';
import { usePopupStore } from '../../stores/popup';
import { useStorageStore } from '../../stores/storage';
import { useSettingsStore } from '../../stores/settings';

definePageMeta({
    layout: 'client'
})

const userStore = useUser();
const popUpStore = usePopupStore();
const store = useStorageStore();
const settingsStore = useSettingsStore();

const isResponseCard = ref([[], []]);
const requestToCancel = ref({
    id: null,
    index: null
});

const dropdownStates = ref([false, false, false, false]);
const toggleDropdown = (dropdown_id) => {
    if(!settingsStore.isMobile){
        dropdownStates.value[dropdown_id-1] = false
        dropdownStates.value[dropdown_id] = !dropdownStates.value[dropdown_id]
        dropdownStates.value[dropdown_id+1] = false
    }
}
const ClicktoggleDropdown = (dropdown_id) => {
    if(settingsStore.isMobile){
        clearDropdown();
        dropdownStates.value[dropdown_id] = !dropdownStates.value[dropdown_id]
    }
}
const clearDropdown = () => {
    dropdownStates.value = [false, false, false, false]
}


const requestsCache = ref({
    acceptedRequests: [],
    inProgressRequests: [],
    rejectedRequests: []
})
const totalPages = ref(0);
const totalElements = ref(0);
const pagination = ref(0);
const requestsLoaded = ref([3, 3, 3]);
const searchInput = ref('');

const filter = ref({ type: '', order: '' });

const changeView = ref(false);

const applyFilter = (requests, type, order) => {
    if(settingsStore.isMobile){
        clearDropdown();
    }
    filter.value.type = type;
    filter.value.order = order;
    sortRequests(requests, filter.value.type, filter.value.order);
};
const sortRequests = (requests, type, order) => {
    if (type === 'date') {
        requests.sort((a, b) => {
            const dateA = new Date(a.creationDate);
            const dateB = new Date(b.creationDate);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
    } else if (type === 'name') {
        requests.sort((a, b) => {
            const nameA = a.item.name.toLowerCase();
            const nameB = b.item.name.toLowerCase();
            if (nameA < nameB) return order === 'asc' ? -1 : 1;
            if (nameA > nameB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }
};
const requestsReq = async () => {
    const res = await getRequestByUser(userStore, userStore.id, 0);
    res.content.map((request) => {
        switch(request.status){
            case 'PENDENTE':
                requestsCache.value.inProgressRequests.push(request);
                break;
            case 'ACEITO':
                requestsCache.value.acceptedRequests.push(request);
                break;
            case 'RECUSADO':
                requestsCache.value.rejectedRequests.push(request);
                break;
        }
    })
    totalElements.value = res.totalElements;
    totalPages.value = res.totalPages;
    pagination.value++;
    if(totalPages.value > 1){
        for(let i = 1; i < totalPages.value; i++){
            const res = await getRequestByUser(userStore, userStore.id, i);
            res.content.map((request) => {
            switch(request.status){
                case 'PENDENTE':
                    requestsCache.value.inProgressRequests.push(request);
                    break;
                case 'ACEITO':
                    requestsCache.value.acceptedRequests.push(request);
                    break;
                case 'RECUSADO':
                    requestsCache.value.rejectedRequests.push(request);
                    break;
                }
            })
        }
    } 

}
const requestsSearchreq = async (searchQuery) => {
    const res = await getRequestByUser(userStore, userStore.id, 0);
    res.content.map((request) => {
        switch(request.status){
            case 'PENDENTE':
                if(request.item.name.includes(searchQuery)){
                    requestsCache.value.inProgressRequests.push(request);
                }
                break;
            case 'ACEITO':
                if(request.item.name.includes(searchQuery)){
                    requestsCache.value.acceptedRequests.push(request);
                }
                break;
            case 'RECUSADO':
                if(request.item.name.includes(searchQuery)){
                    requestsCache.value.rejectedRequests.push(request);
                }
                break;
        }
    })
    totalPages.value = res.totalPages;
    pagination.value++;
    if(totalPages.value > 1){
        for(let i = 1; i < totalPages.value; i++){
            const res = await getRequestByUser(userStore, userStore.id, pagination.value);
            res.content.map((request) => {
            switch(request.status){
                case 'PENDENTE':
                    if(request.item.name.includes(searchQuery)){
                        requestsCache.value.inProgressRequests.push(request);
                    }
                    break;
                case 'ACEITO':
                    if(request.item.name.includes(searchQuery)){
                        requestsCache.value.acceptedRequests.push(request);
                    }
                    break;
                case 'RECUSADO':
                    if(request.item.name.includes(searchQuery)){
                        requestsCache.value.rejectedRequests.push(request);
                    }
                    break;
            }
        })
        }
    } 
}

const loadRequests = ref(true);
let typingTimeout = null;
const requestsLoad = computed(() => {
    if(searchInput.value !== ''){
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            pagination.value = 0;
            requestsCache.value = {acceptedRequests: [], inProgressRequests: [], rejectedRequests: []};
            requestsSearchreq(searchInput.value);
        }, 1000);
        return 1;
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        pagination.value = 0;
        requestsCache.value = {acceptedRequests: [], inProgressRequests: [], rejectedRequests: []};
        requestsReq();
    }, 500);
    return 1;
    
})


const cancelRequest = async (requestId, index) => {
    try{
        const res = await requestCancel(userStore, requestId);
        popUpStore.throwPopup("Solicitação cancelada com sucesso", 'blue');
        requestsCache.value.inProgressRequests.splice(index, 1);
        
    } catch(err){
        popUpStore.throwPopup("ERRO: Algum problema ocorreu, contate o suporte", 'red')
    }

}
settingsStore.isMobile ? changeView.value = true : null;
const mobileView = ref(false);
const resizeBox = () => {
    if(window.innerWidth <= 1115){
        changeView.value = true;
        mobileView.value = changeView.value;
    }else{
        mobileView.value = false;
    }
}
onMounted(() => {   
    if(store.isMobile){
        changeView.value = true;
        mobileView.value = changeView.value;
    }
    loadRequests.value = false;
    window.addEventListener('resize', resizeBox);
})
</script>

<style scoped>
.card-container {
    scrollbar-width:none;
    scrollbar-color: transparent; /* Fundo branco no Firefox */
}
.cards-box {
    scrollbar-color: rgba(51, 51, 51, 0.5) transparent !important; 
    scrollbar-width: thin !important;
}

*::-moz-scrollbar-thumb:hover {
    background: transparent;
}
.resizeBox{
    display: flex !important;
}
.container-fluid{
    padding: 80px 0 100px 0;
}
.requests-container{
    box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.5);
    border: 1px #D9D9D9 solid;
    border-radius: 0px 10px 10px 10px;
    border-top: solid 1px #ccc;
}
.request-container{
    width: 99%; 
}
.sub-dropdown-item{
    border: 0px;
}
.card-container{
    overflow-x: scroll;
    margin-top: 4px;
    border-radius: 10px;
    width: 98.4%;
    transition: box-shadow 0.2s ease-in-out, transform 0.1s ease-in-out;
}
.requests-box{
    border: 1px solid rgb(0, 0, 0, 0.2);
    border-radius: 10px;
    z-index: 1000 !important;
}
.cards-box{
    overflow-x: scroll;
}
.table-box-title{
    margin-left: 8px;
    margin-top: -30px;
    padding: 9px 0px 0px 0px;
    font-weight: 400;
    color: rgb(51,51,51, 0.8);
}
.box-title{
    border-radius: 10px 10px 0px 0px;
}
.box-title-text{
    font-size: 20px;
}
.border-warning{
    border-color: rgb(181, 147, 0) !important;
    box-shadow: inset 0px -12px 15px -10px rgb(181, 147, 0, 0.5);
}
.border-dark-alert{
    border-color: rgb(183, 28, 28, 1) !important;
    box-shadow: inset 0px -12px 15px -10px rgb(183, 28, 28, 0.5);
}
.border-dark-success{
    border-color: rgb(51, 158, 56, 1) !important;
    box-shadow: inset 0px -12px 15px -10px rgb(51, 158, 56, 0.5);
}
.box-bg-warning{
    background-color: rgba(254, 235, 30, 0.2);
}
.box-bg-success{
    background-color: rgba(51, 158, 56, 0.2)
}
.box-bg-alert{
    background-color: rgba(183, 28, 28, 0.2);
}
.dropdown-menu{
    min-width: 130px;
    width: 60px !important;
    margin-left: -100px !important;
}
.list-group-item{
    color: #494b50;
    height: 34px;
}
.list-group-item:hover{
    background-color: #FED51E;
}
.sub-dropdown{
    border-radius: 12px;
    border: 1px #D9D9D9 solid;
    position: absolute;
    left: -54px !important;
    width: 65px;
    margin-top: -45px;
    min-width: 40px;
}
.response-container{
    box-shadow: 0px 0px 10px 1px rgb(0, 0, 0, 0.3);
    border: solid 1px rgb(0, 0, 0, 0.3);
    display: none;
    width: 0px;
    top: 342px;
    position: absolute;
}
.requests-search{
    border-bottom: solid 1px rgb(51, 51, 51, 0.2)
}
.requests-comp{
    background-color: rgb(242, 242, 242);
    border: solid 1px rgb(0, 0, 0, 0.2);
}
.resquest-time{
	font-size: 15px;
	opacity: 80%;
}
.sub-catalog{
    border-radius: 10px;
    margin-top: -14px;
    margin-bottom: 60px !important;
    padding-top: 10px;
    padding-bottom: 20px;
    margin-right: 10%;
    margin-left: 10%;
    border: 1px #D9D9D9 solid;
    box-shadow: 3px 3px 13px 0px rgb(0, 0, 0, 0.5);
}
.sub-catalog-text{
    padding: 0px 10px 0px 10px;
    font-size: 15px;
}
.response-card{
    overflow: hidden;
    right: 0px;
    top: 0px;
    height: 475px;
    transition: width 0.5s ease-in-out;
    box-shadow: inset 0px 0px 100px 1px rgba(0, 0, 0, 0.1)
}
.response-toggle{
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    right: 0px;
    top: 0px;
    z-index: 100;
    transition: top 0.3s ease-in-out;
}
h6{
    font-weight: 400;
    color: rgb(51,51,51, 0.8);
}
p{
    padding: 0;
    margin: 0;
}
.table-searchbar{
    border: none;
    border-radius: 10px 10px 10px 10px;
    top: 70px;
}
.searchbar{
    border-radius: 8px 0px 0px 8px;
    font-weight: 500;
}
.action-btn{
    font-weight: 500;
    font-size: 15px;
    border: none;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 1px ridge #1F69B1;
    margin-right: 10px;
    box-shadow: inset 0px -12px 15px -18px rgb(11, 59, 105, 0.7);
    color: rgb(0, 0, 0, 0.7); 
    transition: background-color 0.2s ease-in-out;
}
.action-btn:hover{
    color: white !important; 
    background-color: #0B3B69; 
}
.table-searchbar{
    border: none;
    border-bottom: solid 1px #1F69B1;
    border-radius: 10px 10px 0px 0px;
    box-shadow: inset 0px -12px 15px -18px rgb(11, 59, 105, 0.7);
    color: rgb(0, 0, 0, 0.7); 
    transition: box-shadow 0.3s ease;
}
.empty-text{
    width: 300px;
    height: 100px;
    margin-left: 60px;
}
.table-actions{
    width: 100%;
}
.table-searchbar:hover {
    box-shadow: inset 0px -12px 15px -18px rgba(11, 59, 105, 0.7), 0px 0px 7px 0px rgba(11, 59, 105, 0.7);
}
.table-searchbar:hover,
.table-searchbar:focus-within {
    box-shadow: inset 0px -12px 15px -18px rgba(11, 59, 105, 0.7), 0px 0px 7px rgba(11, 59, 105, 0.7); /* Sombra interna na parte inferior e contorno ao redor */
}
.searchbar{
    border: none;
    border-radius: 0;
    font-weight: 500;
}
.search-glass{
    padding-left: 0px;
}

.width-adjust{
    width: 100%;
}
.card-width-adjust{
    width: 30%;
}
.response-textarea{
    padding-bottom: 30%;
}
@media screen and (max-width: 1115px){
    .card-width-adjust{
        width: 48%;
    }   
    .empty-text{
        justify-content: center !important;
    }
}
@media screen and (max-width: 670px){
    .requests-view{
        margin-right: 8px;
    }
    .cards-box{
        margin-right: 5px;
    }
    .box-title-text{
        font-size: 18px;
    }
    .actions{
        margin-top: 0px !important;
    }
    .card-width-adjust{
        width: 80%;
    }
    .table-searchbar{  
        width: 140px;
    }
}
@media screen and (max-width: 450px){
    .box-title-text{
        font-size: 14px;
    }
    .actions{
        margin-top: -1px !important;
    }
    .table-searchbar{
        margin-top: 2px !important;  
        width: 135px;
    }
    .searchbar{
        font-size: 14px;
    }
    .card-width-adjust{
        width: 100%;
    }
}
@media screen and (max-width: 370px){
    .box-title-text{
        font-size: 14px;
    }
    .actions{
        margin-top: -1px !important;
    }
    .table-searchbar{
        margin-top: 2px !important;  
        width: 115px;
    }
    .searchbar{
        font-size: 13px;
    }
    .card-width-adjust{
        width: 100%;
    }
}
</style>