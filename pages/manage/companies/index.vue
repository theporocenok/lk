<template>
  <div>
    <SortFilterTitle
      title="Список компаний"
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
          sm="10"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по Названию, ИНН, КПП"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          class="d-flex pt-0"
          cols="12"
          sm="2"
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
      :model="$admin.Company"
      :auto-query="!$helpers.isMobile()"
      :show-sort="showSort"
    >
      <template #item.id="{item}">
        <n-link :to="getLinkCompany(item.id)">
          {{ item.id }}
        </n-link>
      </template>
      <template #item.title="{item}">
        <n-link :to="getLinkCompany(item.id)">
          {{ item.title }}
        </n-link>
        <div class="font-italic caption">
          ИНН {{ item.inn }} / КПП {{ item.kpp }}
        </div>
      </template>
    </Crud>
  </div>
</template>

<script>
  import Crud from '~/components/CRUD/Index';
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  
  export default {
    components: {
      SearchFiltersBtn,
      SortFilterTitle,
      Crud
    },
      data () {
          return {
            showFilters: false,
            showSort: false,

            refresh: false,
              // queryOptions
              queryOptions: {
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