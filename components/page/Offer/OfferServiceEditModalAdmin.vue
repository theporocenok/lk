<template>
  <v-dialog
    v-model="showDialog"
    persistent
    :width="!$helpers.isMobile() ? '90vw' : '100vw'"
    :fullscreen="$helpers.isMobile()"
    content-class="r-dialog"
  >
    <div
      v-if="!$helpers.isMobile()"
      style="position: relative"
    >
      <v-btn
        height="40"
        width="40"
        min-width="0"
        depressed
        absolute
        dark
        rounded
        :color="$config.defaultColor"
        class="r-dialog__close px-0"
        @click="checkBeforeClose"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </div>
    <v-card
      :class="`d-flex flex-column justify-start`"
    >
      <template
        v-if="$helpers.isMobile()"
      >
        <v-layout
          justify-space-between
          align-center
          class="tcsm-dialog__edge px-4"
          @click="checkBeforeClose"
        >
          <v-layout
            align-center
          >
            <v-btn
              text
              class="px-0"
              :color="$config.defaultColor"
            >
              <v-btn
                min-width="unset"
                min-height="unset"
                width="34"
                height="34"
                rounded
                depressed
                :color="$config.defaultColor"
                class="mr-3 px-0"
              >
                <v-icon color="white">
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <span
                v-if="editable"
                class="font-family--rubik text-none body-1"
              >
                Выход без сохранения
              </span>
              <span
                v-else
                class="font-family--rubik text-none body-1"
              >
                Назад
              </span>
            </v-btn>
          </v-layout>

          <v-icon :color="$config.defaultColor">
            close
          </v-icon>
        </v-layout>
      </template>
      <v-card-title class="headline lighten-2 kp_service__title">
        Информация об устройстве
      </v-card-title>

      <v-card-text>
        <v-form
          ref="offerServiceFormAdmin"
          v-model="offerServiceFormAdminValid"
        >
          <v-row>
            <v-col
              xl="6"
              lg="6"
              md="12"
              sm="12"
              cols="12"
            >
              <template v-if="!editable">
                <v-text-field
                  :value="serviceObj.device ? serviceObj.device.title : serviceObj.service_device_title"
                  label="Средство измерений"
                  :outlined="$helpers.isMobile()"
                  readonly
                  :color="$config.defaultColor"
                />
              </template>
              <template v-else>
                <v-combobox
                  ref="serviceDeviceInput"
                  v-model="serviceObj.service_device_id"
                  :rules="rules.deviceRules"
                  required
                  :items="siList"
                  item-value="id"
                  item-text="title_full"
                  :color="$config.defaultColor"
                  :item-color="$config.defaultColor"
                  label="Выберите средство измерений"
                  :outlined="$helpers.isMobile()"
                  :hint="noDataSIText"
                  :no-data-text="noDataSIText"
                  :search-input.sync="searchDevices"
                  clearable
                  @keyup="searchDevicesFunc"
                  @change="getServicesListByDeviceId"
                >
                  <template #item="{item}">
                    <v-row
                      class="device--desktop"
                      justify="space-between"
                    >
                      <v-col
                        xl="6"
                        lg="6"
                        md="7"
                        sm="6"
                      >
                        {{ item.description }}
                      </v-col>
                      <v-col
                        xl="4"
                        lg="4"
                        md="3"
                        sm="4"
                      >
                        {{ item.title }}
                      </v-col>
                      <v-col
                        xl="2"
                        lg="2"
                        md="1"
                        sm="2"
                        class="text-no-wrap"
                      >
                        {{ item.grsi }}
                      </v-col>
                    </v-row>
                    <span class="device--mobile">{{ item.title_full }}</span>
                  </template>
                </v-combobox>
              </template>
            </v-col>
            <v-col
              xl="6"
              lg="6"
              md="12"
              sm="12"
              cols="12"
            >
              <v-text-field
                v-if="!editable"
                readonly
                :outlined="$helpers.isMobile()"
                label="Услуга"
                :color="$config.defaultColor"
                :value="serviceObj.service ? serviceObj.service.title : serviceObj.service_title"
              />
              <v-autocomplete
                v-else
                v-model="serviceObj.service_id"
                required
                :rules="rules.serviceRules"
                :color="$config.defaultColor"
                :item-color="$config.defaultColor"
                :items="servicesList"
                :outlined="$helpers.isMobile()"
                no-data-text="Нет доступных услуг"
                item-value="id"
                item-text="title"
                label="Услуга"
                @change="changeService"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              xl="2"
              lg="2"
              md="6"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObj.grsi"
                :color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                label="№ ГРСИ"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="2"
              lg="2"
              md="6"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObj.year"
                :color="$config.defaultColor"
                :rules="rules.yearRules"
                :outlined="$helpers.isMobile()"
                required
                step="1"
                type="number"
                :max="new Date().getFullYear()"
                label="Год выпуска"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="4"
              lg="4"
              md="6"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObj.fault"
                :color="$config.defaultColor"
                label="Разряд/Погрешность/КТ"
                :outlined="$helpers.isMobile()"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="4"
              lg="4"
              md="6"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObj.measuring_range"
                :color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                label="Предел/диапазон измерений"
                :readonly="!editable"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="serviceObj.service_title_offer"
                required
                :rules="rules.nameKPRules"
                :rows="1"
                auto-grow
                :outlined="$helpers.isMobile()"
                label="Наименование для печати"
                :readonly="!editable"
                :color="$config.defaultColor"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="serviceObj.laboratory_id"
                :color="$config.defaultColor"
                :items="$store.state.laboratories"
                item-value="id"
                label="Лаборатория"
                :outlined="$helpers.isMobile()"
                :readonly="!editable"
                clearable
                class="custom-autocomplete-without-id"
                :item-color="$config.defaultColor"
                :item-text="laboratoryTitle"
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
          </v-row>
          <v-row>
            <v-col
              xl="3"
              lg="3"
              md="3"
              sm="6"
              cols="12"
            >
              <v-autocomplete
                v-model="serviceObj.service_cost_id"
                :readonly="!editable"
                :items="serviceCosts"
                label="Регион цен"
                :outlined="$helpers.isMobile()"
                item-value="id"
                item-text="title"
                :rules="rules.regionRules"
                required
                :color="$config.defaultColor"
                :item-color="$config.defaultColor"
                @change="changeServiceCost"
              >
                <template v-slot:item="data">
                  <div>
                    <div>{{ data.item.title }}</div>
                    <div class="caption">
                      {{ data.item.message }}
                    </div>
                  </div>
                </template>
              </v-autocomplete>
              <div
                v-show="isWrongRegion"
                style="color: red;"
              >
                Данная услуга в выбранном регионе не оказывается
              </div>
            </v-col>
            <v-col
              xl="3"
              lg="3"
              md="3"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObjTariff"
                :color="$config.defaultColor"
                label="Тариф, руб"
                type="number"
                :readonly="!editable"
                :outlined="$helpers.isMobile()"
                @change="reCalcOne"
                @keyup="reCalcOne"
              />
            </v-col>
            <v-col
              xl="3"
              lg="3"
              md="3"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model.number="serviceObjCount"
                min="1"
                type="number"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                label="Количество, шт"
                :rules="rules.countRules"
                required
                :readonly="!editable"
                @input="reCalcOne"
                @change="reCalcOne"
                @keyup="reCalcOne"
                @keydown="serviceObjCountKeyDown"
              />
            </v-col>
            <v-col
              xl="3"
              lg="3"
              md="3"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObjCountSets"
                min="1"
                type="number"
                :color="$config.defaultColor"
                label="Каналов, шт"
                :readonly="!editable"
                :outlined="$helpers.isMobile()"
                @input="reCalcOne"
                @change="reCalcOne"
                @keyup="reCalcOne"
                @keydown="serviceObjCountKeyDown"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              xl="12"
              lg="12"
              md="12"
              sm="12"
              cols="12"
            >
              <v-checkbox
                v-model="serviceObj.urgency"
                label="Срочность"
                on-icon="mdi-checkbox-marked-outline"
                class="mt-0 checkbox-hidden"
                :color="$config.defaultColor"
                :readonly="!editable"
              >
                <template #label>
                  <span class="mr-2">Срочность</span>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    <span>Срочное выполнение работ в течение трех дней. Надбавка к тарифу 50%</span>
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-radio-group
                v-model="addressButtons"
                class="mt-0 pt-0 mr-7"
                :readonly="!editable"
              >
                <v-radio
                  :color="$config.defaultColor"
                  class="mt-0 pt-0"
                  :value="false"
                  label="В лаборатории ЦСМ"
                />
                <v-row class="d-flex align-center">
                  <v-col
                    xl="3"
                    lg="3"
                    md="3"
                    sm="4"
                    cols="12"
                  >
                    <v-radio
                      :color="$config.defaultColor"
                      class="mt-0 pt-0"
                      :value="true"
                      label="Выезд по месту"
                    />
                  </v-col>
                  <v-col
                    v-show="addressButtons"
                    xl="9"
                    lg="9"
                    md="9"
                    sm="8"
                    cols="12"
                    class="py-0 my-0"
                  >
                    <template>
                      <v-textarea
                        v-model="serviceObj.address"
                        class="py-0 my-0"
                        :color="$config.defaultColor"
                        label="Место проведения поверки"
                        :outlined="$helpers.isMobile()"
                        :readonly="!editable"
                        rows="1"
                        auto-grow
                      >
                        <template #prepend>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-help-circle-outline
                              </v-icon>
                            </template>
                            <span>Выезд по месту эксплуатации СИ с указанием адреса</span>
                          </v-tooltip>
                        </template>
                      </v-textarea>
                    </template>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              xl="12"
              lg="12"
              md="12"
              sm="12"
              cols="12"
            >
              <v-autocomplete
                v-model="serviceObj.coefficients"
                :items="$store.state.coefficients"
                class="custom-autocomplete-without-id kp_discounts"
                item-value="id"
                :item-text="coefficientTitle"
                :item-color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                clearable
                no-data-text="Нет подходящих скидок/надбавок"
                :readonly="!editable"
                :color="$config.defaultColor"
                label="Скидки и надбавки"
                @change="changeCoefficient"
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
          </v-row>
          <v-row>
            <v-col
              xl="2"
              lg="2"
              md="6"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObjDiscount"
                :color="$config.defaultColor"
                label="Скидка, %"
                :outlined="$helpers.isMobile()"
                readonly
              />
            </v-col>
            <v-col
              xl="2"
              lg="2"
              md="6"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObjIncrease"
                :color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                label="Надбавка, %"
                readonly
              />
            </v-col>
            <v-spacer />
            <v-col
              xl="2"
              lg="2"
              md="4"
              sm="6"
              cols="12"
            >
              <v-text-field
                :value="this.serviceObj.cost ? this.serviceObj.cost.toLocaleString('ru-RU') : ''"
                :color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                label="Цена"
                readonly
              />
            </v-col>
            <v-col
              xl="2"
              lg="2"
              md="4"
              sm="6"
              cols="12"
            >
              <v-text-field
                :value="this.serviceObj.sum ? this.serviceObj.sum.toLocaleString('ru-RU') : ''"
                :color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                label="Сумма"
                readonly
              />
            </v-col>
            <v-col
              xl="2"
              lg="2"
              md="4"
              sm="12"
              cols="12"
            >
              <v-text-field
                :value="this.serviceObj.sum_with_vat ? this.serviceObj.sum_with_vat.toLocaleString('ru-RU') : ''"
                :color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                label="Итого с НДС"
                readonly
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-layout
          justify-end
          wrap
        >
          <v-btn
            v-if="editable"
            :color="$config.defaultColor"
            text
            @click="saveService"
          >
            Сохранить
          </v-btn>
          <v-btn
            color="red"
            text
            @click="checkBeforeClose"
          >
            Закрыть
          </v-btn>
        </v-layout>
      </v-card-actions>

      <template
        v-if="$helpers.isMobile() && false"
      >
        <v-layout
          justify-center
          align-center
          column
          class="tcsm-dialog__edge px-4 body-2"
          style="color: #b1b1b1;"
        >
          <n-link
            :to="localePath('/')"
            class="text-decoration-none"
            style="color: #b1b1b1 !important;"
          >
            Политика конфиденциальности
          </n-link>
          © {{ new Date().getFullYear() }} Тюменский ЦСМ
        </v-layout>
      </template>
    </v-card>
    <ConfirmDialog
      :dialog="closeDialog"
      confirm-text="закрыть редактирование услуги по заявке без сохранения?"
      confirm-btn-text="Выйти без сохранения"
      @accept="closeFunc"
      @close-dialog="closeDialog = false"
      @decline="closeDialog = false"
    />
  </v-dialog>
