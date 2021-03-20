<template>
  <div>
    <div>
      <v-data-table
        :headers="computedInvoiceHeaders"
        :items="invoice_items"

        class="elevation-1"
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
    // import Invoice from "../Invoice/Invoice";
    export default {
        name: "CompanyInvoices",
        // components: {Invoice},
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
                this.invoice_dialog = true;
                this.invoice_selected = item;
            }
        }
    }
</script>

<style scoped>

</style>