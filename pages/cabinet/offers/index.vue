<template>
  <div>
    <SortFilterTitle
      :title="$helpers.isMobile() ? 'Заявки на КП' : 'Заявки на коммерческое предложение'"
      :count-filters="countFilters"
      show-add-btn
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
      @add-action="newOffer"
    />

    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pb-0' : ''}`"
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
            @change="!$helpers.isMobile() ? refresh = true : null"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
          cols="12"
          lg="4"
          md="4"
          sm="6"
        >
          <v-autocomplete
            v-model="filterCompanyAutocomplete"
            label="Компания"
            :items="userCompaniesForTable"
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
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
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
                readonly
                clearable
                v-bind="attrs"
                :outlined="$helpers.isMobile()"
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
          :class="`d-flex ${$helpers.isMobile() ? 'py-0' : ''}`"
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
            :class="`${$helpers.isMobile() ? 'mt-0' : ''}`"
            @change="!$helpers.isMobile() ? refresh = true : null"
          />
        </v-col>
        <v-spacer />
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pt-0' : 'justify-end'}`"
          cols="12"
          lg="1"
          md="1"
          sm="12"
        >
          <SearchFiltersBtn
            :show-filters="showFilters"
            @refresh="refreshOffers"
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
        class="offer--crud"
        :hide-default-footer="false"
        :show-title="false"
        :refresh.sync="refresh"
        :query-options="Object.assign({}, queryOptions, {filterCompany: filterCompanyOnPage})"
        :model="$user.CompanyOffer"
        :create-button-callback="newOffer"
        :dbl-click-callback="dblClickOffer"
        :show-sort="showSort"
        :element-id-to-get="getElementId"
        @open-dialog="showOffer"
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
        <template #item.user_info="item">
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
            <template v-if="item.status.id === $config.offerStatuses.draft">
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
                    @click="openConfirmModal('отправить заявку на рассмотрение?', item)"
                  >
                    <v-icon>
                      mdi-share
                    </v-icon>
                  </v-btn>
                </template>
                <span>Отправить на рассмотрение</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    class="mr-1 order-3"
                    v-bind="attrs"
                    v-on="on"
                    @click="openDeleteOfferDialog('Удалить черновик заявки?',item)"
                  >
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </template>
                <span>Удалить черновик</span>
              </v-tooltip>
            </template>
            <template v-if="item.status.id === $config.offerStatuses.newOffer">
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
            <template v-if="item.status.id === $config.offerStatuses.canceled || item.status.id === $config.offerStatuses.underConsideration">
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
        <template #custom_item="{item}">
          <tr
            class="font-family--rubik"
            :style="!!item.status.color ? 'background-color: rgba(' + $helpers.convertHexToRGB(item.status.color) + ', .1)' : ''"
          >
            <td
              class="text-start"
              @click="dblClickOffer(item)"
            >
              <div
                v-if="item.number"
                style="color: #3C64B1;"
                class="text-decoration-underline mb-1"
              >
                № {{ item.number }}
              </div>
              <div>
                от {{ $helpers.convertDateTcsm(item.created_at) }}
              </div>
            </td>
            <td
              class="text-start"
              @click="dblClickOffer(item)"
            >
              {{ item.status.title }}
            </td>
            <td class="text-start">
              <div
                v-if="!refresh"
                class="d-flex flex-nowrap"
              >
                <template v-if="item.status.id === $config.offerStatuses.draft">
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
                        @click="openConfirmModal('отправить заявку на рассмотрение?', item)"
                      >
                        <v-icon>
                          mdi-share
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Отправить на рассмотрение</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        class="mr-1 order-3"
                        v-bind="attrs"
                        v-on="on"
                        @click="openDeleteOfferDialog('Удалить черновик заявки?',item)"
                      >
                        <v-icon>
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Удалить черновик</span>
                  </v-tooltip>
                </template>
                <template v-if="item.status.id === $config.offerStatuses.newOffer">
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
                <template v-if="item.status.id === $config.offerStatuses.canceled || item.status.id === $config.offerStatuses.underConsideration">
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
            </td>
          </tr>
        </template>
      </Crud>
    </template>
    <template v-else>
      <template
        v-for="(company, key) in filtredCompanies"
      >
        <div
          :key="key"
          class="pt-4 mb-4"
        >
          <div
            v-if="userCompaniesForTable.length > 1"
            class="font-family--rubik px-4 mb-2 subtitle-1"
          >
            <n-link :to="`/cabinet/companies/${company.id}`">
              {{ company.title }}
            </n-link>
          </div>
          <Crud
            class="offer--crud"
            hide-default-footer
            :show-title="false"
            :refresh.sync="refresh"
            :query-options="Object.assign({}, queryOptions, {filterCompany: company.id, sortBy: sortBy, sortDesc: sortDesc})"
            :page-options="{itemsPerPage: 5}"
            :model="$user.CompanyOffer"
            :sort-desc="sortDesc"
            :create-button-callback="newOffer"
            :dbl-click-callback="dblClickOffer"
            :element-id-to-get="getElementId"
            :custom-headers="mobileHeaders"
            hide-create-btn
            :auto-query="!$helpers.isMobile()"
            :show-sort="false"
            custom-item
            elevation="0"
            mobile-breakpoint="0"
            @open-dialog="showOffer"
          >
            <template #custom_item="{item}">
              <tr
                class="font-family--rubik"
                :style="!!item.status.color ? 'background-color: rgba(' + $helpers.convertHexToRGB(item.status.color) + ', .1)' : ''"
              >
                <td
                  class="text-start"
                  @click="dblClickOffer(item)"
                >
                  <div
                    v-if="item.number"
                    style="color: #3C64B1;"
                    class="mb-1"
                  >
                    № {{ item.number }}
                  </div>
                  <div>
                    от {{ $helpers.convertDateTcsm(item.created_at) }}
                  </div>
                </td>
                <td
                  class="text-start"
                  @click="dblClickOffer(item)"
                >
                  {{ item.status.title }}
                </td>
                <td
                  class="text-start"
                  style="padding-right: 10px !important;"
                >
                  <div
                    v-if="!refresh"
                    class="d-flex flex-nowrap"
                  >
                    <template v-if="item.status.id === $config.offerStatuses.draft">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            class="mr-2 order-1"
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
                            class="mr-2 order-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="openConfirmModal('отправить заявку на рассмотрение?', item)"
                          >
                            <v-icon>
                              mdi-share
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>Отправить на рассмотрение</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            class="mr-0 order-3"
                            v-bind="attrs"
                            v-on="on"
                            @click="openDeleteOfferDialog('Удалить черновик заявки?',item)"
                          >
                            <v-icon>
                              mdi-close
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>Удалить черновик</span>
                      </v-tooltip>
                    </template>
                    <template v-if="item.status.id === $config.offerStatuses.newOffer">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            class="mr-2 order-0"
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
                            class="mr-0 order-1"
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
                    </template>
                    <template v-if="item.status.id === $config.offerStatuses.sentOffer">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            class="mr-2 order-0"
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
                            class="mr-0 order-4"
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
                    <template v-if="item.status.id === $config.offerStatuses.canceled || item.status.id === $config.offerStatuses.underConsideration">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            class="mr-2 order-0"
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
                </td>
              </tr>
            </template>
          </Crud>
        </div>
      </template>
    </template>

    <OfferEditModal
      :dialog="offer_dialog"
      :offer="offer_selected"
      :edit="offer_editable"
      :user-companies="userCompaniesForTable"
      @refresh-table="closeOffer(), refresh = true"
      @save-offer="refresh = true"
      @close-dialog="closeOffer"
    />
    <ConfirmDialog
      :dialog="deleteOfferDialog"
      :confirm-text="deleteOfferText"
      @accept="deleteOffer"
      @decline="closeDeleteOfferDialog"
    />
    <ConfirmDialog
      :dialog="confirmDialog"
      :confirm-text="confirmText"
      @accept="sendOffer"
      @decline="closeConfirmModal"
    />
  </div>
