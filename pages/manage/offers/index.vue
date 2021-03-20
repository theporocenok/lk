<template>
  <div>
    <SortFilterTitle
      title="Заявки на коммерческое предложение"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
    />

    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          :class="`d-flex pb-0 ${$helpers.isMobile() ? '' : 'pt-0'}`"
          cols="12"
          lg="2"
          md="2"
          sm="6"
        >
          <v-autocomplete
            v-model="queryOptions.filterStatus"
            label="Статус заявки"
            :items="statuses"
            item-value="id"
            item-text="title"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          class="d-flex pt-0 pb-0"
          cols="12"
          lg="4"
          md="4"
          sm="6"
        >
          <v-autocomplete
            v-model="queryOptions.filterCompany"
            label="Компания"
            :items="userCompanies"
            clearable
            item-value="id"
            item-text="title"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            :no-data-text="noDataCompanyText"
            :search-input.sync="searchCompanies"
            @keyup="searchCompanyFunc"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          class="d-flex pt-0 pb-0"
          cols="12"
          lg="3"
          md="3"
          sm="6"
        >
          <v-menu
            ref="datePicker"
            v-model="datePicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="last_calibration"
                v-model="textDateRange"
                label="Дата отправки на рассмотрение"
                :prepend-icon="`${$helpers.isMobile() ? '' : 'event'}`"
                :append-icon="`${$helpers.isMobile() ? 'event' : ''}`"
                :outlined="$helpers.isMobile()"
                readonly
                clearable
                v-bind="attrs"
                :color="$config.defaultColor"
                v-on="on"
                @click:clear="clearDateRange"
              />
            </template>
            <v-date-picker
              v-model="filterDateRange"
              no-title
              range
              locale="ru"
              :color="$config.defaultColor"
              @change="changeDate"
            >
              <v-spacer />
              <v-btn
                text
                :color="$config.defaultColor"
                @click="datePicker = false"
              >
                Отмена
              </v-btn>
              <v-btn
                :color="$config.defaultColor"
                text
                @click="datePicker = false"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col
          class="d-flex pt-0 pb-0"
          cols="6"
          lg="2"
          md="2"
          sm="3"
        >
          <v-checkbox
            v-model="queryOptions.filterUrgency"
            label="Срочность"
            :color="$config.defaultColor"
            clearable
            on-icon="mdi-checkbox-marked-outline"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-spacer />
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : 'justify-end'}`"
          cols="126"
          lg="12"
          md="1"
          sm="12"
        >
          <v-row
            v-if="!$helpers.isMobile() || showFilters"
            :class="`${$helpers.isMobile() ? 'ml-1 mr-1' : ''}`"
          >
            <v-col
              :class="`d-flex pt-0 ${$helpers.isMobile() ? 'px-0' : ''}`"
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
        </v-col>
      </v-row>
    </v-expand-transition>

    <Crud
      :hide-default-footer="false"
      :show-title="false"
      :refresh.sync="refresh"
      :query-options="queryOptions"
      :model="$admin.CompanyOffer"
      :create-button-callback="newOffer"
      :dbl-click-callback="dblClickOffer"
      :auto-query="!$helpers.isMobile()"
      :show-sort="showSort"
      class="offer--crud"
      :element-id-to-get="getElementId"
      @open-dialog="editOffer"
    >
      <template #item.company.title="{item}">
        <n-link :to="getLinkCompany(item.company.id)">
          {{ item.company.title }}
        </n-link>
        <div class="font-italic caption">
          ИНН {{ item.company.inn }} / КПП {{ item.company.kpp }} / ОГРН {{ item.company.ogrn }}
        </div>
      </template>
      <template #item.urgency_services_count="{item}">
        {{ item.urgency_services_count?'Да':'-' }}
      </template>
      <template #item.created_at="{item}">
        {{ $helpers.convertDate(item.created_at) }}
      </template>
      <template #item.number="{item}">
        <template v-if="item.number && item.approved_at">
          № {{ item.number }}
          <div class="font-italic caption">
            <span class="font-weight-light mt-1">от {{ $helpers.convertDate(item.approved_at) }}</span>
          </div>
        </template>
      </template>
      <template #item.calculated.sum="{item}">
        <div style="white-space: nowrap;">
          {{ item.calculated ? item.calculated.sum_with_vat.toLocaleString('ru-RU') : '0' }} руб.
        </div>
        <div
          v-if="!!item.calculated.sum"
          class="font-italic caption"
          style="white-space: nowrap;"
        >
          <span class="font-weight-light mt-1">В т.ч. НДС {{ item.calculated.sum_vat.toLocaleString('ru-RU') }} руб.</span>
        </div>
      </template>
      <template #item.status.title="{item}">
        <div
          v-if="true"
          :style="`background-color: ${item.status.color}`"
          class="text-no-wrap pa-2 text-center"
          @click="item.editStatus = true"
        >
          {{ item.status.title }}
        </div>
        <v-select
          v-else
          v-model="item.status.id"
          :background-color="getStatusColor(item.status.id)"
          :items="statuses"
          item-value="id"
          item-text="title"
        />
      </template>
      <template #item.contact_title="item">
        {{ item.item.contact_title }}
        <br v-if="item.item.contact_phone && item.item.contact_title">
        <a
          v-if="item.item.contact_phone"
          :href="`tel:${item.item.contact_phone}`"
        >{{ item.item.contact_phone }}</a>
      </template>
      <template #action_buttons_after="{item}">
        <div
          v-if="!refresh"
          class="d-flex flex-nowrap"
        >
          <template v-if="item.status.id === $config.offerStatuses.newOffer">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="mr-1 order-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="editOffer(item)"
                >
                  <v-icon>
                    edit
                  </v-icon>
                </v-btn>
              </template>
              <span>Редактировать</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="mr-1 order-3"
                  v-bind="attrs"
                  v-on="on"
                  @click="openCancelOfferDialog(item)"
                >
                  <v-icon>
                    mdi-close
                  </v-icon>
                </v-btn>
              </template>
              <span>Отменить заявку</span>
            </v-tooltip>
          </template>
          <template v-if="item.status.id === $config.offerStatuses.underConsideration">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="mr-1 order-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="editOffer(item)"
                >
                  <v-icon>
                    edit
                  </v-icon>
                </v-btn>
              </template>
              <span>Редактировать</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="mr-1 order-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="openConfirmModal('перевести заявку в статус Подготовлено КП?', item)"
                >
                  <v-icon>
                    mdi-share
                  </v-icon>
                </v-btn>
              </template>
              <span>Перевести в статус "Подготовлено КП"</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="mr-1 order-3"
                  v-bind="attrs"
                  v-on="on"
                  @click="openCancelOfferDialog(item)"
                >
                  <v-icon>
                    mdi-close
                  </v-icon>
                </v-btn>
              </template>
              <span>Отменить заявку</span>
            </v-tooltip>
          </template>
          <template v-if="item.status.id === $config.offerStatuses.sentOffer">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="mr-1 order-0"
                  v-bind="attrs"
                  v-on="on"
                  @click="showOffer(item)"
                >
                  <v-icon>
                    mdi-eye
                  </v-icon>
                </v-btn>
              </template>
              <span>Просмотр</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  target="_blank"
                  class="mr-1 order-4"
                  v-bind="attrs"
                  v-on="on"
                  @click="printOffer(item)"
                >
                  <v-icon>
                    mdi-download
                  </v-icon>
                </v-btn>
              </template>
              <span>Скачать КП</span>
            </v-tooltip>
          </template>
          <template v-if="item.status.id === $config.offerStatuses.canceled">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="mr-1 order-0"
                  v-bind="attrs"
                  v-on="on"
                  @click="showOffer(item)"
                >
                  <v-icon>
                    mdi-eye
                  </v-icon>
                </v-btn>
              </template>
              <span>Просмотр</span>
            </v-tooltip>
          </template>
        </div>
      </template>
    </Crud>
    <OfferEditModal
      :dialog="offer_dialog"
      :offer="offer_selected"
      :edit="offer_editable"
      @show-preview="printOffer"
      @save-offer="refresh = true"
      @close-dialog="closeOffer"
    />
    <OfferCancelModalAdmin
      :dialog="cancelOfferDialog"
      :company-offer-id="cancelOfferId"
      @close-dialog="closeCancelOfferDialog"
    />
    <ConfirmDialog
      :dialog="confirmDialog"
      :confirm-text="confirmText"
      @accept="readyOffer"
      @decline="closeConfirmModal"
    />
  </div>
</template>

<script>
  import Crud from '~/components/CRUD/Index';
  import OfferEditModal from "../../../components/page/Offer/OfferEditModal";
  import OfferCancelModalAdmin from "../../../components/page/Offer/OfferCancelModalAdmin";
  import ConfirmDialog from "../../../components/page/Dialogs/ConfirmDialog";
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  
  export default {
    components: {
      SearchFiltersBtn,
      SortFilterTitle,
      ConfirmDialog,
      OfferCancelModalAdmin,
      OfferEditModal,
      Crud
    },
    data() {
      return {
        showFilters: false,
        showSort: false,

        //Разрешённые для редактирования статусы
        editableStatuses: [this.$config.offerStatuses.newOffer, this.$config.offerStatuses.underConsideration],

        // меню дейтпикеров
        menuIssuedAt: false,
        menuPayedAt: false,
        
        // модалка
        offer_dialog: false,
        offer_editable: false,
        offer_selected: {},


        datePicker: false,
        companySearchTimeout: null,
        noDataCompanyText: 'Необходимо ввести минимум 3 символа',
        searchCompanies: '',
        userCompanies: [],
        userCompaniesForTable: [],
        statuses: [],
        filterDateRange: [],
        
        refresh: false,
        // queryOptions
        queryOptions: {
          searchText: '',
          filterIssuedAt: [],
          filterPayedAt: [],
          filterPayed: '',
          filterReady: '',
          filterCompany: '',
          filterUrgency: '',
          filterType: '',
          filterDateRange: [],
          invoice_type_id: 2,
        },

        //Всплывайка отмены заявки
        cancelOfferDialog: false,
        cancelOfferId: -1,

        //Всплывайка подтверждения
        confirmDialog: false,
        confirmText: '',
        confirmCallback: null,
        confirmItemId: -1,

        getElementId: null,
      };
    },
    computed: {
      datePayedAtText() {
        return this.queryOptions.filterPayedAt.join(' ~ ');
      },
      dateIssuedAtText() {
        return this.queryOptions.filterIssuedAt.join(' ~ ');
      },
      dateRange() {
        return this.queryOptions.filterDateRange;
      },
      textDateRange() {
        return _.isArray(this.filterDateRange)
                ? this.filterDateRange.join(' ~ ')
                : '';
      }
    },
    watch: {
      filterDateRange: function (val) {
        if (!val) {//При очистке фильтра дат задаём пустой массив вместо null
          this.filterDateRange = [];
          this.queryOptions.filterDateRange = [];
        }
      },
    },
    mounted() {
      this.$store.dispatch('loadRegions');
      this.$store.dispatch('loadLaboratories');
      this.$store.dispatch('loadTransService');
      this.loadStatuses();
      // this.loadTypes();
      // this.loadCompanies();
      if (!!this.$route.query && !!this.$route.query.edit) {
        this.getElementId = this.$route.query.edit;
      }
    },
    methods: {

      //Список компаний для внутренней таблицы?????????????????????????????????????????????? Зачем он там нужен?
      //Для администратора не нужен
      // async loadCompanies() {
      //   let {data} = (await this.$api.User.companies()).data;
      //   this.userCompaniesForTable = data.companies;
      // },

      /**
       * Сортировка дат при изменении
       */
      changeDate() {
        if (!this.filterDateRange || this.filterDateRange.length === 1 ) {
          return;
        }

        let firstDate = this.filterDateRange[0];
        let secondDate = this.filterDateRange[1];
        if (firstDate>secondDate) {
          this.filterDateRange = Object.assign([], [secondDate, firstDate]);
        }
        this.queryOptions.filterDateRange = this.filterDateRange;
        this.datePicker = false;
      },


      /**
       * Запрос всех возможных статусов заявок для фильтра
       * @returns {Promise<void>}
       */
      async loadStatuses() {
        try {
          let {data} = (await this.$api.CompanyOffer.listStatuses(true)).data;
          this.statuses = data.statuses;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка загрузки статусов заявок на КП',
            color: 'error'
          });
        }
      },

      /**
       * Запрос всех возможных видов работ для фильтров
       * @returns {Promise<void>}
       */
      async loadTypes() {
        try {
          let {data} = (await this.$api.Service.getTypes()).data;
          this.types = data.types;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка загрузки типов услуг',
            color: 'error'
          });
        }
      },


      /**
       * Обработчик поиска компании
       */
      searchCompanyFunc() {
        this.findCompany();
      },

      /**
       * Поиск компании по введённым символам
       * @param searchText - Переменная для поиска текста
       * @param noData - Текст при отсутствии результатов поиска
       * @param timeout - Таймер на запрос (не чаще 500мс)
       * @param companiesList - Список компаний по запросу
       * @returns {Promise<void>}
       */
      async findCompany(searchText = this.searchCompanies,
                        noData = this.noDataCompanyText,
                        timeout = this.companySearchTimeout,
                        list = this.userCompanies) {
        //Если переменная поиска пуста или её длина менее 3 символов
        //Обнуляем массив компаний, выводим сообщение о недостаточной длине
        if (!searchText || searchText.length < 3) {
          noData = "Необходимо ввести минимум 3 символа";
          list.splice(0);
          return;
        }

        noData = 'Поиск...';
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          try {

            let {data} = (await this.$api.Company.find({searchText: searchText, hasOffers: true})).data;
            if (data.items.length == 0) {
              noData = "Ничего не найдено";
              list.splice(0);
            }else{
              let outerThis = this;
              data.items.map(function (item, key) {
                outerThis.$set(list, key, item);
              });
            }

            clearTimeout(timeout);

          }catch{
            this.$store.commit('setSnackParams', {
              text: 'Ошибка при поиске компаний',
              color: 'error'
            });
          }
        }, 500);
      },


      /**
       * Форма создания заявки на КП
       */
      newOffer() {
        this.offer_selected = {};
        this.offer_editable = true;
        this.offer_dialog = true;
      },

      /**
       * Открыть/редактировать заявку по двойнопу клику
       */
      dblClickOffer(item) {
        if (this.editableStatuses.includes(item.status.id)) {
          this.editOffer(item);
        }else{
          this.showOffer(item);
        }
      },

      /**
       * Форма показа заявки на КП
       * @param item - заявка на КП
       */
      showOffer(item) {
        this.offer_selected = item;
        this.offer_dialog = true;
      },

      /**
       * Форма изменения заявки на КП
       * @param item - заявка на КП
       */
      editOffer(item) {
        // this.offer_selected = item;
        this.offer_selected = Object.assign({}, item);
        this.offer_editable = true;
        this.offer_dialog = true;
      },

      /**
       * Закрыть форму просмотра/редактирования заявки на КП
       * Обнулить все передаваемые в неё значения
       */
      closeOffer() {
        this.offer_selected = {};
        this.offer_editable = false;
        this.offer_dialog = false;
        this.refresh = true;
      },

      /**
       * Открытие формы отмены заявки на КП
       */
      openCancelOfferDialog (item) {
        this.cancelOfferId = item.id;
        this.cancelOfferDialog = true;
      },

      /**
       * Закрытие формы отмены заявки на КП
       */
      closeCancelOfferDialog () {
        this.cancelOfferId = -1;
        this.cancelOfferDialog = false;
        this.refresh = true;
      },


      /**
       * Получение ссылки на компанию в списке
       * @param company_id - id компании
       * @returns {string} - Ссылка на компанию
       */
      getLinkCompany(company_id) {
        if (this.$auth.user.role_id == 1) {
          return `/manage/companies/${company_id}`;
        }
        return `/cabinet/companies/${company_id}`;
      },

      /**
       * Очистка фильтра по датам
       */
      clearDateRange() {
        this.filterDateRange = [];
        this.queryOptions.filterDateRange = [];
      },

      /**
       * Получение цвета background статуса
       * @param id - id статуса
       * @returns {*}
       */
      getStatusColor(id) {
        let status = this.statuses.find(function (status) {
          return status.id === id;
        });
        return status.color;
      },

      //Временная функция для получения ссылки на скачивание файла
      getDownloadLink(item) {
        return `${process.env.API_HOST}v1/company-offers/${item.id}/offer`;
      },


      /*Методы для заявки без всплываек*/

      /**
       * Загрузка файла заявки
       * @param item - заявка
       * @returns {Promise<void>}
       */
      async printOffer(item) {
        try {
          await this.$api.CompanyOffer.printOffer(item.id);
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при загрузке КП',
            color: 'error'
          });
        }
      },

      /**
       * Перевод заявки в статус "Подготовлено КП"
       * @param item - заявка
       * @returns {Promise<void>}
       */
      async readyOffer() {
        try {
          await this.$api.CompanyOffer.ready(this.confirmItemId);
          this.refresh = true;
          this.closeConfirmModal();
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при формировании КП',
            color: 'error'
          });
        }
      },

      /*Всплывайка с подтверждением действия*/

      openConfirmModal(text, item) {
        this.confirmItemId = item.id;
        this.confirmText = text;
        this.confirmDialog = true;
      },

      closeConfirmModal() {
        this.confirmItemId = -1;
        this.confirmText = '';
        this.confirmCallback = null;
        this.confirmDialog = false;
      },
    },
  };
</script>

<style>
  .offer--crud .v-select__selection {
    margin-left: 5px;
  }
  .offer--crud .v-input__slot {
    border-radius: 3px;
    overflow: hidden;
  }
</style>

<style scoped>

</style>