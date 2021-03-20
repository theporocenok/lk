<template>
  <v-card :elevation="$helpers.isMobile() ? '0' : ''">
    <v-card-title :class="$helpers.isMobile() ? 'px-0' : ''">
      <v-layout
        v-if="!$helpers.isMobile()"
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
      <SortFilterTitle
        v-else
        title="Средства измерений"
        :show-filters-btn="false"
        :show-sort-btn="false"
        show-add-btn
        @add-action="newService"
      />
    </v-card-title>
    <v-card-text :class="$helpers.isMobile() ? 'pb-0 px-0' : ''">
      <v-data-table
        no-data-text="Нет записей"
        :headers="headersAdmin"
        :items="servicesList"
        class="hide-mobile-table-header"
        mobile-breakpoint="0"
        :hide-default-header="$helpers.isMobile()"
        :hide-default-footer="$helpers.isMobile()"
        @dblclick:row="dblclickRow"
        @click:row="dblclickRow"
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
        <template #item.actions="{item}">
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
        <template
          v-if="$helpers.isMobile()"
          #item="{item}"
        >
          <div
            class="font-family--rubik caption text-none text--black py-4"
            style="border-top: 1px solid #e5e5e5;"
          >
            <v-layout
              class="px-4"
              justify-space-between
              align-center
            >
              <div>
                {{ item.service ? item.service.title : item.service_title }}
              </div>
              <div
                v-if="item.service_id != $store.state.transService.service_id"
                class="d-flex ml-3"
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
                  class="mr-2"
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
            </v-layout>

            <v-layout
              class="mt-3 px-4"
              justify-space-between
            >
              <div style="flex: 0 0 42%;">
                <div
                  class="text--grey overline text-none mb-2"
                  style="letter-spacing: unset !important;"
                >
                  Наименование СИ
                </div>
                <div class="text--black">
                  {{ item.device ? item.device.title : item.service_device_title }}
                </div>
              </div>
              <div style="flex: 0 0 28%;">
                <div
                  class="text--grey overline text-none mb-2"
                  style="letter-spacing: unset !important;"
                >
                  Количество, шт.
                </div>
                <div class="text--black">
                  {{ item.count }}
                </div>
              </div>
              <div style="flex: 0 0 23%;">
                <div
                  class="text--grey overline text-none mb-2"
                  style="letter-spacing: unset !important;"
                >
                  Каналов, шт.
                </div>
                <div class="text--black">
                  {{ item.count_sets }}
                </div>
              </div>
            </v-layout>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
    <OfferServiceEditModal
      :dialog="service_dialog"
      :service="service_selected"
      :can-edit="service_editable"
      :service-cost-id="serviceCostId"
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
  import OfferServiceEditModal from "./OfferServiceEditModal";
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  import SortFilterTitle from "../SortFilterTitle";
  export default {
    name: "OfferTableAdmin",
    components: {SortFilterTitle, ConfirmDialog, OfferServiceEditModal},
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
          { text: 'Наименование СИ', value: 'service_device_title' },
          { text: 'Услуга', value: 'service.code_si' },
          { text: 'Количество, шт', value: 'count' },
          { text: 'Каналов, шт', value: 'count_sets' },
          { text: 'Действия', value: 'actions' },
        ],
        sortBy: null,
        sortByList: [
          { text: 'Номенклатура', key: 'service.code_si', class: 'service_column' },
          { text: 'Услуга', key: 'service.code_si' },
          { text: 'Количество, шт', key: 'count' },
          { text: 'Каналов, шт', key: 'count_sets' },
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

<style scoped>

</style>