</template>

<script>
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  import {offerServiceEditMixin} from "./OfferServiceEditModalMixin";
  export default {
    name: "OfferServiceEditModalAdmin",
    components: {ConfirmDialog},
    mixins: [offerServiceEditMixin],
    props: {
      laboratoryId: {
        type: Number,
        default: () => {
          return 0;
        }
      },
    },
    data() {
      return {
        rules: {
          deviceRules: [
            v => !!v || 'Выберите, пожалуйста, средство измерений'
          ],
          deviceCustomRules: [
            v => !!v || 'Введите, пожалуйста, наименование средства измерений'
          ],
          serviceRules: [
            v => !!v || 'Выберите, пожалуйста, услугу'
          ],
          countRules: [
            v => !!v || 'Обязательное поле'
          ],
          yearRules: [
            v => (!!!v || v && parseInt(v, 10) > 1900) || 'Год должен быть не меньше 1900',
            v => (!!!v || v && parseInt(v, 10) <= new Date().getFullYear()) || 'Год должен быть не больше текущего',
          ],
          regionRules: [
            v => !!v || 'Выберите, пожалуйста, регион цен',
          ],
          nameKPRules: [
            v => !!v || 'Обязательное поле'
          ],
        },
        offerServiceFormAdminValid: true,
        isCalcing: false,
      }
    },
    computed: {
      urgency() {
        return this.serviceObj.urgency;
      },
      serviceObjTariff: {
        get() {
          return this.serviceObj.tariff ? this.serviceObj.tariff : 0;
        },
        set(newValue) {
          if (!!newValue) {
            this.serviceObj.tariff = Math.abs(parseFloat(newValue));
            return;
          }
          this.serviceObj.tariff = 0;
        }
      },
      serviceObjDiscount: {
        get() {
          return this.serviceObj.discount_prc ? this.serviceObj.discount_prc : 0;
        },
        set(newValue) {
          if (!!newValue) {
            this.serviceObj.discount_prc = parseInt(newValue, 10) > 100 ? 100 : parseInt(newValue, 10);
            return;
          }
          this.serviceObj.discount_prc = 0;
        }
      },
      serviceObjIncrease: {
        get: function() {
          return !!this.serviceObj.increase_prc ? this.serviceObj.increase_prc : 0;
        },
        set: function(newValue) {
          if (!!newValue) {
            this.serviceObj.increase_prc = parseInt(newValue);
            return;
          }
          this.serviceObj.increase_prc = 0;
        }
      },
    },
    watch: {
      'serviceObj.coefficients': function (val) {
        this.reCalcOne();
      },
      'serviceObj.service_id': function (val) {
        this.setTariff();
      }
    },
    mounted() {
      // this.loadData();
    },
    methods: {

      /**
       * Получение title для лаборатории
       * @param val
       */
      laboratoryTitle(val) {
        let code = val.code ? ' [' + val.code + ']' : '';
        return val.title + code;
      },

      /**
       * Событие смены услуги
       */
      changeService(event) {
        this.setGrsi();
        this.setTitleOffer();
        this.setTariff();
      },

      /**
       * Событие смены региона цен
       */
      changeServiceCost() {
        this.setTariff();
        this.reCalcOne();
      },

      /**
       * Установка тарифа при смене услуги
       */
      setTariff(item) {
        if (!!!this.serviceObj.service_id || this.serviceObj.service_id < 0) {
          return;
        }
        let outerThis = this;
        let servCostObj = this.servicesList.find(function(item) {
          return outerThis.serviceObj.service_id == item.id;
        });

        if (!!!servCostObj) {
          return;
        }

        let tariffCost = servCostObj.costs.find(function(cost) {
          return cost.service_cost_id === outerThis.serviceObj.service_cost_id && cost.year === outerThis.tariffYear;
        });
        this.serviceObj.tariff = !!tariffCost ? tariffCost.cost : 0;
        this.reCalcOne();
      },

      /**
       * Пересчёт стоимости текущего СИ
       * @returns {Promise<void>}
       */
      async reCalcOne() {
        if (this.isCalcing) {
          return;
        }
        this.isCalcing = true;
        let service_cost_id = this.serviceObj.service_cost_id;
        let service = Object.assign({}, this.serviceObj);

        // console.log(this.serviceObj.discount_prc,
        //             this.serviceObj.discount_prc.toString().replace(/[^0-9]/g, ''),
        //             parseInt(this.serviceObj.discount_prc));

        this.$set(service, 'tariff', parseFloat(this.serviceObj.tariff));
        this.$set(service, 'discount_prc', parseFloat(this.serviceObj.discount_prc));
        this.$set(service, 'increase_prc', parseFloat(this.serviceObj.increase_prc));
        this.$set(service, 'count', parseInt(this.serviceObj.count));
        this.$set(service, 'count_sets', parseInt(this.serviceObj.count_sets));

        let toCalc = {
          service_cost_id: service_cost_id,
          services: [service],
        }

        try{
          let {data} = (await this.$api.CompanyOffer.calc(toCalc)).data;
          if (!!data) {

            this.$set(this.serviceObj, 'sum', data.calculate.services[0].sum);
            this.$set(this.serviceObj, 'cost', data.calculate.services[0].cost);
            this.$set(this.serviceObj, 'sum_with_vat', data.calculate.services[0].sum_with_vat);
          }
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при перерасчёте',
            color: 'error'
          });
        }
        this.isCalcing = false;
      },

      /**
       * Наименование скидок/надбавок при выборе
       */
      coefficientTitle(val) {
        let code = val.code ? ' [' + val.code + ']' : '';
        let percent = '';
        if (!!val.type && !!val.percent) {
          percent += ' (';
          percent += val.type > 0 ? '+' : '-';
          percent += val.percent;
          percent += '%)';
        }
        return val.title + percent + code;
      },

      /**
       * Пересчёт скидок и надбавок
       */
      changeCoefficient() {
        this.serviceObj.discount_prc = 0;
        this.serviceObj.increase_prc = 0;
        let coeffObj = this.getCoefficientObj(this.serviceObj.coefficients);
        if (!!coeffObj.type && !!coeffObj.percent) {
          if (coeffObj.type > 0) {
            this.serviceObj.increase_prc += coeffObj.percent;
          }else{
            this.serviceObj.discount_prc += coeffObj.percent;
          }
        }
      },

      /**
       * Поиск объекта среди всех скидок/надбавок по его id
       * @param id
       */
      getCoefficientObj(id) {
        return this.$store.state.coefficients.find(function(item) {
          return item.id==id;
        })
      },

      /**
       * Удаление надбавки/скидки из списка
       * @param val - объект надбавки/скидки
       */
      removeSelectedCoefficient(val) {
        let index = this.serviceObj.coefficients.findIndex(function(item) {
          return item == val.id;
        });
        this.serviceObj.coefficients.splice(index, 1);
        this.changeCoefficients();
      }
    },

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

<style>
  .device--mobile {
    display: none;
  }
  .kp_discounts .v-select__selections {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
  }
  .kp_discounts .v-chip {
    height: unset;
    padding: 10px 12px;
  }
  .kp_discounts .wrap {
    white-space: normal;
  }
  .v-menu__content .v-list-item__title {
    white-space: normal;
  }
  @media screen and (max-width: 600px) {
    .device--mobile {
      display: unset;
    }
    .device--desktop {
      display: none;
    }
  }
</style>

<style scoped>

  .autocomplete__items {
    position: absolute;
    z-index: 1;
    border: 1px solid #7F828B;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    left: 0;
    right: 0;
    bottom: -14px;
    background-color: #fff;
  }
  .kp_service__title {
    word-break: normal;
  }

</style>