<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="measures"
      item-key="id"
      class="elevation-1"
    >
      <template #item.actions>
        <v-icon
          small
          @click="editFunc"
        >
          edit
        </v-icon>
        <v-icon small>
          delete
        </v-icon>
      </template>
    </v-data-table>
    <InvoiceItemMeasuresEdit
      :dialog="dialog"
      @close-dialog="closeDialog"
    />
  </div>
</template>

<script>
    import InvoiceItemMeasuresEdit from "./InvoiceItemMeasuresEdit";
    export default {
        name: "InvoiceItemMeasures",
        components: {InvoiceItemMeasuresEdit},
        props: {
            invoiceItemId: {
                type: Number,
                default: () => {
                    return 0;
                }
            },
            companyId: {
                type: Number,
                default: () => {
                    return 0;
                }
            },
        },
        data() {
            return {
                dialog: false,
                singleExpand: false,
                headers: [
                    {
                        text: 'ID',
                        align: 'start',
                        sortable: false,
                        value: 'company_measure.id',
                    },
                    {
                        text: 'Наименование',
                        sortable: false,
                        value: 'company_measure.title',
                    },
                    {
                        text: 'factory_number',
                        sortable: false,
                        value: 'company_measure.factory_number',
                    },
                    {
                        text: 'serial_register_number',
                        sortable: false,
                        value: 'company_measure.state_register_number',
                    },
                    {
                        text: 'model',
                        sortable: false,
                        value: 'company_measure.model',
                    },
                    {
                        text: 'Год выпуска',
                        sortable: false,
                        value: 'company_measure.release_year',
                    },
                    {
                        text: 'Действия',
                        sortable: false,
                        value: 'actions',
                    }
                ],
                measures: [],
            }
        },
        computed: {
            // refreshTable: {
            //     get() {
            //         return this.refresh;
            //     },
            //     set(v) {
            //         this.('update:refresh', v);
            //     }
            // }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            closeDialog () {
                this.dialog = false;
            },
            editFunc () {
                this.dialog = true;
                // console.log(this.dialog);
            },
            async loadData(){
                let {data} = (await this.$model.CompanyInvoiceItemMeasure.methods.all({filter_invoice_item_id:this.invoiceItemId})).data;
                // let {data} = (await this.$model.CompanyInvoiceItemMeasure.methods.create({invoice_item_id:this.invoiceItemId, company_measure_id: 2})).data; //Добавить прибор в таблицу приборов услуги
                // let {data} = (await this.$model.CompanyMeasure.methods.create({company_id:this.invoiceItemId, title: 'some title'})).data; //Создание прибора в компании
                this.measures = data;
            },
        },

        // layout: 'guest',
        // layout: 'manage',
    }
</script>

<style scoped>

</style>