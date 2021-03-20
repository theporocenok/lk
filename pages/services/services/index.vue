<template>
  <div>
    <SortFilterTitle
      title="Услуги"
      :count-filters="countFilters"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
    />

    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pb-0' : ''}`"
          cols="6"
          xl="1"
          lg="2"
          md="2"
          sm="6"
          xs="4"
        >
          <v-select
            v-model="queryOptions.filterCost"
            :items="$store.state.regions"
            item-value="id"
            item-text="title"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            label="Регион"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          :class="`${$helpers.isMobile() ? 'pb-0' : ''}`"
          cols="6"
          xl="2"
          lg="3"
          md="3"
          sm="6"
          xs="4"
        >
          <v-select
            v-model="queryOptions.filterYear"
            :items="yearSelectItems"
            :item-color="$config.defaultColor"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            label="Год оказания услуги"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          xl="5"
          lg="7"
          md="7"
          sm="6"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Код СИ, Наименование услуги, № ГРСИ, Тип СИ"
            :color="$config.defaultColor"
            :outlined="$helpers.isMobile()"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>

        <v-col
          v-if="!$helpers.isMobile()"
          :class="`${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          lg="2"
          md="6"
          sm="6"
        >
          <v-autocomplete
            v-model="queryOptions.filterType"
            label="Вид работ"
            :items="types"
            clearable
            item-value="id"
            item-text="title"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            :item-color="$config.defaultColor"
            no-data-text="Нет видов работ, удовлетворяющих запросу"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          xl="2"
          lg="2"
          md="3"
          sm="12"
          xs="12"
        >
          <v-checkbox
            v-model="queryOptions.filterCheckout"
            height="unset"
            min-height="unset"
            class="mt-0"
            label="Поверка на выезде"
            :color="$config.defaultColor"
            on-icon="mdi-checkbox-marked-outline"
            @change="checkboxChanged"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          xl="2"
          lg="2"
          md="3"
          sm="12"
          xs="12"
        >
          <v-checkbox
            v-model="queryOptions.filterDecree250"
            height="unset"
            min-height="unset"
            class="mt-0"
            label="Постановление 250"
            :color="$config.defaultColor"
            on-icon="mdi-checkbox-marked-outline"
            @change="checkboxChanged"
          />
        </v-col>
        <v-spacer />
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : 'justify-end'}`"
          cols="12"
          xl="1"
          lg="12"
          md="2"
          sm="12"
          xs="12"
        >
          <SearchFiltersBtn
            :show-filters="showFilters"
            @refresh="refreshServices"
            @hide-filters="showFilters = false"
          />
        </v-col>
      </v-row>
    </v-expand-transition>


    <v-row
      v-if="$helpers.isMobile()"
      class="mx-1"
    >
      <v-col>
        <v-autocomplete
          v-model="filterTypeComp"
          label="Вид работ"
          :items="types"
          item-value="id"
          item-text="title"
          hide-details
          :outlined="$helpers.isMobile()"
          :color="$config.defaultColor"
          :item-color="$config.defaultColor"
          no-data-text="Нет видов работ, удовлетворяющих запросу"
          @change="refresh=true"
        />
      </v-col>
    </v-row>

    <Crud
      :hide-default-footer="false"
      :show-title="false"
      :refresh.sync="refresh"
      :query-options="Object.assign({}, queryOptions)"
      :page-options="{fields: sortByList}"
      :model="$user.Service"
      :show-sort="showSort"
      :auto-query="!$helpers.isMobile()"
      :class="`hide-mobile-table-header ${$helpers.isMobile() ? 'mt-3' : ''}`"
      :hide-default-header="$helpers.isMobile()"
      :mobile-breakpoint="0"
      :custom-item="$helpers.isMobile()"
    >
      <template #item.device_title="{item}">
        {{ item.device_title }} ({{ item.device_description }})
        <div>{{ item.device_grsi ? item.device_grsi : '' }}</div>
      </template>
      <template #item.checkout="{item}">
        {{ item.checkout ? 'Да' : '-' }}
      </template>
      <template #item.decree250="{item}">
        {{ item.decree250 ? 'Да' : '-' }}
      </template>
      <template #action_buttons_after>
        <v-btn small>
          Заявка на сдачу
        </v-btn>
      </template>
      <template #custom_item="{item}">
        <div
          class="font-family--rubik py-4 px-4"
          style="border-bottom: 1px solid #e5e5e5"
        >
          <div class="font-family--rubik text--black mb-2">
            {{ item.title }}
          </div>
          <v-layout justify-space-between>
            <div style="flex: 0 0 35%;">
              <div
                class="text--grey overline text-none font-family--rubik"
                style="letter-spacing: unset !important;"
              >
                Код СИ
              </div>
              <div class="text--black font-family--rubik">
                {{ item.code_si }}
              </div>
            </div>
            <div style="flex: 0 0 35%;">
              <div
                class="text--grey overline text-none font-family--rubik"
                style="letter-spacing: unset !important;"
              >
                Средство измерений
              </div>
              <div class="text--black font-family--rubik">
                {{ item.device_title }}
              </div>
            </div>
            <v-layout
              align-center
              justify-end
              class="text-right font-family--rubik pr-2"
              style="flex: 1;"
            >
              <div
                v-if="item.filtered_cost"
                class="text-no-wrap caption font-family--rubik font-weight-bold font-family--rubik"
                :style="`color: ${$config.defaultColor}`"
              >
                {{ item.filtered_cost.cost }}
              </div>
            </v-layout>
          </v-layout>
        </div>
      </template>
    </Crud>
  </div>
</template>

<script>
  import Crud from "../../../components/CRUD/Index";
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  export default {
    name: "",
    components: {SearchFiltersBtn, SortFilterTitle, Crud},
    props: {
    },
    data() {
      return {
        showFilters: false,
        showSort: false,
        sortDesc: false,
        sortByList: [
          {
            key: 'code_si',
            label: 'Код СИ'
          },
          {
            key: 'title',
            label: 'Наименование услуги'
          },
        ],

        refresh:false,
        queryOptions: {
          filterCost: 1,
          filterYear: new Date().getFullYear(),
          filterType: '',
          searchText: '',
          filterCheckout: 0,
          filterDecree250: 0,
        },
        countFilters: 0,
        types: [],
        roles: [],
        yearSelectItems: [
          new Date().getFullYear(),
          new Date().getFullYear() + 1,
        ],
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
      filterTypeComp: {
        get() {
          return !!this.queryOptions.filterType ? this.queryOptions.filterType : 1;
        },
        set(val) {
          this.queryOptions.filterType = val;
          this.refresh = true;
        }
      }
    },
    async mounted() {
      // this.loadData();
      await this.$store.dispatch('loadRegions');
      await this.$store.dispatch('loadTransService');
      await this.loadTypes();
      if (this.$helpers.isMobile()) {
        this.filterTypeComp = 1;
      }
      this.countFilters = this.$helpers.countActiveFilters(this.queryOptions);
    },
    methods: {

      refreshSort(sortByValue) {
        this.sortBy = sortByValue;
        let sortDesc = this.sortByList.find((sort) => {
          if (sortByValue == sort.key) {
            return sort;
          }
        });
        this.sortDesc =  !!sortDesc.sortDesc ? sortDesc.sortDesc : false;
        this.refresh = true;
      },

      /**
       * Обновляем список услуг после добавления фильтров
       */
      refreshServices() {
        this.countFilters = this.$helpers.countActiveFilters(this.queryOptions);
        this.refresh = true;
        this.showFilters = false;
      },

      setDefaultFilterType() {
        this.queryOptions.filterType = this.types[0] ? this.types[0].id : 1;
        this.lastFilterType = this.types[0] ? this.types[0].id : 1;
      },

      /**
       * Разделяем цены по годам
       * @param costs
       */
      getCostsByYears(costs) {
        if (!!!costs || costs.length == 0) {
          return []
        }

        let resCosts = [];
        let currYear = costs[0].year;
        let currYearCosts = [];
        costs.map(function(cost) {
          if (cost.year != currYear) {
            resCosts.push({
              year: currYear,
              costs: Object.assign([], currYearCosts),
            });
            currYear = cost.year;
            currYearCosts = [];
          }
          currYearCosts.push(cost);
        });
        resCosts.push({
          year: currYear,
          costs: Object.assign([], currYearCosts),
        });
        return resCosts;
      },

      checkboxChanged () {
          this.queryOptions.filterCheckout = this.queryOptions.filterCheckout?1:0;
          this.queryOptions.filterDecree250 = this.queryOptions.filterDecree250?1:0;
          if (!this.$helpers.isMobile()){
            this.refresh = true;
          }
      },
      async loadData(){
          // let {data} = (await this.$model.SettingGroups.methods.all()).data;
          // let {data} = (await this.$user.ServiceCost.methods.all({onlyTitle:true})).data;
          // let {data} = (await this.$api.Service.getCosts()).data;
          // this.regions = data.costs;
      },
  
      /**
       * Запрос всех возможных видов работ для фильтров
       * @returns {Promise<void>}
       */
      async loadTypes() {
        try{
          let {data} = (await this.$api.Service.getTypes()).data;
          this.types = data.types;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при загрузке типов услуг',
            color: 'error'
          });
        }
      },
    },

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

<style>

</style>

<style scoped>

</style>