<template>
  <div>
    <TcsmDialog
      :dialog="dialog"
      edit-dialog
      max-width="800"
      @save-changes="updateComment(), closeWithoutSaving()"
      @close-dialog="close"
    >
      <template v-slot:title>
        <div class="title font-family--rubik">
          <v-layout
            v-if="loading"
            justify-center
            align-center
            style="height: 100px"
          >
            <v-progress-circular
              indeterminate
              :color="defaultColor"
            />
          </v-layout>
          <template v-else>
            <div>
              Cчет № <span>{{ invoice_item.number }} от {{ $helpers.convertDateTcsm(invoice_item.issued_at) }}</span>
            </div>
          </template>
        </div>
      </template>
      <template v-slot:main>
        <div
          class="body-2 mt-2 font-family--rubik px-1"
          style="color: #222"
        >
          <div
            v-if="!!invoice_item && !!invoice_item.status"
            :class="`px-3 py-2 mx-n3 mb-2 font-weight-bold ${$helpers.isMobile() ? 'caption text-none' : ''}`"
            :style="`background-color: rgba(${$helpers.convertHexToRGB(invoice_item.status.color)},.1)`"
          >
            {{ invoice_item.status.title }}
            <template v-if="invoice_item.ready_at || invoice_item.payed_at || invoice_item.issued_at">
              <template v-if="invoice_item.ready_at">
                {{ $helpers.convertDateTcsm(invoice_item.ready_at) }}
              </template>
              <template v-else-if="invoice_item.payed_at">
                {{ $helpers.convertDateTcsm(invoice_item.payed_at) }}
              </template>
              <template v-else-if="invoice_item.issued_at">
                {{ $helpers.convertDateTcsm(invoice_item.issued_at) }}
              </template>
            </template>
          </div>
          <template v-if="invoice_item.company">
            <div :class="`mb-3 ${$helpers.isMobile() ? 'caption' : ''}`">
              {{ invoice_item.company.title }}
            </div>

            <div :class="`mt-1 ${$helpers.isMobile() ? 'caption' : ''}`">
              <i>ИНН</i> <span style="color: #858791;">{{ invoice_item.company.inn }}</span> / <i>КПП</i> <span style="color: #858791;">{{ invoice_item.company.kpp }}</span>
            </div>
          </template>


          <template v-if="invoice_item.order">
            <div class="mt-1 caption">
              Договор № <span style="color: #858791;">{{ invoice_item.order.number }}</span>
              <span
                v-if="invoice_item.order.approved_at != null"
                class=""
                style="color: #858791;"
              >
                <i>от</i> <span>{{ $helpers.convertDateTcsm(invoice_item.order.approved_at) }}</span>
              </span>
            </div>
          </template>
          <template v-if="!!invoice_item.payed_at && $helpers.isMobile()">
            <div class="mt-1 caption">
              Дата оплаты: <span style="color: #858791;">{{ $helpers.convertDateTcsm(invoice_item.payed_at) }}</span>
            </div>
          </template>
          <template v-if="!!invoice_item.ready_at && $helpers.isMobile()">
            <div class="mt-1 caption">
              Дата готовности: <span style="color: #858791;">{{ $helpers.convertDateTcsm(invoice_item.ready_at) }}</span>
            </div>
          </template>
        </div>
        <v-layout
          v-if="loading"
          justify-center
          align-center
          style="height: 100px"
        >
          <v-progress-circular
            indeterminate
            :color="defaultColor"
          />
        </v-layout>
        <template v-else>
          <InvoiceItems
            v-if="invoice_item.items"
            :invoice-items="invoice_item.items"
          />
          <v-divider v-if="!$helpers.isMobile()" />
          <v-layout
            align-center
            justify-space-between
            class="mx-n6 px-6 mt-5 subtitle-2"
            :style="`height: 46px; ${$helpers.isMobile() ? 'background-color: rgba(24, 203, 31, 0.1);' : ''}`"
          >
            <div>
              <span
                :class="`${$helpers.isMobile() ? 'font-weight-regular' : 'font-weight-bold'}`"
                :style="$helpers.isMobile() ? 'color: #222;' : ''"
              >Общая сумма счета: </span>
            </div>
            <div :style="`color: ${$config.defaultColor}`">
              {{ invoice_item.sum }}
            </div>
          </v-layout>

          <div :class="$helpers.isMobile() ? 'mt-8' : 'mt-3'">
            <span
              v-if="!$helpers.isMobile()"
              class="font-weight-bold"
            >Комментарий: </span>
            <div>
              <v-textarea
                v-model="invoice_item.comment"
                rows="1"
                auto-grow
                class="ma-0"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :label="$helpers.isMobile() ? 'Комментарий:' : ''"
                @keyup="isEdited = true"
                @change="isEdited = true"
              />
            </div>
          </div>
        </template>
      </template>
    </TcsmDialog>

    <ConfirmDialog
      :dialog="confirmDialog"
      confirm-text="закрыть состав счёта без сохранения комментария?"
      confirm-btn-text="Не сохранять"
      @accept="closeWithoutSaving"
      @decline="confirmDialog = false"
    />
  </div>
</template>

<script>
  import InvoiceItems from "./InvoiceItems";
  import TcsmDialog from "../Dialogs/tcsmDialog";
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  
  export default {
    name: "Invoice",
    components: {ConfirmDialog, TcsmDialog, InvoiceItems},
    props: {
      invoiceItem: {
        type: Object,
        required: false,
        default: () => {
          return {};
        }
      },
      invoiceItemId: {
        type: [Number, String],
        required: false,
        default: () => {
          return 0;
        }
      },
      dialog: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        loading: true,
        defaultColor: '#006e4c',
        invoice_item: {},
        updateTimeout: false,

        isEdited: false,

        confirmDialog: false,
      };
    },
    watch: {
      async dialog(val) {
        if (val) {
          await this.loadData();
        }
      },
    },
    mounted() {
      this.loadData();
    },
    methods: {
      async updateComment() {
        // console.log("new value", this.invoice_item);
        let {data} = (await this.$api.CompanyInvoice.saveComment(this.invoice_item.id, {comment: this.invoice_item.comment})).data;
        this.isEdited = false;
      },
      async loadData() {
        this.loading = true;
        if (this.invoiceItemId) {
          let {data} = (await this.$api.CompanyInvoice.page(this.invoiceItemId)).data;
          this.invoice_item = data.invoice;
        } else if (this.invoiceItem) {
          this.invoice_item = Object.assign({}, this.invoiceItem);
        }
        this.loading = false;
      },
      close() {
        if (this.isEdited) {
          this.confirmDialog = true;
          return;
        }
        this.closeWithoutSaving();
      },
      closeWithoutSaving() {
        this.invoice_item = {};
        this.confirmDialog = false;
        this.isEdited = false;
        this.$emit('update:dialog', false);
        this.$emit('hideDialog');
      }
    }
  };
</script>

<style scoped>

</style>