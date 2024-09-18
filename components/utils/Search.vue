<template>
	<div class="modal fade" tabindex="-1" id="neiSearchModal"  aria-labelledby="neiSearchModal" aria-hidden="true" data-bs-backdrop="true" @keyup.down="SearchDown()" @keyup.up="SearchUp()" @keyup.enter="Navigate()"> 
		<div class="modal-dialog modal-dialog-start modal-dialog-scrollable"> 
			<div class="modal-content"> 
				<div class="modal-header">
            <div class="search-bar d-flex mx-1">
                <div class="ms-0 NavigateToItem d-flex align-items-center" role="search">
                  <label class="search-label">
                    <IconsSearchGlass class="search-icon p-1" width="40px" height="41px"/>
                  </label>
                  <input class="form-control outline-warning p-0" v-model="searchQuery" @input="handleSearch" type="search"  placeholder="Pesquisar" autocomplete="off" autocorrect="off" autocapitalize="none" enterkeyhint="search" spellcheck="false" autofocus="true">
                </div>
            </div>	
				</div>
				<div class="modal-body">
            <ul v-if="showResults && searchQuery !== '' && searchResults.length != 0" class="list-group">
                <li v-for="result in searchResults" :key="result.id" @click="NavigateToItem(result.id)" class="searchResult list-group-item list-group-item-action d-flex justify-content-between align-items-center" tabindex="0"> 
                  {{ result.name }} 
                  <span class="badge bg-primary rounded-pill" v-if="result"> {{ result.quantity }} </span>
                </li>
              </ul>
              <div class="d-flex justify-content-center align-items-center py-3" v-else-if="!showResults && searchQuery !== ''">
              <LoadersComponentLoading :isLoading="true" />
            </div>
            <p class="d-flex justify-content-center align-items-center pt-3" v-else-if=" searchQuery !== '' && searchResults.length === 0">
            Nenhum Resultado Encontrado
            </p>
            
            <ul v-if="searchQuery.length === 0 && searchStore.recentSearch.length  > 0" class="list-group">
              <a class="text-decoration-none" v-for="result in searchStore.recentSearch" :key="result.id">
                <li @click="NavigateToItem(result.id)" class="searchResult list-group-item list-group-item-action d-flex justify-content-between align-items-center" tabindex="0"> 
                  {{ result.name }} 
                  <span class="badge bg-primary rounded-pill" v-if="result"> {{ result.quantity }} </span>
                </li>
              </a>
            </ul> 
            
             <p class="d-flex justify-content-center align-items-center pt-3" v-if="searchStore.recentSearch.length === 0 && searchQuery.length === 0">
              Sem Pesquisas Recentes
            </p>
            
				</div>
				<div v-if="!settingsStore.isMobile" class="modal-footer">
            <p class="fs-6"><IconsEnter class="bg-primary text-light" style="border-radius: 3px;"/> para selecionar <IconsBottomArrow class="bg-primary text-light" style="border-radius: 3px;"/> <IconsUpArrow class="bg-primary text-light" style="border-radius: 3px;"/> para navegar e <span class="bg-primary text-light" style="border-radius: 3px;">esc</span> para fechar</p>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import { useSearch } from '../../stores/search.ts';
import { useStorageStore } from '../../stores/storage.ts';
import { getItems } from '../../services/items/itemsGET.ts';
import { useUser } from '../../stores/user.ts';
import { useSettingsStore } from '../../stores/settings.ts';
import { navigateTo } from 'nuxt/app';

