<template>
  <div>
    <div class="ml-5">
      <v-layout
        justify-end
        class="mb-2"
      >
        <v-btn
          :to="localePath('/equipment/edit/')"
        >
          Создать
        </v-btn>
      </v-layout>
    </div>
    
    <v-data-table
      xs2
      :headers="headers"
      :items="data"
      dense
      :loading="loading"
      loading-text="Loading... Please wait"
      fixed-header
      class="elevation-1 data-table--vertical_modify"
      :footer-props="{itemsPerPageOptions: [5,10,25]}"
      sort-by="id"
      :sort-desc="true"
      :options.sync="options"
      :server-items-length="meta.total"
    >
      <template #item.actions="{item}">
        <v-layout
          justify-center
        >
          <v-btn
            :to="localePath(`/equipment/edit/${item.id}`)"
            fab
            text
            x-small
            class="mr-1"
          >
            <v-icon
              small
              class="mx-2"
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn
            :to="localePath(`/equipment/${item.hash}`)"
            fab
            text
            x-small
            class="mr-1"
          >
            <v-icon
              small
              class="mx-2"
            >
              mdi-eye
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            x-small
            @click="showQrCode(item)"
          >
            <v-icon
              small
              class="mx-2"
            >
              mdi-qrcode
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            x-small
          >
            <v-icon
              small
              class="mx-2"
            >
              mdi-comment-plus-outline
            </v-icon>
          </v-btn>
        </v-layout>
      </template>
    </v-data-table>
    <QRCodeDialog
      v-if="selectedItem"
      :dialog.sync="dialogQrCode"
      :selected-item="selectedItem"
    />
  </div>
</template>

<script>
  
  import QRCodeDialog from "../page/Form/QRCodeDialog";
  
  export default {
    name: "GroupTable",
    components: {QRCodeDialog},
    
    props: {},
    data: () => ({
      filter: {
        renter_id: "",
        equipment_type_id: "",
        city_id: "",
        equipment_manufacturer_id: "",
        equipment_model_id: "",
        equipment_status_id: "",
        text: ""
      },
      dialogQrCode: false,
      selectedItem: null,
      loading: false,
      options: {
        itemsPerPage: 25,
        sortBy: ['title'],
        sortDesc: [false]
      },
      meta: {
        current_page: 1,
        last_page: 0,
        total: 0
      },
      data: [],
      headers: [
        {
          text: 'Список компаний',
          value: 'renter.title',
        },
        {
          text: 'Тип',
          value: 'equipment_type.title',
        },
        {
          text: 'Город',
          value: 'city.title',
        },
        {
          text: 'Производитель',
          value: 'equipment_manufacturer.title',
        },
        {
          text: 'Модель',
          value: 'equipment_model.title',
        },
        {
          text: 'Статус',
          value: 'equipment_status.title',
        },
        {
          text: 'Дней до обсл.',
          value: 'nothing_waiting',
        },
        {
          text: 'Инвертарный номер',
          value: 'inventory_number'
        },
        {
          text: 'Адрес',
          value: 'address'
        },
        {
          text: 'Редактирование',
          value: 'actions'
        },
      ],
    }),
    computed: {
      renterId() {
        return this.$store.state.renterId;
      },
      equipmentTypeId() {
        return this.$store.state.equipmentTypeId;
      },
      cityId() {
        return this.$store.state.cityId;
      },
      equipmentManufacturerId() {
        return this.$store.state.equipmentManufacturerId;
      },
      equipmentModelId() {
        return this.$store.state.equipmentModelId;
      },
      equipmentSearch() {
        return this.$store.state.equipmentSearch;
      },
    },
    watch: {
      async options() {
        await this.loadData(this.options);
      },
      async renterId(v) {
        this.filter.renter_id = v;
        await this.loadData(this.options);
      },
      async equipmentTypeId(v) {
        this.filter.equipment_type_id = v;
        await this.loadData(this.options);
      },
      async cityId(v) {
        this.filter.city_id = v;
        await this.loadData(this.options);
      },
      async equipmentManufacturerId(v) {
        this.filter.equipment_manufacturer_id = v;
        await this.loadData(this.options);
      },
      async equipmentModelId(v) {
        this.filter.equipment_model_id = v;
        await this.loadData(this.options);
      },
      async equipmentStatusId(v) {
        this.filter.equipment_status_id = v;
        await this.loadData(this.options);
      },
      async equipmentSearch(v) {
        this.filter.text = v;
        await this.loadData(this.options);
      },
    },
    mounted() {
      this.filter.city_id = this.cityId;
      this.filter.equipment_manufacturer_id = this.equipmentManufacturerId;
      this.filter.renter_id = this.renterId;
      this.filter.equipment_model_id = this.equipmentModelId;
      this.filter.equipment_status_id = this.equipmentStatusId;
      this.filter.equipment_type_id = this.equipmentTypeId;
      this.filter.text = this.equipmentSearch;
    },
    methods: {
      showQrCode(item) {
        this.dialogQrCode = true;
        this.selectedItem = item;
      },
      /*async changeFilter() {
       await this.loadData(this.options);
       },*/
      async loadData(options) {
        this.loading = true;
        let filter = _.merge(this.filter, options);
        try{
          const {data} = (await this.$api.CityObjectField.index(filter)).data;

          this.data = data.items;
          this.meta = data.meta;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при получении города',
            color: 'error'
          });
        }

        this.loading = false;
      }
    },
  };
</script>
