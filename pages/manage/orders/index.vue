<template>
  <div>
    <SortFilterTitle
      title="Список договоров"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
    />
    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          class="d-flex pb-0"
          cols="12"
          sm="2"
          xs="12"
        >
          <v-select
            v-model="queryOptions.filterValidTo"
            :items="[
              {text:'Истек срок',value:'1'},
              {text:'Действуют',value:'0'},
            ]"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            :item-color="$config.defaultColor"
            clearable
            label="Срок действия"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pb-0 pt-0' : ''}`"
          cols="12"
          sm="8"
          xs="12"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по номеру договора, названию компании, ИНН, КПП"
            clearable
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          class="d-flex pt-0"
          cols="12"
          sm="2"
          xs="12"
        >
          <SearchFiltersBtn
            :show-filters="showFilters"
            @refresh="refresh = true, showFilters = false"
            @hide-filters="showFilters = false"
          />
        </v-col>
      </v-row>
    </v-expand-transition>

    <Crud
      :hide-default-footer="false"
      :show-title="false"
      :refresh.sync="refresh"
      :query-options="queryOptions"
      :model="$admin.CompanyOrder"
      :auto-query="!$helpers.isMobile()"
      :show-sort="showSort"
    >
      <template #item.company.title="{item}">
        <template v-if="item.company">
          <n-link :to="getLinkCompany(item.company.id)">
            {{ item.company.title }}
          </n-link>
          <div class="font-italic caption">
            ИНН {{ item.company.inn }} / КПП {{ item.company.kpp }}
          </div>
        </template>
      </template>
    </Crud>
  </div>
</template>

<script>
  import Crud from '~/components/CRUD/Index';
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  
  export default {
    components: {
      SortFilterTitle,
      SearchFiltersBtn,
      Crud
    },
      data () {
          return {
            showFilters: false,
            showSort: false,
            
              refresh: false,
              // queryOptions
              queryOptions: {
                  filterValidTo: '',
                  searchText: '',
              },
          }
      },
      methods: {
          getLinkCompany(company_id){
              if(this.$auth.user.role_id==1){
                  return `/manage/companies/${company_id}`;
              }
              return `/cabinet/companies/${company_id}`;
          },
      },
      middleware: 'administrator',
  };
</script>

<style scoped>

</style>