<template>
  <div>
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
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            label="Срок действия"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          sm="5"
          xs="12"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по номеру договора, ИНН, КПП"
            clearable
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            @keyup.enter="loadData"
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
            @refresh="loadData(), $emit('hide-filters')"
            @hide-filters="$emit('hide-filters')"
          />
        </v-col>
      </v-row>
    </v-expand-transition>

    <div>
      <SortMobile
        :sort-by-list="sortByList"
        :show-sort="showSort"
        @refresh="(sortByValue) => {sortBy = sortByValue}"
      />
      <v-data-table
        v-if="!$helpers.isMobile()"
        :headers="orders_headers"
        :items="orders_items"
        mobile-breakpoint="0"
        :sort-by="sortBy"
        class="elevation-1 hide-mobile-table-header"
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
      <div v-else>
        <template v-for="(group, key) in orders_mobile">
          <div
            :key="key"
            class="pt-4 mb-4"
          >
            <div class="px-4 mb-2">
              <n-link :to="`/cabinet/companies/${group.company_id}`">
                {{ group.company_title }}
              </n-link>
            </div>

            <v-data-table
              :headers="orders_headers_mobile"
              :items="group.orders"
              hide-default-footer
              mobile-breakpoint="0"
              :sort-by="sortBy"
              class="elevation-0 hide-mobile-table-header"
            >
              <template
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
                    Показывать
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
              <template #item="{item}">
                <tr
                  :style="`background-color: ${getBGColor(item.valid_to)}`"
                  @click="goToOrderCompany(item)"
                >
                  <td
                    class="text-start text-no-wrap text-truncate"
                    style="max-width: 130px;"
                  >
                    <a>
                      № {{ item.number }}
                    </a>
                  </td>
                  <td class="text-start text-no-wrap">
                    {{ $helpers.convertDateTcsm(item.approved_at) }}
                  </td>
                  <td class="text-start text-no-wrap">
                    {{ $helpers.convertDateTcsm(item.valid_to) }}
                  </td>
                  <td class="text-start pl-0">
                    <v-btn
                      color="#818181"
                      text
                      min-width="0"
                      class="px-0"
                    >
                      <v-icon large>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
    import SortMobile from "../SortMobile";
    import SearchFiltersBtn from "../SearchFiltersBtn";
    export default {
        name: "UserOrders",
      components: {SearchFiltersBtn, SortMobile},
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
              sortBy: null,
              sortByList: [
                {
                  key: 'number',
                  label: 'Договор'
                },
                {
                  key: 'valid_to',
                  label: 'Статус'
                },
              ],

              orders_headers: [
                  {text: 'Компания', value: 'company.title'},
                  {text: 'Договор №', value: 'number'},
                  {text: 'Действует до', value: 'valid_to'},
                  {text: 'Срок, дн', value: 'days'},
              ],
              orders_items: [],

              orders_headers_mobile: [
                {text: 'Договор', value: 'number', sortable: false, width: '40px'},
                {text: 'Дата договора', value: 'approved_at', sortable: false,},
                {text: 'Срок действия', value: 'status', sortable: false,},
                {text: '', value: '', sortable: false, width: '40px'},
              ],

              orders_mobile: [],

              queryOptions: {
                  userId: '',
                  filterValidTo: '',
                  searchText: '',
              },
              filterCompanyOnPage:'',
              filterCompanyAutocomplete: '',
              userCompaniesList: [],
            }
        },
        mounted() {
          this.loadData();
          this.loadCompanies();
        },
        methods:{

          /**
           * Смена значения в фильтре компании
           */
          changeCompanyFilter(item) {
            if (!this.$helpers.isMobile()) {
              this.filterCompanyOnPage = item;
              this.loadData();
            }
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
          getBGColor(date) {
            if (!!!Date.parse(date) || new Date(Date.parse(date)) > new Date()) {
              return this.$config.bgGreen;
            }
            return '';
          },
          getLinkCompany(company_id){
            if(this.$auth.user.role_id==1){
                return `/manage/companies/${company_id}`;
            }
            return `/cabinet/companies/${company_id}`;
          },
          goToOrderCompany(orderItem){
            // console.log(orderItem);
            if(this.$auth.user.role_id==1){
                this.$router.push(`/manage/companies/${orderItem.company.id}`);
                return;
            }
            this.$router.push(`/cabinet/companies/${orderItem.company.id}`);
            return;
          },
          async loadData(){
            this.filterCompanyOnPage = this.filterCompanyAutocomplete ? this.filterCompanyAutocomplete : '';
            this.$emit('change-count-filters', this.$helpers.countActiveFilters(Object.assign({}, this.queryOptions, {filterCompany: this.filterCompanyOnPage}), ['userId']));

            let userId = this.$auth.user.id;
            if(this.userId){
                userId = this.userId;
            }

            this.queryOptions.userId = userId;
            let {data} = (await this.$api.CompanyOrder.list(Object.assign({}, this.queryOptions, {filterCompany: this.filterCompanyOnPage}))).data;
            this.orders_items = data.items;

            this.groupOrders();
          },
          groupOrders() {
            if (this.orders_items.length == 0) {
              this.orders_mobile = [{
                company_title: '',
                orders: []
              }];
              return;
            }
            let groups = [];
            let company_id = null;
            this.orders_items.sort(this.compareOrders);
            this.orders_items.map((order) => {
              if (company_id != order.company.id) {
                company_id = order.company.id;
                groups.push({
                  company_title: order.company.title,
                  company_id: order.company.id,
                  orders: [order],
                });
              }else{
                groups[groups.length - 1].orders.push(order);
              }
            });

            this.orders_mobile = groups;
            // console.log(this.orders_mobile);
          },
          compareOrders(order1, order2) {
            if (order1.company.title > order2.company.title) {
              return 1;
            }
            if (order1.company.title === order2.company.title) {
              return 0;
            }
            return -1;
          }

            // showDialogItems(item){
            //     console.log("item", item);
            //     this.invoice_items: item.items;
            // }
        }
    }
</script>

<style scoped>

</style>