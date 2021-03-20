<template>
  <div>
    <TcsmDialog
      :dialog="showDialog"
      :edit-dialog="editable"
      width="90vw"
      persistent
      custom-footer
      :loading="checkingTheAbilityToEdit"
      @close-dialog="checkBeforeClose"
    >
      <template v-slot:title>
        <div style="word-break: normal;">
          {{ dialogTitle }}
        </div>
      </template>
      <template v-slot:main>
        <v-form
          ref="offerForm"
          v-model="offerFormValidate"
        >
          <v-row>
            <v-col :class="$helpers.isMobile() ? 'px-0' : ''">
              <v-row>
                <v-col
                  :class="`py-0 ${$helpers.isMobile() ? 'mb-5' : ''}`"
                  lg="2"
                  md="2"
                  sm="2"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="serviceCostIdComp"
                    :readonly="!editable"
                    :items="$store.state.regions"
                    label="Регион цен"
                    :hide-details="$helpers.isMobile()"
                    item-value="id"
                    item-text="title"
                    :rules="rules.regionRules"
                    required
                    :outlined="$helpers.isMobile()"
                    :color="$config.defaultColor"
                    :item-color="$config.defaultColor"
                    @change="changeServiceCostId"
                  />
                </v-col>
                <v-col
                  :class="`py-0 ${$helpers.isMobile() ? 'mb-5' : ''}`"
                  lg="3"
                  md="3"
                  sm="3"
                  cols="12"
                >
                  <v-select
                    v-if="editable"
                    v-model="innerOffer.tariff_year"
                    :color="$config.defaultColor"
                    :item-color="$config.defaultColor"
                    :items="yearSelectItems"
                    :outlined="$helpers.isMobile()"
                    :hide-details="$helpers.isMobile()"
                    label="Год оказания услуги"
                    @change="changeTariffYear"
                  />
                  <v-text-field
                    v-else
                    :value="innerOffer.tariff_year ? innerOffer.tariff_year : 'Не указан'"
                    label="Год оказания услуги"
                    :outlined="$helpers.isMobile()"
                    :color="$config.defaultColor"
                    readonly
                  />
                </v-col>
                <v-col
                  :class="`py-0 ${$helpers.isMobile() ? 'mb-3' : ''}`"
                  lg="7"
                  md="7"
                  sm="7"
                  cols="12"
                >
                  <v-text-field
                    v-if="innerOffer.id && !editable"
                    v-model="innerOffer.company.title"
                    label="Компания"
                    :outlined="$helpers.isMobile()"
                    :color="$config.defaultColor"
                    readonly
                  />
                  <v-combobox
                    v-else
                    v-model="innerOffer.company"
                    :items="companiesList"
                    label="Введите название компании"
                    :hide-details="$helpers.isMobile()"
                    item-value="id"
                    item-text="title"
                    :hint="noDataCompanyText"
                    :rules="rules.companyRules"
                    :color="$config.defaultColor"
                    :item-color="$config.defaultColor"
                    :no-data-text="noDataCompanyText"
                    :search-input.sync="searchCompanies"
                    :outlined="$helpers.isMobile()"
                    @change="chooseCompany"
                    @keyup="searchCompanyFunc"
                  />
                </v-col>
              </v-row>
              <template v-if="canChooseUser && companyUsers.length > 0">
                <v-row align-content="center">
                  <v-col
                    xl="9"
                    lg="8"
                    md="9"
                    sm="8"
                    cols="12"
                  >
                    <v-autocomplete
                      v-model="choosenUser"
                      :items="companyUsers"
                      label="Ответственное лицо"
                      item-value="id"
                      item-text="full_name"
                      no-data-text="Сотрудников не найдено"
                      :hide-details="$helpers.isMobile()"
                      clearable
                      :outlined="$helpers.isMobile()"
                      :color="$config.defaultColor"
                      :item-color="$config.defaultColor"
                      @click:clear="changeCompanyUser({})"
                      @change="changeCompanyUser"
                    />
                  </v-col>
                  <v-col
                    class="d-flex align-center"
                  >
                    <v-btn
                      dark
                      :color="$config.defaultColor"
                      small
                      @click="setCustomResponsiblePerson"
                    >
                      <template v-if="companyUsers.length > 0">
                        Указать вручную
                      </template>
                      <template v-else>
                        Указать ответственное лицо вручную
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
              <template v-if="showInfoAboutAbsenseUsersInCompany && companyUsers.length == 0">
                <v-row>
                  <v-col>
                    У выбранной компании нет сотрудников<br>
                    Вы можете указать ответственное лицо вручную
                  </v-col>
                </v-row>
              </template>
              <v-row
                v-if="isAdmin && !editable"
                class="body-1 black--text"
              >
                <v-col>
                  <div class="mb-2">
                    Ответственное лицо:
                  </div>
                  <div>
                    <span v-if="!!innerOffer.contact_title">ФИО: <strong>{{ innerOffer.contact_title }}</strong></span>
                    <span
                      v-if="!!innerOffer.contact_phone"
                      class="ml-1"
                    >
                      Тел: <strong>{{ innerOffer.contact_phone }}</strong>
                    </span>
                    <span
                      v-if="!!innerOffer.contact_email"
                      class="ml-1"
                    >
                      Письма будут отправлены на почту: <strong>{{ innerOffer.contact_email }}</strong>
                    </span>
                  </div>
                </v-col>
              </v-row>
              <v-form
                ref="contactForm"
                v-model="contactFormValidate"
              >
                <v-row v-if="!isAdmin || editUser">
                  <v-col
                    class="d-flex flex-column justify-end"
                    xl="6"
                    lg="6"
                    md="6"
                    sm="6"
                    cols="12"
                  >
                    <v-text-field
                      v-model="innerOffer.contact_title"
                      :label="`ФИО ${ isAdmin ? 'ответственного лица' : 'исполнителя'}`"
                      :suffix="$helpers.checkPhoneRules(innerOffer.contact_phone)"
                      :outlined="$helpers.isMobile()"
                      :hide-details="$helpers.isMobile()"
                      :color="$config.defaultColor"
                      :readonly="!editable || !isAdmin"
                    />
                  </v-col>
                  <v-col
                    xl="6"
                    lg="6"
                    md="6"
                    sm="6"
                    cols="12"
                  >
                    <v-text-field
                      v-model="innerOffer.contact_phone"
                      v-mask="'+7 (###) ###-##-##'"
                      :rules="rules.phoneRules"
                      :suffix="$helpers.checkPhoneRules(innerOffer.contact_phone)"
                      required
                      name="phone"
                      :hide-details="$helpers.isMobile()"
                      :outlined="$helpers.isMobile()"
                      :label="`Номер телефона ${ isAdmin ? 'ответственного лица' : 'исполнителя'}`"
                      :color="$config.defaultColor"
                      :readonly="!editable || !isAdmin"
                    />
                  </v-col>
                  <v-col v-if="companyUsers.length > 0">
                    <v-btn
                      dark
                      :color="$config.defaultColor"
                      small
                      @click="editUser = false"
                    >
                      Выбрать из списка сотрудников
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-row>
                <v-col
                  :class="`d-flex flex-column justify-end ${$helpers.isMobile() && !isAdmin ? 'py-0' : ''}`"
                  xl="6"
                  lg="6"
                  md="6"
                  sm="12"
                  cols="12"
                >
                  <v-text-field
                    v-show="showEmailField"
                    v-model="innerOffer.contact_email"
                    :label="`${ isAdmin ? 'Email для отправки КП' : 'Дополнительный Email'}`"
                    type="email"
                    autocomplete="off"
                    :hide-details="$helpers.isMobile()"
                    :outlined="$helpers.isMobile()"
                    :color="$config.defaultColor"
                    :readonly="!editable || !sendEmail"
                    :class="$helpers.isMobile() ? 'my-3' : '' "
                  >
                    <template
                      v-if="sendEmail"
                      #append
                    >
                      <v-tooltip
                        top
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>
                          Вы получите готовое КП на следующие адреса:
                          <template v-if="!!getUserEmail()"> {{ getUserEmail() }}, </template>
                          {{ !!innerOffer.contact_email ? innerOffer.contact_email : '' }}
                        </span>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                  <v-checkbox
                    v-model="sendEmail"
                    on-icon="mdi-checkbox-marked-outline"
                    :label="textForSendEmailCheckbox"
                    :color="$config.defaultColor"
                    :readonly="!editable"
                    hide-details
                    class="mt-0"
                  />
                </v-col>

                <v-col
                  :class="`${$helpers.isMobile() && !isAdmin ? 'py-0' : ''}`"
                  xl="6"
                  lg="6"
                  md="6"
                  sm="12"
                  cols="12"
                >
                  <v-checkbox
                    v-model="innerOffer.transport_preparation"
                    label="Подготовка к транспортировке"
                    class="checkbox-hidden"
                    on-icon="mdi-checkbox-marked-outline"
                    :color="$config.defaultColor"
                    :readonly="!editable"
                    hide-details
                    @change="setTransportPreparation"
                  >
                    <template #label>
                      <span class="mr-2">Подготовка к транспортировке</span>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>При необходимости подготовки к транспортировке (дополнительной упаковке/обрешетки) установите галочку</span>
                      </v-tooltip>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
              <v-row
                v-if="isAdmin"
                class="mt-2"
              >
                <v-col
                  xl="6"
                  lg="6"
                  md="6"
                  sm="12"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="innerOffer.laboratory_id"
                    class="custom-autocomplete-without-id"
                    :items="$store.state.laboratories"
                    label="Выберите лабораторию"
                    item-value="id"
                    :item-text="laboratoryTitle"
                    :outlined="$helpers.isMobile()"
                    :rules="rules.laboratoryRules"
                    :color="$config.defaultColor"
                    :item-color="$config.defaultColor"
                    suffix="Обязательно"
                    no-data-text="Нет подходящих лабораторий"
                    :hide-details="$helpers.isMobile()"
                  >
                    <template v-slot:selection="data">
                      <div
                        class="custom-autocomplete-without-id-selection"
                        v-html="data.item.title"
                      />
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item" />
                      </template>
                      <template v-else>
                        <v-list-item-content>
                          <v-layout justify-space-between>
                            <div v-html="data.item.title" />
                            <div v-html="data.item.code" />
                          </v-layout>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col
                  xl="6"
                  lg="6"
                  md="6"
                  sm="12"
                  cols="12"
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
                        v-model="innerOffer.expired_at"
                        label="Срок действия КП"
                        :prepend-icon="`${$helpers.isMobile() ? '' : 'event'}`"
                        :append-icon="`${$helpers.isMobile() ? 'event' : ''}`"
                        :outlined="$helpers.isMobile()"
                        readonly
                        clearable
                        v-bind="attrs"
                        :color="$config.defaultColor"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="innerOffer.expired_at"
                      no-title
                      locale="ru"
                      :color="$config.defaultColor"
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
              </v-row>
            </v-col>
            <v-col
              :class="$helpers.isMobile() ? 'px-0' : ''"
              xl="6"
              lg="6"
              md="12"
              sm="12"
              cols="12"
            >
              <v-textarea
                v-model="innerOffer.comment"
                outlined
                :hide-details="$helpers.isMobile()"
                :label="(!isAdmin) ? 'Ваш комментарий к заявке' : 'Комментарий клиента (Видят все)'"
                :color="$config.defaultColor"
                :readonly="!editable"
                :rows="(isAdmin) ? '5' : '7'"
              />
              <v-textarea
                v-if="isAdmin"
                v-model="innerOffer.comment_admin"
                outlined
                :hide-details="$helpers.isMobile()"
                label="Внутренний комментарий (Виден сотрудникам ЦСМ + отправляется в 1С)"
                :color="$config.defaultColor"
                :readonly="!editable || !isAdmin"
                rows="5"
              />
            </v-col>
          </v-row>
        </v-form>

        <v-row>
          <v-col
            :class="$helpers.isMobile() ? 'mx-n3 px-0 pb-0' : ''"
            :style="$helpers.isMobile() ? 'width: calc(100% + 24px); max-width: calc(100% + 24px);' : ''"
          >
            <OfferTableAdmin
              v-if="isAdmin"
              :can-edit="editable"
              :services-list="innerOffer.services"
              :service-cost-id="serviceCostIdComp"
              :laboratory-id="laboratoryIdComp"
              :dialog="showDialog"
              :offer-costs="offerCosts"
              :offer-validated="offerFormValidate"
              :tariff-year="tariffYear"
              @offer-validate="$refs.offerForm.validate()"
              @recalc="reCalc"
              @new-service="newService"
              @edit-service="saveService"
              @delete-service="deleteService"
            />
            <OfferTable
              v-else
              :can-edit="editable"
              :services-list.sync="innerOffer.services"
              :service-cost-id="serviceCostIdComp"
              :offer.sync="innerOffer"
              :dialog="showDialog"
              :offer-validated="offerFormValidate"
              :tariff-year="tariffYear"
              @offer-validate="$refs.offerForm.validate()"
              @new-service="newService"
              @edit-service="saveService"
              @delete-service="deleteService"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-layout
          :justify-space-between="$helpers.isMobile() && !isAdmin && editable"
          :justify-end="!$helpers.isMobile() || isAdmin || !editable"
          :wrap="!$helpers.isMobile() || isAdmin"
          :class="$helpers.isMobile() && !isAdmin ? '' : ''"
        >
          <v-btn
            v-if="isAdmin"
            text
            :color="$config.defaultColor"
            :class="`text-none ${!$helpers.isMobile() ? 'mr-2' : ''}`"
            @click="toPreviewDialogConfirm"
          >
            Предпросмотр КП
          </v-btn>
          <v-btn
            v-if="editable && isAdmin"
            text
            :color="$config.defaultColor"
            :class="`text-none ${!$helpers.isMobile() ? 'mr-2' : ''}`"
            @click="toFormDialogConfirm"
          >
            Сформировать КП
          </v-btn>
          <v-btn
            v-if="editable && !isAdmin"
            dark
            :color="$config.defaultColor"
            :class="`text-none ${!$helpers.isMobile() ? 'mr-2' : ''}`"
            @click="toConsDialogConfirm"
          >
            Отправить заявку
          </v-btn>
          <v-btn
            v-if="editable"
            outlined
            :color="$config.defaultColor"
            :class="`text-none ${!$helpers.isMobile() ? 'mr-2' : ''}`"
            @click="saveOffer"
          >
            Сохранить
          </v-btn>
          <v-btn
            v-if="!$helpers.isMobile() || isAdmin || !editable"
            outlined
            :color="$config.defaultColor"
            class="text-none"
            @click="checkBeforeClose"
          >
            Закрыть
          </v-btn>
        </v-layout>
      </template>
    </TcsmDialog>
    <ConfirmDialog
      :dialog="confirmDialog"
      :confirm-text="confirmDialogText"
      :confirm-btn-text="confirmDialogBtnText"
      :custum-text="confirmDialogCustomText"
      :show-decline-btn="confirmDialogShowDeclineBtn"
      @accept="confirmDialogCallback"
      @close-dialog="clearConfirmDialogData"
      @decline="clearConfirmDialogData"
    />
  </div>
