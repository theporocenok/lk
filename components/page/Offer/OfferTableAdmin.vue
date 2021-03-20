<template>
  <v-card>
    <v-card-title>
      <v-layout
        align-center
        justify-space-between
        wrap
      >
        <div class="mb-2">
          Средства измерений
        </div>
        <v-btn
          v-if="editable"
          dark
          :color="$config.defaultColor"
          small
          @click="newService"
        >
          Добавить СИ
        </v-btn>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <SortMobile
        :sort-by-list="sortByList"
        :show-sort="true"
        @refresh="(sortByValue) => {sortBy = sortByValue}"
      />
      <v-data-table
        no-data-text="Нет записей"
        :headers="headersAdmin"
        :items="servicesList"
        :sort-by="sortBy"
        class="hide-mobile-table-header"
        @dblclick:row="dblclickRow"
      >
        <template #item.service_device_title="{item}">
          {{ !!item.device ? item.device.title : item.service_device_title }}
        </template>
        <template #item.count_sets="{item}">
          {{ item.count_sets ? item.count_sets : '' }}
        </template>
        <template #item.service.code_si="{item}">
          <template v-if="item.service_id != $store.state.transService.service_id">
            {{ !!item.service ? item.service.title : item.service_title }}
          </template>
          <template v-else>
            {{ item.service_title_offer }}
          </template>
        </template>
        <template #item.grsi="{item}">
          <span class="text-no-wrap">
            {{ item.grsi }}
          </span>
        </template>
        <template
          #item.actions="{item}"
        >
          <div
            v-if="item.service_id != $store.state.transService.service_id"
            class="d-flex"
          >
            <v-icon
              v-if="!editable"
              class="mr-1"
              @click="showService(item)"
            >
              mdi-eye
            </v-icon>
            <v-icon
              v-if="editable"
              class="mr-1"
              @click="editService(item)"
            >
              edit
            </v-icon>
            <v-icon
              v-if="editable"
              class="mr-1"
              @click="confirmDeleteRow(item)"
            >
              mdi-close
            </v-icon>
          </div>
        </template>
        <template #item.sum="{item}">
          <span class="text-no-wrap">
            {{ !!item.sum ? item.sum.toLocaleString('ru-RU') : '0' }} руб
          </span>
        </template>
        <template #item.cost="{item}">
          <span class="text-no-wrap">
            {{ !!item.cost ? item.cost.toLocaleString('ru-RU') : '0' }} руб
          </span>
        </template>
        <template
          v-if="isAdmin"
          #body.append
        >
          <tr class="admin-table">
            <td colspan="4" />

            <td>
              <div class="text-no-wrap text-right">
                Сумма:
              </div>
              <div class="text-no-wrap text-right">
                Сумма НДС:
              </div>
              <div class="text-no-wrap text-right">
                Итого с НДС:
              </div>
            </td>
            <td>
              <div class="text-no-wrap text-right">
                <b>{{ !!offerCosts.sum ? offerCosts.sum.toLocaleString('ru-RU') : '0' }}</b> руб
              </div>
              <div class="text-no-wrap text-right">
                <b>{{ !!offerCosts.sum_vat ? offerCosts.sum_vat.toLocaleString('ru-RU') : '0' }}</b> руб
              </div>
              <div class="text-no-wrap text-right">
                <b>{{ !!offerCosts.sum_with_vat ? offerCosts.sum_with_vat.toLocaleString('ru-RU') : '0' }}</b> руб
              </div>
            </td>
            <td />
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <OfferServiceEditModalAdmin
      :dialog="service_dialog"
      :service="service_selected"
      :can-edit="service_editable"
      :service-cost-id="serviceCostId"
      :laboratory-id="laboratoryId"
      :tariff-year="tariffYear"
      @save-item="saveService"
      @close-dialog="closeService"
    />
    <ConfirmDialog
      :dialog="deleteDialog"
      confirm-text="удалить выбранную услугу?"
      confirm-btn-text="Удалить"
      @accept="deleteRow"
      @close-dialog="deleteDialog = false"
      @decline="deleteDialog = false"
    />
  </v-card>
</template>