export default {
  data() {
    return {
      searchQuery: "",
      searchCount: 0,
      searchResults: [],
      showResults: false,
      pagination: 0,
      totalPages: 0,
      searchIndex: 0,
      typingTimeout: null
    };
  },
  methods: {
    NavigateToItem(id) {
      this.searchStore.itemSearch = { searching: true, itemId: id }
      let selectedItem;

      if (this.searchResults.length > 0) {
          selectedItem = this.searchResults.find(item => item.id === id);
      } else {
        selectedItem = this.searchStore.recentSearch.find(item => item.id === id);
      }

      this.addItemToRecentSearch(selectedItem);
      navigateTo('/nei/catalogo')
    },
    SearchDown() {
      let searchResult = document.getElementsByClassName("searchResult");
      if ((this.searchCount) === (searchResult.length)) {
        this.searchCount = 1;
      } else {
        this.searchCount++;
      }
      searchResult[this.searchCount - 1].focus();
    },
    SearchUp() {
      let searchResult = document.getElementsByClassName("searchResult");
      if (this.searchCount <= 1) {
        this.searchCount = (searchResult.length);
      } else {
        this.searchCount--;
      }
      searchResult[this.searchCount - 1].focus();
    },
    Navigate() {
        let searchResult = document.getElementsByClassName("searchResult");
        searchResult[this.searchCount - 1].click();
    },
    isItemInArray(array, item) {
      const index = array.findIndex(
          (element) =>
              element.id === item.id
      )

      return {
        isInside: index > -1,
        index: index, 
      } 
    },
    addItemToRecentSearch(res) {
      const item = {
          id: res.id,
          name: res.name,
          quantity: res.quantity,
      };
      const { isInside, index } = this.isItemInArray(this.searchStore.recentSearch, item);

      if (isInside) {
        this.searchStore.recentSearch.splice(index, 1);
      }

      this.searchStore.recentSearch.unshift(item);

      if (this.searchStore.recentSearch.length > 5) {
        this.searchStore.recentSearch.pop();
      }
    },
    async handleSearch(e) {
      this.searchQuery = e.target.value;
      this.showResults = false;
      this.searchResults = [];
      this.pagination = 0;
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(async () => {
        await this.fetchSearchResults();
        this.showResults = true;
      }, 1000);
    },
    async fetchSearchResults() {
      while (this.searchResults.length < 20 && this.pagination < this.totalPages) {
          const res = await getItems(this.userStore, this.pagination, 'id,desc');
          this.totalPages = res.totalPages;
          this.store.items.push(res.content);
          res.content.map((item) => {
            const normalizedItemName = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const normalizedSearchQuery = this.searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
            if (normalizedItemName.includes(normalizedSearchQuery)) {
              this.searchResults.push(item);
            }
          });
          this.pagination++;
        }
    },
    async itemsReq() {
      const res = await getItems(this.userStore, this.pagination, 'id,desc');
      this.totalPages = res.totalPages;
      this.store.items.push(res.content);
      this.pagination++;
    },
  },
  mounted() {
    this.itemsReq();
  },
  async setup() {
    const settingsStore = useSettingsStore();
    const userStore = useUser();
    const searchStore = useSearch();
    const store = useStorageStore();

    return {
      store,
      searchStore,
      userStore,
      settingsStore
    }
  },
}
</script>

<style scoped>
.search-label{
background-color: white;
color: rgb(51,51,51, 0.9);
}
.search-icon{
border: 1px solid rgb(51, 51, 51, 0.2); 
border-right: 0;
}
.form-control{
  border: 1;
  border-left: 0;
  height: 41px;
  width: 420px;
  border-radius: 0px 4px 4px 0px;
}
.form-control::placeholder{
  font-size: 19px;
}
.modal-content{
	overflow-y: hidden;
}
@media screen and (max-width: 630px){
  .form-control{
    width: 75vw !important;
    
  }
  .NavigateToItem{
    width: 75vw;
  }
}
@media screen and (max-width: 676px) {
	.modal-dialog{
		margin-top: 10% !important;
		margin-left: 10% !important;
		margin-right: 5% !important;
	}
}
@media screen and (max-width: 412px) {
	.modal-dialog{
		margin-left: 7% !important;
		margin-right: 7% !important;
	}
}
</style>


