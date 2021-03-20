<template>
  <div>
    <div class="headline pa-4">
      Заявки на КП
    </div>

    <Crud
      :hide-default-footer="false"
      :show-title="false"
      :refresh.sync="refresh"
      :query-options="queryOptions"
      :model="$admin.CompanyInvoiceKP"
    >
      <template #item.company.title="{item}">
        <template v-if="item.company">
          <n-link :to="getLinkCompany(item.company.id)">
            {{ item.company.title }}
          </n-link>
          <div class="font-italic caption">
            ИНН {{ item.company.inn }} / КПП {{ item.company.kpp }}
          </div>
        </template>
      </template>
      <template #item.order.number="{item}">
        <template v-if="item.order">
          {{ item.order.number }}
          <div
            v-if="item.order.approved_at"
            class="font-italic caption"
          >
            от {{ item.order.approved_at }}
          </div>
        </template>
      </template>
      <template
        #slot.invoiceitems="invoiceItem"
      >
        <template v-if="!invoiceItem.items.id">
          Перед добавлением вариантов, необходимо <a
            href="#"
            @click.prevent
          >сохранить</a> заявку
        </template>
        <Crud
          v-else
          :hide-default-footer="false"
          :show-title="false"
          :refresh.sync="refresh"
          :query-options="{ filter_invoice_id: invoiceItem.items.id }"
          :prepend-item-attributes="{invoce_item_id: invoiceItem.items.id }"
          :model="$admin.CompanyInvoiceItem"
        >
          <template #slot.measures="measure">
            <template v-if="!measure.items.id">
              Перед добавлением вариантов, необходимо <a
                href="#"
                @click.prevent
              >сохранить</a> заявку
            </template>
            <Crud
              v-else-if="false"
              :hide-default-footer="false"
              :show-title="false"
              :refresh.sync="refresh"
              :query-options="{ filter_invoice_item_id: measure.items.id }"
              :prepend-item-attributes="{ invoice_item_id: measure.items.id, /*'company_id': invoiceItem.items.company_id */}"
              :model="$admin.CompanyInvoiceItemMeasure"
            />
            <InvoiceItemMeasures
              v-else
              :invoice-item-id="measure.items.id"
              :company-id="invoiceItem.items.company_id"
            />
          </template>
        </Crud>
      </template>
    </Crud>
  </div>
</template>

<script>
  import Crud from '~/components/CRUD/Index';
  import InvoiceItemMeasures from "../../../components/page/Invoice/InvoiceItemMeasures";
  
  export default {
    components: {
        InvoiceItemMeasures,
      Crud
    },
    data() {
      return {
        // меню дейтпикеров
        menuIssuedAt: false,
        menuPayedAt: false,
        
        // модалка
        invoice_dialog: false,
        invoice_selected: {},
        
        refresh: false,
        // queryOptions
        queryOptions: {
          searchText: '',
          filterIssuedAt: [],
          filterPayedAt: [],
          filterPayed: '',
          filterReady: '',
          invoice_type_id: 2,
        },
      };
    },
    computed: {
      datePayedAtText() {
        return this.queryOptions.filterPayedAt.join(' ~ ');
      },
      dateIssuedAtText() {
        return this.queryOptions.filterIssuedAt.join(' ~ ');
      },
    },
    methods: {
      getLinkCompany(company_id) {
        if (this.$auth.user.role_id == 1) {
          return `/manage/companies/${company_id}`;
        }
        return `/cabinet/companies/${company_id}`;
      },
      showDialogItems(item) {
        this.invoice_selected = {};
        this.invoice_selected = item;
        this.invoice_dialog = true;
      }
    },
    middleware: 'administrator',
  };
</script>

<style scoped>

</style>