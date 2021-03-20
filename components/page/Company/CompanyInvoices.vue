<template>
  <div>
    <Invoice
      :dialog.sync="invoice_dialog"
      :invoice-item-id.sync="invoice_selected.id"
      @hideDialog="invoice_dialog=false"
    />


    <template v-if="showFilters">
      <v-row class="ml-1 mr-1">
        <v-col
          class="d-flex pb-0"
          cols="12"
          sm="3"
        >
          <v-menu
            ref="menuIssuedAt"
            v-model="menuIssuedAt"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateIssuedAtText"
                label="Дата создания"
                prepend-icon="event"
                readonly
                clearable
                v-on="on"
                @click:clear="queryOptions.filterIssuedAt=[]"
              />
            </template>
            <v-date-picker
              v-model="queryOptions.filterIssuedAt"
              range
              no-title
              scrollable
            />
          </v-menu>
        </v-col>

        <v-col
          class="d-flex pb-0"
          cols="12"
          sm="3"
        >
          <v-select
            v-model="queryOptions.filterPayed"
            :items="[
              {text:'Оплачен',value:'1'},
              {text:'Не оплачен',value:'0'},
            ]"
            clearable
            label="Статус оплаты"
          />
        </v-col>

        <v-col
          class="d-flex pb-0"
          cols="12"
          sm="3"
        >
          <v-menu
            ref="menuPayedAt"
            v-model="menuPayedAt"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="datePayedAtText"
                label="Дата оплаты"
                prepend-icon="event"
                readonly
                clearable
                v-on="on"
                @click:clear="queryOptions.filterPayedAt=[]"
              />
            </template>
            <v-date-picker
              v-model="queryOptions.filterPayedAt"
              range
              no-title
              scrollable
            />
          </v-menu>
        </v-col>

        <v-col
          class="d-flex pb-0"
          cols="12"
          sm="3"
        >
          <v-select
            v-model="queryOptions.filterReady"
            :items="[
              {text:'Готов',value:'1'},
              {text:'Не готов',value:'0'},
            ]"
            clearable
            label="Статус готовности"
          />
        </v-col>
      </v-row>

      <v-row class="ml-1 mr-1">
        <v-col
          class="d-flex pt-0"
          cols="12"
          sm="10"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по номеру счета, названию компании, ИНН, КПП"
            clearable
            @keyup.enter="loadData"
          />
        </v-col>
        <v-col
          class="d-flexd-flex pt-0"
          cols="12"
          sm="2"
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
        :headers="computedInvoiceHeaders"
        :items="invoice_items"
        :sort-by="sortBy"
        :auto-query="!$helpers.isMobile()"
        class="elevation-1 hide-mobile-table-header"
      >
        <template
          #item.number_mobile="{item}"
          :mobile="false"
        >
          № {{ item.number }} от {{ item.issued_at }}
        </template>
        <template #item.items="{item}">
          <v-btn
            dark
            color="#006e4c"
            small
            class="mr-1"
            @click="showDialogItems(item)"
          >
            Состав счета
          </v-btn>
        </template>
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
        <template #item.order.number="{item}">
          <template v-if="item.order">
            {{ item.order.number }}
            <div
              v-if="item.order.approved_at != null"
              class="font-italic caption"
            >
              от {{ item.order.approved_at }}
            </div>
          </template>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
    import Invoice from "../Invoice/Invoice";
    import SortMobile from "../SortMobile";
    export default {
        name: "CompanyInvoices",
        components: {SortMobile, Invoice},
        props: {
            companyId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            },
            showFilters: {
                type: Boolean,
                required: false,
                default: () => {
                    return true;
                }
            },
        },
        data () {
            return {
                sortBy: null,
                sortByList: [
                  {label: 'Номер', key: 'number'},
                  {label: 'Дата', key: 'issued_at'},
                  {label: 'Сумма', key: 'sum'},
                  {label: 'Оплачен', key: 'payed_at'},
                  {label: 'Готов', key: 'ready_at'},
                  {label: 'Договор', key: 'order.number'},
                  {label: 'Состав', key: 'items'},
                ],

                invoice_dialog: false,
                invoice_selected: [],
                invoice_items: [],
                defaultColor: '#006e4c',


                // меню дейтпикеров
                menuIssuedAt: false,
                menuPayedAt: false,

                // queryOptions
                queryOptions: {
                    searchText: '',
                    filterIssuedAt: [],
                    filterPayedAt: [],
                    filterPayed: '',
                    filterReady: '',
                },
            }
        },
        computed: {
            datePayedAtText () {
                return this.queryOptions.filterPayedAt.join(' ~ ')
            },
            dateIssuedAtText () {
                return this.queryOptions.filterIssuedAt.join(' ~ ')
            },
            getWindowWidth() {
                return this.$store.state.screenWidth;
            },
            computedInvoiceHeaders(){
                if(this.getWindowWidth > 1000 ){
                    // return desktop
                    return [
                        {text: 'Номер', value: 'number'},
                        {text: 'Дата', value: 'issued_at'},
                        {text: 'Сумма', value: 'sum'},
                        {text: 'Оплачен', value: 'payed_at'},
                        {text: 'Готов', value: 'ready_at'},
                        {text: 'Договор', value: 'order.number'},
                        {text: 'Состав', value: 'items'},
                    ];
                } else {
                    // return mobile
                    return [
                        {text: 'Номер, дата', value: 'number_mobile'},
                        {text: 'Сумма', value: 'sum'},
                        {text: 'Оплачен', value: 'payed_at'},
                        {text: 'Готов', value: 'ready_at'},
                        {text: 'Состав', value: 'items'},
                    ];
                }
            }
        },
        mounted() {
            this.loadData();
        },
        methods:{
            getLinkCompany(company_id){
                if(this.$auth.user.role_id==1){
                    return `/manage/companies/${company_id}`;
                }
                return `/cabinet/companies/${company_id}`;
            },
            async loadData(){
              try{
                let {data} = (await this.$api.Company.invoices(this.companyId, this.queryOptions)).data;
                this.invoice_items = data.company.invoices;
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при загрузке заявок компании',
                  color: 'error'
                });
              }
            },
            showDialogItems(item){
                // console.log("item", item);
                this.invoice_dialog = true;
                this.invoice_selected = item;
            }
        }
    }
</script>

<style scoped>

</style>