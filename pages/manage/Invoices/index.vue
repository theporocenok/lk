<template>
  <div>
    <SortFilterTitle
      title="Счета компании"
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
                :prepend-icon="`${$helpers.isMobile() ? '' : 'event'}`"
                :append-icon="`${$helpers.isMobile() ? 'event' : ''}`"
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
              :color="$config.defaultColor"
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
            :item-color="$config.defaultColor"
            :color="$config.defaultColor"
            :outlined="$helpers.isMobile()"
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
                :prepend-icon="`${$helpers.isMobile() ? '' : 'event'}`"
                :append-icon="`${$helpers.isMobile() ? 'event' : ''}`"
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
              scrollable
              :color="$config.defaultColor"
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
            :outlined="$helpers.isMobile()"
            :items="[
              {text:'Готов',value:'1'},
              {text:'Не готов',value:'0'},
            ]"
            clearable
            :color="$config.defaultColor"
            :item-color="$config.defaultColor"
            label="Статус готовности"
          />
        </v-col>
      </v-row>
    </v-expand-transition>
    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          class="d-flex pt-0"
          cols="12"
          sm="10"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по номеру счета, названию компании, ИНН, КПП"
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
      :model="$admin.CompanyInvoice"
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
      <template #item.order.number="{item}">
        <template v-if="item.order">
          {{ item.order.number }}
          <div
            v-if="item.order.approved_at"
            class="font-italic caption"
          >
            от {{ item.order.approved_at }}
          </div>
        </template>
      </template>
      <template #action_buttons_after="{item}">
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
    </Crud>

    <Invoice
      :invoice-item="invoice_selected"
      :invoice-item-id="invoice_selected.id"
      :dialog.sync="invoice_dialog"
    />

    <v-dialog
      v-if="false"
      v-model="invoice_dialog"
      max-width="800"
      content-class="r-dialog"
    >
      <Invoice
        v-if="invoice_dialog"
        :invoice-item="invoice_selected"
        :invoice-item-id="invoice_selected.id"
        :dialog.sync="invoice_dialog"
      />
    </v-dialog>
  </div>
</template>

<script>
  import Crud from '~/components/CRUD/Index';
  import Invoice from "../../../components/page/Invoice/Invoice";
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  
  export default {
    components: {
      SearchFiltersBtn,
      SortFilterTitle,
      Invoice,
      Crud
    },
    data() {
      return {
        showFilters: false,
        showSort: false,

        // меню дейтпикеров
        menuIssuedAt: false,
        menuPayedAt: false,
        
        // модалка
        invoice_dialog: false,
        invoice_selected: {},
        
        refresh: false,
        // queryOptions
        queryOptions: {
          searchText: '',
          filterIssuedAt: [],
          filterPayedAt: [],
          filterPayed: '',
          filterReady: '',
        },
      };
    },
    computed: {
      datePayedAtText() {
        return this.queryOptions.filterPayedAt.join(' ~ ');
      },
      dateIssuedAtText() {
        return this.queryOptions.filterIssuedAt.join(' ~ ');
      },
    },
    methods: {
      getLinkCompany(company_id) {
        if (this.$auth.user.role_id == 1) {
          return `/manage/companies/${company_id}`;
        }
        return `/cabinet/companies/${company_id}`;
      },
      showDialogItems(item) {
        this.invoice_selected = {};
        this.invoice_selected = item;
        // console.log("item", item);
        this.invoice_dialog = true;
      }
    },
    middleware: 'administrator',
  };
</script>

<style scoped>

</style>