<script>
  import OfferServiceEditModalAdmin from "./OfferServiceEditModalAdmin";
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  import SortMobile from "../SortMobile";
  export default {
    name: "OfferTableAdmin",
    components: {SortMobile, ConfirmDialog, OfferServiceEditModalAdmin},
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      servicesList: {
        type: Array,
        default: () => {
          return [];
        }
      },
      canEdit: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      serviceCostId: {
        type: Number,
        default: () => {
          return 0;
        }
      },
      laboratoryId: {
        type: Number,
        default: () => {
          return 0;
        }
      },
      offerCosts: {
        type: Object,
        default: () => {
          return {
            sum: 0,
            sum_vat: 0,
            sum_with_vat: 0,
          }
        }
      },
      offerValidated: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      tariffYear: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        clickCounter:0,

        headersAdmin: [
          { text: 'Тип СИ', value: 'service_device_title' },
          { text: 'Номенклатура', value: 'service.code_si', class: 'service_column' },
          { text: 'Количество, шт', value: 'count' },
          { text: 'Каналов, шт', value: 'count_sets' },
          { text: 'Цена', value: 'cost' },
          { text: 'Сумма', value: 'sum' },
          { text: 'Действия', value: 'actions' },
        ],
        sortBy: null,
        sortByList: [
          { label: 'Тип СИ', key: 'service_device_title' },
          { label: 'Номенклатура', key: 'service.code_si', class: 'service_column' },
          { label: 'Количество, шт', key: 'count' },
          { label: 'Каналов, шт', key: 'count_sets' },
          { label: 'Цена', key: 'cost' },
          { label: 'Сумма', key: 'sum' },
        ],

        //Параметры для модалки с редактированием услуги
        service_dialog: false,
        service_selected: {},
        service_editable: false,
        // service_id: -1,

        deleteDialog: false,
        deleteItem: null,
      }
    },
    computed: {
      isAdmin: {
        get() {
          return this.$auth.user.role_id==1;
        }
      },
      editable: {
        get() {
          return this.canEdit;
        }
      },
    },
    watch: {
      dialog: function () {

      },
    },
    mounted() {
      // this.loadData();
    },
    methods: {
      dblclickRow(mouseEvent, item){
          if (item.item.service_id == this.$store.state.transService.service_id) {
            return;
          }
          if (this.editable) {
            this.editService(item.item);
          }else{
            this.showService(item.item);
          }
      },

      /**
       * Закрыть модалку просмотра устройства
       */
      closeService() {
        this.service_selected = {};
        this.service_editable = false;
        this.service_dialog = false;
      },

      /**
       * Добавление устройства к заявке
       */
      newService() {
        if (!this.offerValidated) {
          this.$emit('offer-validate');
          return;
        }
        this.service_editable = true;
        this.service_dialog = true;
      },

      /**
       * Показать подробную информацию об устройстве
       */
      showService(item) {
        this.service_selected = item;
        this.service_editable = false;
        this.service_dialog = true;
      },

      /**
       * Показать подробную информацию об устройстве для редактирования
       */
      editService(item) {
        this.service_selected = item;
        this.service_editable = true;
        this.service_dialog = true;
      },


      /**
       * Добавление/сохранение устройства
       * @param item - объект устройства
       */
      saveService(item) {

        if (!_.isEmpty(_.keys(this.service_selected))) {
          this.$emit('edit-service', item);
        } else {
          this.$emit('new-service', item);
        }

        this.$emit('recalc');
      },

      /**
       * Подтверждение удаления устройства
       */
      confirmDeleteRow(item) {
        this.deleteItem = item;
        this.deleteDialog = true;
      },

      /**
       * Удаление устройства
       * @param item - объект устройства
       */
      deleteRow() {
        this.$emit('delete-service', this.deleteItem);
        this.deleteItem = null;
        this.deleteDialog = false;
      },
    },
  }
</script>

<style>
  @media screen and (min-width: 600px) {
    .service_column {
      width: 40vw;
      min-width: 300px;
    }
  }
</style>

<style scoped>

  @media screen and (max-width: 600px) {
    .admin-table {
      display: none;
    }
  }

</style>