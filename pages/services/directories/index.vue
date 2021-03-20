<template>
  <div>
    <div class="headline pa-4">
      Справочники
    </div>

    <v-tabs
      v-model="tab"
      align-with-title
      :color="$config.defaultColor"
    >
      <v-tabs-slider :color="$config.defaultColor" />

      <v-tab
        v-for="item in tabs"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <Crud
          :hide-default-footer="false"
          :show-title="false"
          :refresh.sync="refresh"
          :model="$user.ServiceType"
          :auto-query="!$helpers.isMobile()"
        />
      </v-tab-item>
      <v-tab-item>
        <Crud
          :hide-default-footer="false"
          :show-title="false"
          :refresh.sync="refresh"
          :model="$user.ServiceDimension"
          :auto-query="!$helpers.isMobile()"
        />
      </v-tab-item>
      <v-tab-item>
        <Crud
          :hide-default-footer="false"
          :show-title="false"
          :refresh.sync="refresh"
          :model="$user.ServiceCost"
          :auto-query="!$helpers.isMobile()"
        />
      </v-tab-item>
      <v-tab-item>
        <SortMobile
          :sort-by-list="sortByListLaboratories"
          :show-sort="true"
          @refresh="(sortByValue) => {sortByLaboratories = sortByValue}"
        />
        <v-data-table
          :headers="laboratoryHeaders"
          :items="$store.state.laboratories"
          :items-per-page="50"
          :sort-by="sortByLaboratories"
          :auto-query="!$helpers.isMobile()"
          class="elevation-1 hide-mobile-table-header"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  import Crud from "../../../components/CRUD/Index";
  import SortMobile from "../../../components/page/SortMobile";
  export default {
    name: "",
    components: {SortMobile, Crud},
    props: {
    },
    data() {
      return {
        sortByLaboratories: null,
        sortByListLaboratories: [
          {key: 'title', label: 'Название'},
          {key: 'code', label: 'Код'}
        ],

        tab: null,
        tabs: ['Виды работ', 'Единицы Измерений', 'Типы цен', 'Лаборатории' ],
        laboratoryHeaders: [
          {text: 'Название', value: 'title'},
          {text: 'Код', value: 'code'},
        ],
        refresh:false,
        queryOptions: {
          filterType: [],
          searchText: '',
          verification: false,
        },
        regions: [],
        roles: [],
      }
    },
    computed: {
      // refreshTable: {
      //     get() {
      //         return this.refresh;
      //     },
      //     set(v) {
      //         this.('update:refresh', v);
      //     }
      // }
    },
    mounted() {
      // this.loadData();
      this.$store.dispatch('loadLaboratories');
    },
    methods: {
      // async loadData(){
      //     let {data} = (await this.$model.SettingGroups.methods.all()).data;
      // },
    },

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

<style scoped>

</style>