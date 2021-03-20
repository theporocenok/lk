<template>
  <v-container>
    <v-overlay
      :z-index="2"
      :opacity="0.2"
      :value="loading"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        :color="defaultColor"
        indeterminate
      />
    </v-overlay>
    <v-layout
      v-if="!loading"
      justify-space-between=""
    >
      <v-flex
        xs4
        class="mr-3"
      >
        <v-img
          :src="form.city_object_file ? form.city_object_file.url : require('~/assets/images/no-image.png')"
        >
          <v-btn
            v-if="form.city_object_file"
            absolute
            text
            icon
            color="red"
            @click="deleteFile(form.city_object_file.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-img>
        <v-layout class="p-3">
          <v-file-input
            v-model="form.image"
            prepend-icon=""
            single-line
            dense
            placeholder="Загрузить"
          />
        </v-layout>
      </v-flex>
      <v-flex xs8>
        <v-form>
          <v-layout
            wrap
            justify-space-between
          >
            <v-autocomplete
              v-model="form.equipment_type_id"
              :items="equipmentTypesData"
              :clearable="true"
              :label="'Тип оборудования'"
              item-value="id"
              item-text="title"
              color="#3f4d67"
              class="filter__select ml-1 mr-2"
              :aria-autocomplete="false"
            />

            <v-autocomplete
              v-if="equipmentTypeCategoriesFiltered.length"
              v-model="form.equipment_category_id"
              :items="equipmentTypeCategoriesFiltered"
              :clearable="true"
              :label="'Категория оборудования'"
              item-value="id"
              item-text="title"
              color="#3f4d67"
              class="filter__select ml-1 mr-1"
              :aria-autocomplete="false"
            />
          </v-layout>
          <v-layout
            wrap
            justify-space-between
          >
            <v-autocomplete
              v-model="form.equipment_manufacturer_id"
              :clearable="true"
              :label="'Производитель'"
              :items="equipmentManufacturesData"
              item-value="id"
              color="#3f4d67"
              class="ml-1 mr-2 col-xs-4"
              item-text="title"
              :aria-autocomplete="false"
            />
            <v-autocomplete
              v-model="form.equipment_model_id"
              item-value="id"
              :label="'Модель'"
              color="#3f4d67"
              :clearable="true"
              class="ml-1 mr-2 col-xs-4"
              :aria-autocomplete="false"
              :items="equipmentModelsFiltered"
              item-text="title"
            />
            <v-text-field
              v-model="form.price"
              class="ml-1 mr-2 col-xs-4"
              label="Стоимость"
              :aria-autocomplete="false"
            />
          </v-layout>



          <v-autocomplete
            v-model="form.city_id"
            :label="'Город'"
            :clearable="true"
            :items="citiesData"
            item-value="id"
            color="#3f4d67"
            class="ml-1 mr-2"
            item-text="title"
            :aria-autocomplete="false"
          />

          <v-layout
            wrap
            justify-space-between
          >
            <v-autocomplete
              v-model="form.renter_id"
              :items="rentersData"
              :clearable="true"
              :label="'Контрагент'"
              item-value="id"
              item-text="title"
              color="#3f4d67"
              class="filter__select ml-1 mr-1"
              autocomplete="off"
            />

            <v-text-field
              v-model="form.address"
              class="mr-2"
              label="Адрес"
              :aria-autocomplete="false"
            />
          </v-layout>

          <v-layout>
            <v-text-field
              v-model="form.serial_number"
              class="ml-1 mr-2"
              label="Серийный номер"
              :aria-autocomplete="false"
            />
            <v-text-field
              v-model="form.inventory_number"
              label="Инвертарный номер"
              :aria-autocomplete="false"
            />
          </v-layout>



          <v-autocomplete
            v-model="form.equipment_status_id"
            item-value="id"
            :label="'Статус'"
            color="#3f4d67"
            :clearable="true"
            class="ml-1 mr-1"
            :aria-autocomplete="false"
            :items="equipmentStatusesData"
            item-text="title"
          />
          
          <div class="mb-4">
            <nuxt-link
              v-if="form.hash"
              :to="localePath(`/equipment/${form.hash}`)"
              tag="v-btn"
            >
              Просмотр публичной страницы
            </nuxt-link>
            <v-btn
              v-if="form.hash"
              @click="dialogQrCode = true"
            >
              Просмотр qrCode
            </v-btn>
          </div>
          <v-layout justify-end>
            <v-btn
              color="primary"
              class="mr-2"
              dark
              :to="localePath('/')"
            >
              Выйти без сохранения
            </v-btn>
            <v-btn
              class="mr-2"
              color="success"
              @click="save"
            >
              Сохранить
            </v-btn>
            <v-btn
              v-if="form.id"
              color="red"
              dark
              @click="deleteItem"
            >
              Удалить
            </v-btn>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    
    <QRCodeDialog
      v-if="form.id"
      :dialog.sync="dialogQrCode"
      :selected-item="item"
    />
  </v-container>
</template>

<script>
  
  import {SelectDataMixin} from '@/api/mixins/CityObjectFieldMixin';
  import QRCodeDialog from './QRCodeDialog';
  
  export default {
    name: "ObjectItemForm",
    components: {
      QRCodeDialog
    },
    mixins: [SelectDataMixin],
    props: {
      item: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        defaultColor: '#006e4c',
        equipmentModelsFiltered: [],
        equipmentTypeCategoriesFiltered: [],
        pageId: null,
        loading: true,
        qrCode: null,
        dialogQrCode: false,
        form: {
          id: '',
          address: '',
          hash: '',
          inventory_number: '',
          serial_number: '',
          price: '',
          city_id: '',
          renter_id: '',
          equipment_model_id: '',
          equipment_status_id: '',
          equipment_manufacturer_id: '',
          equipment_type_id: '',
          equipment_category_id: '',
          output: null,
          image: null,
        }
      };
    },
    watch: {
      item() {
        this.form = Object.assign({}, this.item);
      },
      'form.equipment_manufacturer_id'(v) {
        this.equipmentModelsFiltered = this.equipmentModelsData.filter((item) => {
          return item.equipment_manufacture_id === v;
        });
      },
      'form.equipment_type_id'(v) {
        this.equipmentTypeCategoriesFiltered = this.equipmentTypeCategoriesData.filter((item) => {
          return item.equipment_type_id === v;
        });
      }
    },
    mounted() {
      this.load();

    },
    methods: {
      async load() {
        this.loading = true;
        this.form = Object.assign({}, this.item);
        this.equipmentModels();
        this.renters();
        this.equipmentTypes();
        this.equipmentTypeCategories();
        this.equipmentManufactureStatuses();
        this.cities();
        this.equipmentManufactures();
        this.loading = false;
      },
      save() {
        this.$emit('save', this.form);
      },
      deleteFile(fileId) {
        try{
          this.$api.Media.delete(fileId);
          this.form.city_object_file = null;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при удалении файла',
            color: 'error'
          });
        }
      },
      async deleteItem() {
        if (!confirm('Вы точно хотите удалить текущий объект?')) {
          return;
        }
        await this.$api.CityObjectField.delete(this.form.id);
        return this.$router.push(this.localePath('/'));
      },
      
    }
  };
</script>

<style scoped>

</style>