</template>

<script>
  import Crud from '~/components/CRUD/Index';
  import OfferEditModal from "../../../components/page/Offer/OfferEditModal";
  import ConfirmDialog from "../../../components/page/Dialogs/ConfirmDialog";
  import SortFilterTitle from "../../../components/page/SortFilterTitle";
  import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
  import SortMobile from "../../../components/page/SortMobile";

  export default {
    components: {
      SortMobile,
      SearchFiltersBtn,
      SortFilterTitle,
      ConfirmDialog,
      OfferEditModal,
      Crud
    },
    data() {
      return {
        mobileHeaders: [
          {text: 'Дата и №', value: 'date', sortable: false },
          {text: 'Статус', value: 'status', sortable: false },
          {text: 'Действие', value: 'actions', sortable: false },
        ],

        showFilters: false,
        showSort: false,
        sortBy: '',
        sortByList: [
          {
            key: 'status.id',
            sortDesc: false,
            label: 'Статус'
          },
          {
            key: 'created_at',
            label: 'Дата'
          },
        ],
        
        //Разрешённые для редактирования статусы
        editableStatuses: [ this.$config.offerStatuses.draft, this.$config.offerStatuses.newOffer ],

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
        regions: [],
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
          filterStatus: '',
          filterUrgency: '',
          filterDateRange: [],
          invoice_type_id: 2,
        },
        filterCompanyOnPage: '',
        filterCompanyAutocomplete: '',
        countFilters: 0,

        //Всплывайка отмены заявки
        deleteOfferDialog: false,
        deleteOfferText: '',
        deleteOfferId: -1,

        //Всплывайка подтверждения
        confirmDialog: false,
        confirmText: '',
        confirmCallback: null,
        confirmItemId: -1,


        userCompaniesList: [],
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
      },
      filtredCompanies() {
        if (!!!this.filterCompanyOnPage) {
          return this.userCompaniesForTable;
        }
        let company = this.userCompaniesForTable.find((el) => {
          if (el.id == this.filterCompanyOnPage) {
            return el;
          }
        });
        return [company];
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
      this.$store.dispatch('loadTransService');
      this.loadCompanies();
      this.loadStatuses();
      if (!!this.$route.query && !!this.$route.query.open) {
        this.getElementId = this.$route.query.open;
      }
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
       * Обновляем список заявок на КП после добавления фильтров
       */
      refreshOffers() {
        this.filterCompanyOnPage = this.filterCompanyAutocomplete;
        this.countFilters = this.$helpers.countActiveFilters(this.queryOptions, ['invoice_type_id', 'company_id']);
        this.refresh = true;
        this.showFilters = false;
      },

      /**
       * Список компаний пользователя для всплывайки
       */
      async loadCompanies() {
        try {
          let userId = this.$auth.user.id;
          let {data} = (await this.$api.User.companies(userId)).data;
          this.userCompaniesForTable = data.companies;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при загрузке компаний пользователя',
            color: 'error'
          });
        }
      },

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
          let {data} = (await this.$api.CompanyOffer.listStatuses()).data;
          this.statuses = data.statuses;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при загрузке статусов КП',
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
          try{

            let {data} = (await this.$api.Company.find({searchText: searchText})).data;
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
              text: 'Ошибка при поиске компании',
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
       * Удалить заявку
       */
      async deleteOffer() {
        try {
          await this.$api.CompanyOffer.delete(this.deleteOfferId);
          this.closeDeleteOfferDialog();
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке удалить черновик',
            color: 'error'
          });
        }
      },

      /**
       * Открытие формы отмены заявки на КП
       */
      openDeleteOfferDialog (text, item) {
        this.deleteOfferId = item.id;
        this.deleteOfferText = text;
        this.deleteOfferDialog = true;
      },

      /**
       * Закрытие формы отмены заявки на КП
       */
      closeDeleteOfferDialog () {
        this.deleteOfferId = -1;
        this.deleteOfferText = '';
        this.deleteOfferDialog = false;
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
            text: 'Ошибка при попытке загрузить КП',
            color: 'error'
          });
        }
      },

      /**
       * Перевод заявки в статус "Подготовлено КП"
       * @param item - заявка
       * @returns {Promise<void>}
       */
      async sendOffer() {
        try {
          await this.$api.CompanyOffer.send(this.confirmItemId);
          this.refresh = true;
          this.closeConfirmModal();
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке отправить заявку на КП',
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