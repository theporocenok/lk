<template>
  <v-card :elevation="noneElevation || $helpers.isMobile() ?0:''">
    <v-card-title
      :class="$helpers.isMobile() ? 'mx-n6 mb-3' : ''"
    >
      Доступные услуги
    </v-card-title>
    <SortMobile
      v-if="false"
      :sort-by-list="sortByList"
      :show-sort="true"
      @refresh="(sortByValue) => {sortBy = sortByValue}"
    />
    <v-card-text
      :class="tableFont + ($helpers.isMobile() ? ' mx-n6 px-0' : '')"
      :style="$helpers.isMobile() ? 'width: calc(100% + 48px);' : ''"
    >
      <v-data-table
        :headers="headers"
        :items="services"
        :sort-by="sortBy"
        mobile-breakpoint="0"
        :disable-sort="$helpers.isMobile()"
        :hide-default-header="$helpers.isMobile()"
        :hide-default-footer="$helpers.isMobile()"
        class="hide-mobile-table-header"
      >
        <template #item.checkout="{item}">
          {{ item.checkout ? 'Да' : '-' }}
        </template>
        <template #item.decree250="{item}">
          {{ item.decree250 ? 'Да' : '-' }}
        </template>
        <template #item.costs="{item}">
          <v-layout
            class="pt-2"
          >
            <template
              v-for="(yearCost, j) in getCostsByYears(item.costs)"
            >
              <div
                :key="j"
                :class="`${j < getCostsByYears(item.costs).length - 1 ? 'mr-5' : ''}`"
              >
                <div>
                  <b>{{ yearCost.year }}</b>
                </div>
                <template v-for="(cost, i) in yearCost.costs">
                  <div
                    :key="i"
                    class="text-no-wrap"
                  >
                    <i class="caption">{{ cost.service_cost.title }}: {{ cost.cost }}</i>
                  </div>
                </template>
              </div>
            </template>
          </v-layout>
        </template>
        <template
          v-if="$helpers.isMobile()"
          #item="{item}"
        >
          <div
            class="font-family--rubik py-4 px-4"
            style="border-bottom: 1px solid #e5e5e5"
          >
            <div class="text--black mb-5">
              {{ item.title }}
            </div>
            <v-layout justify-space-between>
              <div>
                <div
                  class="text--grey overline text-none"
                  style="letter-spacing: unset !important;"
                >
                  Поверка на выезде
                </div>
                <div class="text--black">
                  {{ item.checkout ? 'Да' : '-' }}
                </div>
              </div>
              <div>
                <div
                  class="text--grey overline text-none"
                  style="letter-spacing: unset !important;"
                >
                  Постановление 250
                </div>
                <div class="text--black">
                  {{ item.decree250 ? 'Да' : '-' }}
                </div>
              </div>
              <div>
                <v-layout
                  justify-space-between
                >
                  <template
                    v-for="(yearCost, j) in getCostsByYears(item.costs)"
                  >
                    <div
                      :key="j"
                      :class="`${j < getCostsByYears(item.costs).length - 1 ? 'mr-5' : ''}`"
                    >
                      <div>
                        <b>{{ yearCost.year }}</b>
                      </div>
                      <template v-for="(cost, i) in yearCost.costs">
                        <div
                          :key="i"
                          class="text-no-wrap"
                        >
                          <i
                            class="caption font-family--rubik font-weight-bold"
                            :style="`color: ${$config.defaultColor}`"
                          >{{ cost.service_cost.title }}: {{ cost.cost }}</i>
                        </div>
                      </template>
                    </div>
                  </template>
                </v-layout>
              </div>
            </v-layout>
          </div>
        </template>
        <template
          v-if="$helpers.isMobile() && services.length > 10"
          #footer="{props}"
        >
          <v-layout
            v-if="props.pagination.itemsLength > props.pagination.itemsPerPage"
            class="px-2 mt-4"
            align-center
            justify-space-between
            :wrap="false"
          >
            <div class="text-no-wrap caption font-family--rubik mr-3">
              {{ props.itemsPerPageText }}
            </div>
            <v-select
              v-model="props.options.itemsPerPage"
              hide-details
              :color="$config.defaultColor"
              :items="[5, 10, 15, 50]"
              class="tcsmSelect-mobile font-family--rubik caption mr-2"
              outlined
            />
            <div class="text-no-wrap caption font-family--rubik mr-2">
              {{ props.pagination.pageStart + 1 }}-{{ props.pagination.pageStop }} из {{ props.pagination.itemsLength }}
            </div>
            <v-layout justify-end>
              <v-btn
                min-width="unset"
                width="32"
                height="32"
                color="#006e4c"
                depressed
                outlined
                class="mr-3"
                @click="props.options.page - 1 > 0 ? props.options.page-- : props.options.page"
              >
                <v-icon>
                  arrow_back
                </v-icon>
              </v-btn>
              <v-btn
                min-width="unset"
                width="32"
                height="32"
                color="#006e4c"
                depressed
                outlined
                class=""
                @click="props.options.page + 1 <= props.pagination.pageCount ? props.options.page++ : props.options.page"
              >
                <v-icon>
                  arrow_forward
                </v-icon>
              </v-btn>
            </v-layout>
          </v-layout>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import SortMobile from "../SortMobile";
  export default {
    name: "ServicesTable",
    components: {SortMobile},
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      services: {
        type: Array,
        default: () => {
          return [];
        }
      },
      noneElevation: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      tableFont: {
        type: String,
        default: () => {
          return '';
        }
      }
    },
    data() {
      return {
        sortBy: null,
        headers: [
          { text: 'Наименование', value: 'title' },
          { text: 'Поверка на выезде', value: 'checkout' },
          { text: 'Постановление 250', value: 'decree250' },
          { text: 'Стоимость', value: 'costs' },
        ],
        sortByList: [
          { label: 'Наименование', key: 'title' },
          { label: 'Поверка на выезде', key: 'checkout' },
          { label: 'Постановление 250', key: 'decree250' },
          { label: 'Стоимость', key: 'costs' },
        ],
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.dialog;
        },
        set(v) {
          this.$emit('close-dialog');
        }
      },
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
    },
    methods: {
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
      }
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