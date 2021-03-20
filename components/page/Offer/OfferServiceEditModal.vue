<template>
  <div>
    <TcsmDialog
      :dialog="showDialog"
      persistent
      :width="!$helpers.isMobile() ? '90vw' : '100vw'"
      :edit-dialog="editable"
      @save-changes="saveService"
      @close-dialog="checkBeforeClose"
    >
      <template v-slot:title>
        Информация об устройстве
      </template>

      <template v-slot:main>
        <v-form
          ref="offerServiceForm"
          v-model="offerServiceFormValid"
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
                  :outlined="$helpers.isMobile()"
                  :hide-details="$helpers.isMobile()"
                  suffix="Обязательно"
                  required
                  :items="siList"
                  item-value="id"
                  item-text="title_full"
                  :color="$config.defaultColor"
                  :item-color="$config.defaultColor"
                  label="Выберите средство измерений"
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
                :hide-details="$helpers.isMobile()"
                suffix="Обязательно"
                :outlined="$helpers.isMobile()"
                :rules="rules.serviceRules"
                :color="$config.defaultColor"
                :item-color="$config.defaultColor"
                :items="servicesList"
                item-value="id"
                item-text="title"
                label="Услуга"
                @change="changeService"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              xl="3"
              lg="4"
              md="5"
              sm="6"
              cols="12"
            >
              <v-autocomplete
                v-model="serviceObj.service_cost_id"
                :readonly="!editable"
                :outlined="$helpers.isMobile()"
                :items="serviceCosts"
                label="Регион цен"
                item-value="id"
                item-text="title_for_select"
                :hide-details="$helpers.isMobile()"
                :rules="rules.regionRules"
                required
                :color="$config.defaultColor"
                :item-color="$config.defaultColor"
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
              xl="1"
              lg="2"
              md="2"
              sm="6"
              cols="6"
            >
              <v-text-field
                v-model="serviceObjCount"
                min="1"
                type="number"
                :hide-details="$helpers.isMobile()"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                label="Количество, шт"
                :readonly="!editable"
                @keydown="serviceObjCountKeyDown"
              />
            </v-col>
            <v-col
              xl="1"
              lg="2"
              md="2"
              sm="6"
              cols="6"
            >
              <v-text-field
                v-model="serviceObjCountSets"
                min="1"
                type="number"
                :hide-details="$helpers.isMobile()"
                :color="$config.defaultColor"
                label="Каналов, шт"
                :outlined="$helpers.isMobile()"
                :readonly="!editable"
                @keydown="serviceObjCountKeyDown"
              />
            </v-col>
            <v-col
              xl="2"
              lg="2"
              md="3"
              sm="6"
              cols="6"
            >
              <v-text-field
                v-model="serviceObj.grsi"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :hide-details="$helpers.isMobile()"
                label="№ ГРСИ"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="1"
              lg="2"
              md="2"
              sm="6"
              cols="6"
            >
              <v-text-field
                v-model="serviceObj.year"
                :color="$config.defaultColor"
                :outlined="$helpers.isMobile()"
                :hide-details="$helpers.isMobile()"
                :rules="rules.yearRules"
                required
                label="Год выпуска"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="2"
              lg="3"
              md="5"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObj.fault"
                :color="$config.defaultColor"
                :hide-details="$helpers.isMobile()"
                :outlined="$helpers.isMobile()"
                label="Разряд/Погрешность/КТ"
                :readonly="!editable"
              />
            </v-col>
            <v-col
              xl="2"
              lg="3"
              md="5"
              sm="6"
              cols="12"
            >
              <v-text-field
                v-model="serviceObj.measuring_range"
                :outlined="$helpers.isMobile()"
                :hide-details="$helpers.isMobile()"
                :color="$config.defaultColor"
                label="Предел/диапазон измерений"
                :readonly="!editable"
              />
            </v-col>
          </v-row>
          <v-row v-if="false">
            <v-col>
              <v-text-field
                v-model="serviceObj.service_title_offer"
                :outlined="$helpers.isMobile()"
                :hide-details="$helpers.isMobile()"
                label="Наименование для КП"
                readonly
                :color="$config.defaultColor"
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
                hide-details
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
                hide-details
                :readonly="!editable"
              >
                <v-radio
                  :color="$config.defaultColor"
                  class="mt-0 pt-0"
                  :value="false"
                  label="В лаборатории ЦСМ"
                />
                <v-row>
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
                    class="my-0 py-0"
                  >
                    <template>
                      <v-textarea
                        v-model="serviceObj.address"
                        class="py-0 my-0"
                        :color="$config.defaultColor"
                        label="Место проведения поверки"
                        :outlined="$helpers.isMobile()"
                        :readonly="!editable"
                        :rows="$helpers.isMobile() ? '3' : '1'"
                        hide-details
                        auto-grow
                      >
                        <template
                          v-if="!$helpers.isMobile()"
                          #prepend
                        >
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
                        <template
                          v-if="$helpers.isMobile()"
                          #append
                        >
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
        </v-form>
      </template>
    </TcsmDialog>
    <ConfirmDialog
      :dialog="closeDialog"
      confirm-text="закрыть редактирование услуги по заявке без сохранения?"
      confirm-btn-text="Не сохранять"
      @accept="closeFunc"
      @close-dialog="closeDialog = false"
      @decline="closeDialog = false"
    />
  </div>
</template>

<script>
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  import {offerServiceEditMixin} from "./OfferServiceEditModalMixin"
  import TcsmDialog from "../Dialogs/tcsmDialog";
  export default {
    name: "OfferServiceEditModalAdmin",
    components: {TcsmDialog, ConfirmDialog},
    mixins: [offerServiceEditMixin],
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
        },
        offerServiceFormValid: true,
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      // this.loadData();
    },
    methods: {

      /**
       * Событие смены услуги
       */
      changeService(event) {
        this.setGrsi();
        this.setTitleOffer();
      },
    },

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

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