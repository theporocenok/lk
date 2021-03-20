<template>
  <div>
    <SortFilterTitle
      title="Мои средства измерений"
      show-add-btn
      :count-filters="countFilters"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
      @add-action="newSI"
    />

    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pb-0' : ''}`"
          cols="12"
          lg="4"
          md="12"
          sm="12"
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
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          lg="3"
          md="5"
          sm="5"
        >
          <v-autocomplete
            v-model="filterCompanyAutocomplete"
            label="Компания"
            :items="userCompanies"
            clearable
            item-value="id"
            item-text="title"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            auto-select-first
            @change="changeCompanyFilter"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          lg="3"
          md="5"
          sm="5"
        >
          <v-text-field
            v-model="queryOptions.filterAddress"
            label="Адрес"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-spacer />
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : 'justify-end'}`"
          cols="12"
          lg="1"
          md="2"
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

    <SortMobile
      :sort-by-list="sortByList"
      :show-sort="showSort"
      @refresh="refreshSort"
    />
    <template v-if="!$helpers.isMobile()">
      <Crud
        :hide-default-footer="false"
        :show-title="false"
        :refresh.sync="refresh"
        :query-options="queryOptions"
        :model="$user.CompanyDevice"
        :create-button-callback="newSI"
        :hide-create-btn="$helpers.isMobile()"
        :dbl-click-callback="editDevice"
        :auto-query="!$helpers.isMobile()"
        :mobile-breakpoint="0"
        :hide-default-header="$helpers.isMobile()"
        :custom-item="$helpers.isMobile()"
        :elevation="$helpers.isMobile() ? '0' : ''"
      >
        <template #item.title="{item}">
          <div>
            <span class="body-2">{{ item.device.title }}</span> ({{ item.device.description }}) <br>
            <span class="caption text--secondary">{{ item.title }}</span>
          </div>
        </template>
        <template #item.device.grsi="{item}">
          <div class="text-no-wrap">
            {{ item.device.grsi }} <br>
            <span class="font-weight-light mt-1">{{ item.year }}</span>
          </div>
        </template>
        <template #item.last_calibration="{item}">
          <div
            v-if="false"
            class=""
          >
            {{ $helpers.addDaysToDate(item.last_calibration, (item.device)?item.device.calibration_days:null) }}
          </div>
          <div>
            {{ !!item.last_calibration ? $helpers.convertDate(item.last_calibration, 'DD MMMM YYYY') : '' }}
          </div>
        </template>
        <template #item.company.title="{item}">
          <n-link :to="getLinkCompany(item.company.id)">
            {{ item.company.title }}
          </n-link>
          <div class="font-italic caption">
            ИНН {{ item.company.inn }} / КПП {{ item.company.ogrn }} / ОГРН {{ item.company.ogrn }}
          </div>
        </template>
        <template #action_buttons_after="{item}">
          <v-btn
            icon
            class="mr-2"
            @click="showDevice(item)"
          >
            <v-icon>
              info
            </v-icon>
          </v-btn>
          <v-btn
            icon
            class="mr-2"
            @click="editDevice(item)"
          >
            <v-icon>
              edit
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click="openDeleteDeviceDialog(item)"
          >
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </template>
        <template
          v-if="$helpers.isMobile()"
          #custom_item="{item}"
        >
          <div
            class="font-family--rubik px-4 py-5"
            style="border-top: 1px solid #e5e5e5"
          >
            <v-layout
              justify-space-between
              class="mb-4"
            >
              <div>
                <div
                  class="caption"
                  style="color: #222;"
                >
                  {{ item.device.title }} ({{ item.device.description }})
                </div>
                <div
                  v-if="item.title"
                  class="overline mt-2 text-none font-weight-regular"
                  style="letter-spacing: unset !important; color: #666;"
                >
                  {{ item.title }}
                </div>
              </div>
              <v-layout
                style="flex: 0 0 28%"
                justify-space-between
                :wrap="false"
              >
                <v-btn
                  height="25"
                  width="25"
                  icon
                  class="mr-2"
                  @click="showDevice(item)"
                >
                  <v-icon>
                    info
                  </v-icon>
                </v-btn>
                <v-btn
                  height="25"
                  width="25"
                  icon
                  class="mr-2"
                  @click="editDevice(item)"
                >
                  <v-icon>
                    edit
                  </v-icon>
                </v-btn>
                <v-btn
                  height="25"
                  width="25"
                  icon
                  @click="openDeleteDeviceDialog(item)"
                >
                  <v-icon>
                    delete
                  </v-icon>
                </v-btn>
              </v-layout>
            </v-layout>
            <v-layout justify-space-between>
              <div>
                <div
                  class="overline text-none mb-2"
                  style="letter-spacing: unset !important;"
                >
                  № и серия ГРСИ
                </div>
                <div
                  class="caption"
                  style="color: #3C64B1;"
                >
                  {{ item.device.grsi }}
                </div>
              </div>
              <div>
                <div
                  class="overline text-none mb-2"
                  style="letter-spacing: unset !important;"
                >
                  Серийный номер
                </div>
                <div
                  class="caption"
                  style="color: #3C64B1;"
                >
                  {{ item.serial_number ? item.serial_number : '-' }}
                </div>
              </div>
              <div>
                <div
                  class="overline text-none mb-2"
                  style="letter-spacing: unset !important;"
                >
                  Последняя поверка
                </div>
                <div
                  class="caption text-decoration-underline"
                  :style="`color: ${lastCalibrationColor(item.last_calibration, item.calibration_months)}`"
                >
                  {{ item.last_calibration ? $helpers.convertDateTcsm(item.last_calibration) : '-' }}
                </div>
              </div>
            </v-layout>
          </div>
        </template>
      </Crud>
    </template>
    <template v-else>
      <template
        v-for="(company, key) in filtredCompanies"
      >
        <div
          :key="key"
          class="mb-5"
        >
          <div
            v-if="userCompaniesList.length > 1"
            class="font-family--rubik px-4 mb-2 subtitle-1"
          >
            <n-link :to="`/cabinet/companies/${company.id}`">
              {{ company.title }}
            </n-link>
          </div>
          <Crud
            :hide-default-footer="false"
            :show-title="false"
            :refresh.sync="refresh"
            :query-options="Object.assign({}, queryOptions, {filterCompany: company.id, sortBy: sortBy, sortDesc: sortDesc})"
            :model="$user.CompanyDevice"
            :create-button-callback="newSI"
            hide-create-btn
            :dbl-click-callback="editDevice"
            :auto-query="false"
            :show-sort="false"
            group-by
            :mobile-breakpoint="0"
            :hide-default-header="$helpers.isMobile()"
            custom-item
            elevation="0"
          >
            <template
              v-if="$helpers.isMobile()"
              #custom_item="{item}"
            >
              <div
                class="font-family--rubik px-4 py-5"
                style="border-top: 1px solid #e5e5e5"
              >
                <v-layout
                  justify-space-between
                  class="mb-4"
                >
                  <div>
                    <div
                      class="caption font-weight-bold font-family--rubik"
                      style="color: #222;"
                    >
                      {{ item.device.title }} ({{ item.device.description }})
                    </div>
                    <div
                      v-if="item.title"
                      class="overline mt-1 text-none font-weight-regular font-family--rubik"
                      style="letter-spacing: unset !important; color: #666; line-height: normal;"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                  <v-layout
                    style="flex: 0 0 28%"
                    justify-space-between
                    :wrap="false"
                  >
                    <v-btn
                      height="25"
                      width="25"
                      icon
                      class="mr-2"
                      @click="showDevice(item)"
                    >
                      <v-icon>
                        info
                      </v-icon>
                    </v-btn>
                    <v-btn
                      height="25"
                      width="25"
                      icon
                      class="mr-2"
                      @click="editDevice(item)"
                    >
                      <v-icon>
                        edit
                      </v-icon>
                    </v-btn>
                    <v-btn
                      height="25"
                      width="25"
                      icon
                      @click="openDeleteDeviceDialog(item)"
                    >
                      <v-icon>
                        delete
                      </v-icon>
                    </v-btn>
                  </v-layout>
                </v-layout>
                <v-layout justify-space-between>
                  <div>
                    <div
                      class="overline text-none mb-1 font-family--rubik"
                      style="letter-spacing: unset !important; line-height: normal"
                    >
                      № и серия ГРСИ
                    </div>
                    <div
                      class="caption font-family--rubik"
                      style="color: #3C64B1;"
                    >
                      {{ item.device.grsi }}
                    </div>
                  </div>
                  <div>
                    <div
                      class="overline text-none mb-1 font-family--rubik"
                      style="letter-spacing: unset !important; line-height: normal"
                    >
                      Серийный номер
                    </div>
                    <div
                      class="caption font-family--rubik"
                      style="color: #3C64B1;"
                    >
                      {{ item.serial_number ? item.serial_number : '-' }}
                    </div>
                  </div>
                  <div>
                    <div
                      class="overline text-none mb-1 font-family--rubik"
                      style="letter-spacing: unset !important; line-height: normal"
                    >
                      Последняя поверка
                    </div>
                    <div
                      class="caption text-decoration-underline font-family--rubik"
                      :style="`color: ${lastCalibrationColor(item.last_calibration, item.calibration_months)}`"
                    >
                      {{ item.last_calibration ? $helpers.convertDateTcsm(item.last_calibration) : '-' }}
                    </div>
                  </div>
                </v-layout>
              </div>
            </template>
          </Crud>
        </div>
      </template>
    </template>
    <ServiceDeviceModal
      :edit="canEditDevice"
      :dialog="deviceModalDialog"
      :device="currentDevice"
      :user-companies="userCompanies"
      @close-dialog="closeServiceDeviceModal"
      @save-device="refresh = true"
    />
    <ConfirmDialog
      :dialog="deleteDeviceDialog"
      confirm-text="удалить ваше СИ?"
      @accept="deleteDevice"
      @decline="closeDeleteDeviceDialog"
    />
  </div>
</template>

<script>
  import Crud from "../../../components/CRUD/Index"
  import ServiceDeviceModal from "../../../components/page/Requests/ServiceDeviceModal";
  import ConfirmDialog from "../../../components/page/Dialogs/ConfirmDialog";
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  import SortMobile from "../../../components/page/SortMobile";
  export default {
    name: "",
    components: {
      SortMobile,
      SortFilterTitle,
      SearchFiltersBtn,
      ConfirmDialog,
      ServiceDeviceModal, Crud},
    props: {
    },
    data() {
      return {
        showFilters: false,
        showSort: false,
        sortBy: '',
        sortByList: [
          {
            key: 'last_calibration',
            label: 'Последняя поверка'
          },
          {
            key: 'title',
            label: 'Название'
          },
        ],
        
        refresh:false,
        canEditDevice: false,
        currentDevice: {},
        deviceModalDialog: false,
        queryOptions: {
          filterAddress: '',
          searchText: '',
        },
        filterCompanyOnPage: '',
        filterCompanyAutocomplete: '',
        countFilters: 0,
        active_items: [],
        roles: [],
        userCompanies: [],
  
        deleteDeviceDialog: false,
        deleteDeviceId: -1,

        userCompaniesList: [],
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
      }
    },
    mounted() {
      this.loadData();
      this.getUserCompaniesList(this.$auth.user.id);
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
       * Смена значения в фильтре компании
       */
      changeCompanyFilter(item) {
        if (!this.$helpers.isMobile()) {
          this.filterCompanyOnPage = item;
          this.refresh = true;
        }
      },

      /**
       * Обновляем список устройств после добавления фильтров
       */
      refreshDevices() {
        this.filterCompanyOnPage = this.filterCompanyAutocomplete;
        this.countFilters = this.$helpers.countActiveFilters(this.queryOptions);
        this.refresh = true;
        this.showFilters = false;
      },
      lastCalibrationColor(last_calibration, calibration_months) {
        let lCalibration = new Date(Date.parse(last_calibration));
        let sumMonths = !!calibration_months ? calibration_months : 0;
        lCalibration.setMonth(lCalibration.getMonth() + sumMonths);
        if (lCalibration < new Date()) {
          return '#FE0002';
        }
        return this.$config.defaultColor;
      },
      async getUserCompaniesList(userID) {
        let {data} = (await this.$api.User.companies(userID)).data;
        this.userCompaniesList = data.companies;
      },
      newSI () {
        this.currentDevice = {};
        this.canEditDevice = true,
        this.deviceModalDialog = true;
      },
      showDevice(item) {
        this.currentDevice = item;
        this.deviceModalDialog = true;
      },
      editDevice(item) {
        this.canEditDevice = true;
        this.currentDevice = item;
        this.deviceModalDialog = true;
      },
      async deleteDevice() {
        try {
          await this.$api.CompanyDevice.delete(this.deleteDeviceId);
          this.refresh = true;
          this.closeDeleteDeviceDialog();
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке удаления СИ',
            color: 'error'
          });
        }
      },
      openDeleteDeviceDialog(item){
        this.deleteDeviceId = item.id;
        this.deleteDeviceDialog = true;
      },
      closeDeleteDeviceDialog(){
        this.deleteDeviceId = -1;
        this.deleteDeviceDialog = false;
      },
      closeServiceDeviceModal() {
        this.currentDevice = {};
        this.canEditDevice = false;
        this.deviceModalDialog = false;
      },
      getLinkCompany(company_id){
        if(this.$auth.user.role_id==1){
          return `/manage/companies/${company_id}`;
        }
        return `/cabinet/companies/${company_id}`;
      },
      async loadData(){
        try {
          let userID = this.$auth.user.id;
          let {data} = (await this.$api.User.companies(userID)).data;
          this.userCompanies = data.companies;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при получении списка компаний пользователя',
            color: 'error'
          });
        }
      },
    },

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

<style scoped>

</style>