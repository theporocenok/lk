<template>
  <div>
    <Invoice
      :dialog.sync="invoice_dialog"
      :invoice-item-id.sync="invoice_selected.id"
      @hideDialog="invoice_dialog=false"
    />

    <template v-if="isInvoicePage">
      <v-expand-transition>
        <v-row
          v-if="!$helpers.isMobile() || showFilters"
          class="ml-1 mr-1"
        >
          <v-col
            :class="`d-flex pb-0 ${$helpers.isMobile() ? 'mb-3' : ''}`"
            cols="12"
            sm="3"
          >
            <v-autocomplete
              v-model="filterCompanyAutocomplete"
              label="Компания"
              hide-details
              :items="userCompaniesList"
              clearable
              item-value="id"
              item-text="title"
              :outlined="$helpers.isMobile()"
              :color="$config.defaultColor"
              no-data-text="Не найдено компаний с таких названием"
              @change="changeCompanyFilter"
            />
          </v-col>

          <v-col
            :class="`d-flex pb-0 ${$helpers.isMobile() ? 'mb-3' : ''}`"
            cols="12"
            sm="2"
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
                  :prepend-icon="`${$helpers.isMobile() ? '' : 'event'}`"
                  :append-icon="`${$helpers.isMobile() ? 'event' : ''}`"
                  hide-details
                  :outlined="$helpers.isMobile()"
                  :color="$config.defaultColor"
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
                :color="$config.defaultColor"
                @input="queryOptions.filterIssuedAt.length == 2 ? menuIssuedAt = false : null"
              />
            </v-menu>
          </v-col>

          <v-col
            :class="`d-flex pb-0 ${$helpers.isMobile() ? 'mb-3' : ''}`"
            cols="12"
            sm="2"
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
                  :prepend-icon="`${$helpers.isMobile() ? '' : 'event'}`"
                  :append-icon="`${$helpers.isMobile() ? 'event' : ''}`"
                  hide-details
                  :outlined="$helpers.isMobile()"
                  :color="$config.defaultColor"
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
                :color="$config.defaultColor"
                scrollable
                @input="queryOptions.filterPayedAt.length == 2 ? menuPayedAt = false : null"
              />
            </v-menu>
          </v-col>

          <v-col
            :class="`d-flex pb-0 ${$helpers.isMobile() ? 'mb-3' : ''}`"
            cols="12"
            sm="2"
          >
            <v-select
              v-model="queryOptions.filterPayed"
              :items="[
                {text:'Оплачен',value:'1'},
                {text:'Не оплачен',value:'0'},
              ]"
              clearable
              hide-details
              :outlined="$helpers.isMobile()"
              :color="$config.defaultColor"
              label="Статус оплаты"
            />
          </v-col>

          <v-col
            :class="`d-flex pb-0 ${$helpers.isMobile() ? 'mb-3' : ''}`"
            cols="12"
            sm="2"
          >
            <v-select
              v-model="queryOptions.filterReady"
              :items="[
                {text:'Готов',value:'1'},
                {text:'Не готов',value:'0'},
              ]"
              clearable
              hide-details
              :outlined="$helpers.isMobile()"
              :color="$config.defaultColor"
              label="Статус готовности"
            />
          </v-col>
        </v-row>
      </v-expand-transition>

      <v-expand-transition>
        <v-row
          v-if="!$helpers.isMobile() || showFilters"
          :class="`ml-1 mr-1 ${$helpers.isMobile() ? 'mt-3' : ''}`"
        >
          <v-col
            class="d-flex pt-0"
            cols="12"
            sm="10"
          >
            <v-text-field
              v-model="queryOptions.searchText"
              label="Поиск по номеру счета, ИНН, КПП"
              clearable
              hide-details
              :outlined="$helpers.isMobile()"
              :color="$config.defaultColor"
              @keyup.enter="loadData"
            />
          </v-col>
          <v-col
            class="d-flex pt-0"
            cols="12"
            sm="2"
          >
            <SearchFiltersBtn
              :show-filters="showFilters"
              @refresh="refreshInvoices"
              @hide-filters="$emit('hide-filters')"
            />
          </v-col>
        </v-row>
      </v-expand-transition>
    </template>

    <div>
      <SortMobile
        :sort-by-list="sortByList"
        :show-sort="showSort"
        @refresh="refreshSort"
      />
      <Crud
        v-if="!$helpers.isMobile() || (isInvoicePage && !$helpers.isMobile())"
        
        :hide-default-footer="false"
        :show-title="false"
        :refresh.sync="refresh"
        :query-options="Object.assign({}, queryOptions, {filterCompany: filterCompanyOnPage})"
        :model="$user.CompanyInvoice"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :dbl-click-callback="clickInvoiceOnMobile"
        :show-sort="showSort"
        :element-id-to-get="getElementId"
        :headers="computedInvoiceHeaders"
        :auto-query="!$helpers.isMobile()"
        hide-actions
        hide-create-btn
        class="elevation-1 hide-mobile-table-header invoices-table--mobile"
        elevation="0"
        @open-dialog="showDialogItems"
      >
        <template
          #item.number_mobile="{item}"
          :mobile="false"
        >
          <div
            :class="`text-no-wrap ${$helpers.isMobile() ? '' : ''}`"
            :style="$helpers.isMobile() ? 'color: #3C64B1;' : ''"
          >
            № {{ item.number }}
          </div>
          <div class="text-no-wrap">
            от {{ $helpers.convertDateTcsm(item.issued_at) }}
          </div>
        </template>
        <template #item.status="{item}">
          <template v-if="item.ready_at">
            {{ item.status.title }} {{ $helpers.convertDateTcsm(item.ready_at) }}
          </template>
        </template>
        <template #item.items="{item}">
          <div
            v-if="!$helpers.isMobile()"
            class="px-4"
          >
            <v-btn
              dark
              color="#006e4c"
              small
              class="mr-1"
              @click="showDialogItems(item)"
            >
              Состав счета
            </v-btn>
          </div>
          <div
            v-else
            class="overflow-hidden pr-4"
          >
            <v-icon
              color="#818181"
              large
              @click="showDialogItems(item)"
            >
              mdi-chevron-right
            </v-icon>
          </div>
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
        <template #item.sum="{item}">
          <template v-if="!$helpers.isMobile()">
            {{ item.sum }}
          </template>
          <template v-else>
            <span
              class="font-weight-bold"
              :style="`color: ${$config.defaultColor}`"
            >{{ item.sum }}</span>
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
      </Crud>

      <div v-else>
        <template v-for="(company, key) in filtredCompanies">
          <div
            :key="key"
            class="pt-4 mb-4"
          >
            <div class="px-4 mb-2">
              <n-link :to="`/cabinet/companies/${company.id}`">
                {{ company.title }}
              </n-link>
            </div>

            <Crud
              class="elevation-1 hide-mobile-table-header invoices-table--mobile"
              hide-default-footer
              :show-title="false"
              :refresh.sync="refresh"
              :query-options="Object.assign({}, queryOptions, {filterCompany: company.id, sortBy: sortBy, sortDesc: sortDesc})"
              :page-options="{itemsPerPage: 5}"
              :item-class="isReadyInvoice"
              :model="$user.CompanyInvoice"
              :sort-desc="sortDesc"
              :dbl-click-callback="clickInvoiceOnMobile"
              :element-id-to-get="getElementId"
              :headers="computedInvoiceHeaders"
              :custom-headers="mobile_headers"
              hide-create-btn
              :auto-query="!$helpers.isMobile()"
              mobile-breakpoint="0"
              :show-sort="false"
              hide-actions
              elevation="0"
              @open-dialog="showDialogItems"
            >
              <template
                #item.number_mobile="{item}"
                :mobile="false"
              >
                <div
                  :class="`text-no-wrap ${$helpers.isMobile() ? '' : ''}`"
                  :style="$helpers.isMobile() ? 'color: #3C64B1;' : ''"
                >
                  № {{ item.number }}
                </div>
                <div class="text-no-wrap">
                  от {{ $helpers.convertDateTcsm(item.issued_at) }}
                </div>
              </template>
              <template #item.status="{item}">
                <template>
                  {{ item.status.title }}
                  <template v-if="item.ready_at || item.payed_at || item.issued_at">
                    <template v-if="item.ready_at">
                      {{ $helpers.convertDateTcsm(item.ready_at) }}
                    </template>
                    <template v-else-if="item.payed_at">
                      {{ $helpers.convertDateTcsm(item.payed_at) }}
                    </template>
                    <template v-else-if="item.issued_at">
                      {{ $helpers.convertDateTcsm(item.issued_at) }}
                    </template>
                  </template>
                </template>
              </template>
              <template #item.items="{item}">
                <div
                  class="overflow-hidden pr-4"
                >
                  <v-icon
                    color="#818181"
                    large
                    @click="showDialogItems(item)"
                  >
                    mdi-chevron-right
                  </v-icon>
                </div>
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
              <template #item.sum="{item}">
                <template v-if="!$helpers.isMobile()">
                  {{ item.sum }}
                </template>
                <template v-else>
                  <span
                    class="font-weight-bold"
                    :style="`color: ${$config.defaultColor}`"
                  >{{ item.sum }}</span>
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
            </Crud>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
    import Invoice from "../Invoice/Invoice";
    import SearchFiltersBtn from "../SearchFiltersBtn";
    import SortMobile from "../SortMobile";
    import Crud from "../../CRUD/Index";
    export default {
        name: "UserInvoices",
        components: {Crud, SortMobile, SearchFiltersBtn, Invoice},
        props: {
            userId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            },
            showSort: {
              type: Boolean,
              default: false,
            },
            showFilters: {
              type: Boolean,
              default: false,
            },
        },
        data () {
            return {
              sortBy: 'id',
              sortDesc: false,
              sortByList: [
                {
                  key: 'number',
                  label: 'Номер'
                },
                {
                  key: 'status_id',
                  sortDesc: true,
                  label: 'Статус'
                },
                {
                  key: 'sum',
                  label: 'Сумма'
                },
                {
                  key: 'issued_at',
                  label: 'Дата'
                },
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
                  userId: '',
                  searchText: '',
                  filterIssuedAt: [],
                  filterPayedAt: [],
                  filterPayed: '',
                  filterReady: '',
              },
              filterCompanyOnPage:'',
              filterCompanyAutocomplete: '',
              refresh: false,

              footerProps: {
                itemsPerPageText: 'Показывать'
              },

              getElementId: null,

              userCompaniesList: [],
              groupedInvoices: [],

              mobile_headers: [
                {text: 'Счёт', value: 'number_mobile', sortable: false},
                {text: 'Статус', value: 'status', sortable: false},
                {text: 'Сумма', value: 'sum', sortable: false},
                {text: '', value: 'items', sortable: false, width: '41'},
              ],
            }
        },
        computed: {
          datePayedAtText () {
              let res = this.$helpers.convertDateTcsm(this.queryOptions.filterPayedAt[0]);
              if (!!this.queryOptions.filterPayedAt[1]) {
                res += ' - ' + this.$helpers.convertDateTcsm(this.queryOptions.filterPayedAt[1]);
              }
              return res;
          },
          dateIssuedAtText () {
            let res = this.$helpers.convertDateTcsm(this.queryOptions.filterIssuedAt[0]);
            if (!!this.queryOptions.filterIssuedAt[1]) {
              res += ' - ' + this.$helpers.convertDateTcsm(this.queryOptions.filterIssuedAt[1]);
            }
            return res;
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
                      {text: 'Компания', value: 'company.title'},
                      {text: 'Договор', value: 'order.number'},
                      {text: 'Состав', value: 'items'},
                  ];
              } else {
                  // return mobile
                  return [
                      {text: 'Счёт', value: 'number_mobile', sortable: false},
                      {text: 'Статус', value: 'status', sortable: false},
                      {text: 'Сумма', value: 'sum', sortable: false},
                      {text: '', value: 'items', sortable: false, width: '41'},
                  ];
              }
          },
          isInvoicePage() {
              return this.$route.name == 'cabinet-invoices';
          },
          filtredCompanies() {
            if (!!!this.filterCompanyOnPage) {
              return this.userCompaniesList;
            }
            let company = this.userCompaniesList.find((el) => {
              if (el.id == this.filterCompanyOnPage) {
                return el;
              }
            });
            return [company];
          },
        },
        watch: {
          invoice_items(val) {
            if (!!val && !!this.getElementId) {
              this.showElementById(this.getElementId);
            }
          },
          element_id_to_get(val) {
            if (!!val) {
              this.showElementById(val);
            }
          }
        },
        mounted() {
          this.loadData();
          this.loadCompanies();
          if (!!this.$route.query && !!this.$route.query.open) {
            this.getElementId = this.$route.query.open;
          }
        },
        methods:{
            refreshInvoices() {
              this.filterCompanyOnPage = this.filterCompanyAutocomplete;
              let countFilters = this.$helpers.countActiveFilters(Object.assign({}, this.queryOptions, {filterCompany: this.filterCompanyOnPage}), ['userId']);
              this.$emit('hide-filters');
              this.$emit('change-count-filters', countFilters);
              this.refresh = true;
            },
            groupInvoices() {
              if (this.invoice_items.length == 0) {
                this.groupedInvoices = [{
                  company_title: '',
                  orders: []
                }];
              }
              let groups = [];
              let company_id = null;
              this.invoice_items.sort(this.compareInvoices);
              this.invoice_items.map((invoice) => {
                if (company_id != invoice.company.id) {
                  company_id = invoice.company.id;
                  groups.push({
                    company_title: invoice.company.title,
                    company_id: invoice.company.id,
                    invoices: [invoice],
                  });
                }else{
                  groups[groups.length - 1].invoices.push(invoice);
                }
              });
              this.groupedInvoices = groups;
            },

            compareInvoices(order1, order2) {
              if (order1.company.title > order2.company.title) {
                return 1;
              }
              if (order1.company.title === order2.company.title) {
                return 0;
              }
              return -1;
            },

            /**
             * Список компаний пользователя
             */
            async loadCompanies() {
              try {
                let userId = this.$auth.user.id;
                let {data} = (await this.$api.User.companies(userId)).data;
                this.userCompaniesList = data.companies;
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при загрузке компаний пользователя',
                  color: 'error'
                });
              }
            },

            /**
             * Смена значения в фильтре компании
             */
            changeCompanyFilter(item) {
              if (!this.$helpers.isMobile()) {
                this.filterCompanyOnPage = item;
                this.refresh = true;
              }
            },

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
            showElementById(id) {
              let res = null;
              res = this.invoice_items.find((el) => {
                if (el.id == id) {
                  return el;
                }
              });
              if (!!res) {
                this.showDialogItems(res);
              }
            },
            clickInvoiceOnMobile(any, obj) {
              if (this.$helpers.isMobile()) {
                this.showDialogItems(!!obj ? obj.item : any);
              }
            },
            isReadyInvoice(item) {
              if (!!item.ready_at || !!item.payed_at) {
                return 'invoice--green';
              }
              return '';
            },
            getLinkCompany(company_id){
                if(this.$auth.user.role_id==1){
                    return `/manage/companies/${company_id}`;
                }
                return `/cabinet/companies/${company_id}`;
            },
            async loadData(){
                this.filterCompanyOnPage = this.filterCompanyAutocomplete;
                this.$emit('change-count-filters', this.$helpers.countActiveFilters(Object.assign({}, this.queryOptions, {filterCompany: this.filterCompanyOnPage}), ['userId']));

                let userId = this.$auth.user.id;
                if(this.userId){
                    userId = this.userId;
                }

                this.queryOptions.userId = userId;
                let {data} = (await this.$api.User.invoices(userId, Object.assign({}, this.queryOptions, {filterCompany: this.filterCompanyOnPage}))).data;
                this.invoice_items = data.items;
                this.groupInvoices();
            },
            showDialogItems(item){
                // console.log("item", item);
                this.invoice_dialog = true;
                this.invoice_selected = item;
            },
        }
    }
</script>

<style>
  .invoice--green {
    background-color: rgba(24, 203, 31, 0.1);
  }
  .invoices-table--mobile tr>td:last-child {
    padding: 0 !important;
  }
</style>

<style scoped>

</style>