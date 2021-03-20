<template>
  <div>
    <TcsmDialog
      :dialog="showDialog"
      edit-dialog
      max-width="80vh"
      persistent
      custom-footer
      @close-dialog="closeFunc"
    >
      <template v-slot:title>
        Информация об устройстве
      </template>

      <template v-slot:main>
        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
        >
          <v-row>
            <v-col
              class="pb-0"
            >
              <v-text-field
                v-if="currDevice.id"
                v-model="currDevice.device_title"
                label="Средство измерений"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile ? 'mb-5' : ''"
                suffix="Обязательно"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                readonly
              />
              <v-autocomplete
                v-else
                v-model="currDevice.service_device_id"
                :items="devices"
                label="Средство измерений"
                item-value="id"
                item-text="title_full"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile ? 'mb-5' : ''"
                suffix="Обязательно"
                :rules="rules.serviceDeviceRules"
                :outlined="$helpers.isMobile()"
                :cache-items="false"
                :no-data-text="noDevicesListText"
                :color="$config.defaultColor"
                :search-input.sync="searchDevices"
                @keyup="getDevicesList"
                @change="setGrsi"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="12"
              class="py-0"
            >
              <v-text-field
                ref="title"
                v-model="currDevice.title"
                label="Наименование пользовательское"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile ? 'mb-5' : ''"
                suffix="Обязательно"
                required
                :rules="rules.titleRules"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="6"
              class="py-0"
            >
              <v-text-field
                ref="year"
                v-model="currDevice.year"
                label="Год выпуска"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="6"
              class="py-0"
            >
              <v-text-field
                ref="serial_number"
                v-model="currDevice.serial_number"
                label="Серийный номер"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="6"
              class="py-0"
            >
              <v-text-field
                ref="grsi"
                v-model="currDevice.grsi"
                label="№ ГРСИ"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                readonly
              />
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="6"
              class="py-0"
            >
              <v-text-field
                v-if="!editable"
                :value="currDevice.last_calibration"
                label="Последняя поверка"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                readonly
              />
              <v-menu
                v-else
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    ref="last_calibration"
                    v-model="chosenDate"
                    label="Дата последней поверки"
                    :prepend-icon="!$helpers.isMobile() ? 'event' : ''"
                    :append-icon="$helpers.isMobile() ? 'event' : ''"
                    :rules="rules.lastCalibrationRules"
                    :outlined="$helpers.isMobile()"
                    required
                    readonly
                    v-bind="attrs"
                    :color="$config.defaultColor"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="chosenDate"
                  no-title
                  scrollable
                  locale="ru"
                  :color="$config.defaultColor"
                >
                  <v-spacer />
                  <v-btn
                    text
                    :color="$config.defaultColor"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    :color="$config.defaultColor"
                    text
                    @click="chooseDate"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="12"
              class="py-0"
            >
              <v-text-field
                ref="address"
                v-model="currDevice.address"
                label="Адрес"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :readonly="!editable"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="12"
              class="py-0"
            >
              <v-text-field
                ref="fault"
                v-model="currDevice.fault"
                label="Разряд, погрешность, КТ"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="12"
              class="py-0"
            >
              <v-text-field
                v-if="!editable"
                v-model="currDevice.company_title"
                label="Компания"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                readonly
              />
              <v-autocomplete
                v-show="editable"
                ref="company_id"
                v-model="currDevice.company_id"
                :items="userCompanies"
                item-value="id"
                item-text="title"
                label="Компания"
                :outlined="$helpers.isMobile()"
                required
                :rules="rules.companyRules"
                :color="$config.defaultColor"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="12"
              class="py-0"
            >
              <v-text-field
                ref="measuring_range"
                v-model="currDevice.measuring_range"
                label="Предел/диапазон измерений"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="6"
              sm="6"
              cols="12"
              class="py-0"
            >
              <v-text-field
                v-model="currDevice.calibration_months"
                :readonly="!editable"
                min="0"
                type="number"
                :outlined="$helpers.isMobile()"
                label="Межповерочный интервал (месяцев)"
                :color="$config.defaultColor"
                @keydown="calibrationMonthsValid"
              />
            </v-col>
          </v-row>
          <v-row v-if="currDevice.services">
            <v-col class="py-0">
              <ServicesTable

                :table-font="'caption'"
                :services="currDevice.services"
              />
            </v-col>
          </v-row>
        </v-form>
      </template>


      <template v-slot:footer>
        <v-spacer />

        <v-btn
          v-if="editable"
          :color="$config.defaultColor"
          text
          @click="saveDevice"
        >
          {{ (currDevice.id?'Сохранить': 'Добавить') }}
        </v-btn>
        <v-btn
          v-if="!editable && currDevice.services"
          :color="$config.defaultColor"
          text
          @click="editBtn = true"
        >
          Изменить
        </v-btn>
        <v-btn
          color="red"
          text
          @click="closeFunc"
        >
          Закрыть
        </v-btn>
      </template>
    </TcsmDialog>
    <ConfirmDialog
      confirm-text="закрыть всплывающее окно без сохранения?"
      confirm-btn-text="Не сохранять"
      :dialog="confirmDialog"
      @accept="closeFuncWithoutSaving"
      @decline="confirmDialog = false"
    />
    <PastChecksModal
      :dialog="pastChecksModal"
      @close-dialog="pastChecksModal = false"
    />
  </div>
