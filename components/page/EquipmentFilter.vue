<template>
  <v-layout
    align-center
    justify-center
    :class="{'wrap pa-6':isMobile}"
  >
    <template v-slot:append>
      <div style="min-width: 25px">
        <v-progress-circular
          v-show="loadingSearch"
          size="20"
          indeterminate
          color="primary"
        />
      </div>
    </template>
    
    <v-autocomplete
      v-model="renterId"
      :items="rentersData"
      :clearable="true"
      :label="'Контрагент'"
      item-value="id"
      item-text="title"
      :color="!isMobile ? '#3f4d67' : ''"
      class="filter__select ml-1 mr-1"
      autocomplete="off"
      hide-details
      :class="{'mobile--width mb-5':isMobile}"
      @click:clear="renterId = null"
    />
    <v-autocomplete
      v-model="equipmentTypeId"
      :items="equipmentTypesData"
      :clearable="true"
      :label="'Тип оборудования'"
      item-value="id"
      item-text="title"
      :color="!isMobile ? '#3f4d67' : ''"
      class="filter__select ml-1 mr-1"
      :aria-autocomplete="false"
      hide-details
      :class="{'mobile--width mb-5':isMobile}"
      @click:clear="equipmentTypeId = null"
    />
    <v-autocomplete
      v-model="cityId"
      :label="'Город'"
      :clearable="true"
      :items="citiesData"
      item-value="id"
      :color="!isMobile ? '#3f4d67' : ''"
      class="ml-1 mr-1"
      item-text="title"
      :aria-autocomplete="false"
      hide-details
      :class="{'mobile--width mb-5':isMobile}"
      @click:clear="cityId = null"
    />
    <v-autocomplete
      v-model="equipmentManufacturerId"
      :clearable="true"
      :label="'Производитель'"
      :items="equipmentManufacturesData"
      item-value="id"
      :color="!isMobile ? '#3f4d67' : ''"
      class="ml-1 mr-1"
      item-text="title"
      :aria-autocomplete="false"
      hide-details
      :class="{'mobile--width mb-5':isMobile}"
      @click:clear="equipmentManufacturerId = null"
    />
    <v-autocomplete
      v-model="equipmentModelId"
      item-value="id"
      :label="'Модель'"
      :color="!isMobile ? '#3f4d67' : ''"
      :clearable="true"
      class="ml-1 mr-1"
      :aria-autocomplete="false"
      :items="equipmentModelsData"
      item-text="title"
      hide-details
      :class="{'mobile--width mb-5':isMobile}"
      @click:clear="equipmentModelId = null"
    />
    <v-autocomplete
      v-model="equipmentStatusId"
      item-value="id"
      :label="'Статус'"
      :color="!isMobile ? '#3f4d67' : ''"
      :clearable="true"
      class="ml-1 mr-1"
      :aria-autocomplete="false"
      :items="equipmentStatusesData"
      item-text="title"
      hide-details
      :class="{'mobile--width mb-5':isMobile}"
      @click:clear="equipmentStatusId = null"
    />
    <v-autocomplete
      v-model="daysToService"
      :label="'Дней до обсл.'"
      :color="!isMobile ? '#3f4d67' : ''"
      :clearable="true"
      class="ml-1 mr-1"
      :aria-autocomplete="false"
      :items="['7 дней','14 дней','30 дней']"
      hide-details
      :class="{'mobile--width mb-5':isMobile}"
      @click:clear="daysToService = null"
    />
  </v-layout>
</template>

<script>
  import {SelectDataMixin} from '@/api/mixins/CityObjectFieldMixin';
  
  export default {
    name: "HeaderFilter",
    mixins: [SelectDataMixin],
    props: {
      isMobile: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loadingSearch: false,
        searchTimer: false,
        searchInput: "",
        equipmentModelsFiltered: [],
        daysToService: ''
      };
    },
    computed: {
      renterId: {
        get() {
          return this.$store.state.renterId;
        },
        set(v) {
          this.$store.commit('setRenterId', v);
        }
      },
      equipmentTypeId: {
        get() {
          return this.$store.state.equipmentTypeId;
        },
        set(v) {
          this.$store.commit('setEquipmentTypeId', v);
        }
      },
      cityId: {
        get() {
          return this.$store.state.cityId;
        },
        set(v) {
          this.$store.commit('setCityId', v);
        }
      },
      equipmentManufacturerId: {
        get() {
          return this.$store.state.equipmentManufacturerId;
        },
        set(v) {
          this.$store.commit('setEquipmentManufacturerId', v);
        }
      },
      equipmentModelId: {
        get() {
          return this.$store.state.equipmentModelId;
        },
        set(v) {
          this.$store.commit('setEquipmentModelId', v);
        }
      },
      equipmentStatusId: {
        get() {
          return this.$store.state.equipmentStatusId;
        },
        set(v) {
          this.$store.commit('setEquipmentStatusId', v);
        }
      },
      equipmentSearch: {
        get() {
          return this.$store.state.equipmentSearch;
        },
        set(v) {
          this.$store.commit('setEquipmentSearch', v);
        }
      }
    },
    watch: {
      equipmentManufacturerId(v) {
        this.equipmentModels(v);
      }
    },
    mounted() {
      this.load();
    },
    methods: {
      async load() {
        this.renters();
        this.equipmentTypes();
        this.cities();
        this.equipmentManufactures();
        this.equipmentManufactureStatuses();
      },
    }
  };
</script>

<style scoped>
  .mobile--width{width: 100%}
</style>
