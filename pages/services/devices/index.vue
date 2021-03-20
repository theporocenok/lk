<template>
  <div>
    <SortFilterTitle
      title="Средства измерений"
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
          cols="12"
          sm="10"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Название / Серийный номер / № ГРСИ / Описание"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>

        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pt-0' : ''}`"
          cols="12"
          sm="2"
        >
          <SearchFiltersBtn
            :show-filters="showFilters"
            @refresh="refreshDevices"
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
      :model="$user.ServiceDevice"
      :show-sort="showSort"
      :auto-query="!$helpers.isMobile()"
      group-by
      :mobile-breakpoint="0"
      :custom-headers="$helpers.isMobile() ? mobile_headers : []"
      :custom-item="$helpers.isMobile()"
    >
      <template #action_buttons_after="{item}">
        <v-btn
          small
          @click="showServicesModal(item)"
        >
          Список услуг
        </v-btn>
      </template>
      <template #custom_item="{item}">
        <tr @click="showServicesModal(item)">
          <td
            class="text-start"
            style="padding-top: 10px !important; padding-bottom: 10px !important;"
          >
            <div class="text--black mb-1">
              {{ item.title }}
            </div>
            <div style="color: #5F616F;">
              {{ item.description }}
            </div>
          </td>
          <td class="text-start">
            <v-layout
              justify-space-between
              align-center
            >
              <div class="text-no-wrap mr-2">
                {{ item.grsi }}
              </div>
              <div>
                <v-btn
                  min-width="0"
                  width="35"
                  color="#818181"
                  text
                >
                  <v-icon large>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </v-layout>
          </td>
        </tr>
      </template>
    </Crud>
    <TcsmDialog
      max-width="80vh"
      :dialog="servicesModalShow"
      @close-dialog="servicesModalShow = false"
    >
      <template v-slot:main>
        <ServicesTable
          none-elevation
          :services="servicesModal"
        />
      </template>
    </TcsmDialog>
    <ServicesModal
      v-if="false"
      :dialog="servicesModalShow"
      :services="servicesModal"
      @close-dialog="servicesModalShow = false"
    />
  </div>
</template>

<script>
  import Crud from "../../../components/CRUD/Index";
  import ServicesModal from "../../../components/page/Requests/ServicesModal";
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  import TcsmDialog from "../../../components/page/Dialogs/tcsmDialog";
  import ServicesTable from "../../../components/page/Requests/ServicesTable";
  export default {
    name: "",
    components: {ServicesTable, TcsmDialog, SortFilterTitle, SearchFiltersBtn, ServicesModal, Crud},
    props: {
    },
    data() {
      return {
        showFilters: false,
        showSort: false,

        refresh:false,
        servicesModalShow: false,
        servicesModal: [],
        queryOptions: {
          searchText: '',
        },
        countFilters: 0,
        active_items: [],
        roles: [],

        mobile_headers: [
          {text: 'Наименование', value: 'title_mobile', sortable: false},
          {text: 'ГРСИ', value: 'grsi_mobile', sortable: false},
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
    },
    mounted() {
      // this.loadData();
    },
    methods: {

      /**
       * Обновляем список устройств после добавления фильтров
       */
      refreshDevices() {
        this.countFilters = this.$helpers.countActiveFilters(this.queryOptions);
        this.refresh = true;
        this.showFilters = false;
      },
      showServicesModal(item) {
        this.servicesModal = item.services;
        this.servicesModalShow = true;
      },
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