</template>

<script>
  import PastChecksModal from "./PastChecksModal";
  import ServicesTable from "./ServicesTable";
  import TcsmDialog from "../Dialogs/tcsmDialog";
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  export default {
    name: "ServiceDeviceModal",
    components: {ConfirmDialog, TcsmDialog, ServicesTable, PastChecksModal},
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      device: {
        type: Object,
        default: () => {
          return {};
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
      }
    },
    data() {
      return {
        pastChecksModal: false,
        servicesModal: false,
        menu: false,
        editBtn: false,
        chosenDate: new Date().toISOString().substr(0, 10),
        currDevice: {},
        formValid: true,
        rules: {
          titleRules: [
            v => !!v || 'Обязательное поле',
            v => (v && v.length >= 3) || 'Наименование должно быть не короче 3 символов',
          ],
          lastCalibrationRules: [
            v => !!v || 'Обязательное поле',
            v =>
                    (v && new Date(v).toISOString().substr(0, 10) <= new Date().toISOString().substr(0, 10))
                    || 'Дата не должна превышать текущее число',
          ],
          companyRules: [
            v => !!v || 'Обязательное поле',
          ],
          serviceDeviceRules: [
            v => !!v || 'Обязательное поле',
          ],
        },
        devicesList: [],
        devicesSearchTimeout: null,
        searchDevices: '',
        noDevicesListText: 'Необходимо ввести минимум 3 символа',
        loading: false,
        isEdited: false,
        // item: {
        //   title: null,
        //   measuring_range: null,
        //   grsi: null,
        //   year: null,
        //   serial_number: null,
        //   fault: null,
        //   last_calibration: null,
        //   address: null,
        //   company: null,
        // }

        confirmDialog: false,
        confirmDialogText: '',
        confirmDialogTextColor: this.$config.defaultColor,
        confirmDialogBtnText: '',
        confirmDialogBtnColor: this.$config.defaultColor,
        confirmDialogAcceptAction: () => {},
        confirmDialogDeclineAction: () => {},
      }
    },
    computed: {
      editable: {
        get() {
          return this.edit || this.editBtn;
        },
        set() {

        }
      },
      devices: {
        get() {
          if (this.devicesList.length > 0) {
            return this.devicesList;
          }
          return [];
        }
      },
      showDialog: {
          get() {
              return this.dialog;
          },
          set(v) {
              this.dateMenu = false;
              this.$emit('close-dialog');
          }
      },
      // currDevice: {
      //   get() {
      //     if (this.editable) {
      //       if (this.device.device) {
      //         this.copyObj(this.deviceToSingleLvl(this.device));
      //       }else{
      //         this.copyObj(this.getClearObj());
      //       }
      //
      //       return this.item;
      //     }
      //
      //     return this.device.device?this.deviceToSingleLvl(this.device):this.getClearObj();
      //   }
      // }
    },
    watch: {
      dialog(val) {
        if (val && !!this.$refs.form) {
          this.$refs.form.resetValidation();
        }
        if (val) {
          this.openModal();
        }
      },
      currDevice: {
        handler(val) {
          if (!this.loading) {
            this.isEdited = true;
          }
        },
        deep: true,
      }
    },
    mounted() {
      // this.loadData();
    },
    beforeUpdate() {
      if (this.userCompanies.length == 1) {
        this.loading = true;
        this.currDevice.company_id = this.userCompanies[0].id;
        this.loading = false;
      }
    },
    methods: {
      async openModal() {
        this.loading = true;
        if (this.editable) {
          if (this.device.device) {
            await this.copyObj(this.deviceToSingleLvl(this.device));
          }else{
            await this.copyObj(this.getClearObj());
          }
        }else{
          await this.copyObj(this.device.device ? this.deviceToSingleLvl(this.device) : this.getClearObj());
        }

        this.loading = false;
        this.isEdited = false;
      },
      chooseDate() {
          this.$refs.menu.save(this.currDevice.last_calibration);
      },
      closeFunc() {
          if (this.isEdited) {
            this.confirmDialog = true;
            return;
          }
          this.closeFuncWithoutSaving();
      },
      closeFuncWithoutSaving() {
        this.confirmDialog = false;
        this.editBtn = false;
        this.pastChecksModal = false;
        this.menu = false;
        this.loading = false;
        this.isEdited = false;
        this.showDialog = false;
      },
      async saveDevice() {
          if (!this.$refs.form.validate()) {
            this.noDevicesListText = "Необходимо ввести минимум 3 символа";
            return;
          }

          try{
            this.currDevice.last_calibration = this.chosenDate;
            let response;
            if (this.currDevice.id) {
              response = (await this.$api.CompanyDevice.update(this.currDevice));
            }else{
              response = (await this.$api.CompanyDevice.create(this.currDevice));
            }

            if (response.statusText == "OK") {
              this.$emit('save-device');
              this.editBtn = false;
              this.showDialog = false;
            }
          }catch{
            this.$store.commit('setSnackParams', {
              text: 'Ошибка при попытке создать/изменить СИ',
              color: 'error'
            });
          }
      },
      getClearObj() {
        this.chosenDate = new Date().toISOString().substr(0, 10);
        return {
          id: null,
          title: '',
          device_title: '',
          measuring_range: '',
          grsi: '',
          calibration_days: null,
          calibration_months: null,
          year: '',
          serial_number: '',
          fault: '',
          last_calibration: '',
          address: '',
          company_title: '',
          company_id: null,
          service_device_id: null,
          services: null,
        }
      },
      deviceToSingleLvl(item) {
        //Устанавливаем дату последней проверки
        this.chosenDate = new Date(item.last_calibration).toISOString().substr(0, 10);
        return {
          id: item.id,
          title: item.title,
          device_title: item.device ? item.device.title_full:'',
          measuring_range: item.measuring_range,
          grsi: item.device?item.device.grsi:'',
          calibration_days: item.device?item.device.calibration_days:null,
          calibration_months: item.calibration_months,
          year: item.year,
          serial_number: item.serial_number,
          fault: item.fault,
          last_calibration: item.last_calibration,
          address: item.address,
          company_title: item.company?item.company.title:'',
          company_id: item.company?item.company.id:null,
          service_device_id: item.device?item.device.id:null,
          services: item.device?item.device.services:null,
        }
      },
      copyObj(fromObj) {
        this.currDevice = Object.assign({},fromObj);
      },
      async getDevicesList() {
        if (!this.searchDevices || this.searchDevices.length < 3) {
          this.noDevicesListText = "Необходимо ввести минимум 3 символа";
          this.devicesList = [];
          return;
        }

        this.noDevicesListText = 'Поиск...';
        clearTimeout(this.devicesSearchTimeout);
        this.devicesSearchTimeout = setTimeout(async () => {

          let {data} = (await this.$user.ServiceDevice.methods.all({searchText: this.searchDevices})).data;
          if (data.length == 0) {
            this.noDevicesListText = "Ничего не найдено";
            this.devicesList = [];
          }else{
            this.devicesList = data;
          }

          clearTimeout(this.devicesSearchTimeout);
        }, 500);
      },
  
      setGrsi() {
        let currDeviceId = this.currDevice.service_device_id;
        let currDevice = this.devices.find(function (item) {
          return item.id == currDeviceId;
        });
    
    
        this.currDevice.grsi = !!currDevice
                ? currDevice.grsi
                : '';
      },

      calibrationMonthsValid(event) {
        if (event.key==',' || event.key=='-' || event.key=='.' || event.key=='e') {
          event.preventDefault();
        }
      },
    },

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

<style>

</style>

<style scoped>

</style>