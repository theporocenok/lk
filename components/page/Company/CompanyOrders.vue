<template>
  <div>
    <template v-if="showFilters">
      <v-row class="ml-1 mr-1">
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
            clearable
            label="Срок действия"
          />
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="8"
          xs="12"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по номеру договора, названию компании, ИНН, КПП"
            clearable
            @keyup.enter="loadData"
          />
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="2"
          xs="12"
        >
          <v-btn @click="loadData">
            Искать
          </v-btn>
        </v-col>
      </v-row>
    </template>
    
    <div>
      <SortMobile
        :sort-by-list="sortByList"
        :show-sort="true"
        @refresh="(sortByValue) => {sortBy = sortByValue}"
      />
      <v-data-table
        :headers="orders_headers"
        :items="orders_items"
        :hide-default-footer="hideDefaultFooter"
        :sort-by="sortBy"
        :auto-query="!$helpers.isMobile()"
        class="elevation-1 hide-mobile-table-header"
      >
        <template #item.number="{item}">
          {{ item.number }}
          <template v-if="item.approved_at">
            от {{ item.approved_at }}
          </template>
        </template>
        <template #item.days="{item}">
          {{ item.days }}
          <template v-if="item.days && item.is_work_days != null">
            <span v-if="item.is_work_days=='1'">рабочих</span>
            <span v-if="item.is_work_days=='0'">календарных</span>
          </template>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
    import SortMobile from "../SortMobile";
    export default {
        name: "CompanyOrders",
      components: {SortMobile},
      props: {
            showFilters: {
                type: Boolean,
                required: false,
                default: () => {
                    return false;
                }
            },
            hideDefaultFooter: {
                type: Boolean,
                required: false,
                default: () => {
                    return true;
                }
            },
            companyId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            }
        },
        data () {
            return {
              sortBy: null,
              sortByList: [
                {label: 'Договор №', key: 'number'},
                {label: 'Действует до', key: 'valid_to'},
                {label: 'Срок, дн', key: 'days'},
              ],

                orders_headers: [
                    {text: 'Договор №', value: 'number'},
                    {text: 'Действует до', value: 'valid_to'},
                    {text: 'Срок, дн', value: 'days'},
                ],
                orders_items: [],

                queryOptions: {
                    filterValidTo: '',
                    searchText: '',
                },
            }
        },
        mounted() {
            this.loadData();
        },
        methods:{
            async loadData(){
              try{
                let {data} = (await this.$api.Company.orders(this.companyId, this.queryOptions)).data;
                this.orders_items = data.company.orders;
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при загрузке договоров компании',
                  color: 'error'
                });
              }

            },
        }
    }
</script>

<style scoped>

</style>