</template>

<script>
  import OfferTable from "./OfferTable";
  import OfferTableAdmin from "./OfferTableAdmin";
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  import TcsmDialog from "../Dialogs/tcsmDialog";
  export default {
    name: "OfferEditModal",
    components: {TcsmDialog, ConfirmDialog, OfferTableAdmin, OfferTable},
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      offer: {
        type: Object,
        default: () => {
          return {};
        }
      },
      offerId: {
        type: Number,
        default: () => {
          return null;
        }
      },
      edit: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      userCompanies: {
        type: Array,
        default: () => {
          return [];
        }
      },
    },
    data() {
      return {
        firstLoad: true,

        laboratoryFocused: false,

        rules: {
          companyRules: [
            v => (!!v && !!v.id) || 'Выберите, пожалуйста, компанию из списка',
          ],
          regionRules: [
            v => !!v || 'Выберите, пожалуйста, регион цен',
          ],
          nameRules: [
            v => !!v || 'Выберите, пожалуйста, ФИО исполнителя',
          ],
          laboratoryRules: [
            v => !!v || 'Выберите, пожалуйста, лабораторию',
          ],
          phoneRules: [
            v => (!!v && v.length == 18 || !!!v) || 'Номер телефона должен содержать 11 цифр',
          ],
        },

        offerFormValidate: true,
        contactFormValidate: true,

        datePicker: false,

        searchCompanies: '',
        noDataCompanyText: '',
        companySearchTimeout: null,
        userCompaniesAutocompliter: [],

        companyUsers: [],
        choosenUser: {},
        editUser: false,

        sendEmail: false,

        yearSelectItems: [
          new Date().getFullYear(),
          new Date().getFullYear() + 1,
        ],

        innerOffer: {},
        innerOfferChanging: false,
        isEdited: false,
        isNewOffer: true,
        canEditOffer: true,
        checkingTheAbilityToEdit: true,
        checkingTheAbilityToEditInterval: null,

        loadingOrders: false,

        currentOfferId: null,
        
        confirmDialog: false,
        confirmDialogCallback: function () {},
        confirmDialogText: '',
        confirmDialogCustomText: false,
        confirmDialogBtnText: '',
        confirmDialogShowDeclineBtn: true,
      }
    },
    computed: {
      /**
       * Заголовок для формы
       */
      dialogTitle() {
        return !this.editable ? 'Просмотр заявки на ' + this.getOfferTitle : this.isNewOffer ? 'Создание заявки на ' + this.getOfferTitle : 'Редактирование заявки на ' + this.getOfferTitle;
      },

      /**
       *
       */
      getOfferTitle() {
        if (this.$helpers.isMobile()) {
          return 'КП';
        }
        return 'коммерческое предложение'
      },

      /**
       * Если список компании не был передан
       * Берём список компаний из поиска
       */
      companiesList: {
        get() {
          if (!!!this.userCompanies || !this.userCompanies.length) {
            return this.userCompaniesAutocompliter;
          }
          return this.userCompanies;
        }
      },

      /**
       * Проверка на администратора
       */
      isAdmin: {
        get() {
          return this.$auth.user.role_id==1;
        }
      },

      /**
       * Открыть/скрыть модалку
       */
      showDialog: {
        get () {
          return this.dialog;
        },
        set () {
          this.$emit('close-dialog');
        }
      },

      offerSum() {
        return this.innerOffer.sum;
      },
      offerSumVat() {
        return this.innerOffer.sum_vat;
      },
      offerSumWithVat() {
        return this.innerOffer.sum_with_vat;
      },
      offerCosts: {
        get() {
          return {
            sum: this.offerSum ? this.offerSum : 0,
            sum_vat: this.offerSumVat ? this.innerOffer.sum_vat : 0,
            sum_with_vat: this.offerSumWithVat ? this.offerSumWithVat : 0,
          }
        }
      },


      editable: {
        get() {
          return this.edit && this.canEditOffer;
        }
      },
      companySelected: {
        get() {
          return !!this.innerOffer.company_id;
        }
      },

      /**
       * Получение cost для transService в зависимости от региона
       */
      getTransServiceCost() {
        let serviceCost = this.innerOffer.service_cost_id;
        let cost = this.$store.state.transService.costs.find(function(cost) {
          return cost.service_cost_id == serviceCost;
        });
        return cost ? cost.cost : 0;
      },

      /**
       * Получение count для transService
       */
      getTransServiceCount() {
        if (!this.innerOffer.services.length) {
          return 0;
        }
        let outerThis = this;
        let count = this.innerOffer.services.reduce(function (curr, val) {
          let isTransService = val.id == outerThis.$store.state.transService.service_id;
          return curr + parseInt(val.count && !isTransService ? val.count * val.count_sets : 0);
        },0);
        return count;
      },

      serviceCostIdComp: {
        get: function () {
          return this.innerOffer.service_cost_id;
        },
        set: function (val) {
          this.innerOffer.service_cost_id = val;
        }
      },
      laboratoryIdComp: {
        get: function () {
          return this.innerOffer.laboratory_id;
        },
        set: function (val) {
          this.innerOffer.laboratory_id = val;
        }
      },
      tariffYear: {
        get: function() {
          return this.innerOffer.tariff_year;
        },
        set: function (val) {
          this.innerOffer.tariff_year = val;
        }
      },
      textForSendEmailCheckbox() {
        if (!this.isAdmin) {
          return 'Отправить копию КП на email';
        }
        if (!!this.choosenUser && !!this.choosenUser.id) {
          return 'Указать дополнительный email для получения копии КП';
        }
        return 'Указать email для получения КП';
      },
      canChooseUser() {
        return this.isAdmin && this.editable && !!this.innerOffer.company && !!this.innerOffer.company.id && !this.editUser;
      },
      showInfoAboutAbsenseUsersInCompany() {
        return this.isAdmin && this.editable && !!this.innerOffer.company && !!this.innerOffer.company.id;
      },
      showEmailField() {
        return this.sendEmail && (!this.isAdmin || (this.editable && this.isAdmin));
      },
      getContactTitle() {
        if (!this.isAdmin) {
          return this.innerOffer.contact_title;
        }
        return this.editUser
                ? this.innerOffer.contact_title
                : !!this.choosenUser && !!this.choosenUser.id
                  ? this.choosenUser.full_name
                  : ''
      },
      getContactPhone() {
        if (!this.isAdmin) {
          return this.innerOffer.contact_phone;
        }
        return this.editUser
                ? this.innerOffer.contact_phone
                : !!this.choosenUser && !!this.choosenUser.id
                  ? this.choosenUser.phone
                  : ''
      },
    },
    watch: {

      /**
       * Вызываем необходимые функции при открытии модалки
       * @param val
       */
      dialog: async function (val) {
        if (val) {
          await this.openModal();
          await this.reCalc();
          this.firstLoad = false;
        }
      },

      /**
       * Если компания всего одна, выбираем её
       * @param val
       */
      userCompanies(val) {
        if (!!val && val.length == 1) {
          this.innerOffer.company_id = val[0].id;
        }
      },

      innerOffer: {
        handler(val) {
          if (!this.firstLoad) {
            this.isEdited = true;
          }
        },
        deep: true,
      },

      /**
       * Очищаем поле, если сняли галочку
       */
      sendEmail(val) {
        if (!val) {
          this.innerOffer.contact_email = '';
        }
      },
    },
    methods: {
      /**
       * Фунция открытия модалки
       * Выполняем всё, что необходимо
       */
      async openModal() {
        this.firstLoad = true;
        this.currentOfferId = null;

        if (!!this.$refs.offerForm) {
          this.$refs.offerForm.resetValidation(); //Очищаем валидацию
        }
        if (!!this.$refs.contactForm) {
          this.$refs.contactForm.resetValidation(); //Очищаем валидацию
        }

        if (!!this.offer && Object.keys(this.offer).length) {
          this.isNewOffer = false;

          this.innerOffer = Object.assign({}, this.offer);
          this.innerOffer.services = Object.assign([], this.offer.services);

          if (!!this.innerOffer.contact_email) {
            this.sendEmail = true;
          }

          if (this.innerOffer.company_id) {
            await this.getCompanyById(this.innerOffer.company_id);
          }
          await this.reCalc();
        }else {
          this.innerOffer = !!this.offerId ? await this.loadOfferById(this.offerId) : {};
          this.isNewOffer = !!!this.offerId;

          if (this.userCompanies.length == 1) {
            this.innerOffer.company = Object.assign({}, this.userCompanies[0]);
          }
        }

        if (this.isAdmin) {
          this.checkingTheAbilityToEdit = false;
          this.$store.dispatch('loadCoefficients');

          if (!!this.offer && !!this.offer.id && this.offer.status.id === this.$config.offerStatuses.newOffer) {
            this.sendOfferToReview();
          }

          if (!!this.innerOffer.company_id) {
            await this.chooseCompany({id: this.innerOffer.company_id});
          }

          if (!!this.innerOffer.contact_user_id) {
            this.editUser = false;
            this.choosenUser = {id: this.innerOffer.contact_user_id};
          }else{
            this.editUser = this.editable;
          }
        }

        if (!this.isAdmin && this.editable) {

          if (!!!this.innerOffer.contact_title) {
            this.$set(this.innerOffer, 'contact_title', this.getUserTitle());
          }

          if (!!!this.innerOffer.contact_phone) {
            this.$set(this.innerOffer, 'contact_phone', this.getUserPhone());
          }

          if (!!this.offer.status && this.offer.status.id === this.$config.offerStatuses.newOffer) {
            this.checkPermissionsForEditInterval();
          }else{
            this.checkingTheAbilityToEdit = false;
          }

        }else{
          this.checkingTheAbilityToEdit = false;
        }

        if (!!!this.innerOffer.service_cost_id && this.editable) {
          this.$set(this.innerOffer, 'service_cost_id', this.getUserServiceCost());
        }
        if ((!!!this.innerOffer.tariff_year || this.innerOffer.tariff_year < new Date().getFullYear()) && this.editable) {
          this.$set(this.innerOffer, 'tariff_year', new Date().getFullYear());
        }
        if (!!this.innerOffer.expired_at) {
          let expiredAtDate = new Date(this.innerOffer.expired_at);
          let expiredAtDateMonth = expiredAtDate.getMonth() + 1 < 10 ? '0' + (expiredAtDate.getMonth() + 1) : (expiredAtDate.getMonth() + 1);
          let expiredAtDateDay = expiredAtDate.getDate() < 10 ? '0' + expiredAtDate.getDate() : (expiredAtDate.getDate());
          let expiredAtDateString = expiredAtDate.getFullYear() + '-' + expiredAtDateMonth + '-' + expiredAtDateDay;
          this.$set(this.innerOffer, 'expired_at', expiredAtDateString);
        }
        if (!!!this.innerOffer.expired_at && this.editable) {
          this.$set(this.innerOffer, 'expired_at', (new Date().getFullYear()) + '-12-31');
        }
      },

      /**
       * Загрузка заявки по ID
       */
      async loadOfferById(id) {
        try{
          let {data} = await this.$api.CompanyOffer.find(id);
          return data.data.result;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке загрузить КП',
            color: 'error'
          });
        }
      },


      /**
       * Сохранить/создать заявку
       */
      async saveOffer(closeAfterSave = true) {
        if (!this.$refs.offerForm.validate() || !this.$refs.contactForm.validate()) {
          return;
        }
        try{

          let response;
          let toSend = Object.assign(this.innerOffer, {
            company_id: this.innerOffer.company.id,
            contact_user_id: !!this.choosenUser && !!this.choosenUser.id ? this.choosenUser.id : null,
            contact_title: this.getContactTitle,
            contact_phone: this.getContactPhone,
          });
          if (this.innerOffer.id) {
            this.currentOfferId = this.innerOffer.id;
            response = (await this.$api.CompanyOffer.update(toSend));
          }else{
            response = (await this.$api.CompanyOffer.create(toSend));
            if (!!response && response.statusText == "OK") {
              this.currentOfferId = response.data.data.company_offer.id;
            }
          }

          if (response.statusText == "OK") {
            this.$emit('save-offer');
            if (closeAfterSave) {
              this.closeFunc();
            }
          }
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке сохранить КП',
            color: 'error'
          });
        }
      },

      /**
       *
       */
      sendOfferToReview() {
        try{
          this.$api.CompanyOffer.review(this.offer.id);
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке отправить КП на рассмотрение',
            color: 'error'
          });
        }
      },

      /**
       * Очистка переменных confirmDialog
       */
      clearConfirmDialogData() {
        this.confirmDialogText = '';
        this.confirmDialogBtnText = '';
        this.confirmDialogCustomText = false;
        this.confirmDialogShowDeclineBtn = true;
        this.confirmDialogCallback = function () {};
        this.confirmDialog = false;
      },

      /**
       * Открытие формы сохранения заявки перед предпросмотром
       */
      toPreviewDialogConfirm() {
        if (!this.$refs.offerForm.validate() || !this.$refs.contactForm.validate()) {
          return;
        }
        this.confirmDialogText = 'Заявка будет сохранена перед предпросмотром. Сохранить заявку и продолжить?';
        this.confirmDialogCustomText = true;
        this.confirmDialogBtnText = 'Продолжить';
        let outerThis = this;
        this.confirmDialogCallback = async function() {
          await outerThis.saveOffer(false);
          setTimeout(function() {
            outerThis.confirmDialog = false;
          }, 2000);
          outerThis.$emit('show-preview', {id: outerThis.currentOfferId});
        };
        this.confirmDialog = true;
      },

      /**
       * Откритие формы для подтверждения формирования КП
       */
      toFormDialogConfirm() {
        if (!this.$refs.offerForm.validate() || !this.$refs.contactForm.validate()) {
          return;
        }
        this.confirmDialogText = 'сформировать коммерческое предложение?';
        this.confirmDialogBtnText = 'Сформировать';
        let outerThis = this;
        this.confirmDialogCallback = function() {
          outerThis.toFormOffer();
        }
        this.confirmDialog = true;
      },

      /**
       * Сформировать КП
       */
      async toFormOffer() {
        if (!this.$refs.offerForm.validate() || !this.$refs.contactForm.validate()) {
          return;
        }
        try {
          let response;
          this.$set(this.innerOffer, 'withReady', 1);
          let toSend = Object.assign(this.innerOffer, {company_id: this.innerOffer.company.id})
          if (this.innerOffer.id) {
            response = (await this.$api.CompanyOffer.update(toSend));
          }else{
            response = (await this.$api.CompanyOffer.create(toSend));
          }

          if (response.statusText == "OK") {
            this.$emit('save-offer');
            this.closeFunc();
          }
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке создать/изменить КП',
            color: 'error'
          });
        }
      },

      /**
       * Откритие формы для подтверждения отправки на рассмотрение
       */
      toConsDialogConfirm() {
        if (!this.$refs.offerForm.validate() || !this.$refs.contactForm.validate()) {
          return;
        }
        this.confirmDialogText = 'отправить заявку на рассмотрение?';
        this.confirmDialogBtnText = 'Отправить';
        let outerThis = this;
        this.confirmDialogCallback = function() {
          outerThis.toConsOffer();
        }
        this.confirmDialog = true;
      },

      /**
       * На рассмотрение
       */
      async toConsOffer() {
        if (!this.$refs.offerForm.validate() || !this.$refs.contactForm.validate()) {
          return;
        }
        try {
          let response;
          this.$set(this.innerOffer, 'withSend', 1);
          let toSend = Object.assign(this.innerOffer, {company_id: this.innerOffer.company.id})
          if (this.innerOffer.id) {
            response = (await this.$api.CompanyOffer.update(toSend));
          }else{
            response = (await this.$api.CompanyOffer.create(toSend));
          }

          if (response.statusText == "OK") {
            this.$emit('save-offer');
            this.closeFunc();
          }
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке отправить заявку на КП',
            color: 'error'
          });
        }
      },

      /**
       * Уведомляем пользователя о невозможности редактировать заявку
       */
      notificationAboutInabilityToEdit() {
        this.confirmDialogShowDeclineBtn = false;
        this.confirmDialogBtnText = 'Понятно';
        this.confirmDialogCustomText = true;
        this.confirmDialogText = 'Вы больше не можете редактировать данную заявку. Заявка будет закрыта, а список заявок обновлён.';
        let outerThis = this;
        this.confirmDialogCallback = function () {
          outerThis.closeFunc();
          outerThis.$emit('refresh-table');
        }
        this.confirmDialog = true;
      },

      /**
       * Уверены, что желаете закрыть без сохранения?
       */
      checkBeforeClose() {
        if (this.editable && this.isEdited) {
          this.confirmDialogText = 'закрыть заявку без сохранения?';
          this.confirmDialogBtnText = 'Не сохранять';
          let outerThis = this;
          this.confirmDialogCallback = function() {
            outerThis.closeFunc();
          }
          this.confirmDialog = true;
        }else{
          this.closeFunc();
        }
      },

      /**
       * Закрыть модалку
       */
      closeFunc() {
        this.innerOffer = {};
        this.confirmDialog = false;
        this.showDialog = false;
        this.firstLoad = true;
        this.isEdited = false;
        this.canEditOffer = true;
        this.checkingTheAbilityToEdit = true;
        clearInterval(this.checkingTheAbilityToEditInterval);
        this.sendEmail = false;

        this.companyUsers = [];
        this.choosenUser = {};
        this.editUser = false;
      },

      /**
       * Функции для transService
       */

      /**
       * Добавляем услугу подготовки к транспортировке
       */
      setTransportPreparation(val) {
        let index = this.findTransportPreparationService();
        if (val) {
          if (index < 0) {
          //   this.$set(this.transport_preparation, 'service_cost_id', this.innerOffer.service_cost_id);
            this.newService(this.$store.state.transService);
            this.reCalc();
          }
        }else if (index >= 0) {
          this.deleteServiceById(index);
        }
      },

      transServiceObjReCalc() {
        let index = this.findTransportPreparationService();
        if (index >= 0) {
          // console.log('добавление объекта transService');
          let empty = {
            tariff: this.getTransServiceCost,
            count: this.getTransServiceCount,
            // count_sets: this.getTransServiceCountSets,
            count_sets: 0,
            service_cost_id: this.serviceCostIdComp,
            discount_prc: 0,
            increase_prc: 0,
          };
          let transCurr = Object.assign({}, this.innerOffer.services[index], empty);
          this.$set(this.innerOffer.services,
                    index,
                    transCurr
          );
        }
      },

      findTransportPreparationService() {
        if (!!!this.innerOffer || !this.innerOffer.services) {
          return -1;
        }
        let outerThis = this;
        let index = this.innerOffer.services.findIndex(function(service) {
          return service.service_id == outerThis.$store.state.transService.service_id;
        });
        return index;
      },

      async changeServiceCostId(event) {
        this.transServiceObjReCalc();
        this.reCalc();
      },


      /**
       * Добавление нового устройства
       */
      async newService(item) {
        if (!!this.innerOffer.services) {
          this.innerOffer.services.push(item);
        }else{
          this.$set(this.innerOffer, 'services', []);
          this.innerOffer.services.push(item);
        }
        this.transServiceObjReCalc();
        this.reCalc();
      },

      /**
       * Сохранение изменений существующего устройства
       */
      saveService(item) {
        let index = this.getServiceId(item);

        if (index > -1) {
          this.$set(this.innerOffer.services, index, item);
        }
        this.transServiceObjReCalc();
        this.reCalc();
      },

      /**
       * Удаление существующего устройства
       */
      deleteService(item) {
        let index = this.getServiceId(item);
        if (index > -1) {
          this.innerOffer.services.splice(index, 1);
        }
        this.reCalc();
      },

      /**
       * Удаление существующего устройства
       */
      deleteServiceById(index) {
        if (!!!this.innerOffer || !this.innerOffer.services) {
          return -1;
        }
        this.innerOffer.services.splice(index, 1);
        this.reCalc();
      },


      /**
       * Получение ФИО пользователя (не администратора)
       */
      getUserTitle() {
        return !this.isAdmin ? this.$auth.user.full_name : '';
      },

      /**
       * Получение номера телефона пользователя (не администратора)
       */
      getUserPhone() {
        return !this.isAdmin ? this.$auth.user.phone : '';
      },

      /**
       * Получение email пользователя (не администратора)
       */
      getUserEmail() {
        return !this.isAdmin ? this.$auth.user.email : '';
      },

      /**
       * Получение региона пользователя
       */
      getUserServiceCost() {
        return this.$auth.user.service_cost_id;
      },

      /**
       * Сохраняем данные пользователя после редактирования администратором
       */
      saveContactData() {
        if (!this.$refs.contactForm.validate()) {
          return;
        }
        this.editUser = false;
      },

      /**
       * Проверка на возможность редактировать каждые 30 секунд
       * -Осуществляем проверку
       * -Если можем редактировать, запускаем интервал для проверки каждые 30 секунд
       */
      async checkPermissionsForEditInterval() {
        this.canEditOffer = await this.checkPermissionsForEdit();
        this.checkingTheAbilityToEdit = false;

        if (this.canEditOffer) {
          let outerThis = this;
          this.checkingTheAbilityToEditInterval = setInterval(async function() {
            outerThis.canEditOffer = await outerThis.checkPermissionsForEdit();
            if (!outerThis.canEditOffer) {
              clearInterval(outerThis.checkingTheAbilityToEditInterval);
              outerThis.notificationAboutInabilityToEdit();
            }
          }, 30000)
        }else{
          this.notificationAboutInabilityToEdit();
        }
      },

      /**
       * Получение разрешения на редактирование
       */
      async checkPermissionsForEdit() {
        try {
          let {data} = await this.$api.CompanyOffer.canEdit(this.offer.id);
          if (!!data.data) {
            return data.data.result.can_edit;
          }
          return false;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке получить разрешение на редактирование',
            color: 'error'
          });
        }
      },


      /**
       * Поиск необходимого устройства среди текущих устройств
       */
      getServiceId(item) {
        if (!!!this.innerOffer || !this.innerOffer.services) {
          return -1;
        }
        return this.innerOffer.services.findIndex(function (service) {
          return service.id === item.id;
        })
      },

      /**
       * Получить информацию о компании по id
       */
      async getCompanyById(id) {
        try {
          let {data} = (await this.$api.Company.find({filterId: id})).data;
          this.userCompaniesAutocompliter = data.items;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при попытке получить id компании',
            color: 'error'
          });
        }
      },


      searchCompanyFunc() {
        this.findCompany();
      },

      async chooseCompany(val) {
        if (!this.isAdmin || !!!val) {
          return;
        }
        if (!this.firstLoad) {
          this.changeCompanyUser({});
        }
        if (typeof val == 'object') {
          try {
            let {data} = await this.$api.Company.companyUsers(val.id);
            this.companyUsers = !!data.data && !!data.data.company ? data.data.company.users : [];
            if (this.companyUsers.length == 0) {
              this.setCustomResponsiblePerson();
            }else{
              this.editUser = false;
            }
            if (this.companyUsers.length == 1) {
              this.choosenUser = this.companyUsers[0];
              this.changeCompanyUser(this.choosenUser);
            }
          }catch{
            this.$store.commit('setSnackParams', {
              text: 'Ошибка при попытке получить список пользователей компании',
              color: 'error'
            });
          }
        }else{
          this.companyUsers = [];
          this.setCustomResponsiblePerson();
        }
      },

      /**
       * Смена ответственного лица
       */
      changeCompanyUser(val) {
        if (typeof val == 'object') {
          this.innerOffer.contact_title = !!val.full_name ? val.full_name : '';
          this.innerOffer.contact_phone = !!val.phone ? val.phone : '';
        }
        if (typeof val =='number') {
          let user = this.companyUsers.find((user) => {
            return user.id == val;
          });
          this.innerOffer.contact_title = !!user.full_name ? user.full_name : '';
          this.innerOffer.contact_phone = !!user.phone ? user.phone : '';
        }
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
                        timeout = this.companySearchTimeout,
                        list = this.userCompaniesAutocompliter) {
        //Если переменная поиска пуста или её длина менее 3 символов
        //Обнуляем массив компаний, выводим сообщение о недостаточной длине
        if (!searchText || searchText.length < 3) {
          this.noDataCompanyText = "Необходимо ввести минимум 3 символа";
          list.splice(0);
          // this.innerOffer.company.id = null;
          // this.innerOffer.company.title = searchText;
          this.addDefaultCompaniesListForUser();
          return;
        }

        this.noDataCompanyText = 'Поиск...';
        clearTimeout(timeout);
        timeout = setTimeout(async () => {

          try {
            let {data} = (await this.$api.Company.find({searchText: searchText})).data;
            if (data.items.length == 0) {
              if (this.userCompanies.length == 0) {
                this.noDataCompanyText = "Ничего не найдено";
              }
              list.splice(0);
              this.innerOffer.company.id = null;
              this.innerOffer.company.title = searchText;
              // this.innerOffer.company_id = null;
            }else{
              this.noDataCompanyText = "";
              let outerThis = this;
              data.items.map(function (item, key) {
                outerThis.$set(list, key, item);
              });
            }

            this.addDefaultCompaniesListForUser();

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
       * Добавляем в массив компаний компании пользователя
       */
      addDefaultCompaniesListForUser(list = this.userCompaniesAutocompliter) {
        if (!this.isAdmin) {
          let outerThis = this;
          this.userCompanies.map(function(item, key) {
            outerThis.$set(list, list.length + key, Object.assign({}, item));
          });
        }
      },


      /**
       * Перерасчёт заявки
       * @param service_cost_id - id региона
       * @param services - массив устройств
       * @param offer - объект заявки (необязательный параметр)
       * @returns {Promise<void>}
       */
      async reCalc(service_cost_id = this.innerOffer.service_cost_id,
                   services = this.innerOffer.services,
                   offer = this.innerOffer) {
        if (!this.isAdmin) {
          return;
        }
        if (!service_cost_id || !!!services) {
          return ;
        }
        let toCalc = {
          service_cost_id: service_cost_id,
          services: services,
        }

        try{
          let {data} = (await this.$api.CompanyOffer.calc(toCalc)).data;
          if (!!data) {
            data.calculate.services.map(function(item, key ) {
              Object.assign(services[key], item);
            });
          }

          if (!!offer) {
            this.$set(offer, 'sum', data.calculate.sum);
            this.$set(offer, 'sum_vat', data.calculate.sum_vat);
            this.$set(offer, 'sum_with_vat', data.calculate.sum_with_vat);
          }
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при пересчёте',
            color: 'error'
          });
        }
      },

      /**
       * Указать ответственное лицо вручную
       */
      setCustomResponsiblePerson() {
        this.editUser = true;
        this.choosenUser = {};
      },

      /**
       * Получение title для лаборатории
       * @param val
       */
      laboratoryTitle(val) {
        let code = val.code ? ' [' + val.code + ']' : '';
        return val.title + code;
      },

      /**
       * Событие смены года оказания услуги
       */
      changeTariffYear() {
        if (!!this.innerOffer.services) {
          let outerThis = this;
          this.innerOffer.services.map(function(service, index) {
            if (index != outerThis.findTransportPreparationService() && !!service.service && !!service.service.costs) {
              let isCostInService = service.service.costs.find(function(serviceCost) {
                return serviceCost.service_cost_id == service.service_cost_id && serviceCost.year == outerThis.tariffYear;
              });
              service.tariff = !!isCostInService ? isCostInService.cost : 0;
            }
          })
        }
        this.reCalc();
      },
    },
  }
</script>

<style>
  .checkbox-hidden input[type=checkbox] {
    visibility: hidden;
  }
  .custom-autocomplete-without-id-selection {
    width: 100%;
    color: rgba(0,0,0,.87);
  }
  .custom-autocomplete-without-id:not(.v-input--is-focused) .custom-autocomplete-without-id-selection + input {
    width: 0 !important;
    height: 0 !important;
    min-width: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
    line-height: 0 !important;
  }
</style>

<style scoped>
    .measure-edit__close {
        top: -20px;
        right: -20px;
        z-index: 217;
    }
</style>